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
  }
  /* Firebase cloud backup */
  if (typeof saveToFirebase === 'function' && window.FB_READY) {
    saveToFirebase(window.AppState);
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
    showToast('Backup downloaded!');
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
      renderPage();
      showToast('Data restored!');
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