/* ============================================
   VASAVI'S LIFE OS — VOICE CONVERSATION
   utils/speech.js

   Real back-and-forth voice conversation:
   You speak → AI listens → AI speaks back → repeat
   Like talking to a real person
   ============================================ */

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var speechSynth       = window.speechSynthesis;
var recognizer        = null;
var isListening       = false;
var isSpeaking        = false;
var conversationMode  = false;
var currentLang       = 'en-US';
var onVoiceResult     = null;

var SPEECH_LANGS = {
  'Korean':  'ko-KR',
  'English': 'en-US',
  'Hindi':   'hi-IN',
  'Tamil':   'ta-IN',
  'Telugu':  'te-IN',
  'Japanese':'ja-JP'
};

/* ============================================
   CONVERSATION MODE — full back and forth
   You speak → AI responds → AI speaks →
   automatically listens again → repeat
   ============================================ */
function startConversation(lang, onUserSpoke) {
  if (!SpeechRecognition) {
    showToast('Voice not supported — use Chrome browser', 'error');
    return;
  }
  conversationMode = true;
  currentLang      = lang || 'en-US';
  onVoiceResult    = onUserSpoke;
  updateConvBtn(true);
  listenOnce();
}

function stopConversation() {
  conversationMode = false;
  isListening      = false;
  if (recognizer)    { try { recognizer.stop(); } catch(e){} }
  if (speechSynth)   { speechSynth.cancel(); }
  updateConvBtn(false);
  showToast('Conversation ended');
}

function listenOnce() {
  if (!conversationMode) return;
  if (isSpeaking) return; /* wait for AI to finish speaking */

  recognizer              = new SpeechRecognition();
  recognizer.lang         = currentLang;
  recognizer.continuous   = false;
  recognizer.interimResults = false;

  recognizer.onstart = function() {
    isListening = true;
    setConvStatus('🎤 Listening... speak now', '#10b981');
  };

  recognizer.onresult = function(e) {
    isListening      = false;
    var text         = e.results[0][0].transcript;
    setConvStatus('💭 You said: ' + text, '#a855f7');
    if (onVoiceResult) onVoiceResult(text);
    /* AI processes and speaks — then listenOnce() called again from speakAIResponse */
  };

  recognizer.onerror = function(e) {
    isListening = false;
    if (e.error === 'no-speech' && conversationMode) {
      setTimeout(listenOnce, 500); /* try again */
    } else {
      setConvStatus('❌ Error: ' + e.error + ' — tap mic to retry', '#ef4444');
    }
  };

  recognizer.onend = function() {
    isListening = false;
  };

  try { recognizer.start(); }
  catch(e) { console.warn('recognizer start error:', e); }
}

/* ============================================
   AI SPEAKS — then listens again automatically
   ============================================ */
function speakAIResponse(text, lang) {
  if (!speechSynth || !text) {
    /* No speech API — just listen again */
    if (conversationMode) setTimeout(listenOnce, 500);
    return;
  }

  isSpeaking = true;
  speechSynth.cancel();

  /* Clean text */
  var clean = text
    .replace(/[#*`>\[\]]/g, '')
    .replace(/\n+/g, '. ')
    .substring(0, 400);

  var utt   = new SpeechSynthesisUtterance(clean);
  utt.lang  = lang || currentLang;
  utt.rate  = 0.92;
  utt.pitch = 1.05;

  /* Pick best available voice */
  var voices = speechSynth.getVoices();
  var best   = voices.find(function(v) {
    return v.lang === utt.lang && v.localService;
  }) || voices.find(function(v) {
    return v.lang.startsWith((utt.lang || 'en').split('-')[0]);
  });
  if (best) utt.voice = best;

  setConvStatus('🔊 AI speaking...', '#f59e0b');

  utt.onend = function() {
    isSpeaking = false;
    /* After AI finishes speaking → automatically listen again */
    if (conversationMode) {
      setConvStatus('🎤 Your turn — speak now', '#10b981');
      setTimeout(listenOnce, 600);
    }
  };

  utt.onerror = function() {
    isSpeaking = false;
    if (conversationMode) setTimeout(listenOnce, 500);
  };

  speechSynth.speak(utt);
}

/* ============================================
   ONE-SHOT — single listen (non-conversation)
   ============================================ */
function startListening(onResult, lang) {
  if (!SpeechRecognition) {
    showToast('Voice not supported — use Chrome', 'error');
    return;
  }
  if (isListening) { stopListening(); return; }

  var r          = new SpeechRecognition();
  r.lang         = lang || 'en-US';
  r.continuous   = false;
  r.interimResults = false;

  r.onstart  = function() { isListening = true; updateVoiceBtns(true); };
  r.onresult = function(e) {
    isListening = false;
    updateVoiceBtns(false);
    if (onResult) onResult(e.results[0][0].transcript);
  };
  r.onerror  = function(e) { isListening = false; updateVoiceBtns(false); };
  r.onend    = function() { isListening = false; updateVoiceBtns(false); };
  r.start();
}

function stopListening() {
  if (recognizer) try { recognizer.stop(); } catch(e){}
  isListening = false;
  updateVoiceBtns(false);
}

function speakText(text, lang, onDone) {
  if (!speechSynth) { if(onDone) onDone(); return; }
  speechSynth.cancel();
  var utt   = new SpeechSynthesisUtterance(text.substring(0,300));
  utt.lang  = lang || 'en-US';
  utt.rate  = 0.92;
  utt.onend = function() { if(onDone) onDone(); };
  var voices = speechSynth.getVoices();
  var best = voices.find(function(v){ return v.lang === utt.lang; });
  if (best) utt.voice = best;
  speechSynth.speak(utt);
}

function stopSpeaking() {
  if (speechSynth) speechSynth.cancel();
  isSpeaking = false;
  if (conversationMode) setTimeout(listenOnce, 300);
}

/* ============================================
   UI HELPERS
   ============================================ */
function updateConvBtn(active) {
  document.querySelectorAll('.conv-mode-btn').forEach(function(btn) {
    if (active) {
      btn.style.background = '#ef4444';
      btn.style.color      = '#fff';
      btn.textContent      = '⏹ End Conversation';
    } else {
      btn.style.background = '';
      btn.style.color      = '';
      btn.textContent      = '🎙️ Start Voice Conversation';
    }
  });
}

function updateVoiceBtns(listening) {
  document.querySelectorAll('.voice-listen-btn').forEach(function(btn) {
    btn.style.background = listening ? '#ef4444' : '';
    btn.textContent      = listening ? '⏹ Stop' : '🎤 Speak';
  });
}

function setConvStatus(msg, color) {
  document.querySelectorAll('.conv-status').forEach(function(el) {
    el.textContent = msg;
    if (color) el.style.color = color;
  });
}

console.log('speech.js loaded — Voice conversation ready');