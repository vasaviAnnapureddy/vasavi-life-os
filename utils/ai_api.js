/* ============================================
   VASAVI'S LIFE OS — AI API
   utils/ai_api.js
   Groq: Whisper (speech→text) + LLaMA (think)
   + Orpheus (text→speech)
   FREE forever. Like a real phone call.
   ============================================ */

var HARDCODED_KEY = ''; /* paste your gsk_... key here */

function getApiKey() {
  return (window.AppState && window.AppState.anthropicKey) || HARDCODED_KEY || '';
}

/* ============================================
   STEP 1: YOUR VOICE → TEXT (Groq Whisper)
   ============================================ */
function groqSpeechToText(audioBlob, onDone) {
  var key = getApiKey();
  if (!key) { onDone('', 'No API key'); return; }

  var form = new FormData();
  var ext = (audioBlob.type || '').includes('ogg') ? 'ogg' : 'webm';
  form.append('file', audioBlob, 'recording.' + ext);
  form.append('model', 'whisper-large-v3-turbo');
  /* No language specified — auto-detect Korean or English */
  form.append('response_format', 'text');

  fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + key },
    body: form
  })
  .then(function(r) { return r.text(); })
  .then(function(text) { onDone(text.trim(), null); })
  .catch(function(e) { onDone('', e.message); });
}

/* ============================================
   STEP 2: TEXT → AI RESPONSE
   Groq (free) by default. Paste a Claude API key
   (starts with sk-ant-) instead and it upgrades
   to real Claude automatically.
   ============================================ */
function isClaudeKey() {
  return getApiKey().indexOf('sk-ant-') === 0;
}

function groqChat(systemPrompt, messages, onDone) {
  var key = getApiKey();
  if (!key) { onDone('Please add your API key in AI Assistant! (Groq free key or Claude sk-ant- key)'); return; }

  if (isClaudeKey()) { claudeChat(systemPrompt, messages, onDone); return; }

  var msgs = [{ role:'system', content: systemPrompt }];
  messages.forEach(function(m) {
    msgs.push({ role: m.role==='user'?'user':'assistant', content: m.text||m.content||'' });
  });

  fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'Authorization':'Bearer '+key },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 800,
      temperature: 0.8,
      messages: msgs
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.choices && data.choices[0]) onDone(data.choices[0].message.content||'');
    else onDone('Error: '+(data.error&&data.error.message||'unknown'));
  })
  .catch(function(e) { onDone('Connection error: '+e.message); });
}

/* ============================================
   VISION — send a photo + question to the AI.
   Groq → Llama 4 Scout (free). Claude key → Claude.
   Used by the AI Dietician to read plate photos.
   ============================================ */
function aiVision(prompt, dataUrl, onDone) {
  var key = getApiKey();
  if (!key) { onDone('Add your API key in AI Assistant first (Groq free key works for photos too).'); return; }

  if (isClaudeKey()) {
    var parts = dataUrl.split(',');
    var mediaType = (parts[0].match(/data:(.*?);/)||[])[1] || 'image/jpeg';
    fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 700,
        messages: [{ role:'user', content: [
          { type:'image', source:{ type:'base64', media_type:mediaType, data:parts[1] } },
          { type:'text', text: prompt }
        ]}]
      })
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (data.content && data.content[0]) onDone(data.content[0].text||'');
      else onDone('Claude error: '+(data.error&&data.error.message||'unknown'));
    })
    .catch(function(e){ onDone('Connection error: '+e.message); });
    return;
  }

  /* Groq vision — Llama 4 Scout supports images, free */
  fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'Authorization':'Bearer '+key },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      max_tokens: 700,
      temperature: 0.3,
      messages: [{ role:'user', content: [
        { type:'text', text: prompt },
        { type:'image_url', image_url:{ url: dataUrl } }
      ]}]
    })
  })
  .then(function(r){ return r.json(); })
  .then(function(data){
    if (data.choices && data.choices[0]) onDone(data.choices[0].message.content||'');
    else onDone('Error: '+(data.error&&data.error.message||'unknown'));
  })
  .catch(function(e){ onDone('Connection error: '+e.message); });
}

/* Real Claude — used automatically when key starts with sk-ant- */
function claudeChat(systemPrompt, messages, onDone) {
  var msgs = [];
  messages.forEach(function(m) {
    msgs.push({ role: m.role==='user'?'user':'assistant', content: m.text||m.content||'' });
  });
  if (msgs.length === 0) msgs.push({ role:'user', content:'Hello' });

  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': getApiKey(),
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: msgs
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.content && data.content[0]) onDone(data.content[0].text||'');
    else onDone('Claude error: '+(data.error&&data.error.message||'unknown'));
  })
  .catch(function(e) { onDone('Connection error: '+e.message); });
}

/* ============================================
   STEP 3: AI TEXT → VOICE (Browser TTS - works instantly)
   ============================================ */
function groqTextToSpeech(text, onDone) {
  /* Use browser voice directly — fast, free, no API needed */
  if (onDone) onDone(null);
}

/* ============================================
   PLAY AUDIO URL
   ============================================ */
var currentAudio = null;
function playAudioUrl(url, onEnd) {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  if (!url) { if(onEnd) onEnd(); return; }
  currentAudio = new Audio(url);
  currentAudio.onended = function() { currentAudio=null; if(onEnd) onEnd(); };
  currentAudio.onerror = function() { currentAudio=null; if(onEnd) onEnd(); };
  currentAudio.play().catch(function(e) {
    console.warn('Audio play error:', e);
    if(onEnd) onEnd();
  });
}

function stopCurrentAudio() {
  if (currentAudio) { currentAudio.pause(); currentAudio=null; }
}

/* ============================================
   BROWSER TTS — Natural voice
   ============================================ */
function browserSpeak(text, lang, onEnd) {
  if (!window.speechSynthesis) { if(onEnd) onEnd(); return; }
  window.speechSynthesis.cancel();

  /* Clean text */
  var clean = text.replace(/\[.*?\]/g, function(m){
    return m.replace(/[\[\]]/g,'');
  }).replace(/[*#`]/g,'').substring(0, 400);

  var utt   = new SpeechSynthesisUtterance(clean);
  utt.lang  = lang || 'en-US';
  utt.rate  = 0.88;
  utt.pitch = 1.05;
  utt.volume = 1.0;

  /* Pick best available voice */
  var voices = window.speechSynthesis.getVoices();
  var best =
    voices.find(function(v){ return v.lang === utt.lang && v.name.includes('Google'); }) ||
    voices.find(function(v){ return v.lang === utt.lang && v.localService; }) ||
    voices.find(function(v){ return v.lang.startsWith((lang||'en').split('-')[0]); }) ||
    voices[0];
  if (best) utt.voice = best;

  utt.onend   = function(){ if(onEnd) onEnd(); };
  utt.onerror = function(){ if(onEnd) onEnd(); };
  window.speechSynthesis.speak(utt);
}

/* ============================================
   SPEAK RESPONSE — browser voice, works always
   ============================================ */
function speakResponse(text, langCode, onEnd) {
  browserSpeak(text, langCode||'en-US', onEnd);
}

/* ============================================
   GENERAL AI — for all other modules
   ============================================ */
function callClaude(systemPrompt, userMessage, onChunk, onDone) {
  groqChat(systemPrompt, [{ role:'user', text: userMessage }], onDone);
}

function askTopicAI(topic, rootName, level, question, onDone) {
  var levelName = level===0?'complete beginner':level===1?'intermediate':'advanced';
  var sys = 'You are Vasavi\'s personal AI teacher. She is 23, Bengaluru, DataMites Data Science student. '+levelName+' level. Teach like a brilliant warm friend — real insights, Indian examples, conversational. Max 250 words.';
  callClaude(sys, 'Topic: '+topic+' ('+rootName+')\nQuestion: '+question, null, onDone);
}

function askLanguageTutor(language, question, history, onDone) {
  var sys = 'You are Vasavi\'s '+language+' tutor and best friend. She is 23, Bengaluru, loves K-dramas. Be warm, fun, encouraging. Give Korean pronunciation in brackets [an-nyeong]. Keep replies under 150 words. Respond naturally like a real conversation.';
  var safeH = Array.isArray(history)?history:[];
  var hist = safeH.slice(-6).map(function(m){ return (m.role==='user'?'Vasavi':'Tutor')+': '+(m.text||m.content||''); }).join('\n');
  groqChat(sys, safeH.slice(-6), onDone);
}

function askJournalAI(entry, mood, lifeScore, onDone) {
  callClaude('You are Vasavi\'s caring AI companion. She is 23, Bengaluru. Respond warmly to her journal — validate, give one gentle insight, encourage. Max 120 words. Sound like a best friend.', 'Mood: '+(mood||'neutral')+'\n\nEntry: '+entry, null, onDone);
}

function askGeneralAI(question, context, onDone) {
  callClaude('You are Vasavi\'s personal AI mentor. 23, Bengaluru, Data Science student. Answer warmly, practically, with Indian context.', (context?'Context:\n'+context+'\n\n':'')+'Question: '+question, null, onDone);
}

function saveApiKeyFromInput() {
  var el = document.getElementById('api-key-input');
  if (!el||!el.value.trim()) { showToast('Paste your Groq key first','error'); return; }
  window.AppState.anthropicKey = el.value.trim();
  saveData(); showToast('Groq key saved! Voice AI ready ✅'); renderPage();
}

function clearApiKey() { window.AppState.anthropicKey=''; saveData(); renderPage(); }
function saveApiKey(k) { if(!k) return false; window.AppState.anthropicKey=k.trim(); saveData(); return true; }

console.log('ai_api.js loaded — Groq Speech-to-Speech ready');