/* ============================================
   VASAVI'S LIFE OS - JOURNAL + DAILY TALK
   modules/journal.js
   ============================================ */

function renderJournal() {
  var state = window.AppState;
  var tab   = state.journalTab || 'talk';
  var h     = '';

  /* Stats */
  var entries  = state.journalEntries || [];
  var ideas    = state.journalIdeas   || [];
  var todayEntry = entries.find(function(e){ return e.date === todayString(); });

  h += '<div class="grid-3" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + entries.length + '</div><div class="stat-label">Total Entries</div><div class="stat-sub">Your story so far</div></div>';
  h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">' + (todayEntry ? '✓' : '—') + '</div><div class="stat-label">Today Written</div><div class="stat-sub">' + (todayEntry ? 'Great job!' : 'Not yet today') + '</div></div>';
  h += '<div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-value">' + ideas.length + '</div><div class="stat-label">Ideas Vault</div><div class="stat-sub">Original thinking</div></div>';
  h += '</div>';

  /* Tabs */
  h += '<div class="subtab-bar">';
  [['talk','💬 Daily Talk'],['reflect','📔 Reflection'],['ideas','💡 Ideas Vault'],['history','📅 History']].forEach(function(t) {
    h += '<div class="subtab ' + (tab === t[0] ? 'active' : '') + '" onclick="switchJournalTab(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  h += '</div>';

  if (tab === 'talk')    h += renderJournalTalk(state);
  if (tab === 'reflect') h += renderJournalReflect(state);
  if (tab === 'ideas')   h += renderJournalIdeas(state);
  if (tab === 'history') h += renderJournalHistory(state);

  return h;
}

/* ---- DAILY TALK ---- */
function renderJournalTalk(state) {
  var h = '';
  var msgs = state.talkMessages || [];

  /* Vasavi's daily opener based on life score */
  var ls = typeof calcLifeScore === 'function' ? calcLifeScore() : 50;
  var opener = ls >= 70
    ? '🔥 Vasavi, your score is ' + ls + ' today. You showed up. That\'s the whole game. What are we working on?'
    : ls >= 40
    ? '👋 Hey Vasavi! Score is ' + ls + ' — solid progress. What\'s on your mind today?'
    : '💜 Vasavi, I see you\'re here. That already counts. What\'s going on? Tell me anything.';

  /* Chat window */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">💬 Talk to Your OS</div>';
  h += '<div id="talk-messages" style="min-height:200px;max-height:360px;overflow-y:auto;padding:8px 0;">';

  /* System opener */
  h += '<div style="display:flex;gap:10px;margin-bottom:12px;align-items:flex-start;">';
  h += '<div style="width:28px;height:28px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;">OS</div>';
  h += '<div style="background:#1a1a35;border-radius:0 10px 10px 10px;padding:10px 12px;font-size:12px;line-height:1.6;max-width:85%;">' + escHtml(opener) + '</div>';
  h += '</div>';

  msgs.forEach(function(m) {
    if (m.role === 'user') {
      h += '<div style="display:flex;justify-content:flex-end;margin-bottom:10px;">';
      h += '<div style="background:var(--accent);border-radius:10px 0 10px 10px;padding:10px 12px;font-size:12px;line-height:1.6;max-width:80%;color:#fff;">' + escHtml(m.text) + '</div>';
      h += '</div>';
    } else {
      h += '<div style="display:flex;gap:10px;margin-bottom:10px;align-items:flex-start;">';
      h += '<div style="width:28px;height:28px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;">OS</div>';
      h += '<div style="background:#1a1a35;border-radius:0 10px 10px 10px;padding:10px 12px;font-size:12px;line-height:1.6;max-width:85%;">' + escHtml(m.text) + '</div>';
      h += '</div>';
    }
  });

  h += '</div>';

  /* Quick prompts */
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin:10px 0;">';
  ['How am I doing?','I feel stuck today','I finished something!','I need motivation','What should I focus on?'].forEach(function(p) {
    h += '<div onclick="sendTalkMessage(\'' + p.replace(/'/g, '') + '\')" style="padding:5px 10px;border-radius:99px;background:#1a1a35;border:1px solid var(--border);font-size:10px;cursor:pointer;color:#a0aec0;">' + p + '</div>';
  });
  h += '</div>';

  /* Input */
  h += '<div style="display:flex;gap:8px;margin-top:8px;">';
  h += '<input id="talk-input" placeholder="Type anything to your OS..." style="flex:1;" onkeydown="if(event.key===\'Enter\')sendTalkFromInput()" />';
  h += '<button class="btn-primary" onclick="sendTalkFromInput()">Send</button>';
  h += '</div></div>';

  return h;
}

/* ---- DAILY REFLECTION ---- */
function renderJournalReflect(state) {
  var h = '';
  var today    = todayString();
  var entries  = state.journalEntries || [];
  var todayE   = entries.find(function(e){ return e.date === today; }) || { date: today, mood: '', wins: '', hard: '', tmr: '', gratitude: '' };
  var moodEmojis = ['😴','😔','😐','🙂','😊','🔥'];

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📔 Today\'s Reflection — ' + new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'short' }) + '</div>';

  /* Mood */
  h += '<div style="margin-bottom:16px;">';
  h += '<div style="font-size:11px;font-weight:700;color:#8899bb;margin-bottom:8px;">HOW ARE YOU FEELING?</div>';
  h += '<div style="display:flex;gap:10px;">';
  moodEmojis.forEach(function(em, i) {
    var selected = todayE.mood === em;
    h += '<div onclick="setJournalMood(\'' + em + '\')" style="width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer;border:2px solid ' + (selected ? 'var(--accent)' : 'var(--border)') + ';background:' + (selected ? '#1a0533' : 'var(--card2)') + ';">' + em + '</div>';
  });
  h += '</div></div>';

  /* 3 reflection questions */
  [
    { key: 'wins',      label: '🏆 What did I accomplish today?',     ph: 'Even small wins count...' },
    { key: 'hard',      label: '💪 What was difficult?',              ph: 'What challenged you today...' },
    { key: 'tmr',       label: '🎯 ONE thing I will do tomorrow',     ph: 'Just one. Be specific...' },
    { key: 'gratitude', label: '🙏 I am grateful for...',             ph: 'Something good happened...' }
  ].forEach(function(q) {
    h += '<div style="margin-bottom:14px;">';
    h += '<div style="font-size:11px;font-weight:700;color:#8899bb;margin-bottom:6px;">' + q.label + '</div>';
    h += '<textarea rows="2" placeholder="' + q.ph + '" oninput="saveJournalField(\'' + q.key + '\',this.value)" style="margin:0;">' + escHtml(todayE[q.key] || '') + '</textarea>';
    h += '</div>';
  });

  h += '<button class="btn-primary" onclick="saveJournalEntry()" style="width:100%;">💾 Save Today\'s Reflection</button>';
  h += '</div>';

  /* Weekly review trigger */
  var dayOfWeek = new Date().getDay();
  if (dayOfWeek === 0) {
    h += '<div style="background:#1a1500;border:1px solid #d97706;border-radius:10px;padding:12px;margin-bottom:14px;">';
    h += '<div style="font-size:10px;color:#f59e0b;font-weight:800;margin-bottom:6px;">☀️ SUNDAY WEEKLY REVIEW</div>';
    h += '<div style="font-size:12px;margin-bottom:10px;">Rest day reminder: You\'ve earned today. The system is quiet. Come back strong tomorrow. 🙏</div>';
    h += '</div>';
  }

  return h;
}

/* ---- IDEAS VAULT ---- */
function renderJournalIdeas(state) {
  var h = '';
  var ideas = state.journalIdeas || [];

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">💡 Add New Idea</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;">Vasavi\'s thinking is rare. Capture every original idea here.</div>';
  h += '<input id="idea-title" placeholder="Idea title..." style="margin-bottom:8px;" />';
  h += '<textarea id="idea-body" rows="3" placeholder="Describe the idea..." style="margin-bottom:8px;"></textarea>';
  h += '<div style="display:flex;gap:8px;">';
  h += '<select id="idea-cat" style="flex:1;"><option>DS/AI Project</option><option>Business Idea</option><option>Life Improvement</option><option>Content Idea</option><option>Creative</option><option>Other</option></select>';
  h += '<button class="btn-primary" onclick="addJournalIdea()">Add Idea</button>';
  h += '</div></div>';

  if (ideas.length === 0) {
    h += '<div class="empty-state"><div class="emo">💡</div><p>Your ideas vault is empty. Start capturing your original thinking!</p></div>';
    return h;
  }

  var cats = ['All'].concat([...new Set(ideas.map(function(i){ return i.cat; }))]);
  var selCat = state.ideaCatFilter || 'All';

  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">';
  cats.forEach(function(c) {
    h += '<div onclick="setIdeaFilter(\'' + c + '\')" style="padding:4px 10px;border-radius:99px;cursor:pointer;font-size:11px;font-weight:700;background:' + (selCat === c ? 'var(--accent)' : 'var(--card2)') + ';color:' + (selCat === c ? '#fff' : '#8899bb') + ';border:1px solid var(--border);">' + c + '</div>';
  });
  h += '</div>';

  var filtered = selCat === 'All' ? ideas : ideas.filter(function(i){ return i.cat === selCat; });
  filtered.slice().reverse().forEach(function(idea, idx) {
    var realIdx = ideas.indexOf(idea);
    h += '<div class="card" style="margin-bottom:10px;">';
    h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">';
    h += '<div>';
    h += '<div style="font-size:13px;font-weight:700;">' + escHtml(idea.title) + '</div>';
    h += '<span style="font-size:10px;background:#1a0533;color:#a855f7;border-radius:4px;padding:2px 7px;font-weight:700;">' + escHtml(idea.cat) + '</span>';
    h += '</div>';
    h += '<span style="font-size:10px;color:#556080;">' + (idea.date || '') + '</span>';
    h += '</div>';
    h += '<div style="font-size:12px;line-height:1.6;color:#a0aec0;">' + escHtml(idea.body) + '</div>';
    h += '<div style="margin-top:8px;display:flex;gap:8px;">';
    h += '<button class="btn-ghost btn-small" onclick="deleteJournalIdea(' + realIdx + ')">Delete</button>';
    h += '</div></div>';
  });

  return h;
}

/* ---- HISTORY ---- */
function renderJournalHistory(state) {
  var h = '';
  var entries = (state.journalEntries || []).slice().reverse();

  if (entries.length === 0) {
    return '<div class="empty-state"><div class="emo">📅</div><p>No journal entries yet. Start reflecting daily!</p></div>';
  }

  entries.forEach(function(e) {
    h += '<div class="card" style="margin-bottom:10px;">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
    h += '<div style="font-size:13px;font-weight:700;">' + e.date + '</div>';
    h += '<span style="font-size:20px;">' + (e.mood || '😐') + '</span>';
    h += '</div>';
    if (e.wins)      h += '<div style="font-size:11px;color:#10b981;margin-bottom:4px;">🏆 ' + escHtml(e.wins) + '</div>';
    if (e.hard)      h += '<div style="font-size:11px;color:#f59e0b;margin-bottom:4px;">💪 ' + escHtml(e.hard) + '</div>';
    if (e.tmr)       h += '<div style="font-size:11px;color:#a855f7;margin-bottom:4px;">🎯 ' + escHtml(e.tmr) + '</div>';
    if (e.gratitude) h += '<div style="font-size:11px;color:#8899bb;">🙏 ' + escHtml(e.gratitude) + '</div>';
    h += '</div>';
  });

  return h;
}

/* ============================================
   ACTIONS
   ============================================ */
function switchJournalTab(tab) { window.AppState.journalTab = tab; saveData(); renderPage(); }

function sendTalkMessage(text) {
  if (!window.AppState.talkMessages) window.AppState.talkMessages = [];
  window.AppState.talkMessages.push({ role: 'user', text: text });
  var reply = getTalkReply(text);
  window.AppState.talkMessages.push({ role: 'os', text: reply });
  saveData(); renderPage();
  setTimeout(function(){ var el=document.getElementById('talk-messages'); if(el) el.scrollTop=el.scrollHeight; }, 100);
}

function sendTalkFromInput() {
  var el = document.getElementById('talk-input');
  if (!el || !el.value.trim()) return;
  sendTalkMessage(el.value.trim());
  el.value = '';
}

function getTalkReply(text) {
  var t = text.toLowerCase();
  var state = window.AppState;
  var ls = typeof calcLifeScore === 'function' ? calcLifeScore() : 50;
  var dsDone = Object.values(state.dsProgress || {}).filter(function(v){ return v === 'done'; }).length;

  if (t.includes('stuck') || t.includes('cannot') || t.includes("can't")) {
    return 'Vasavi, stuck is a feeling, not a fact. Open your DS Roadmap. Pick ONE exercise. Set timer for 25 mins. Start there. One step is all you need right now.';
  }
  if (t.includes('finish') || t.includes('done') || t.includes('complete')) {
    return 'That\'s real progress, Vasavi. You finished something — that separates you from most people who only plan. Log it. What is the next one thing?';
  }
  if (t.includes('motivat') || t.includes('tired') || t.includes('demotiv')) {
    return 'Motivation comes after action, not before. You built a full OS while most people scroll. That gap is your advantage. ' + dsDone + ' DS days done. Keep that number moving.';
  }
  if (t.includes('how am i') || t.includes('score') || t.includes('doing')) {
    return 'Life Score right now: ' + ls + '/100. ' + (ls >= 70 ? 'You are genuinely winning today, Vasavi. 🔥' : ls >= 40 ? 'Solid day. A few more habits ticked and you hit 70+.' : 'Low score days happen. What is the ONE thing you can do in the next 30 mins?');
  }
  if (t.includes('job') || t.includes('interview') || t.includes('apply')) {
    return 'DS job strategy: Week 1-2 = finish DS Roadmap + project. Week 3 = polish GitHub + LinkedIn. Week 4 = apply 10 per day. You have ' + (8 - dsDone) + ' roadmap days left. Focus there first.';
  }
  if (t.includes('focus') || t.includes('work')) {
    return 'Best focus time per your schedule: 10:30 AM and 2:00 PM blocks. Open Focus Timer → set topic → 25 min Pomodoro. Close everything else. That is the system.';
  }
  if (t.includes('sad') || t.includes('bad day') || t.includes('low')) {
    return 'I hear you. Bad days are data, not identity. You showed up here — that counts. Just one small thing today. That is enough.';
  }
  return 'Vasavi, I am tracking everything. Life Score: ' + ls + '. DS days done: ' + dsDone + '/8. Keep going. What do you need right now?';
}

function setJournalMood(mood) {
  var today = todayString();
  if (!window.AppState.journalEntries) window.AppState.journalEntries = [];
  var e = window.AppState.journalEntries.find(function(e){ return e.date === today; });
  if (!e) { e = { date: today, mood: '', wins: '', hard: '', tmr: '', gratitude: '' }; window.AppState.journalEntries.push(e); }
  e.mood = mood;
  saveData(); renderPage();
}

function saveJournalField(key, val) {
  var today = todayString();
  if (!window.AppState.journalEntries) window.AppState.journalEntries = [];
  var e = window.AppState.journalEntries.find(function(e){ return e.date === today; });
  if (!e) { e = { date: today, mood: '', wins: '', hard: '', tmr: '', gratitude: '' }; window.AppState.journalEntries.push(e); }
  e[key] = val;
  saveData();
}

function saveJournalEntry() {
  saveData();
  var msg = document.createElement('div');
  msg.style.cssText = 'position:fixed;bottom:30px;right:30px;background:#10b981;color:#fff;padding:10px 20px;border-radius:8px;font-size:12px;font-weight:700;z-index:9999;';
  msg.textContent = '✅ Reflection saved!';
  document.body.appendChild(msg);
  setTimeout(function(){ document.body.removeChild(msg); }, 2000);
}

function addJournalIdea() {
  var title = (document.getElementById('idea-title') || {}).value || '';
  var body  = (document.getElementById('idea-body')  || {}).value || '';
  var cat   = (document.getElementById('idea-cat')   || {}).value || 'Other';
  if (!title.trim()) return alert('Please enter an idea title.');
  if (!window.AppState.journalIdeas) window.AppState.journalIdeas = [];
  window.AppState.journalIdeas.push({ title: title.trim(), body: body.trim(), cat: cat, date: todayString() });
  saveData(); renderPage();
}

function deleteJournalIdea(idx) {
  if (!confirm('Delete this idea?')) return;
  window.AppState.journalIdeas.splice(idx, 1);
  saveData(); renderPage();
}

function setIdeaFilter(cat) { window.AppState.ideaCatFilter = cat; saveData(); renderPage(); }

console.log('journal.js loaded OK');