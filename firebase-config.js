/* ============================================
   VASAVI'S LIFE OS — FIREBASE CONFIG
   Spark Plan — FREE FOREVER
   Project: vasavi-life-os
   ============================================ */

/* Firebase SDKs loaded via CDN in index.html */
var FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBQXCcIx0USNd_-Bu9nWReP7Zyvofk3qlQ",
  authDomain:        "vasavi-life-os.firebaseapp.com",
  projectId:         "vasavi-life-os",
  storageBucket:     "vasavi-life-os.firebasestorage.app",
  messagingSenderId: "150525770020",
  appId:             "1:150525770020:web:266a01ecd8a7507d0c1bb1",
  measurementId:     "G-P5NEHS9GJ1"
};

var firebaseApp = null;
var firebaseDb  = null;
var firebaseAuth= null;
var currentUser = null;
var FB_READY    = false;

function initFirebase() {
  try {
    if (typeof firebase === 'undefined') {
      console.warn('Firebase SDK not loaded — using localStorage only');
      return;
    }
    if (!firebase.apps || firebase.apps.length === 0) {
      firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
    } else {
      firebaseApp = firebase.apps[0];
    }
    firebaseDb = firebase.firestore();
    FB_READY   = true;
    /* Fixed path — data is NOT tied to a device or login, so it
       follows you to any phone/laptop and never needs migrating */
    currentUser = { uid: 'vasavi-main-user' };
    initAuth();
    console.log('Firebase ready — connecting to Firestore');
    syncFromFirebase();
    /* Load Groq key from Firestore config document */
    loadGroqKeyFromFirebase();
  } catch(e) {
    console.warn('Firebase init failed:', e.message, '— using localStorage');
    FB_READY = false;
  }
}

/* ============================================
   LOAD GROQ KEY FROM FIREBASE
   Store key once in Firebase, loads everywhere
   Phone, laptop, any device — always works
   ============================================ */
function loadGroqKeyFromFirebase() {
  if (!firebaseDb) return;
  firebaseDb.collection('config').doc('keys').get()
    .then(function(doc) {
      if (doc.exists && doc.data().groqKey) {
        /* Key found in Firebase — set it globally */
        window.GROQ_KEY_FROM_FIREBASE = doc.data().groqKey;
        if (!window.AppState) window.AppState = {};
        if (!window.AppState.anthropicKey) {
          window.AppState.anthropicKey = doc.data().groqKey;
        }
        console.log('Groq key loaded from Firebase ✅');
      }
    })
    .catch(function(e) {
      console.warn('Could not load key from Firebase:', e.message);
    });
}

/* ============================================
   SAVE GROQ KEY TO FIREBASE (call once)
   After this, all devices load it automatically
   ============================================ */
function saveGroqKeyToFirebase(key) {
  if (!firebaseDb || !key) return;
  firebaseDb.collection('config').doc('keys').set({ groqKey: key })
    .then(function() {
      console.log('Groq key saved to Firebase — all devices will load it now ✅');
      showToast('Key saved to Firebase — works on all devices forever! ✅');
    })
    .catch(function(e) {
      console.warn('Could not save key to Firebase:', e.message);
    });
}

/* ============================================
   SAVE TO FIREBASE — called after every saveData()
   ============================================ */
/* ============================================
   AUTO-SYNC — one document per data key.

   The old version synced a HARDCODED list of
   keys, so anything added later (focus sessions,
   vault diary, memories, books, diet, brain gym…)
   was silently NEVER backed up. This version
   syncs EVERY key in AppState automatically, so
   future features are always protected.

   - 1 doc per key  → escapes the 1 MiB doc limit
   - huge keys auto-split into parts
   - only CHANGED keys are written (saves quota)
   - writes are debounced (2s) to avoid write storms
   ============================================ */

/* Runtime-only keys that should never go to the cloud */
var SYNC_SKIP = [
  'currentPage','timerSecs','activeSess','timerWhat','timerView','timerAnalyticsTab',
  'langSecs','langRunning','langActive','srsShowAnswer','sprintRunning','sprintSecs',
  'teachRecording','vaultTab','vaultJustListen','habitsView','financeView','booksView',
  'memoriesView','plannerView','goalTab','goalSubTab','aiTab','learnTab','gymTab',
  'gymEditDay','gymViewDay','dietTab','brainTab','analyticsTab','notesOpenDoc',
  'notesEntryOpen','notesEntryEditing','aeView','langTab','jobsTab','vaultMood',
  'memoryTag','rescueRevealed','rescueGuess','langActiveChat','financeAnalyticsTab',
  'v','t','parts'   /* junk keys from an old sync bug */
];

var FB_MAX_BYTES  = 700000;   /* safety margin under Firestore's 1 MiB */
var _fbLastSynced = {};       /* key -> JSON string of last upload */
var _fbTimer      = null;
var _fbPending    = null;

/* ============================================
   ⛔ DATA-LOSS GUARD
   The old code could upload an EMPTY app over
   good cloud data: if the phone opened with no
   local data (storage cleared / new device) and
   the download was slower than 2 seconds, the
   empty state was pushed up first and wiped the
   cloud copy.

   Now nothing uploads until the download has
   finished, and empty values can never replace
   data that already exists in the cloud.
   ============================================ */
var SYNC_STATE = 'pending';   /* pending -> done | failed */

/* The dangerous moment is app startup, before you have touched
   anything. Once you actually tap something you are in control,
   so real deletes are allowed through. */
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(){ window.ALLOW_EMPTY_SYNC = true; }, { once: true });
  document.addEventListener('touchstart', function(){ window.ALLOW_EMPTY_SYNC = true; }, { once: true });
});

function _sizeOf(v) {
  if (v === null || v === undefined) return 0;
  if (Array.isArray(v)) return v.length;
  if (typeof v === 'object') return Object.keys(v).length;
  if (typeof v === 'string') return v.length ? 1 : 0;
  return 1;
}

function _isEmptyValue(v) {
  if (v === null || v === undefined) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.keys(v).length === 0;
  if (typeof v === 'string') return v.trim() === '';
  return false;
}

function saveToFirebase(state) {
  if (!FB_READY || !firebaseDb || !currentUser) return;
  _fbPending = state;
  clearTimeout(_fbTimer);
  _fbTimer = setTimeout(function(){ _fbFlush(_fbPending); }, 2000);
}

function _fbFlush(state) {
  if (!state || !FB_READY || !firebaseDb || !currentUser) return;

  /* GUARD 1: never upload before the cloud copy has been read */
  if (SYNC_STATE === 'pending') {
    console.warn('⛔ Upload blocked: still loading your data from the cloud.');
    clearTimeout(_fbTimer);
    _fbTimer = setTimeout(function(){ _fbFlush(_fbPending); }, 1500);   /* retry later */
    return;
  }

  var uid = currentUser.uid;
  var ref = firebaseDb.collection('users').doc(uid).collection('data');
  var changed = 0;
  var blocked = 0;

  Object.keys(state).forEach(function(key) {
    if (SYNC_SKIP.indexOf(key) !== -1) return;
    var val = state[key];
    if (val === undefined || val === null) return;
    if (typeof val === 'function') return;

    var json;
    try { json = JSON.stringify(val); } catch(e) { return; }
    if (json === undefined) return;
    if (_fbLastSynced[key] === json) return;   /* unchanged — skip the write */

    /* GUARD 2: an empty value must never replace real cloud data.
       Deleting things on purpose still works, because the delete
       buttons set window.ALLOW_EMPTY_SYNC first. */
    var hadData = _fbLastSynced[key] && !_isEmptyValue(JSON.parse(_fbLastSynced[key] || 'null'));
    if (_isEmptyValue(val) && hadData && !window.ALLOW_EMPTY_SYNC) {
      console.warn('⛔ Refused to wipe "' + key + '" in the cloud with an empty value.');
      blocked++;
      return;
    }

    _fbLastSynced[key] = json;
    changed++;

    if (json.length <= FB_MAX_BYTES) {
      ref.doc(key).set({ v: val, parts: 0, t: Date.now() })
        .catch(function(e){ console.warn('Sync error (' + key + '):', e.message); });
    } else {
      /* Too big for one doc — split the JSON into parts */
      var n = Math.ceil(json.length / FB_MAX_BYTES);
      ref.doc(key).set({ parts: n, t: Date.now() })
        .catch(function(e){ console.warn('Sync error (' + key + ' index):', e.message); });
      for (var i = 0; i < n; i++) {
        ref.doc(key + '__p' + i).set({ s: json.substr(i * FB_MAX_BYTES, FB_MAX_BYTES) })
          .catch(function(e){ console.warn('Sync error (' + key + ' part ' + i + '):', e.message); });
      }
    }
  });

  if (changed > 0) console.log('☁️ Synced ' + changed + ' changed section(s) to Firebase');
  if (blocked > 0 && typeof showToast === 'function') {
    showToast('🛡️ Protected ' + blocked + ' section(s) from being wiped.', 'error');
  }
}

/* ============================================
   GOOGLE SIGN-IN
   IMPORTANT: your data stays at the SAME path
   (users/vasavi-main-user). Signing in does NOT
   move or re-key anything — zero risk of losing
   data. Sign-in exists so Firestore rules can
   lock the database to your account only.
   ============================================ */
var authUser = null;

function initAuth() {
  if (!firebase || !firebase.auth) return;
  try {
    firebaseAuth = firebase.auth();
    firebaseAuth.onAuthStateChanged(function(user) {
      authUser = user || null;
      window.AUTH_USER = authUser;
      if (authUser) console.log('🔐 Signed in as ' + (authUser.email || authUser.uid));
      if (typeof renderPage === 'function' && window.AppState && window.AppState.currentPage === 'settings') renderPage();
    });
    /* Complete a redirect sign-in if we came back from one */
    firebaseAuth.getRedirectResult().catch(function(){});
  } catch(e) { console.warn('Auth init failed:', e.message); }
}

function signInWithGoogle() {
  if (!firebaseAuth) { showToast('Auth not ready — refresh the page.', 'error'); return; }
  var provider = new firebase.auth.GoogleAuthProvider();
  firebaseAuth.signInWithPopup(provider)
    .then(function(res) {
      showToast('🔐 Signed in as ' + (res.user.email || 'you') + '!');
      if (typeof renderPage === 'function') renderPage();
    })
    .catch(function(e) {
      /* Popups are often blocked on phones — fall back to redirect */
      if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment' || e.code === 'auth/cancelled-popup-request')) {
        firebaseAuth.signInWithRedirect(provider);
      } else {
        showToast('Sign-in failed: ' + (e.message || 'unknown'), 'error');
      }
    });
}

function signOutGoogle() {
  if (!firebaseAuth) return;
  firebaseAuth.signOut().then(function() {
    showToast('Signed out. Your data stays safe on this device.');
    if (typeof renderPage === 'function') renderPage();
  });
}

/* ============================================
   🕰️ TIME MACHINE — automatic daily backup

   Once a day the app saves a DATED snapshot of
   everything into its own document. These
   snapshots are never touched by normal syncing,
   so if live data is ever lost you can pick a day
   and get everything back in one tap.

   Keeps the last 21 days. Tiny: your whole app is
   only a few KB of text.
   ============================================ */
var BACKUP_KEEP_DAYS = 21;

function autoDailyBackup() {
  if (!FB_READY || !firebaseDb || !currentUser) return;
  if (SYNC_STATE !== 'done') return;        /* never snapshot before data loads */

  var today = aeTodayIso();
  var state = window.AppState || {};

  /* Do not save an empty app over a day that had real data */
  var realRecords = (state.habits||[]).length + (state.expenses||[]).length +
                    (state.sessions||[]).length + Object.keys(state.reflectionArchive||{}).length;
  if (realRecords === 0) {
    console.warn('🕰️ Skipped daily backup: nothing to save yet.');
    return;
  }

  var ref = firebaseDb.collection('users').doc(currentUser.uid).collection('backups');

  ref.doc(today).get().then(function(doc) {
    if (doc.exists) return;                 /* already saved today */

    var copy = {};
    Object.keys(state).forEach(function(k) {
      if (SYNC_SKIP.indexOf(k) !== -1) return;
      copy[k] = state[k];
    });

    var json;
    try { json = JSON.stringify(copy); } catch(e) { return; }

    /* Stay under Firestore's 1 MiB document limit */
    if (json.length > 800000) {
      delete copy.notesData;                /* images are the only heavy thing */
      try { json = JSON.stringify(copy); } catch(e) { return; }
      if (json.length > 800000) { console.warn('🕰️ Backup too large, skipped.'); return; }
    }

    return ref.doc(today).set({
      date: today,
      created: Date.now(),
      records: realRecords,
      data: json                            /* stored as text, so nothing is reshaped */
    }).then(function() {
      console.log('🕰️ Daily backup saved for ' + today + ' (' + realRecords + ' records)');
      pruneOldBackups();
    });
  }).catch(function(e) { console.warn('Daily backup failed:', e.message); });
}

function pruneOldBackups() {
  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - BACKUP_KEEP_DAYS);
  var cutIso = aeIso(cutoff);
  firebaseDb.collection('users').doc(currentUser.uid).collection('backups').get()
    .then(function(snap) {
      snap.forEach(function(d) { if (d.id < cutIso) d.ref.delete(); });
    }).catch(function(){});
}

/* List the days you can go back to */
function listDailyBackups() {
  if (!FB_READY || !firebaseDb || !currentUser) return Promise.resolve([]);
  return firebaseDb.collection('users').doc(currentUser.uid).collection('backups').get()
    .then(function(snap) {
      var out = [];
      snap.forEach(function(d) {
        var v = d.data() || {};
        out.push({ date: d.id, records: v.records || 0, size: (v.data||'').length });
      });
      return out.sort(function(a,b){ return b.date.localeCompare(a.date); });
    }).catch(function(){ return []; });
}

/* Bring a day back */
function restoreDailyBackup(date) {
  if (!FB_READY || !firebaseDb || !currentUser) return;
  if (!confirm('Restore everything from ' + date + '?\n\nYour current data will be replaced by that day\'s copy.')) return;

  firebaseDb.collection('users').doc(currentUser.uid).collection('backups').doc(date).get()
    .then(function(doc) {
      if (!doc.exists) { showToast('That backup is missing.', 'error'); return; }
      var raw = (doc.data() || {}).data;
      var restored;
      try { restored = JSON.parse(raw); } catch(e) { showToast('That backup is damaged.', 'error'); return; }

      window.AppState = Object.assign({}, DEFAULT_STATE, restored);
      try { localStorage.setItem('vasavi_life_os_v2', JSON.stringify(window.AppState)); } catch(e) {}
      window.ALLOW_EMPTY_SYNC = true;       /* this restore is deliberate */
      forceFullSync();
      if (typeof renderPage === 'function') renderPage();
      showToast('🕰️ Restored everything from ' + date + '!');
    })
    .catch(function(e) { showToast('Restore failed: ' + e.message, 'error'); });
}

/* Force a full re-upload (used after restoring a backup) */
function forceFullSync() {
  _fbLastSynced = {};
  _fbFlush(window.AppState);
  showToast('☁️ Re-uploading everything to cloud...');
}

/* ============================================
   LOAD FROM FIREBASE — on first load
   ============================================ */
function syncFromFirebase() {
  /* RESCUE MODE: open the app with ?nosync=1 to stop the cloud
     touching this device, so you can back up what is on it. */
  if (location.search.indexOf('nosync') !== -1) {
    SYNC_STATE = 'failed';          /* also blocks uploading */
    console.warn('🛟 RESCUE MODE: cloud sync is OFF. Nothing will be downloaded or uploaded.');
    setTimeout(function() {
      if (typeof showToast === 'function') showToast('🛟 Rescue mode: sync OFF. Your device data is safe. Back it up now.');
    }, 1500);
    return;
  }
  if (!FB_READY || !firebaseDb || !currentUser) return;
  var uid = currentUser.uid;

  firebaseDb.collection('users').doc(uid)
    .collection('data').get()
    .then(function(snapshot) {
      if (snapshot.empty) {
        SYNC_STATE = 'done';
        console.log('No Firebase data yet — localStorage is source of truth');
        return;
      }

      var legacy = {};   /* old multi-key chunk docs */
      var modern = {};   /* new one-doc-per-key      */
      var partIndex = {};/* key -> number of parts   */
      var partData  = {};/* key -> { i: string }     */

      snapshot.forEach(function(doc) {
        var id = doc.id, data = doc.data() || {};

        /* Split-part document */
        var pm = id.match(/^(.+)__p(\d+)$/);
        if (pm) {
          if (!partData[pm[1]]) partData[pm[1]] = {};
          partData[pm[1]][parseInt(pm[2])] = data.s || '';
          return;
        }
        /* New format: value lives under "v" */
        if (Object.prototype.hasOwnProperty.call(data, 'v')) {
          modern[id] = data.v;
          return;
        }
        /* New format: big value split into parts */
        if (data.parts > 0) { partIndex[id] = data.parts; return; }

        /* Legacy chunk doc (core, ds, finance…) — every field is a key */
        Object.keys(data).forEach(function(k) {
          if (k !== 't' && k !== 'parts' && data[k] !== null && data[k] !== undefined) legacy[k] = data[k];
        });
      });

      /* Reassemble split values */
      Object.keys(partIndex).forEach(function(key) {
        var n = partIndex[key], buf = '';
        for (var i = 0; i < n; i++) buf += (partData[key] && partData[key][i]) || '';
        try { modern[key] = JSON.parse(buf); }
        catch(e) { console.warn('Could not rebuild "' + key + '" from parts:', e.message); }
      });

      /* ============================================
         MERGE WITH RESCUE
         Modern docs normally win. BUT if a modern
         doc is EMPTY and the old legacy doc still
         holds real data, the legacy data wins.
         This is what brings back habits, expenses
         and notes after the empty-overwrite bug.
         ============================================ */
      var merged = Object.assign({}, legacy);
      var rescued = [];
      Object.keys(modern).forEach(function(k) {
        var mv = modern[k];
        if (_isEmptyValue(mv) && !_isEmptyValue(legacy[k])) {
          rescued.push(k + ' (' + (Array.isArray(legacy[k]) ? legacy[k].length : Object.keys(legacy[k]).length) + ')');
          return;                       /* keep the older, real data */
        }
        merged[k] = mv;
      });
      if (rescued.length) {
        console.log('🛟 Rescued from the old backup copy: ' + rescued.join(', '));
        window._fbRescued = rescued;
        setTimeout(function() {
          if (typeof showToast === 'function') {
            showToast('🛟 Recovered your ' + rescued.length + ' missing sections!');
          }
        }, 1200);
      }

      /* Junk keys created by an earlier sync bug */
      delete merged.v; delete merged.t; delete merged.parts;
      delete window.AppState.v; delete window.AppState.t; delete window.AppState.parts;
      /* ============================================
         GUARD 3: THE CLOUD MUST NEVER SHRINK YOUR
         DEVICE DATA.
         If this device holds MORE records than the
         cloud (for example a laptop that still has
         October entries the cloud lost), we keep the
         device copy and upload it instead.
         ============================================ */
      var keptLocal = [];
      Object.keys(merged).forEach(function(k) {
        if (merged[k] === undefined) return;
        var cloudSize = _sizeOf(merged[k]);
        var localSize = _sizeOf(window.AppState[k]);
        if (localSize > cloudSize) {
          keptLocal.push(k + ' (this device ' + localSize + ', cloud ' + cloudSize + ')');
          return;                                   /* keep the richer local copy */
        }
        window.AppState[k] = merged[k];
      });
      if (keptLocal.length) {
        console.warn('🛡️ Kept this device\'s bigger copy for: ' + keptLocal.join(', '));
        window._fbKeptLocal = keptLocal;
        setTimeout(function() {
          if (typeof showToast === 'function') {
            showToast('🛡️ This device had more data than the cloud. Kept yours. Back it up now!', 'error');
          }
        }, 1500);
      }

      /* Seed the change-tracker so we don't immediately re-upload everything */
      Object.keys(merged).forEach(function(k) {
        try { _fbLastSynced[k] = JSON.stringify(merged[k]); } catch(e) {}
      });

      /* Persist the cloud copy locally too */
      try { localStorage.setItem('vasavi_life_os_v2', JSON.stringify(window.AppState)); } catch(e) {}

      SYNC_STATE = 'done';   /* uploads are safe from here on */
      setTimeout(autoDailyBackup, 3000);   /* today's safety copy */
      console.log('☁️ Firebase sync complete — ' + Object.keys(merged).length + ' sections loaded from cloud');
      if (typeof renderPage === 'function') renderPage();
    })
    .catch(function(e) {
      SYNC_STATE = 'failed';   /* allow local work, but never auto-wipe */
      console.warn('Firebase load error:', e.message);
    });
}

/* ============================================
   REAL-TIME LISTENER — updates across devices
   ============================================ */
function startRealtimeSync() {
  if (!FB_READY || !firebaseDb || !currentUser) return;
  var uid = currentUser.uid;

  firebaseDb.collection('users').doc(uid)
    .collection('data').onSnapshot(function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        if (change.type !== 'modified' && change.type !== 'added') return;
        var id = change.doc.id, data = change.doc.data() || {};
        if (/__p\d+$/.test(id)) return;                    /* part docs handled on full load */
        if (Object.prototype.hasOwnProperty.call(data, 'v')) {
          window.AppState[id] = data.v;                     /* new format */
          try { _fbLastSynced[id] = JSON.stringify(data.v); } catch(e) {}
          return;
        }
        if (data.parts > 0) return;                         /* split value — skip live update */
        Object.keys(data).forEach(function(k) {             /* legacy chunk */
          if (k !== 't' && k !== 'parts' && data[k] !== undefined) window.AppState[k] = data[k];
        });
      });
      if (typeof renderPage === 'function') renderPage();
      console.log('Real-time sync — data updated from another device');
    }, function(e) {
      console.warn('Real-time listener error:', e.message);
    });
}

console.log('firebase-config.js loaded — vasavi-life-os Spark plan');