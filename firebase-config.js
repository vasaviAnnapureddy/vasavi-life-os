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
    /* Use fixed user ID — no auth needed since rules are open */
    currentUser = { uid: 'vasavi-main-user' };
    console.log('Firebase ready — connecting to Firestore');
    syncFromFirebase();
  } catch(e) {
    console.warn('Firebase init failed:', e.message, '— using localStorage');
    FB_READY = false;
  }
}

/* ============================================
   SAVE TO FIREBASE — called after every saveData()
   ============================================ */
function saveToFirebase(state) {
  if (!FB_READY || !firebaseDb || !currentUser) return;
  var uid = currentUser.uid;

  /* Split data into chunks — Firestore has 1MB doc limit */
  var chunks = {
    core:     { habits: state.habits, goals: state.goals, tasks: state.tasks, events: state.events },
    ds:       { dsProgress: state.dsProgress, interviewScores: state.interviewScores, projects: state.projects },
    finance:  { expenses: state.expenses, savings: state.savings, salaryGoal: state.salaryGoal },
    jobs:     { jobs: state.jobs, atsResumeText: state.atsResumeText },
    learning: { topicLevels: state.topicLevels, topicNotes: state.topicNotes, lessonsRead: state.lessonsRead },
    journal:  { journalEntries: state.journalEntries, generalNotes: state.generalNotes, notesData: state.notesData },
    language: { langVocab: state.langVocab, langNotebook: state.langNotebook, langStreaks: state.langStreaks },
    profile:  { resume: state.resume, gymLog: state.gymLog, lifeScore: state.lifeScore }
  };

  Object.keys(chunks).forEach(function(chunk) {
    firebaseDb.collection('users').doc(uid)
      .collection('data').doc(chunk)
      .set(chunks[chunk], { merge: true })
      .catch(function(e) { console.warn('Firebase save error (' + chunk + '):', e.message); });
  });
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
      var merged = {};
      snapshot.forEach(function(doc) {
        var data = doc.data();
        Object.keys(data).forEach(function(k) {
          if (data[k] !== null && data[k] !== undefined) {
            merged[k] = data[k];
          }
        });
      });
      /* Merge into AppState — Firebase wins for synced fields */
      Object.keys(merged).forEach(function(k) {
        if (merged[k] !== undefined) window.AppState[k] = merged[k];
      });
      console.log('Firebase sync complete — data loaded from cloud');
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
        if (change.type === 'modified' || change.type === 'added') {
          var data = change.doc.data();
          Object.keys(data).forEach(function(k) {
            if (data[k] !== undefined) window.AppState[k] = data[k];
          });
        }
      });
      if (typeof renderPage === 'function') renderPage();
      console.log('Real-time sync — data updated from another device');
    }, function(e) {
      console.warn('Real-time listener error:', e.message);
    });
}

console.log('firebase-config.js loaded — vasavi-life-os Spark plan');