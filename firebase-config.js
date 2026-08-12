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
  'memoryTag','rescueRevealed','rescueGuess','langActiveChat','financeAnalyticsTab'
];

var FB_MAX_BYTES  = 700000;   /* safety margin under Firestore's 1 MiB */
var _fbLastSynced = {};       /* key -> JSON string of last upload */
var _fbTimer      = null;
var _fbPending    = null;

function saveToFirebase(state) {
  if (!FB_READY || !firebaseDb || !currentUser) return;
  _fbPending = state;
  clearTimeout(_fbTimer);
  _fbTimer = setTimeout(function(){ _fbFlush(_fbPending); }, 2000);
}

function _fbFlush(state) {
  if (!state || !FB_READY || !firebaseDb || !currentUser) return;
  var uid = currentUser.uid;
  var ref = firebaseDb.collection('users').doc(uid).collection('data');
  var changed = 0;

  Object.keys(state).forEach(function(key) {
    if (SYNC_SKIP.indexOf(key) !== -1) return;
    var val = state[key];
    if (val === undefined || val === null) return;
    if (typeof val === 'function') return;

    var json;
    try { json = JSON.stringify(val); } catch(e) { return; }
    if (json === undefined) return;
    if (_fbLastSynced[key] === json) return;   /* unchanged — skip the write */

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
  if (!FB_READY || !firebaseDb || !currentUser) return;
  var uid = currentUser.uid;

  firebaseDb.collection('users').doc(uid)
    .collection('data').get()
    .then(function(snapshot) {
      if (snapshot.empty) {
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

      /* Legacy first, then modern wins (modern is the current format) */
      var merged = Object.assign({}, legacy, modern);
      Object.keys(merged).forEach(function(k) {
        if (merged[k] !== undefined) window.AppState[k] = merged[k];
      });

      /* Seed the change-tracker so we don't immediately re-upload everything */
      Object.keys(merged).forEach(function(k) {
        try { _fbLastSynced[k] = JSON.stringify(merged[k]); } catch(e) {}
      });

      /* Persist the cloud copy locally too */
      try { localStorage.setItem('vasavi_life_os_v2', JSON.stringify(window.AppState)); } catch(e) {}

      console.log('☁️ Firebase sync complete — ' + Object.keys(merged).length + ' sections loaded from cloud');
      if (typeof renderPage === 'function') renderPage();
    })
    .catch(function(e) { console.warn('Firebase load error:', e.message); });
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