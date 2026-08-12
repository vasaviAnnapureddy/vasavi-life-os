/* ============================================
   VASAVI'S LIFE OS — STORAGE
   utils/storage.js
   localStorage + Firebase sync
   localStorage = instant, always works
   Firebase = cloud backup, cross-device sync
   ============================================ */

var STORAGE_KEY = 'vasavi_life_os_v2';

var DEFAULT_STATE = {
  /* Core */
  currentPage:     'dashboard',
  anthropicKey:    '',

  /* Planner — always an object */
  planner: {
    date: '', mood: '', focus: '', blocks: [],
    workingOn: '', reflection: { well:'', better:'', tomorrow:'' }
  },
  startDate:       new Date().toISOString().split('T')[0],
  lifeScore:       0,

  /* Planner */
  tasks:           [],
  events:          [],
  focusSessions:   [],

  /* Goals */
  goals:           [],
  milestones:      [],

  /* DS Study */
  dsProgress:      {},
  interviewScores: {},
  projects:        [],
  interviewQsDone: {},

  /* Habits */
  habits:          [],
  habitLog:        {},
  gymLog:          [],

  /* Finance */
  expenses:        [],
  income:          [],
  savings:         [],
  salaryGoal:      500000,
  savingsGoal:     50000,

  /* Jobs */
  jobs:            [],
  jobsTab:         'tracker',
  jobFilterStatus: 'All',
  atsResumeText:   '',
  atsResumeCompany:'',

  /* Resume */
  resume:          {},

  /* Learning */
  learnTab:        'map',
  learnOpenRoot:   null,
  learnOpenBranch: null,
  learnOpenTopic:  null,
  topicLevels:     {},
  topicNotes:      {},
  topicMsgs:       {},
  customSubtopics: {},
  customTopics:    {},
  lessonsRead:     {},
  generalNotes:    [],
  noteOpenIdx:     null,

  /* Language */
  langTab:         'home',
  langVocab:       {},
  langNotebook:    {},
  langTutorMsgs:   {},
  langStreaks:      {},
  customLangs:     [],

  /* Books */
  books:           [],

  /* Journal */
  journalEntries:  [],
  journalIdeas:    [],
  journalMood:     {},

  /* Notes */
  notesData:       {},
  customDocs:      [],
  notesOpenDoc:    null,
  notesEntryOpen:  null,

  /* Travel */
  trips:           [],

  /* Analytics */
  weeklyReview:    {},

  /* Calendar events for Google Calendar sync */
  calendarEvents:  []
};

/* ============================================
   LOAD DATA
   ============================================ */
function loadData() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      /* Merge with defaults so new keys always exist */
      window.AppState = Object.assign({}, DEFAULT_STATE, parsed);
    } else {
      window.AppState = Object.assign({}, DEFAULT_STATE);
    }
  } catch(e) {
    console.warn('loadData error:', e);
    window.AppState = Object.assign({}, DEFAULT_STATE);
  }
}

/* ============================================
   SAVE DATA
   localStorage first (instant) then Firebase
   ============================================ */
function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(window.AppState));
  } catch(e) {
    console.warn('localStorage save error:', e);
    /* QUOTA FULL — she must know immediately, not silently lose data */
    if (!window._quotaWarned) {
      window._quotaWarned = true;
      alert('⚠️ Your device storage for this app is FULL.\n\n' +
            'Your latest changes may not be saved locally. Please tap "Backup" now to download ' +
            'your data, then remove old photos/voice notes from Rich Notes.\n\n' +
            '(Your cloud copy in Firebase is still syncing.)');
    }
  }
  /* Firebase cloud backup */
  if (typeof saveToFirebase === 'function' && window.FB_READY) {
    saveToFirebase(window.AppState);
  }
}

/* ============================================
   STORAGE HEALTH — know before you hit a wall
   Browsers give ~5 MB per site for localStorage.
   ============================================ */
var STORAGE_LIMIT_BYTES = 5 * 1024 * 1024;

function storageHealth() {
  var bytes = 0;
  try { bytes = (localStorage.getItem(STORAGE_KEY) || '').length; } catch(e) {}
  var pctUsed = Math.min(100, Math.round((bytes / STORAGE_LIMIT_BYTES) * 100));
  return {
    bytes: bytes,
    kb: Math.round(bytes / 1024),
    mb: Math.round(bytes / 1024 / 102.4) / 10,
    pct: pctUsed,
    level: pctUsed >= 85 ? 'critical' : pctUsed >= 60 ? 'warning' : 'healthy'
  };
}

/* Which parts of your data are the heaviest */
function storageBreakdown() {
  var out = [];
  var s = window.AppState || {};
  Object.keys(s).forEach(function(k) {
    var size = 0;
    try { size = JSON.stringify(s[k] === undefined ? null : s[k]).length; } catch(e) {}
    if (size > 500) out.push({ key: k, kb: Math.round(size/1024*10)/10 });
  });
  return out.sort(function(a,b){ return b.kb - a.kb; }).slice(0, 8);
}

/* Warn once per session if storage is getting full */
function checkStorageOnStart() {
  var h = storageHealth();
  if (h.level === 'critical') {
    showToast('⚠️ Storage ' + h.pct + '% full — tap Backup and clear old media!', 'error');
  } else if (h.level === 'warning') {
    showToast('📦 Storage ' + h.pct + '% used — still fine, but keep an eye on it.');
  }
}

/* ============================================
   BACKUP REMINDER — the 3rd copy (3-2-1 rule)
   Cloud + device + a file YOU own.
   ============================================ */
function daysSinceBackup() {
  var last = window.AppState && window.AppState.lastBackupIso;
  if (!last) return 999;
  return Math.floor((new Date() - new Date(last)) / 86400000);
}

function checkBackupReminder() {
  var d = daysSinceBackup();
  if (d >= 30) {
    setTimeout(function() {
      showToast(d === 999
        ? '💾 You have never backed up. Tap "Backup" to save a copy you own.'
        : '💾 Last backup was ' + d + ' days ago — tap Backup to keep your 3rd copy fresh.', 'error');
    }, 4000);
  }
}

/* ============================================
   BACKUP — download as JSON file
   ============================================ */
function backupData() {
  try {
    var data = JSON.stringify(window.AppState, null, 2);
    var blob = new Blob([data], { type: 'application/json' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href   = url;
    a.download = 'vasavi-life-os-backup-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
    /* Remember when — powers the backup reminder */
    window.AppState.lastBackupIso = new Date().toISOString().split('T')[0];
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(window.AppState)); } catch(e) {}
    if (typeof saveToFirebase === 'function' && window.FB_READY) saveToFirebase(window.AppState);
    var hb = storageHealth();
    showToast('✅ Backup downloaded (' + hb.kb + ' KB). Keep it in Drive/email too!');
  } catch(e) {
    alert('Backup failed: ' + e.message);
  }
}

/* ============================================
   RESTORE — from JSON file
   ============================================ */
function restoreData(file) {
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var parsed = JSON.parse(e.target.result);
      window.AppState = Object.assign({}, DEFAULT_STATE, parsed);
      saveData();
      /* Push the restored copy back to the cloud so every device matches */
      if (typeof forceFullSync === 'function' && window.FB_READY) forceFullSync();
      renderPage();
      showToast('✅ Data restored on this device!');
    } catch(err) {
      alert('Restore failed — invalid backup file.');
    }
  };
  reader.readAsText(file);
}

/* ============================================
   TOAST NOTIFICATION
   ============================================ */
function showToast(msg, type) {
  var existing = document.getElementById('toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.id  = 'toast';
  toast.textContent = msg;
  toast.style.cssText = [
    'position:fixed', 'bottom:24px', 'right:24px', 'z-index:9999',
    'background:' + (type==='error'?'#ef4444':'#10b981'),
    'color:#fff', 'padding:10px 18px', 'border-radius:10px',
    'font-size:13px', 'font-weight:700', 'box-shadow:0 4px 20px rgba(0,0,0,0.3)',
    'transition:opacity .3s'
  ].join(';');
  document.body.appendChild(toast);
  setTimeout(function() { toast.style.opacity='0'; setTimeout(function(){ toast.remove(); },300); }, 2500);
}

/* ============================================
   TODAY STRING HELPER
   ============================================ */
function todayString() {
  return new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

console.log('storage.js loaded — localStorage + Firebase ready');

/* ============================================
   DEEP MERGE — kept for compatibility
   Merges saved data into defaults safely
   ============================================ */
function deepMerge(defaults, saved) {
  var result = JSON.parse(JSON.stringify(defaults));
  if (!saved || typeof saved !== 'object') return result;
  Object.keys(saved).forEach(function(key) {
    if (saved[key] !== null && typeof saved[key] === 'object' &&
        !Array.isArray(saved[key]) && result[key] !== null &&
        typeof result[key] === 'object' && !Array.isArray(result[key])) {
      result[key] = deepMerge(result[key], saved[key]);
    } else {
      result[key] = saved[key];
    }
  });
  return result;
}