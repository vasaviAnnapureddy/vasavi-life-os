/* ============================================
   VASAVI'S LIFE OS — BRAIN GYM
   modules/brain.js

   Built for one real problem: "I know the word
   but I can't find it when speaking."
   That skill is called WORD RETRIEVAL and it is
   trainable like a muscle:
   - 🔤 Word Rescue  → definition shown, you
     recall the word (tip-of-tongue practice)
   - 🧠 Fluency Sprint → 45s, name as many X as
     you can (retrieval speed under pressure)
   - ⚡ AI Daily Byte → one AI/tech concept a day
   ============================================ */

function renderBrain() {
  var state = window.AppState;
  var tab = state.brainTab || 'byte';
  var h = '';

  h += '<div class="subtab-bar">';
  [['byte','⚡ AI Daily Byte'],['rescue','🔤 Word Rescue'],['sprint','🧠 Fluency Sprint']].forEach(function(t) {
    h += '<div class="subtab ' + (tab===t[0]?'active':'') + '" onclick="switchBrainTab(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  h += '</div>';

  if (tab === 'byte')   h += renderAIByte(state);
  if (tab === 'rescue') h += renderWordRescue(state);
  if (tab === 'sprint') h += renderFluencySprint(state);

  return h;
}

function switchBrainTab(t) { window.AppState.brainTab = t; saveData(); renderPage(); }

/* Days since a fixed date — stable daily rotation */
function brainDayNumber() {
  return Math.floor(Date.now() / 86400000);
}

/* ============================================
   ⚡ AI DAILY BYTE
   ============================================ */
function renderAIByte(state) {
  var h = '';
  var idx  = brainDayNumber() % AI_BYTES.length;
  var byte = AI_BYTES[idx];
  var iso  = aeTodayIso();
  var read = !!(state.byteLog||{})[iso];
  var streak = aeStreakFlexible(state.byteLog||{}, 1);
  var totalRead = Object.keys(state.byteLog||{}).length;

  h += '<div class="grid-3" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">🔥 ' + streak + '</div><div class="stat-label">Learning Streak</div><div class="stat-sub">1 off-day allowed</div></div>';
  h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">' + totalRead + '</div><div class="stat-label">Bytes Learned</div></div>';
  h += '<div class="stat-card" style="--stat-color:#06b6d4"><div class="stat-value">' + AI_BYTES.length + '</div><div class="stat-label">In Rotation</div><div class="stat-sub">1 per day</div></div>';
  h += '</div>';

  h += '<div class="card" style="margin-bottom:14px;border:1px solid #a855f7;">';
  h += '<div style="font-size:10px;color:#a855f7;font-weight:800;margin-bottom:6px;">⚡ TODAY\'S AI BYTE — ' + new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short'}) + '</div>';
  h += '<div style="font-size:17px;font-weight:900;margin-bottom:10px;">' + escHtml(byte.t) + '</div>';
  h += '<div style="font-size:13px;line-height:1.9;color:#c4c4d4;margin-bottom:12px;">' + escHtml(byte.b) + '</div>';
  h += '<div style="background:#0d0d1a;border-left:3px solid #f59e0b;padding:10px;border-radius:0 8px 8px 0;font-size:12px;color:#f59e0b;margin-bottom:12px;">🤔 Think: ' + escHtml(byte.q) + '</div>';

  h += '<div style="display:flex;gap:8px;">';
  if (!read) {
    h += '<button class="btn-primary" style="flex:1;" onclick="markByteRead()">✅ Got It — Count My Streak</button>';
  } else {
    h += '<div style="flex:1;text-align:center;padding:10px;color:#10b981;font-weight:700;font-size:12px;">✅ Learned today! Come back tomorrow.</div>';
  }
  h += '<button class="btn-ghost" onclick="byteExplainDeeper(this)">🤖 Go Deeper</button>';
  h += '</div>';
  h += '<div id="byte-deeper" style="display:none;"></div>';
  h += '</div>';

  h += '<div style="font-size:10px;color:#556080;text-align:center;">One concept a day = ' + AI_BYTES.length + ' interview-ready concepts in ' + AI_BYTES.length + ' days. Reading it is 1 minute; thinking about the question is where learning happens.</div>';

  return h;
}

function markByteRead() {
  if (!window.AppState.byteLog) window.AppState.byteLog = {};
  window.AppState.byteLog[aeTodayIso()] = 1;
  saveData(); renderPage();
  showToast('⚡ Byte learned! Brain +1');
}

function byteExplainDeeper(btn) {
  var byte = AI_BYTES[brainDayNumber() % AI_BYTES.length];
  var target = document.getElementById('byte-deeper');
  if (!target) return;
  target.style.display = 'block';

  if (typeof groqChat === 'function' && typeof getApiKey === 'function' && getApiKey()) {
    btn.disabled = true;
    target.innerHTML = '<div style="padding:10px;font-size:11px;color:#a855f7;">🤖 Preparing a deeper lesson...</div>';
    var sys = 'You are Vasavi\'s AI teacher. She is 23, Bengaluru, DS student preparing for interviews. ' +
      'Explain the topic deeper with one Indian real-world example and one interview-style question with its answer. Max 250 words. Be warm and clear.';
    groqChat(sys, [{ role:'user', text:'Topic: ' + byte.t + '\nWhat I already read: ' + byte.b + '\nGo deeper.' }], function(reply) {
      btn.disabled = false;
      target.innerHTML = '<div style="margin-top:10px;background:#0d0d1a;border-left:3px solid #a855f7;padding:12px;border-radius:0 8px 8px 0;font-size:12px;line-height:1.8;white-space:pre-wrap;color:#a0aec0;">' + escHtml(reply) + '</div>';
    });
  } else {
    target.innerHTML = '<div style="margin-top:10px;font-size:11px;color:#f59e0b;">Add your Groq API key in AI Assistant to unlock deeper AI lessons.</div>';
  }
}

/* ============================================
   🔤 WORD RESCUE — tip-of-the-tongue trainer
   The definition is shown; SHE retrieves the
   word. This is retrieval practice — the
   scientifically proven fix for "I knew it a
   minute ago".
   ============================================ */
function renderWordRescue(state) {
  var h = '';
  var iso = aeTodayIso();
  var log = (state.rescueLog||{})[iso] || { done: 0, correct: 0 };
  var idx = (state.rescueIdx != null) ? state.rescueIdx : (brainDayNumber() * 7) % WORD_RESCUE.length;
  var item = WORD_RESCUE[idx % WORD_RESCUE.length];
  var revealed = !!state.rescueRevealed;
  var streakMap = {};
  Object.keys(state.rescueLog||{}).forEach(function(k){ if ((state.rescueLog[k].done||0) >= 3) streakMap[k]=1; });
  var streak = aeStreakFlexible(streakMap, 1);

  h += '<div class="grid-3" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#ec4899"><div class="stat-value">🔥 ' + streak + '</div><div class="stat-label">Rescue Streak</div><div class="stat-sub">3+ words = a day</div></div>';
  h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">' + log.correct + '/' + log.done + '</div><div class="stat-label">Today\'s Score</div></div>';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + WORD_RESCUE.length + '</div><div class="stat-label">Words in Bank</div></div>';
  h += '</div>';

  h += '<div class="card" style="text-align:center;padding:24px 18px;margin-bottom:14px;border:1px solid #ec4899;">';
  h += '<div style="font-size:10px;color:#ec4899;font-weight:800;margin-bottom:10px;">WHAT IS THE WORD FOR...</div>';
  h += '<div style="font-size:16px;line-height:1.7;font-weight:700;margin-bottom:16px;">"' + escHtml(item.d) + '"</div>';

  if (!revealed) {
    h += '<div style="font-size:11px;color:#8899bb;margin-bottom:12px;">Say it OUT LOUD before revealing — speaking is the workout!</div>';
    h += '<input id="rescue-guess" placeholder="Type your guess (optional)..." style="max-width:280px;margin:0 auto 12px;display:block;text-align:center;" onkeydown="if(event.key===\'Enter\')rescueReveal()" />';
    h += '<button class="btn-primary" style="width:100%;max-width:280px;" onclick="rescueReveal()">👀 Reveal Word</button>';
  } else {
    var guess = (state.rescueGuess||'').toLowerCase().trim();
    var correct = guess && guess === item.w.toLowerCase();
    h += '<div style="font-size:26px;font-weight:900;color:#ec4899;margin-bottom:8px;">' + escHtml(item.w) + '</div>';
    if (guess) {
      h += '<div style="font-size:12px;color:' + (correct?'#10b981':'#f59e0b') + ';margin-bottom:12px;">' +
        (correct ? '✅ You got it! Your brain found the path.' : 'You guessed "' + escHtml(state.rescueGuess) + '" — now say the right word aloud 3 times.') + '</div>';
    } else {
      h += '<div style="font-size:12px;color:#8899bb;margin-bottom:12px;">Did you find it in your head? Be honest — that\'s the training.</div>';
    }
    h += '<div style="display:flex;gap:8px;max-width:340px;margin:0 auto;">';
    h += '<button style="flex:1;padding:11px;border-radius:10px;border:2px solid #10b981;background:#001a0d;color:#10b981;cursor:pointer;font-weight:700;" onclick="rescueNext(true)">✅ I Found It</button>';
    h += '<button style="flex:1;padding:11px;border-radius:10px;border:2px solid #f59e0b;background:#1a1000;color:#f59e0b;cursor:pointer;font-weight:700;" onclick="rescueNext(false)">😅 It Escaped Me</button>';
    h += '</div>';
  }
  h += '</div>';

  h += '<div class="card"><div class="card-header">Why this fixes your problem</div>';
  h += '<div style="font-size:12px;line-height:1.9;color:#a0aec0;">' +
    'Forgetting a word you knew "1 minute back" is a <b>retrieval</b> failure, not a memory failure — the word is stored, the path to it is weak. ' +
    'Every time you force your brain to FIND a word from its meaning (instead of just reading it), that path gets physically stronger. ' +
    '3 words a day here + speaking your English chats aloud = noticeably smoother speech in 3-4 weeks. Also real: sleep 7+ hours — word recall is the first thing sleep-deprivation breaks.</div></div>';

  return h;
}

function rescueReveal() {
  var el = document.getElementById('rescue-guess');
  window.AppState.rescueGuess = el ? el.value : '';
  window.AppState.rescueRevealed = true;
  saveData(); renderPage();
}

function rescueNext(found) {
  var state = window.AppState;
  var iso = aeTodayIso();
  if (!state.rescueLog) state.rescueLog = {};
  if (!state.rescueLog[iso]) state.rescueLog[iso] = { done:0, correct:0 };
  state.rescueLog[iso].done++;
  if (found) state.rescueLog[iso].correct++;

  var idx = (state.rescueIdx != null) ? state.rescueIdx : (brainDayNumber() * 7) % WORD_RESCUE.length;
  state.rescueIdx = (idx + 1) % WORD_RESCUE.length;
  state.rescueRevealed = false;
  state.rescueGuess = '';
  saveData(); renderPage();
}

/* ============================================
   🧠 FLUENCY SPRINT — 45 seconds, one category,
   name everything you can. Trains retrieval
   SPEED under pressure (like real conversation).
   ============================================ */
var _sprintTimer = null;

function renderFluencySprint(state) {
  var h = '';
  var running  = !!state.sprintRunning;
  var secsLeft = state.sprintSecs != null ? state.sprintSecs : 45;
  var cat      = state.sprintCat || FLUENCY_CATS[brainDayNumber() % FLUENCY_CATS.length];

  /* Score history */
  var scores = state.sprintLog || {};
  var todayBest = scores[aeTodayIso()] || 0;
  var allBest = 0;
  Object.keys(scores).forEach(function(k){ if (scores[k] > allBest) allBest = scores[k]; });

  h += '<div class="grid-3" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#06b6d4"><div class="stat-value">' + todayBest + '</div><div class="stat-label">Today\'s Best</div><div class="stat-sub">words in 45s</div></div>';
  h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">' + allBest + '</div><div class="stat-label">All-Time Best</div></div>';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + Object.keys(scores).length + '</div><div class="stat-label">Days Trained</div></div>';
  h += '</div>';

  h += '<div class="card" style="text-align:center;padding:22px 18px;margin-bottom:14px;border:1px solid #06b6d4;">';

  if (!running) {
    h += '<div style="font-size:10px;color:#06b6d4;font-weight:800;margin-bottom:8px;">YOUR CATEGORY</div>';
    h += '<div style="font-size:20px;font-weight:900;margin-bottom:14px;">' + escHtml(cat) + '</div>';
    h += '<div style="font-size:11px;color:#8899bb;margin-bottom:14px;">45 seconds. Type (or say aloud and type) as many as you can, separated by commas or Enter. Speed matters, spelling doesn\'t!</div>';
    h += '<div style="display:flex;gap:8px;justify-content:center;">';
    h += '<button class="btn-primary" onclick="startSprint()">▶ Start 45-Second Sprint</button>';
    h += '<button class="btn-ghost" onclick="shuffleSprintCat()">🔀 New Category</button>';
    h += '</div>';
  } else {
    h += '<div style="font-size:34px;font-weight:900;color:' + (secsLeft<=10?'#ef4444':'#06b6d4') + ';margin-bottom:6px;">' + secsLeft + 's</div>';
    h += '<div style="font-size:13px;font-weight:800;margin-bottom:10px;">' + escHtml(cat) + '</div>';
    h += '<textarea id="sprint-box" rows="4" placeholder="mango, banana, guava..." style="margin-bottom:10px;" autofocus></textarea>';
    h += '<button class="btn-red" style="padding:8px 20px;" onclick="endSprint()">⏹ Done Early</button>';
  }
  h += '</div>';

  /* Last result */
  if (state.sprintLastResult) {
    h += '<div class="card" style="margin-bottom:14px;border-left:3px solid #06b6d4;">';
    h += '<div class="card-header">Last Sprint</div>';
    h += '<div style="font-size:12px;line-height:1.8;color:#a0aec0;">' + escHtml(state.sprintLastResult) + '</div>';
    h += '</div>';
  }

  /* Last 7 days scores */
  var now = new Date();
  h += '<div class="card"><div class="card-header">Last 7 Days</div>';
  for (var i = 6; i >= 0; i--) {
    var d = new Date(now); d.setDate(now.getDate()-i);
    var iso = aeIso(d);
    var sc = scores[iso] || 0;
    h += aeBarRow(i===0?'Today':d.toLocaleDateString('en-IN',{weekday:'short'}), sc, Math.max(allBest,15), sc>=15?'#10b981':'#06b6d4', sc>0?sc+' words':'—');
  }
  h += '<div style="font-size:10px;color:#556080;margin-top:8px;">Healthy adult range: 12-18 items in 45-60s. Watch your number climb week by week — that IS your word-finding improving.</div>';
  h += '</div>';

  return h;
}

function shuffleSprintCat() {
  var cats = FLUENCY_CATS.filter(function(c){ return c !== window.AppState.sprintCat; });
  window.AppState.sprintCat = cats[Math.floor(Math.random()*cats.length)];
  saveData(); renderPage();
}

function startSprint() {
  var state = window.AppState;
  if (!state.sprintCat) state.sprintCat = FLUENCY_CATS[brainDayNumber() % FLUENCY_CATS.length];
  state.sprintRunning = true;
  state.sprintSecs = 45;
  saveData(); renderPage();
  setTimeout(function(){ var b=document.getElementById('sprint-box'); if(b) b.focus(); }, 150);

  clearInterval(_sprintTimer);
  _sprintTimer = setInterval(function() {
    var s = window.AppState;
    s.sprintSecs = (s.sprintSecs||45) - 1;
    /* Update just the countdown without re-rendering (keeps typing smooth) */
    var content = document.getElementById('content');
    if (content) {
      var timerEl = content.querySelector('.card div[style*="font-size:34px"]');
      if (timerEl) {
        timerEl.textContent = s.sprintSecs + 's';
        if (s.sprintSecs <= 10) timerEl.style.color = '#ef4444';
      }
    }
    if (s.sprintSecs <= 0) endSprint();
  }, 1000);
}

function endSprint() {
  clearInterval(_sprintTimer); _sprintTimer = null;
  var state = window.AppState;
  var box = document.getElementById('sprint-box');
  var raw = box ? box.value : '';
  var words = raw.split(/[,\n]+/).map(function(w){ return w.trim().toLowerCase(); }).filter(function(w){ return w.length > 1; });
  var unique = words.filter(function(w, i){ return words.indexOf(w) === i; });
  var count = unique.length;

  var iso = aeTodayIso();
  if (!state.sprintLog) state.sprintLog = {};
  if (count > (state.sprintLog[iso]||0)) state.sprintLog[iso] = count;

  state.sprintLastResult = state.sprintCat + ': ' + count + ' unique words — ' + unique.join(', ');
  state.sprintRunning = false;
  state.sprintSecs = 45;
  saveData(); renderPage();
  if (typeof playAlarm === 'function') playAlarm();
  showToast('🧠 ' + count + ' words! ' + (count>=15?'Excellent retrieval!':'Keep training — it climbs fast.'));
}

console.log('brain.js loaded OK');
