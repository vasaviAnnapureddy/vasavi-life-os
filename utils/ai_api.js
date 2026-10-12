/* ============================================
   VASAVI'S LIFE OS — AI API
   utils/ai_api.js
   Groq: Whisper (speech→text) + LLaMA (think)
   + Orpheus (text→speech)
   FREE forever. Like a real phone call.
   ============================================ */

var HARDCODED_KEY = ''; /* paste your gsk_... key here */

/* ============================================
   MODEL NAMES — all in ONE place.
   Groq retires models every few months. When a
   model dies you only change it here.
   Last checked: 12 Oct 2026
   - llama-3.3-70b-versatile  RETIRED 16 Aug 2026
   - llama-4-scout (vision)   RETIRED 17 Jul 2026
   Check: https://console.groq.com/docs/deprecations
   ============================================ */
var GROQ_CHAT_MODEL   = 'openai/gpt-oss-120b';   /* text + reasoning */
var GROQ_VISION_MODEL = 'qwen/qwen3.8-27b';      /* reads photos     */
var GROQ_STT_MODEL    = 'whisper-large-v3-turbo';/* speech to text   */
var CLAUDE_MODEL      = 'claude-sonnet-5';

/* If a model ever dies again, this makes the message helpful
   instead of scary gibberish. */
function friendlyAIError(msg) {
  var m = String(msg || '');
  if (/does not exist|model_not_found|decommission|deprecat/i.test(m)) {
    return 'That AI model was retired by Groq. Open utils/ai_api.js and update ' +
           'GROQ_CHAT_MODEL / GROQ_VISION_MODEL from https://console.groq.com/docs/models\n\n(Technical: ' + m + ')';
  }
  if (/invalid api key|unauthorized|401/i.test(m)) {
    return 'Your API key was not accepted. Add a fresh key in AI Assistant.';
  }
  if (/rate limit|429/i.test(m)) {
    return 'Too many requests for now — wait a minute and try again. (Free tier limit.)';
  }
  return m;
}

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
  form.append('model', GROQ_STT_MODEL);
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

/* Added to EVERY system prompt so replies read like
   normal writing on a phone, not raw markdown with
   **stars** and | pipes |. */
var PLAIN_STYLE_RULE =
  '\n\nHOW TO WRITE YOUR REPLY:\n' +
  '- Write like a person talking, in short plain sentences.\n' +
  '- Do NOT use markdown tables, pipes (|), asterisks (**) or hashes (#).\n' +
  '- For lists, start the line with a dash and keep it short.\n' +
  '- Put numbers inline in the sentence, e.g. "Rent takes Rs 14,000 of your Rs 10,000 income".\n' +
  '- This is read on a small phone screen, so keep it tight.';

function applyPlainStyle(systemPrompt) {
  var p = String(systemPrompt || '');
  /* The agent asks for strict JSON — never touch that one */
  if (p.indexOf('JSON') !== -1 || p.indexOf('TOTAL_KCAL') !== -1) return p;
  return p + PLAIN_STYLE_RULE;
}

function groqChat(systemPrompt, messages, onDone) {
  systemPrompt = applyPlainStyle(systemPrompt);
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
      model: GROQ_CHAT_MODEL,
      max_tokens: 800,
      temperature: 0.8,
      messages: msgs
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.choices && data.choices[0]) onDone(data.choices[0].message.content||'');
    else onDone(friendlyAIError(data.error&&data.error.message||'unknown error'));
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
        model: CLAUDE_MODEL,
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
      else onDone(friendlyAIError(data.error&&data.error.message||'unknown error'));
    })
    .catch(function(e){ onDone('Connection error: '+e.message); });
    return;
  }

  /* Groq vision — Llama 4 Scout supports images, free */
  fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'Authorization':'Bearer '+key },
    body: JSON.stringify({
      model: GROQ_VISION_MODEL,
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
    else onDone(friendlyAIError(data.error&&data.error.message||'unknown error'));
  })
  .catch(function(e){ onDone('Connection error: '+e.message); });
}

/* Real Claude — used automatically when key starts with sk-ant- */
function claudeChat(systemPrompt, messages, onDone) {
  systemPrompt = applyPlainStyle(systemPrompt);
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
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: msgs
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.content && data.content[0]) onDone(data.content[0].text||'');
    else onDone(friendlyAIError(data.error&&data.error.message||'unknown error'));
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