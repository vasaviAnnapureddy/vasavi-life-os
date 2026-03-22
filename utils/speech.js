/* ============================================
   VASAVI'S LIFE OS — SPEECH (Voice AI)
   utils/speech.js
   Speak to AI, AI speaks back
   Works in Chrome — no subscription needed
   ============================================ */

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var speechSynth       = window.speechSynthesis;
var recognizer        = null;
var isListening       = false;
var voiceCallback     = null;

/* ============================================
   START LISTENING — user speaks
   ============================================ */
function startListening(onResult, lang) {
  if (!SpeechRecognition) {
    showToast('Voice not supported — use Chrome browser', 'error');
    return;
  }
  if (isListening) { stopListening(); return; }

  recognizer             = new SpeechRecognition();
  recognizer.lang        = lang || 'en-US';
  recognizer.continuous  = false;
  recognizer.interimResults = false;
  voiceCallback          = onResult;

  recognizer.onstart = function() {
    isListening = true;
    updateVoiceBtns(true);
  };

  recognizer.onresult = function(e) {
    var text = e.results[0][0].transcript;
    isListening = false;
    updateVoiceBtns(false);
    if (voiceCallback) voiceCallback(text);
  };

  recognizer.onerror = function(e) {
    isListening = false;
    updateVoiceBtns(false);
    if (e.error === 'no-speech') showToast('No speech detected — try again');
    else showToast('Voice error: ' + e.error, 'error');
  };

  recognizer.onend = function() {
    isListening = false;
    updateVoiceBtns(false);
  };

  recognizer.start();
}

function stopListening() {
  if (recognizer) recognizer.stop();
  isListening = false;
  updateVoiceBtns(false);
}

/* ============================================
   SPEAK — AI speaks response
   ============================================ */
function speakText(text, lang, onDone) {
  if (!speechSynth) return;
  speechSynth.cancel();

  /* Clean text for speaking */
  var clean = text.replace(/[#*`>\[\]]/g,'').substring(0, 500);

  var utt  = new SpeechSynthesisUtterance(clean);
  utt.lang = lang || 'en-US';
  utt.rate = 0.9;
  utt.pitch= 1.1;

  /* Pick best voice */
  var voices = speechSynth.getVoices();
  var preferred = voices.find(function(v) {
    return v.lang === utt.lang && v.localService;
  }) || voices.find(function(v) {
    return v.lang.startsWith(utt.lang.split('-')[0]);
  });
  if (preferred) utt.voice = preferred;

  utt.onend = function() { if (onDone) onDone(); };
  speechSynth.speak(utt);
}

function stopSpeaking() {
  if (speechSynth) speechSynth.cancel();
}

/* ============================================
   UPDATE BUTTON STATES
   ============================================ */
function updateVoiceBtns(listening) {
  document.querySelectorAll('.voice-listen-btn').forEach(function(btn) {
    btn.style.background  = listening ? '#ef4444' : '';
    btn.textContent       = listening ? '⏹ Stop' : '🎤 Speak';
  });
}

/* ============================================
   LANGUAGE MAP for speech
   ============================================ */
var SPEECH_LANGS = {
  'Korean':  'ko-KR',
  'English': 'en-US',
  'Hindi':   'hi-IN',
  'Tamil':   'ta-IN',
  'Telugu':  'te-IN',
  'Japanese':'ja-JP'
};

console.log('speech.js loaded — Voice AI ready');