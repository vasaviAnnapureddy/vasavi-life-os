/* ============================================
   VASAVI'S LIFE OS - LANGUAGE OS MODULE
   modules/language.js

   Features:
   - Add any language (not just EN/KO)
   - Vocabulary with WORD + MEANING + EXAMPLE SENTENCE
   - Full Notebook per language (notes, grammar, phrases)
   - AI Tutor mode — explains like a friend
   - 10-min session timer with alarm
   - All saved to localStorage → Firebase later
   ============================================ */

/* ---- DEFAULT LANGUAGES (can add more) ---- */
var DEFAULT_LANGS = {
  en: { name: 'English',  flag: '🇬🇧', color: '#3b82f6', level: 'Intermediate' },
  ko: { name: 'Korean',   flag: '🇰🇷', color: '#ef4444', level: 'Beginner'     }
};

function getLangs(state) {
  var custom = state.customLangs || {};
  return Object.assign({}, DEFAULT_LANGS, custom);
}

/* ============================================
   MAIN RENDER
   ============================================ */
function renderLanguage() {
  var state = window.AppState;
  var tab   = state.langTab || 'home';
  var langs = getLangs(state);
  var langKeys = Object.keys(langs);

  /* Stats */
  var totalSessions = (state.langSessions || []).length;
  var totalWords    = langKeys.reduce(function(a, k) {
    return a + ((state.langVocab||{})[k]||[]).length;
  }, 0);
  var totalNotes = langKeys.reduce(function(a, k) {
    return a + ((state.langNotebook||{})[k]||[]).length;
  }, 0);
  var streak = langKeys.reduce(function(a, k){
    return a + ((state.langStreak||{})[k]||0);
  }, 0);

  var h = '';
  h += '<div class="grid-4" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + langKeys.length + '</div><div class="stat-label">Languages</div><div class="stat-sub">Add anytime!</div></div>';
  h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">' + totalSessions + '</div><div class="stat-label">Sessions Done</div></div>';
  h += '<div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-value">' + totalWords + '</div><div class="stat-label">Words Saved</div><div class="stat-sub">With examples</div></div>';
  h += '<div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-value">' + totalNotes + '</div><div class="stat-label">Notebook Entries</div></div>';
  h += '</div>';

  /* Tabs */
  h += '<div class="subtab-bar">';
  [['home','🏠 Languages'],['timer','⏱ Session'],['vocab','📖 Vocabulary'],['notebook','📓 Notebook'],['tutor','🤖 AI Tutor']].forEach(function(t) {
    h += '<div class="subtab ' + (tab===t[0]?'active':'') + '" onclick="switchLangTab(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  h += '</div>';

  if (tab === 'home')     h += renderLangHome(state, langs);
  if (tab === 'timer')    h += renderLangTimer(state, langs);
  if (tab === 'vocab')    h += renderLangVocab(state, langs);
  if (tab === 'notebook') h += renderLangNotebook(state, langs);
  if (tab === 'tutor')    h += renderLangTutor(state, langs);

  return h;
}

/* ============================================
   TAB 1: HOME — All languages + add new
   ============================================ */
function renderLangHome(state, langs) {
  var h = '';

  Object.keys(langs).forEach(function(k) {
    var l        = langs[k];
    var sessions = (state.langSessions||[]).filter(function(s){ return s.lang===k; }).length;
    var vocab    = (state.langVocab||{})[k]||[];
    var nbEntries= (state.langNotebook||{})[k]||[];
    var streak   = (state.langStreak||{})[k]||0;

    h += '<div class="card" style="margin-bottom:14px;border-left:4px solid ' + l.color + ';">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">';
    h += '<div style="display:flex;align-items:center;gap:10px;">';
    h += '<span style="font-size:28px;">' + l.flag + '</span>';
    h += '<div><div style="font-size:15px;font-weight:800;">' + escHtml(l.name) + '</div>';
    h += '<span style="font-size:10px;background:' + l.color + '22;color:' + l.color + ';padding:2px 8px;border-radius:4px;font-weight:700;">' + escHtml(l.level||'Beginner') + '</span></div>';
    h += '</div>';
    h += '<div style="text-align:right;"><div style="font-size:22px;font-weight:900;color:' + l.color + ';">' + streak + '</div><div style="font-size:10px;color:#8899bb;">day streak</div></div>';
    h += '</div>';

    /* Mini stats */
    h += '<div style="display:flex;gap:6px;margin-bottom:12px;">';
    [
      [sessions, 'sessions'],
      [vocab.length, 'words'],
      [nbEntries.length, 'notes']
    ].forEach(function(s) {
      h += '<div style="flex:1;background:var(--card2);border-radius:8px;padding:8px;text-align:center;">';
      h += '<div style="font-size:16px;font-weight:800;color:' + l.color + ';">' + s[0] + '</div>';
      h += '<div style="font-size:10px;color:#8899bb;">' + s[1] + '</div>';
      h += '</div>';
    });
    h += '</div>';

    /* Korean milestone */
    if (k === 'ko' && vocab.length >= 10) {
      h += '<div style="background:#0a1533;border:1px solid #3b82f6;border-radius:8px;padding:8px;text-align:center;margin-bottom:10px;font-size:12px;font-weight:700;color:#a855f7;">당신은 잘하고 있어요! 🎉 You\'re doing great!</div>';
    }

    h += '<div style="display:flex;gap:8px;">';
    h += '<button class="btn-primary" onclick="startLangSession(\'' + k + '\')" style="flex:1;">▶ Start 10-Min Session</button>';
    h += '<button class="btn-ghost" onclick="openLangVocab(\'' + k + '\')" style="flex:1;">📖 Vocabulary</button>';
    h += '</div></div>';
  });

  /* Add new language */
  h += '<div class="card" style="border:1px dashed var(--border);">';
  h += '<div class="card-header">+ Add New Language</div>';
  h += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  h += '<input id="new-lang-name" placeholder="Language name (e.g. Spanish)" style="flex:2;" />';
  h += '<input id="new-lang-flag" placeholder="Flag emoji 🇪🇸" style="flex:1;max-width:80px;" />';
  h += '<input id="new-lang-color" type="color" value="#10b981" style="width:40px;height:38px;border-radius:6px;border:1px solid var(--border);background:transparent;cursor:pointer;" />';
  h += '</div>';
  h += '<button class="btn-primary" onclick="addCustomLang()" style="width:100%;margin-top:8px;">Add Language</button>';
  h += '</div>';

  return h;
}

/* ============================================
   TAB 2: SESSION TIMER
   ============================================ */
function renderLangTimer(state, langs) {
  var h = '';
  var active = state.langActive;
  var secs   = state.langSecs || 0;
  var TARGET = 600;
  var elapsed= Math.min(secs, TARGET + 300);
  var pct    = Math.min(100, Math.round((elapsed/TARGET)*100));

  if (!active) {
    h += '<div class="empty-state"><div class="emo">⏱</div><p>Go to Languages tab and press Start Session!</p></div>';
    return h;
  }

  var l       = (langs[active]||{ name:active, flag:'🌐', color:'#a855f7' });
  var mins    = Math.floor(elapsed/60);
  var secRem  = elapsed%60;
  var timeLeft= TARGET - elapsed;
  var over    = elapsed >= TARGET;

  h += '<div class="card" style="text-align:center;padding:20px;margin-bottom:14px;">';
  h += '<div style="font-size:20px;margin-bottom:6px;">' + l.flag + ' ' + escHtml(l.name) + ' Session</div>';

  /* Ring */
  h += '<div style="margin:12px auto;width:130px;height:130px;position:relative;">';
  h += '<svg viewBox="0 0 36 36" style="transform:rotate(-90deg);width:100%;height:100%;">';
  h += '<circle cx="18" cy="18" r="15.9" fill="none" stroke="#1a1a35" stroke-width="3"/>';
  h += '<circle cx="18" cy="18" r="15.9" fill="none" stroke="' + l.color + '" stroke-width="3" stroke-dasharray="' + pct + ' ' + (100-pct) + '" stroke-linecap="round"/>';
  h += '</svg>';
  h += '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">';
  h += '<div style="font-size:20px;font-weight:900;color:' + l.color + ';">' + mins + ':' + (secRem<10?'0':'') + secRem + '</div>';
  h += '<div style="font-size:10px;color:#8899bb;">' + pct + '%</div>';
  h += '</div></div>';

  if (over) {
    h += '<div style="font-size:13px;font-weight:800;color:#10b981;margin-bottom:12px;">🎉 10 minutes done! Amazing work!</div>';
  } else {
    h += '<div style="font-size:11px;color:#8899bb;margin-bottom:12px;">' + (timeLeft>0 ? Math.ceil(timeLeft/60)+'m '+timeLeft%60+'s remaining' : 'Over time — great dedication!') + '</div>';
  }

  h += '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;">';
  if (!state.langRunning) {
    h += '<button class="btn-primary" onclick="resumeLangTimer()">▶ Resume</button>';
  } else {
    h += '<button class="btn-ghost" onclick="pauseLangTimer()">⏸ Pause</button>';
  }
  h += '<button class="btn-ghost" onclick="endLangSession()">✅ End & Save</button>';
  h += '</div></div>';

  /* Quick word add during session */
  h += '<div class="card">';
  h += '<div class="card-header">📖 Add Word During Session</div>';
  h += '<div style="display:flex;gap:8px;margin-bottom:8px;">';
  h += '<input id="sess-word" placeholder="Word / phrase" style="flex:1;" />';
  h += '<input id="sess-meaning" placeholder="Meaning" style="flex:1;" />';
  h += '</div>';
  h += '<textarea id="sess-example" rows="2" placeholder="Example sentence using this word..." style="margin-bottom:8px;font-size:11px;"></textarea>';
  h += '<button class="btn-primary" onclick="addVocabWord(\'' + active + '\',\'sess\')" style="width:100%;">+ Save Word with Example</button>';
  h += '</div>';

  return h;
}

/* ============================================
   TAB 3: VOCABULARY — word + meaning + example
   ============================================ */
function renderLangVocab(state, langs) {
  var h = '';
  var selLang = state.langVocabFilter || Object.keys(langs)[0] || 'en';

  /* Language picker */
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">';
  Object.keys(langs).forEach(function(k) {
    var l = langs[k];
    var count = ((state.langVocab||{})[k]||[]).length;
    h += '<div onclick="setLangVocabFilter(\'' + k + '\')" style="padding:7px 14px;border-radius:99px;cursor:pointer;font-weight:700;font-size:12px;border:2px solid ' + (selLang===k?l.color:'var(--border)') + ';background:' + (selLang===k?l.color+'22':'var(--card2)') + ';color:' + (selLang===k?l.color:'#8899bb') + ';">' + l.flag + ' ' + escHtml(l.name) + ' (' + count + ')</div>';
  });
  h += '</div>';

  /* Add word */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">+ Add New Word</div>';
  h += '<div style="display:flex;gap:8px;margin-bottom:8px;">';
  h += '<input id="add-word" placeholder="Word or phrase" style="flex:1;" />';
  h += '<input id="add-meaning" placeholder="Meaning / translation" style="flex:1;" />';
  h += '</div>';
  h += '<textarea id="add-example" rows="2" placeholder="Example sentence (very important for understanding!)&#10;e.g. \'I love eating biryani\' — shows how to use the word in context" style="margin-bottom:8px;font-size:11px;"></textarea>';
  h += '<div style="display:flex;gap:8px;">';
  h += '<select id="add-category" style="flex:1;"><option value="general">General</option><option value="greetings">Greetings</option><option value="food">Food & Drink</option><option value="emotions">Emotions</option><option value="work">Work & Study</option><option value="daily">Daily Life</option><option value="grammar">Grammar Note</option></select>';
  h += '<button class="btn-primary" onclick="addVocabWord(\'' + selLang + '\',\'add\')" style="flex:1;">Save Word</button>';
  h += '</div></div>';

  /* Word list */
  var vocabList = ((state.langVocab||{})[selLang]||[]);
  if (vocabList.length === 0) {
    h += '<div class="empty-state"><div class="emo">📖</div><p>No words yet for ' + escHtml(langs[selLang]||{name:selLang}).name + '. Add your first word above!</p></div>';
    return h;
  }

  /* Filter by category */
  var selCat = state.vocabCatFilter || 'all';
  var cats   = ['all'].concat([...new Set(vocabList.map(function(w){ return w.cat||'general'; }))]);
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">';
  cats.forEach(function(c) {
    h += '<div onclick="setVocabCatFilter(\'' + c + '\')" style="padding:4px 10px;border-radius:99px;cursor:pointer;font-size:10px;font-weight:700;background:' + (selCat===c?'var(--accent)':'var(--card2)') + ';color:' + (selCat===c?'#fff':'#8899bb') + ';border:1px solid var(--border);">' + c + '</div>';
  });
  h += '</div>';

  /* Search */
  h += '<input id="vocab-search" placeholder="🔍 Search words..." style="margin-bottom:10px;" oninput="filterVocab(this.value)" />';

  var filtered = selCat==='all' ? vocabList : vocabList.filter(function(w){ return (w.cat||'general')===selCat; });

  h += '<div id="vocab-list">';
  filtered.slice().reverse().forEach(function(w, idx) {
    var realIdx = vocabList.indexOf(w);
    h += '<div class="card" style="margin-bottom:8px;padding:12px;">';
    h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">';
    h += '<div>';
    h += '<span style="font-size:16px;font-weight:800;">' + escHtml(w.word) + '</span>';
    h += ' <span style="font-size:13px;color:#a0aec0;">— ' + escHtml(w.meaning) + '</span>';
    h += '</div>';
    h += '<div style="display:flex;align-items:center;gap:6px;">';
    h += '<span style="font-size:9px;background:#1a1a35;padding:2px 7px;border-radius:4px;color:#8899bb;">' + escHtml(w.cat||'general') + '</span>';
    h += '<button onclick="deleteVocabWord(\'' + selLang + '\',' + realIdx + ')" style="background:transparent;border:none;color:#ef4444;cursor:pointer;font-size:16px;padding:0;">×</button>';
    h += '</div></div>';
    if (w.example) {
      h += '<div style="background:#0a0a1a;border-left:3px solid #a855f7;padding:8px;border-radius:0 6px 6px 0;font-size:12px;color:#c4b5fd;font-style:italic;line-height:1.5;">💡 ' + escHtml(w.example) + '</div>';
    }
    if (w.date) h += '<div style="font-size:10px;color:#556080;margin-top:4px;">' + w.date + '</div>';
    h += '</div>';
  });
  h += '</div>';

  return h;
}

/* ============================================
   TAB 4: NOTEBOOK — per language, full notes
   ============================================ */
function renderLangNotebook(state, langs) {
  var h = '';
  var selLang = state.langNbFilter || Object.keys(langs)[0] || 'en';

  /* Language picker */
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">';
  Object.keys(langs).forEach(function(k) {
    var l = langs[k];
    var count = ((state.langNotebook||{})[k]||[]).length;
    h += '<div onclick="setLangNbFilter(\'' + k + '\')" style="padding:7px 14px;border-radius:99px;cursor:pointer;font-weight:700;font-size:12px;border:2px solid ' + (selLang===k?l.color:'var(--border)') + ';background:' + (selLang===k?l.color+'22':'var(--card2)') + ';color:' + (selLang===k?l.color:'#8899bb') + ';">' + l.flag + ' ' + escHtml(l.name) + ' (' + count + ')</div>';
  });
  h += '</div>';

  /* Add notebook entry */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📓 New Notebook Entry — ' + escHtml((langs[selLang]||{name:selLang}).name) + '</div>';
  h += '<input id="lnb-title" placeholder="Title (e.g. \'Grammar: verb endings\', \'Greetings phrases\')" style="margin-bottom:8px;" />';
  h += '<textarea id="lnb-body" rows="5" placeholder="Write anything here!&#10;&#10;Examples of good entries:&#10;📌 Grammar rule: In Korean, verb comes at end of sentence. \'I school go\' = 나는 학교에 가요&#10;📌 Phrases I learned: 감사합니다 (thank you), 안녕하세요 (hello)&#10;📌 Pronunciation tip: ㅇ at start = silent, at end = \'ng\'&#10;📌 Cultural note: Koreans bow to greet, not handshake" style="margin-bottom:8px;"></textarea>';
  h += '<div style="display:flex;gap:8px;">';
  h += '<select id="lnb-type" style="flex:1;"><option value="grammar">📐 Grammar</option><option value="phrases">💬 Phrases</option><option value="culture">🌍 Culture Note</option><option value="pronunciation">🗣️ Pronunciation</option><option value="story">📖 Story/Context</option><option value="misc">📝 General Note</option></select>';
  h += '<button class="btn-primary" onclick="addLangNbEntry(\'' + selLang + '\')" style="flex:1;">Save to Notebook</button>';
  h += '</div></div>';

  var entries = ((state.langNotebook||{})[selLang]||[]);
  if (entries.length === 0) {
    h += '<div class="empty-state"><div class="emo">📓</div><p>Notebook empty. Start writing — grammar rules, phrases, cultural notes, anything!</p></div>';
    return h;
  }

  /* Type icons */
  var typeIcons = { grammar:'📐', phrases:'💬', culture:'🌍', pronunciation:'🗣️', story:'📖', misc:'📝' };
  var typeColors = { grammar:'#3b82f6', phrases:'#10b981', culture:'#f59e0b', pronunciation:'#a855f7', story:'#ec4899', misc:'#64748b' };

  entries.slice().reverse().forEach(function(entry, idx) {
    var realIdx = entries.length - 1 - idx;
    var ic = typeIcons[entry.type]||'📝';
    var cl = typeColors[entry.type]||'#64748b';
    h += '<div class="card" style="margin-bottom:10px;border-left:3px solid ' + cl + ';">';
    h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">';
    h += '<div><div style="display:flex;align-items:center;gap:6px;">';
    h += '<span style="font-size:16px;">' + ic + '</span>';
    h += '<span style="font-size:13px;font-weight:700;">' + escHtml(entry.title||'Note') + '</span>';
    h += '</div>';
    h += '<span style="font-size:10px;background:' + cl + '22;color:' + cl + ';padding:2px 7px;border-radius:4px;font-weight:700;margin-top:4px;display:inline-block;">' + escHtml(entry.type||'misc') + '</span>';
    h += '</div>';
    h += '<div style="display:flex;gap:6px;">';
    h += '<span style="font-size:10px;color:#556080;">' + (entry.date||'') + '</span>';
    h += '<button onclick="deleteLangNbEntry(\'' + selLang + '\',' + realIdx + ')" style="background:transparent;border:none;color:#ef4444;cursor:pointer;font-size:16px;padding:0;">×</button>';
    h += '</div></div>';
    h += '<div style="font-size:12px;line-height:1.8;color:#a0aec0;white-space:pre-wrap;word-break:break-word;">' + escHtml(entry.body||'') + '</div>';
    h += '</div>';
  });

  return h;
}

/* ============================================
   TAB 5: AI TUTOR — friend + teacher mode
   ============================================ */
function renderLangTutor(state, langs) {
  var h = '';
  var selLang = state.langTutorLang || Object.keys(langs)[0] || 'en';
  /* langTutorMsgs might be object or array — normalise to array */
  var rawMsgs = state.langTutorMsgs;
  var tutorMsgs = Array.isArray(rawMsgs) ? rawMsgs : [];
  var l = langs[selLang] || { name: selLang, flag: '🌐', color: '#a855f7' };

  /* Language selector */
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">';
  Object.keys(langs).forEach(function(k) {
    var lang = langs[k];
    h += '<div onclick="setTutorLang(\'' + k + '\')" style="padding:7px 14px;border-radius:99px;cursor:pointer;font-weight:700;font-size:12px;border:2px solid ' + (selLang===k?lang.color:'var(--border)') + ';background:' + (selLang===k?lang.color+'22':'var(--card2)') + ';color:' + (selLang===k?lang.color:'#8899bb') + ';">' + lang.flag + ' ' + escHtml(lang.name) + '</div>';
  });
  h += '</div>';

  /* Tutor intro card */
  h += '<div style="background:linear-gradient(135deg,#1a0533,#0a1020);border-radius:12px;padding:14px;margin-bottom:14px;">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">';
  h += '<span style="font-size:28px;">' + l.flag + '</span>';
  h += '<div><div style="font-size:14px;font-weight:800;">' + escHtml(l.name) + ' Tutor</div>';
  h += '<div style="font-size:11px;color:#10b981;">● Your friend + teacher — ask anything, anytime</div></div>';
  h += '</div>';
  h += '<div style="font-size:11px;color:#8899bb;line-height:1.6;">Ask me to explain grammar, give examples, translate phrases, teach you pronunciation, quiz you, or just practice conversation. I\'m here!</div>';
  h += '</div>';

  /* Chat */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div id="tutor-msgs" style="min-height:200px;max-height:400px;overflow-y:auto;margin-bottom:12px;">';

  if (tutorMsgs.length === 0) {
    var intro = l.name === 'Korean'
      ? '안녕하세요 Vasavi! 😊 I\'m your Korean tutor. Ask me anything!\n\nTry: "Teach me basic greetings" or "How do I say I love you in Korean?" or "Explain verb endings" or "Give me 5 food words with examples"'
      : 'Hi Vasavi! 😊 I\'m your ' + l.name + ' tutor — your friend and teacher.\n\nTry: "What\'s the difference between since and for?" or "Give me 5 interview phrases with examples" or "Correct my sentence: I am going to market yesterday"';
    h += '<div style="background:#1a1a35;border-radius:0 10px 10px 10px;padding:12px;font-size:12px;line-height:1.7;white-space:pre-wrap;">' + escHtml(intro) + '</div>';
  } else {
    tutorMsgs.forEach(function(m) {
      if (m.role === 'user') {
        h += '<div style="display:flex;justify-content:flex-end;margin-bottom:10px;">';
        h += '<div style="background:var(--accent);border-radius:10px 0 10px 10px;padding:10px 12px;font-size:12px;line-height:1.6;max-width:80%;color:#fff;">' + escHtml(m.content) + '</div>';
        h += '</div>';
      } else {
        h += '<div style="display:flex;gap:8px;margin-bottom:10px;align-items:flex-start;">';
        h += '<span style="font-size:20px;flex-shrink:0;">' + l.flag + '</span>';
        h += '<div style="background:#1a1a35;border-radius:0 10px 10px 10px;padding:10px 12px;font-size:12px;line-height:1.8;max-width:88%;white-space:pre-wrap;">' + escHtml(m.content) + '</div>';
        h += '</div>';
      }
    });
  }
  h += '</div>';
  h += '<div id="tutor-loading" style="display:none;text-align:center;padding:8px;font-size:11px;color:#a855f7;">Thinking...</div>';

  /* Quick prompts per language */
  var prompts = l.name === 'Korean'
    ? ['Basic greetings 🙏','Food words with examples 🍜','How to say numbers?','K-drama phrases 🎬','Quiz me! 📝','Explain verb endings']
    : ['Interview phrases 💼','Correct my grammar ✏️','5 new vocabulary words','How to sound confident?','Phrasal verbs explained','Quiz me! 📝'];

  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">';
  prompts.forEach(function(p) {
    h += '<div onclick="sendTutorMsg(\'' + p.replace(/[^a-zA-Z0-9 ]/g,'') + '\')" style="padding:5px 10px;border-radius:99px;background:#1a1a35;border:1px solid var(--border);font-size:10px;cursor:pointer;color:#a0aec0;">' + p + '</div>';
  });
  h += '</div>';

  h += '<div style="display:flex;gap:8px;">';
  h += '<input id="tutor-input" placeholder="Ask your ' + escHtml(l.name) + ' tutor anything..." style="flex:1;" onkeydown="if(event.key===\'Enter\')sendTutorFromInput()" />';
  h += '<button class="btn-primary" onclick="sendTutorFromInput()">Ask</button>';
  h += '</div>';
  if (tutorMsgs.length > 0) h += '<div style="text-align:right;margin-top:4px;"><span onclick="clearTutorChat()" style="font-size:10px;color:#556080;cursor:pointer;">Clear chat</span></div>';
  h += '</div>';

  /* Save to notebook button */
  if (tutorMsgs.length > 2) {
    h += '<button class="btn-ghost" onclick="saveTutorToNotebook(\'' + selLang + '\')" style="width:100%;">📓 Save This Conversation to Notebook</button>';
  }

  return h;
}

/* ============================================
   TIMER
   ============================================ */
var _langInterval = null;

function startLangSession(lang) {
  window.AppState.langActive  = lang;
  window.AppState.langSecs    = 0;
  window.AppState.langRunning = true;
  window.AppState.langTab     = 'timer';
  clearInterval(_langInterval);
  _langInterval = setInterval(function() {
    if (!window.AppState.langRunning) return;
    window.AppState.langSecs = (window.AppState.langSecs||0) + 1;
    saveData();
    if (window.AppState.langSecs === 600) {
      alert('⏰ LOUD ALARM! 10 MINUTES DONE, Vasavi! 🎉\nAmazing work! Save any words and end the session.');
    }
    renderPage();
  }, 1000);
  saveData(); renderPage();
}

function pauseLangTimer()  { window.AppState.langRunning=false; saveData(); renderPage(); }
function resumeLangTimer() { window.AppState.langRunning=true; clearInterval(_langInterval); _langInterval=setInterval(function(){ if(!window.AppState.langRunning)return; window.AppState.langSecs=(window.AppState.langSecs||0)+1; saveData(); if(window.AppState.langSecs===600){alert('⏰ 10 MINUTES DONE!');} renderPage(); },1000); renderPage(); }

function endLangSession() {
  clearInterval(_langInterval);
  var lang = window.AppState.langActive;
  var mins = Math.round((window.AppState.langSecs||0)/60);
  if (!window.AppState.langSessions) window.AppState.langSessions = [];
  window.AppState.langSessions.push({ lang:lang, date:todayString(), mins:mins });
  if (!window.AppState.langStreak) window.AppState.langStreak = {};
  window.AppState.langStreak[lang] = (window.AppState.langStreak[lang]||0)+1;
  window.AppState.langActive  = null;
  window.AppState.langSecs    = 0;
  window.AppState.langRunning = false;
  window.AppState.langTab     = 'home';
  saveData(); renderPage();
}

/* ============================================
   VOCABULARY ACTIONS
   ============================================ */
function addVocabWord(lang, source) {
  var prefix  = source==='sess' ? 'sess-' : 'add-';
  var wordEl  = document.getElementById(prefix+'word');
  var meanEl  = document.getElementById(prefix+'meaning');
  var exEl    = document.getElementById(prefix+'example');
  var catEl   = document.getElementById('add-category');
  if (!wordEl||!wordEl.value.trim()) { alert('Please enter a word.'); return; }
  if (!window.AppState.langVocab) window.AppState.langVocab = {};
  if (!window.AppState.langVocab[lang]) window.AppState.langVocab[lang] = [];
  window.AppState.langVocab[lang].push({
    word:    wordEl.value.trim(),
    meaning: (meanEl||{}).value||'',
    example: (exEl||{}).value||'',
    cat:     (catEl||{}).value||'general',
    date:    todayString()
  });
  if (wordEl) wordEl.value='';
  if (meanEl) meanEl.value='';
  if (exEl)   exEl.value='';
  saveData(); renderPage();
}

function deleteVocabWord(lang, idx) {
  if (!confirm('Delete this word?')) return;
  window.AppState.langVocab[lang].splice(idx, 1);
  saveData(); renderPage();
}

function setLangVocabFilter(lang) { window.AppState.langVocabFilter=lang; saveData(); renderPage(); }
function setVocabCatFilter(cat)   { window.AppState.vocabCatFilter=cat;   saveData(); renderPage(); }
function openLangVocab(lang)      { window.AppState.langVocabFilter=lang; window.AppState.langTab='vocab'; saveData(); renderPage(); }
function filterVocab(q) {
  document.querySelectorAll('#vocab-list .card').forEach(function(c){ c.style.display=(!q||c.textContent.toLowerCase().includes(q.toLowerCase()))?'':'none'; });
}

/* ============================================
   NOTEBOOK ACTIONS
   ============================================ */
function addLangNbEntry(lang) {
  var titleEl = document.getElementById('lnb-title');
  var bodyEl  = document.getElementById('lnb-body');
  var typeEl  = document.getElementById('lnb-type');
  if (!bodyEl||!bodyEl.value.trim()) { alert('Please write something.'); return; }
  if (!window.AppState.langNotebook) window.AppState.langNotebook = {};
  if (!window.AppState.langNotebook[lang]) window.AppState.langNotebook[lang] = [];
  window.AppState.langNotebook[lang].push({
    title: (titleEl||{}).value||'Note',
    body:  bodyEl.value.trim(),
    type:  (typeEl||{}).value||'misc',
    date:  todayString()
  });
  if (titleEl) titleEl.value='';
  if (bodyEl)  bodyEl.value='';
  saveData(); renderPage();
}

function deleteLangNbEntry(lang, idx) {
  if (!confirm('Delete?')) return;
  window.AppState.langNotebook[lang].splice(idx, 1);
  saveData(); renderPage();
}

function setLangNbFilter(lang) { window.AppState.langNbFilter=lang; saveData(); renderPage(); }

/* ============================================
   TUTOR ACTIONS
   ============================================ */
function switchLangTab(tab)    { window.AppState.langTab=tab; saveData(); renderPage(); }
function setTutorLang(lang)    { window.AppState.langTutorLang=lang; saveData(); renderPage(); }
function clearTutorChat()      { window.AppState.langTutorMsgs=[]; saveData(); renderPage(); }

function sendTutorFromInput() {
  var el=document.getElementById('tutor-input');
  if(!el||!el.value.trim())return;
  sendTutorMsg(el.value.trim());
  el.value='';
}

function sendTutorMsg(msg) {
  if(!window.AppState.langTutorMsgs) window.AppState.langTutorMsgs=[];
  window.AppState.langTutorMsgs.push({role:'user',content:msg});
  saveData(); renderPage();
  var ld=document.getElementById('tutor-loading');
  if(ld) ld.style.display='block';

  var langs = getLangs(window.AppState);
  var lang  = langs[window.AppState.langTutorLang||'en']||{name:'English'};
  var reply = getTutorReply(msg, lang.name, window.AppState);

  setTimeout(function(){
    var ld2=document.getElementById('tutor-loading');
    if(ld2) ld2.style.display='none';
    window.AppState.langTutorMsgs.push({role:'tutor',content:reply});
    saveData(); renderPage();
    setTimeout(function(){var el=document.getElementById('tutor-msgs');if(el)el.scrollTop=el.scrollHeight;},100);
  }, 600);
}

function getTutorReply(msg, langName, state) {
  var t = msg.toLowerCase();
  var vocab = ((state.langVocab||{})[state.langTutorLang||'en']||[]);

  if (langName === 'Korean') {
    if (t.includes('greet') || t.includes('hello') || t.includes('annyeong')) {
      return '안녕하세요! Let me teach you Korean greetings! 😊\n\n📌 FORMAL (use with strangers, elders, work):\n• 안녕하세요 (an-nyeong-ha-se-yo) = Hello\n• 감사합니다 (gam-sa-ham-ni-da) = Thank you\n• 죄송합니다 (joe-song-ham-ni-da) = I\'m sorry\n\n📌 INFORMAL (use with friends your age):\n• 안녕 (an-nyeong) = Hi / Bye\n• 고마워 (go-ma-wo) = Thanks\n• 미안해 (mi-an-hae) = Sorry\n\n💡 Key rule: Always use formal with people older than you or in professional settings. That\'s Korean culture!';
    }
    if (t.includes('food') || t.includes('eat') || t.includes('먹')) {
      return '음식 (food) vocabulary! 🍜\n\n🍚 밥 (bap) = Rice / Meal — "밥 먹었어요?" = "Did you eat?"\n🍜 라면 (ra-myeon) = Ramen — "라면 먹을래요?" = "Want to eat ramen?"\n🥩 고기 (go-gi) = Meat — "고기 좋아해요" = "I like meat"\n🐟 생선 (saeng-seon) = Fish\n🥗 채소 (chae-so) = Vegetables\n🍽️ 맛있다 (ma-sit-da) = Delicious!\n\n💡 Fun fact: Koreans greet each other by asking "밥 먹었어요?" (Did you eat?). It shows care, not just hunger!';
    }
    if (t.includes('number') || t.includes('count')) {
      return 'Korean has TWO number systems! 🔢\n\n📌 SINO-KOREAN (from Chinese — for dates, money, phone):\n1=일(il) 2=이(i) 3=삼(sam) 4=사(sa) 5=오(o)\n6=육(yuk) 7=칠(chil) 8=팔(pal) 9=구(gu) 10=십(sip)\n\n📌 NATIVE KOREAN (for counting objects, age):\n1=하나(hana) 2=둘(dul) 3=셋(set) 4=넷(net) 5=다섯(daseot)\n\n💡 Example: "나는 스물두 살이에요" = "I am 22 years old" (native)\n"오만원" = "50,000 won" (sino-korean for money)\n\nPractice: How do you say your age? 😊';
    }
    if (t.includes('kdrama') || t.includes('drama') || t.includes('phrase')) {
      return 'K-drama phrases you will actually hear! 🎬\n\n💬 사랑해 (sa-rang-hae) = I love you\n💬 보고싶어 (bo-go-si-peo) = I miss you\n💬 왜요? (wae-yo?) = Why?\n💬 진짜? (jin-jja?) = Really?!\n💬 대박! (dae-bak!) = Amazing! / Jackpot!\n💬 화이팅! (hwa-i-ting!) = Fighting! / You can do it!\n💬 괜찮아요 (gwaen-chan-a-yo) = It\'s okay / Are you okay?\n💬 어떻게 (eo-tteo-ke) = How?\n\n💡 당신은 잘하고 있어요! = You are doing great, Vasavi! Keep going!';
    }
    if (t.includes('quiz') || t.includes('test me')) {
      var wordList = vocab.length > 0
        ? vocab.slice(-5).map(function(w){ return '"' + w.word + '"'; }).join(', ')
        : '안녕, 감사, 밥, 사랑해, 대박';
      return '퀴즈 시간! (Quiz time!) 📝\n\nTranslate these into English:\n' + wordList + '\n\n' + (vocab.length > 0 ? '(These are from your word bank!)' : '(Add more words to your vocab for personalized quizzes!)') + '\n\nPost your answers and I\'ll check them! 화이팅! 💪';
    }
    if (t.includes('verb') || t.includes('grammar')) {
      return 'Korean Grammar: Verb Endings 📐\n\nIn Korean, the verb ALWAYS comes at the END:\n• 나는 학교에 가요 = I school to go = "I go to school"\n• 나는 밥을 먹어요 = I rice eat = "I eat rice"\n\n📌 Common verb endings:\n• -아요/어요 = polite present (most common!)\n• -이에요/예요 = "is/am/are" (to be)\n• -했어요 = past tense (did)\n• -할 거예요 = future (will do)\n\n💡 Example: \n공부해요 = (I/you/she) study (present)\n공부했어요 = studied (past)\n공부할 거예요 = will study (future)\n\nKorean doesn\'t change for "I" vs "she"! Much simpler! 😊';
    }
    return '안녕하세요! 😊 Great question about Korean!\n\nHere\'s what I know about "' + msg + '":\n\n' + (t.includes('how') ? '이렇게 해요! (This is how!)\n\n• Practice speaking out loud — your mouth needs to learn, not just your eyes\n• Add words to your vocabulary with examples\n• Watch K-dramas with subtitles — you\'ll absorb naturally\n\n당신은 잘하고 있어요! Keep going, Vasavi!' : 'I would need more context. Try asking:\n• "Teach me [specific topic]"\n• "How do I say [phrase]?"\n• "Quiz me on [topic]"\n• "Explain [grammar rule]"\n\n화이팅! 💪');
  }

  /* English tutor */
  if (t.includes('interview') || t.includes('professional')) {
    return 'Professional English for DS interviews! 💼\n\n📌 Opening phrases:\n• "I\'d like to walk you through my approach..."\n• "That\'s a great question. From my experience..."\n• "Let me think through this step by step..."\n\n📌 Explaining your project:\n• "I built a [project] that solves [problem] using [tech]"\n• "The key insight I found was..."\n• "The model achieved X% accuracy by..."\n\n📌 When you don\'t know:\n• "I haven\'t worked with that specifically, but my understanding is..."\n• "That\'s something I\'d approach by..."\n\n💡 Tip: Speak slowly and clearly. Interviewers value clarity over speed!';
  }
  if (t.includes('grammar') || t.includes('correct')) {
    return 'Let me help with your English grammar! ✏️\n\nCommon mistakes Indians make:\n\n❌ "I did not went" → ✅ "I did not go"\n❌ "She is knowing" → ✅ "She knows" (state verbs don\'t use -ing)\n❌ "I am having doubts" → ✅ "I have doubts"\n❌ "We discussed about" → ✅ "We discussed" (no \'about\')\n\n📌 Key rule: After modal verbs (do, will, can, should), use BASE verb:\n• "I will study" ✅ not "I will studies"\n• "Can you explain" ✅ not "Can you explained"\n\nShare a sentence you wrote and I\'ll check it! 😊';
  }
  if (t.includes('vocab') || t.includes('word') || t.includes('5 new')) {
    return '5 powerful words for your vocabulary! 📚\n\n1. METICULOUS (adj)\nMeaning: Very careful and precise\nExample: "She was meticulous in her data analysis."\n\n2. ARTICULATE (verb/adj)\nMeaning: Express clearly / able to speak clearly\nExample: "He could articulate complex ML concepts simply."\n\n3. LEVERAGE (verb)\nMeaning: Use something to maximum advantage\nExample: "We leveraged Python to automate the analysis."\n\n4. ROBUST (adj)\nMeaning: Strong and reliable\nExample: "The model was robust across different datasets."\n\n5. ITERATE (verb)\nMeaning: Repeat a process to improve\nExample: "We iterated on the model until accuracy improved."\n\n💡 Add these to your vocabulary tab with your own example sentences!';
  }
  if (t.includes('quiz') || t.includes('test me')) {
    return 'English Quiz time! 📝\n\nFill in the blank:\n1. "The data _____ (show/shows) a clear trend."\n2. "I _____ (have worked/worked) on this project since January."\n3. "If I _____ (know/knew) the answer, I would tell you."\n\nBONUS — Spot the mistake:\n4. "She is very interested on data science."\n5. "I am good in Python and pandas."\n\nPost your answers! I\'ll explain every one. 💪\n\n(Correct answers save to your notebook automatically when you get them right!)';
  }
  return 'Hello Vasavi! 😊 Let me help with your English.\n\nYou asked about: "' + msg + '"\n\nHere\'s my take:\n• Be specific when asking — "correct this sentence: [sentence]" or "explain [grammar rule]"\n• Practice 10 mins every day — consistency beats cramming\n• Read good English: BBC, The Hindu, technical articles\n• Speak English to yourself — narrate your day!\n\nYour English is already good, Vasavi. We are just making it interview-ready! 💪\n\nTry: "Give me 5 professional phrases" or "Quiz me!"';
}

function saveTutorToNotebook(lang) {
  var msgs = window.AppState.langTutorMsgs || [];
  if (msgs.length === 0) return;
  var entry = msgs.map(function(m){ return (m.role==='user'?'Me: ':'Tutor: ') + m.content; }).join('\n\n');
  if (!window.AppState.langNotebook) window.AppState.langNotebook = {};
  if (!window.AppState.langNotebook[lang]) window.AppState.langNotebook[lang] = [];
  window.AppState.langNotebook[lang].push({
    title: 'Tutor Session — ' + todayString(),
    body: entry,
    type: 'misc',
    date: todayString()
  });
  saveData();
  alert('✅ Saved to your ' + (getLangs(window.AppState)[lang]||{name:lang}).name + ' Notebook!');
}

function addCustomLang() {
  var nameEl  = document.getElementById('new-lang-name');
  var flagEl  = document.getElementById('new-lang-flag');
  var colorEl = document.getElementById('new-lang-color');
  var name = (nameEl||{}).value||'';
  if (!name.trim()) { alert('Please enter a language name.'); return; }
  var key = name.trim().toLowerCase().replace(/\s+/g,'_');
  if (!window.AppState.customLangs) window.AppState.customLangs = {};
  window.AppState.customLangs[key] = {
    name:  name.trim(),
    flag:  (flagEl||{}).value||'🌐',
    color: (colorEl||{}).value||'#a855f7',
    level: 'Beginner'
  };
  if (nameEl) nameEl.value='';
  if (flagEl) flagEl.value='';
  saveData(); renderPage();
}

console.log('language.js loaded OK');