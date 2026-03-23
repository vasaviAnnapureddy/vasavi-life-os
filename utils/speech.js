/* ============================================
   VASAVI'S LIFE OS — VOICE CONVERSATION
   utils/speech.js
   Full phone-call style conversation:
   You speak → Groq hears → LLaMA thinks →
   Orpheus speaks → mic opens → repeat
   ============================================ */

/* MediaRecorder is accessed directly */
var convActive       = false;
var convStream       = null;
var convRecorder     = null;
var convChunks       = [];
var convLang         = 'en-US';
var convCallback     = null;
var convSpeaking     = false;
var SPEECH_LANGS     = {
  'Korean':'ko-KR','English':'en-US','Hindi':'hi-IN',
  'Tamil':'ta-IN','Telugu':'te-IN','Japanese':'ja-JP'
};

/* ============================================
   START FULL VOICE CONVERSATION
   ============================================ */
function startVoiceConversation(langName, onUserSpoke) {
  if (!window.MediaRecorder) { showToast('Voice not supported — use Chrome browser','error'); return; }
  convActive   = true;
  convLang     = SPEECH_LANGS[langName] || 'en-US';
  convCallback = onUserSpoke;
  updateConvBtn(true);
  setConvStatus('🎤 Tap the button and speak...', '#10b981');
  showToast('Voice conversation started! Tap mic to speak 🎤');
}

function stopVoiceConversation() {
  convActive = false;
  if (convRecorder && convRecorder.state === 'recording') {
    try { convRecorder.stop(); } catch(e){}
  }
  if (convStream) { convStream.getTracks().forEach(function(t){ t.stop(); }); convStream=null; }
  if (typeof stopCurrentAudio === 'function') stopCurrentAudio();
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  updateConvBtn(false);
  setConvStatus('', '');
  showToast('Conversation ended');
}

/* ============================================
   RECORD ONE UTTERANCE
   User holds button or taps once
   ============================================ */
function startRecording() {
  if (!convActive) return;
  if (convSpeaking) {
    /* Stop AI and let user speak */
    if (typeof stopCurrentAudio === 'function') stopCurrentAudio();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    convSpeaking = false;
  }

  navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
    convStream  = stream;
    convChunks  = [];
    convRecorder = new window.MediaRecorder(stream);

    convRecorder.ondataavailable = function(e) {
      if (e.data.size > 0) convChunks.push(e.data);
    };

    convRecorder.onstop = function() {
      stream.getTracks().forEach(function(t){ t.stop(); });
      if (!convActive) return;
      var blob = new Blob(convChunks, { type:'audio/webm' });
      if (blob.size < 1000) {
        setConvStatus('🎤 Too short — try again', '#f59e0b');
        return;
      }
      setConvStatus('💭 Processing...', '#a855f7');
      processUserSpeech(blob);
    };

    convRecorder.start();
    setConvStatus('🔴 Recording... tap Stop when done', '#ef4444');
    updateRecordBtn(true);

  }).catch(function(e) {
    showToast('Microphone error: '+e.message, 'error');
    setConvStatus('❌ Microphone blocked', '#ef4444');
  });
}

function stopRecording() {
  if (convRecorder && convRecorder.state === 'recording') {
    convRecorder.stop();
    updateRecordBtn(false);
  }
}

/* ============================================
   PROCESS: audio → text → AI → voice
   ============================================ */
function processUserSpeech(audioBlob) {
  var key = (window.AppState && window.AppState.anthropicKey)
         || window.GROQ_KEY_FROM_FIREBASE
         || '';

  if (!key) {
    /* Wait for Firebase to load key */
    setConvStatus('🔑 Loading key from Firebase...', '#f59e0b');
    setTimeout(function() { processUserSpeech(audioBlob); }, 2000);
    return;
  }

  if (typeof groqSpeechToText !== 'function') {
    setConvStatus('❌ Page not fully loaded — please refresh once', '#ef4444');
    return;
  }

  groqSpeechToText(audioBlob, function(text, err) {
    if (err || !text || text.trim() === '') {
      setConvStatus('❌ Could not hear clearly — tap Speak and try again', '#ef4444');
      return;
    }
    setConvStatus('💬 You said: "' + text + '"', '#a855f7');
    if (convCallback) convCallback(text);
  });
}

/* ============================================
   AI SPEAKS — then user can speak again
   ============================================ */
function aiSpeak(text, langName, onDone) {
  if (!convActive && !onDone) return;
  convSpeaking = true;
  setConvStatus('🔊 AI speaking...', '#f59e0b');

  var langCode = SPEECH_LANGS[langName] || 'en-US';

  if (typeof speakResponse === 'function') {
    speakResponse(text, langCode, function() {
      convSpeaking = false;
      if (convActive) {
        setConvStatus('🎤 Your turn — tap mic to speak', '#10b981');
      }
      if (onDone) onDone();
    });
  }
}

/* ============================================
   UI HELPERS
   ============================================ */
function updateConvBtn(active) {
  document.querySelectorAll('.conv-mode-btn').forEach(function(btn) {
    btn.style.background = active ? '#1a0533' : '';
    btn.style.borderColor = active ? '#a855f7' : '';
    btn.style.color = active ? '#a855f7' : '';
    btn.textContent = active ? '⏹ End Conversation' : '🎙️ Start Voice Conversation';
  });
}

function updateRecordBtn(recording) {
  document.querySelectorAll('.record-btn').forEach(function(btn) {
    btn.style.background = recording ? '#ef4444' : '#1a0000';
    btn.style.border = recording ? '2px solid #ff6666' : '2px solid #ef4444';
    btn.style.color = '#fff';
    btn.innerHTML = recording ? '⏹ Stop Recording' : '🎤 Speak';
  });
  _isRecording = recording;
}

function setConvStatus(msg, color) {
  document.querySelectorAll('.conv-status').forEach(function(el) {
    el.textContent = msg;
    if (color) el.style.color = color;
    el.style.display = 'flex';
  });
  /* Also log to console for debugging */
  if (msg) console.log('Voice status:', msg);
}

/* Single tap toggle for record button */
var _isRecording = false;
function toggleRecord() {
  /* Works even without conversation mode */
  if (_isRecording) {
    _isRecording = false;
    stopRecording();
  } else {
    _isRecording = true;
    startRecording();
  }
}

console.log('speech.js loaded — Groq Voice Conversation ready');