/* ============================================
   VASAVI'S LIFE OS — SAVI AGENT 🤖
   modules/agent.js

   Not a chatbot — an AGENT. You type or speak
   one sentence and it performs the action in
   the right module:
     "log 45 minutes pandas"
     "add 250 food expense"
     "gym done"
     "I read 30 pages of atomic habits"
     "mood 4 energy 3"
     "how much did I spend on food this month?"

   How it works (real agent architecture):
   1. A TOOL REGISTRY defines every action Savi
      can take, with typed parameters.
   2. The LLM receives the tools + your sentence
      and returns strict JSON: {tool, params}.
   3. The handler executes it against AppState.
   4. If no API key, a rule-based parser handles
      the common commands — so it always works.
   ============================================ */

/* ============================================
   THE TOOL REGISTRY
   ============================================ */
var AGENT_TOOLS = [
  {
    name: 'log_focus',
    desc: 'Log a completed focus/study session that was not timed.',
    params: { minutes: 'number of minutes', what: 'what she worked on' },
    run: function(p) {
      var mins = parseInt(p.minutes); if (!mins || mins <= 0) return { ok:false, msg:'How many minutes?' };
      var now = Date.now(), start = now - mins*60000;
      if (!window.AppState.sessions) window.AppState.sessions = [];
      window.AppState.sessions.push({
        start: start, end: now, duration: mins, what: p.what || 'Focus session',
        startStr: new Date(start).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),
        endStr:   new Date(now).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})
      });
      return { ok:true, msg:'⏱ Logged ' + mins + ' mins of "' + (p.what||'focus') + '".', go:'timer' };
    }
  },
  {
    name: 'log_expense',
    desc: 'Record money spent.',
    params: { amount: 'rupees', category: 'Food/Gym/Transport/Shopping/Subscriptions/Health/Study/Entertainment or a custom name', note: 'what it was for' },
    run: function(p) {
      var amt = parseFloat(p.amount); if (!amt || amt <= 0) return { ok:false, msg:'How much did you spend?' };
      var cat = (p.category || 'Other').trim();
      cat = cat.charAt(0).toUpperCase() + cat.slice(1);
      if (!window.AppState.expenses) window.AppState.expenses = [];
      window.AppState.expenses.push({ amount: amt, cat: cat, date: new Date().toDateString(), note: p.note || '' });
      return { ok:true, msg:'💸 Logged ₹' + amt + ' on ' + cat + '.', go:'finance' };
    }
  },
  {
    name: 'log_income',
    desc: 'Record money received.',
    params: { amount: 'rupees', source: 'Salary/Stipend/Freelance/Tutoring/Side Hustle/Gift/Other' },
    run: function(p) {
      var amt = parseFloat(p.amount); if (!amt || amt <= 0) return { ok:false, msg:'How much did you receive?' };
      if (!window.AppState.income) window.AppState.income = [];
      window.AppState.income.push({ amount: amt, source: p.source || 'Other', date: new Date().toDateString(), note: p.note || '' });
      return { ok:true, msg:'💵 Logged ₹' + amt + ' income from ' + (p.source||'Other') + '.', go:'finance' };
    }
  },
  {
    name: 'add_goal',
    desc: 'Add a goal for today.',
    params: { text: 'the goal', priority: 'High/Medium/Low' },
    run: function(p) {
      if (!p.text) return { ok:false, msg:'What is the goal?' };
      if (!window.AppState.goals) window.AppState.goals = {};
      if (!Array.isArray(window.AppState.goals.daily)) window.AppState.goals.daily = [];
      window.AppState.goals.daily.push({ text: p.text, priority: p.priority || 'Medium', deadline: aeTodayIso(), done:false, createdAt:new Date().toISOString() });
      return { ok:true, msg:'🎯 Goal added: "' + p.text + '".', go:'goals' };
    }
  },
  {
    name: 'complete_goal',
    desc: 'Mark an existing goal as done by matching its text.',
    params: { text: 'part of the goal text' },
    run: function(p) {
      var daily = (window.AppState.goals && window.AppState.goals.daily) || [];
      var q = (p.text||'').toLowerCase();
      var g = daily.find(function(x){ return !x.done && (x.text||'').toLowerCase().indexOf(q) !== -1; });
      if (!g) return { ok:false, msg:'Could not find a pending goal matching "' + (p.text||'') + '".' };
      g.done = true; g.doneAt = aeTodayIso();
      return { ok:true, msg:'✅ Marked done: "' + g.text + '".', go:'goals' };
    }
  },
  {
    name: 'log_gym',
    desc: 'Mark that she went to the gym (today, or a past date).',
    params: { date: 'YYYY-MM-DD, optional — defaults to today' },
    run: function(p) {
      var iso = /^\d{4}-\d{2}-\d{2}$/.test(p.date||'') ? p.date : aeTodayIso();
      if (!window.AppState.gymLog) window.AppState.gymLog = {};
      window.AppState.gymLog[iso] = true;
      return { ok:true, msg:'💪 Gym logged for ' + iso + '.', go:'gym' };
    }
  },
  {
    name: 'log_habit',
    desc: 'Tick a habit as done today by name.',
    params: { name: 'habit name' },
    run: function(p) {
      var habits = window.AppState.habits || [];
      var q = (p.name||'').toLowerCase();
      var hb = habits.find(function(x){ return (x.name||'').toLowerCase().indexOf(q) !== -1; });
      if (!hb) return { ok:false, msg:'No habit found matching "' + (p.name||'') + '".' };
      if (!hb.history) hb.history = {};
      hb.history[aeTodayIso()] = 1;
      return { ok:true, msg:'✅ "' + hb.name + '" ticked for today.', go:'habits' };
    }
  },
  {
    name: 'log_meal',
    desc: 'Log food eaten with calories.',
    params: { description: 'what she ate', kcal: 'calories (number)' },
    run: function(p) {
      var k = parseInt(p.kcal);
      if (!p.description) return { ok:false, msg:'What did you eat?' };
      if (!k) return { ok:false, msg:'Roughly how many calories? (Or use the Dietician tab to estimate from a photo.)' };
      if (typeof dietDay !== 'function') return { ok:false, msg:'Dietician module not loaded.' };
      var day = dietDay(window.AppState, aeTodayIso());
      day.meals.push({ desc: p.description, kcal: k, time: new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}), source:'agent' });
      return { ok:true, msg:'🍛 Logged "' + p.description + '" — ' + k + ' kcal.', go:'diet' };
    }
  },
  {
    name: 'log_steps',
    desc: 'Record step count for today.',
    params: { steps: 'number of steps' },
    run: function(p) {
      var s = parseInt(p.steps); if (!s) return { ok:false, msg:'How many steps?' };
      if (typeof dietDay !== 'function') return { ok:false, msg:'Dietician module not loaded.' };
      dietDay(window.AppState, aeTodayIso()).steps = s;
      return { ok:true, msg:'👟 ' + s + ' steps saved for today.', go:'diet' };
    }
  },
  {
    name: 'log_mood',
    desc: 'Record mood and/or energy for today, each 1 to 5.',
    params: { mood: '1-5', energy: '1-5' },
    run: function(p) {
      var iso = aeTodayIso();
      if (!window.AppState.moodLog) window.AppState.moodLog = {};
      if (!window.AppState.moodLog[iso]) window.AppState.moodLog[iso] = {};
      var m = parseInt(p.mood), e = parseInt(p.energy);
      if (m >= 1 && m <= 5) window.AppState.moodLog[iso].mood = m;
      if (e >= 1 && e <= 5) window.AppState.moodLog[iso].energy = e;
      if (!m && !e) return { ok:false, msg:'Give mood and/or energy from 1 to 5.' };
      return { ok:true, msg:'💗 Saved' + (m?' mood '+m+'/5':'') + (e?' energy '+e+'/5':'') + '.', go:'habits' };
    }
  },
  {
    name: 'log_reading',
    desc: 'Log pages read in a book.',
    params: { book: 'book name (partial ok)', pages: 'pages read now (number)' },
    run: function(p) {
      var pages = parseInt(p.pages); if (!pages) return { ok:false, msg:'How many pages?' };
      var books = window.AppState.books || [];
      var q = (p.book||'').toLowerCase();
      var b = q ? books.find(function(x){ return (x.name||'').toLowerCase().indexOf(q) !== -1; }) : books[0];
      if (!b) return { ok:false, msg:'No book found matching "' + (p.book||'') + '". Add it in Books first.' };
      b.done = (b.done||0) + pages;
      if (b.total > 0 && b.done > b.total) b.done = b.total;
      if (!window.AppState.bookLog) window.AppState.bookLog = {};
      var iso = aeTodayIso();
      window.AppState.bookLog[iso] = (window.AppState.bookLog[iso]||0) + pages;
      if (b.total > 0 && b.done >= b.total && !b.finishedOn) b.finishedOn = iso;
      return { ok:true, msg:'📖 +' + pages + ' pages of "' + b.name + '" (' + b.done + (b.total?'/'+b.total:'') + ').', go:'books' };
    }
  },
  {
    name: 'add_vocab',
    desc: 'Save a new vocabulary word.',
    params: { word: 'the word', meaning: 'its meaning', example: 'example sentence', lang: 'en or ko' },
    run: function(p) {
      if (!p.word) return { ok:false, msg:'Which word?' };
      var lang = (p.lang === 'ko') ? 'ko' : 'en';
      if (!window.AppState.langVocab) window.AppState.langVocab = {};
      if (!window.AppState.langVocab[lang]) window.AppState.langVocab[lang] = [];
      window.AppState.langVocab[lang].push({ word:p.word, meaning:p.meaning||'', example:p.example||'', cat:'general', date: todayString() });
      return { ok:true, msg:'🗣️ Saved "' + p.word + '" to your vocabulary.', go:'language' };
    }
  },
  {
    name: 'add_memory',
    desc: 'Write a life memory.',
    params: { tag: 'win/hard/beautiful/lesson', title: 'short title', text: 'the memory' },
    run: function(p) {
      if (!p.text) return { ok:false, msg:'What is the memory?' };
      var tag = ['win','hard','beautiful','lesson'].indexOf(p.tag) !== -1 ? p.tag : 'win';
      if (!Array.isArray(window.AppState.memories)) window.AppState.memories = [];
      window.AppState.memories.push({ id:Date.now(), tag:tag, title:p.title||'', text:p.text, date:aeTodayIso() });
      return { ok:true, msg:'📕 Memory saved to your life book.', go:'memories' };
    }
  },
  {
    name: 'start_timer',
    desc: 'Start the focus timer now.',
    params: { what: 'what she is working on' },
    run: function(p) {
      window.AppState.timerWhat  = p.what || 'Focus session';
      window.AppState.activeSess = Date.now();
      window.AppState.timerSecs  = 0;
      window.AppState.timerView  = 'timer';
      if (typeof timerInterval !== 'undefined') { try { clearInterval(timerInterval); } catch(e){} }
      if (typeof tickTimer === 'function') { try { timerInterval = setInterval(tickTimer, 1000); } catch(e){} }
      return { ok:true, msg:'▶ Timer started for "' + (p.what||'focus') + '". Go!', go:'timer' };
    }
  },
  {
    name: 'answer_question',
    desc: 'Answer a question about her own data (spending, focus, gym, goals, streaks) without changing anything.',
    params: { question: 'her question' },
    run: function(p) { return { ok:true, msg:'', ask:true, question: p.question }; }
  }
];

function agentToolByName(n) { return AGENT_TOOLS.find(function(t){ return t.name === n; }); }

/* ============================================
   RENDER
   ============================================ */
function renderAgent() {
  var state = window.AppState;
  var log = state.agentLog || [];
  var h = '';

  h += '<div class="card" style="margin-bottom:14px;border:1px solid #a855f7;">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">';
  h += '<div style="width:40px;height:40px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:20px;">🤖</div>';
  h += '<div><div style="font-size:14px;font-weight:900;">Savi Agent</div>';
  h += '<div style="font-size:11px;color:#10b981;">● Tell me what you did — I\'ll put it in the right place</div></div>';
  h += '</div>';

  h += '<div style="display:flex;gap:8px;margin-bottom:10px;">';
  h += '<input id="agent-input" placeholder="e.g. log 45 minutes pandas" style="flex:1;" onkeydown="if(event.key===\'Enter\')runAgentFromInput()" />';
  h += '<button class="btn-primary" onclick="runAgentFromInput()">Go</button>';
  h += '</div>';
  h += '<button class="btn-ghost" style="width:100%;margin-bottom:10px;" onclick="agentVoice()">🎤 Speak a Command</button>';
  h += '<div id="agent-status" style="display:none;text-align:center;padding:8px;font-size:11px;color:#a855f7;">🤖 Working on it...</div>';

  h += '<div style="font-size:10px;color:#556080;margin-bottom:6px;">Try tapping one:</div>';
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
  ['log 45 minutes pandas','add 250 food expense','gym done','I read 20 pages','mood 4 energy 3','6000 steps',
   'add goal finish DS notes','how much did I spend on food this month?'].forEach(function(ex) {
    h += '<div onclick="runAgentCommand(\'' + ex.replace(/'/g,"\\'") + '\')" style="padding:5px 10px;border-radius:99px;background:#1a1a35;border:1px solid var(--border);font-size:10px;cursor:pointer;color:#a0aec0;">' + ex + '</div>';
  });
  h += '</div>';
  h += '</div>';

  /* Result of the last command */
  if (state.agentLast) {
    var L = state.agentLast;
    h += '<div class="card" style="margin-bottom:14px;border-left:3px solid ' + (L.ok?'#10b981':'#f59e0b') + ';">';
    h += '<div style="font-size:11px;color:#556080;margin-bottom:4px;">You said: "' + escHtml(L.command) + '"</div>';
    h += '<div style="font-size:13px;font-weight:700;color:' + (L.ok?'#10b981':'#f59e0b') + ';line-height:1.7;white-space:pre-wrap;">' + escHtml(L.msg) + '</div>';
    if (L.ok && L.go) {
      h += '<button class="btn-ghost" style="margin-top:8px;font-size:11px;" onclick="goToPage(\'' + L.go + '\')">Open ' + escHtml(PAGE_TITLES[L.go]||L.go) + ' →</button>';
    }
    if (L.ok && L.undoable) {
      h += '<button class="btn-ghost" style="margin-top:8px;margin-left:6px;font-size:11px;color:#ef4444;" onclick="agentUndo()">↩ Undo</button>';
    }
    h += '</div>';
  }

  /* What it can do */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">🛠️ What Savi Can Do</div>';
  h += '<div style="font-size:11px;color:#a0aec0;line-height:1.9;">' +
    '⏱ log focus time · ▶ start the timer<br>' +
    '💸 log expenses · 💵 log income<br>' +
    '🎯 add or complete goals<br>' +
    '💪 log gym · ✅ tick habits<br>' +
    '🍛 log meals · 👟 log steps · 💗 log mood &amp; energy<br>' +
    '📖 log pages read · 🗣️ save vocabulary<br>' +
    '📕 write a life memory<br>' +
    '❓ answer questions about your own data</div>';
  h += '</div>';

  /* History */
  if (log.length) {
    h += '<div class="card"><div class="card-header">Recent Actions (' + log.length + ')</div>';
    log.slice(-12).reverse().forEach(function(e) {
      h += '<div style="display:flex;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid #1a1a35;font-size:11px;">';
      h += '<span style="color:#a0aec0;flex:1;">' + escHtml(e.msg) + '</span>';
      h += '<span style="color:#556080;flex-shrink:0;">' + (e.time||'') + '</span></div>';
    });
    h += '</div>';
  }

  return h;
}

function runAgentFromInput() {
  var el = document.getElementById('agent-input');
  if (!el || !el.value.trim()) return;
  var cmd = el.value.trim();
  el.value = '';
  runAgentCommand(cmd);
}

function agentVoice() {
  if (typeof startListening === 'function') {
    startListening(function(text){ if (text) runAgentCommand(text); }, 'en-IN');
    showToast('🎤 Listening — say your command');
  } else if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    var rec = new SR(); rec.lang = 'en-IN'; rec.interimResults = false;
    rec.onresult = function(e){ runAgentCommand(e.results[0][0].transcript); };
    rec.onerror = function(){ showToast('Could not hear you — try typing.', 'error'); };
    rec.start();
    showToast('🎤 Listening — say your command');
  } else {
    showToast('Voice not supported here — type instead.', 'error');
  }
}

/* ============================================
   THE AGENT LOOP
   ============================================ */
function runAgentCommand(command) {
  var status = document.getElementById('agent-status');
  if (status) status.style.display = 'block';

  var finishWith = function(toolName, params) {
    var tool = agentToolByName(toolName);
    if (!tool) { agentFinish(command, { ok:false, msg:'I did not understand that. Try "log 30 minutes reading" or "add 200 food expense".' }); return; }

    /* Question → answer from her data, no mutation */
    if (tool.name === 'answer_question') {
      agentAnswer(command, (params && params.question) || command);
      return;
    }
    var before = JSON.stringify(window.AppState);
    var res = tool.run(params || {});
    if (res.ok) {
      window._agentUndoSnapshot = before;
      res.undoable = true;
      saveData();
    }
    agentFinish(command, res);
  };

  /* Prefer the LLM (handles natural language); fall back to rules */
  if (typeof groqChat === 'function' && typeof getApiKey === 'function' && getApiKey()) {
    var toolSpec = AGENT_TOOLS.map(function(t) {
      return '- ' + t.name + ': ' + t.desc + ' | params: ' + JSON.stringify(t.params);
    }).join('\n');
    var sys = 'You are Savi, an action agent inside Vasavi\'s Life OS. Convert her sentence into ONE tool call.\n\n' +
      'AVAILABLE TOOLS:\n' + toolSpec + '\n\n' +
      'Reply with ONLY a JSON object, no markdown, no explanation:\n' +
      '{"tool":"<tool_name>","params":{...}}\n\n' +
      'Rules: infer sensible values. Money is in rupees. If she is ASKING about her data rather than recording something, use answer_question. ' +
      'Today is ' + aeTodayIso() + '.';
    groqChat(sys, [{ role:'user', text: command }], function(reply) {
      var parsed = null;
      try {
        var clean = String(reply||'').replace(/```json/gi,'').replace(/```/g,'').trim();
        var m = clean.match(/\{[\s\S]*\}/);
        if (m) parsed = JSON.parse(m[0]);
      } catch(e) {}
      if (parsed && parsed.tool) finishWith(parsed.tool, parsed.params);
      else { var f = agentRuleParse(command); finishWith(f.tool, f.params); }
    });
  } else {
    var f = agentRuleParse(command);
    finishWith(f.tool, f.params);
  }
}

/* Rule-based parser — works with no API key at all */
function agentRuleParse(cmd) {
  var t = cmd.toLowerCase().trim();
  var num = function(re){ var m = t.match(re); return m ? parseFloat(m[1]) : null; };

  /* Questions */
  if (/^(how|what|when|why|which|show|tell me|am i|do i)\b/.test(t) || t.indexOf('?') !== -1) {
    return { tool:'answer_question', params:{ question: cmd } };
  }
  /* Steps */
  var steps = num(/(\d[\d,]*)\s*steps/);
  if (steps) return { tool:'log_steps', params:{ steps: String(steps).replace(/,/g,'') } };
  /* Mood / energy */
  if (/\bmood\b|\benergy\b/.test(t)) {
    return { tool:'log_mood', params:{ mood: num(/mood\s*(\d)/), energy: num(/energy\s*(\d)/) } };
  }
  /* Gym */
  if (/\bgym\b/.test(t)) return { tool:'log_gym', params:{} };
  /* Reading */
  if (/\bpages?\b|\bread\b/.test(t)) {
    var pg = num(/(\d+)\s*pages?/) || num(/read\s*(\d+)/);
    var bm = t.match(/(?:of|from)\s+(.+)$/);
    return { tool:'log_reading', params:{ pages: pg, book: bm ? bm[1] : '' } };
  }
  /* Focus */
  if (/\b(min|mins|minute|minutes|hour|hours|hr|hrs)\b/.test(t) || /\bfocus\b|\bstudied\b|\bworked\b/.test(t)) {
    var mins = num(/(\d+)\s*(?:min|mins|minute|minutes)/);
    var hrs  = num(/(\d+)\s*(?:hour|hours|hr|hrs)/);
    if (hrs) mins = (mins||0) + hrs*60;
    var wm = t.match(/(?:on|of|for)\s+(.+)$/);
    var what = wm ? wm[1] : cmd.replace(/\b\d+\s*(min|mins|minute|minutes|hour|hours|hr|hrs)\b/gi,'').replace(/\b(log|logged|did|focus|study|studied|worked)\b/gi,'').trim();
    if (mins) return { tool:'log_focus', params:{ minutes: mins, what: what || 'Focus session' } };
    if (/\bstart\b/.test(t)) return { tool:'start_timer', params:{ what: what } };
  }
  /* Income */
  if (/\b(earned|received|got paid|income|salary|stipend)\b/.test(t)) {
    var ia = num(/(?:rs\.?|₹)?\s*(\d[\d,]*)/);
    return { tool:'log_income', params:{ amount: ia, source: /stipend/.test(t)?'Stipend':/salary/.test(t)?'Salary':/freelance/.test(t)?'Freelance':'Other' } };
  }
  /* Expense */
  if (/\b(spent|expense|paid|bought|cost)\b/.test(t) || /(?:rs\.?|₹)\s*\d/.test(t)) {
    var amt = num(/(?:rs\.?|₹)?\s*(\d[\d,]*)/);
    var cats = ['food','gym','transport','shopping','subscriptions','health','study','entertainment'];
    var cat = cats.find(function(c){ return t.indexOf(c) !== -1; }) || 'Other';
    return { tool:'log_expense', params:{ amount: amt, category: cat, note: cmd } };
  }
  /* Goals */
  if (/\b(complete|completed|done|finished)\b.*\bgoal\b/.test(t)) {
    return { tool:'complete_goal', params:{ text: cmd.replace(/.*goal\s*/i,'').trim() } };
  }
  if (/\bgoal\b|\btodo\b/.test(t)) {
    return { tool:'add_goal', params:{ text: cmd.replace(/\b(add|new|set)\b\s*(a\s*)?goal\s*(to\s*)?/i,'').trim() } };
  }
  /* Habit */
  if (/\bhabit\b/.test(t)) return { tool:'log_habit', params:{ name: cmd.replace(/.*habit\s*/i,'').trim() } };
  /* Meal */
  if (/\b(ate|eat|meal|breakfast|lunch|dinner|kcal|calorie)\b/.test(t)) {
    return { tool:'log_meal', params:{ description: cmd, kcal: num(/(\d+)\s*(?:kcal|calorie)/) } };
  }
  /* Memory */
  if (/\bmemory\b|\bremember\b/.test(t)) {
    return { tool:'add_memory', params:{ tag:'win', title:'', text: cmd.replace(/.*(memory|remember)\s*/i,'').trim() } };
  }
  return { tool:'answer_question', params:{ question: cmd } };
}

/* Answer a data question using the existing context builders */
function agentAnswer(command, question) {
  var ctx = '';
  try { if (typeof buildAIContext === 'function') ctx = buildAIContext(); } catch(e) {}
  if (typeof groqChat === 'function' && typeof getApiKey === 'function' && getApiKey()) {
    groqChat(ctx + '\n\nAnswer her question directly using the data above. Use ₹ for money. Under 100 words.',
      [{ role:'user', text: question }],
      function(reply) { agentFinish(command, { ok:true, msg: reply }); });
  } else {
    agentFinish(command, { ok:true, msg:'Add your free Groq key in AI Assistant and I can answer questions about your data. For now I can still record things — try "log 30 minutes reading".' });
  }
}

function agentFinish(command, res) {
  var status = document.getElementById('agent-status');
  if (status) status.style.display = 'none';

  var entry = {
    command: command, ok: !!res.ok, msg: res.msg || '',
    go: res.go || '', undoable: !!res.undoable,
    time: new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})
  };
  window.AppState.agentLast = entry;
  if (res.ok && res.go) {
    if (!Array.isArray(window.AppState.agentLog)) window.AppState.agentLog = [];
    window.AppState.agentLog.push({ msg: res.msg, time: entry.time });
    if (window.AppState.agentLog.length > 200) window.AppState.agentLog = window.AppState.agentLog.slice(-200);
  }
  saveData(); renderPage();
  if (res.msg) showToast(res.ok ? res.msg : ('⚠️ ' + res.msg), res.ok ? '' : 'error');
}

function agentUndo() {
  if (!window._agentUndoSnapshot) { showToast('Nothing to undo.', 'error'); return; }
  if (!confirm('Undo the last action?')) return;
  try {
    window.AppState = JSON.parse(window._agentUndoSnapshot);
    window._agentUndoSnapshot = null;
    window.AppState.agentLast = null;
    saveData(); renderPage();
    showToast('↩ Undone.');
  } catch(e) { showToast('Could not undo.', 'error'); }
}

console.log('agent.js loaded OK — ' + AGENT_TOOLS.length + ' tools registered');
