/* ============================================
   VASAVI'S LIFE OS — LIFE MEMORIES 📕
   modules/memories.js

   The book of her life:
   - Memories with feeling tags (achievement,
     hard time, beautiful moment, lesson)
   - Browse any month
   - 📕 One-tap "Month Chapter" → printable
     page → Save as PDF (achievements, sad
     moments, lessons + auto-facts from the
     whole OS: focus hours, gym days, money)
   These monthly chapters double as the AI's
   compressed lifetime memory.
   ============================================ */

var MEMORY_TAGS = {
  win:       { icon:'🏆', label:'Achievement',      color:'#f59e0b' },
  hard:      { icon:'💔', label:'Hard Time',        color:'#ef4444' },
  beautiful: { icon:'💜', label:'Beautiful Moment', color:'#a855f7' },
  lesson:    { icon:'📖', label:'Life Lesson',      color:'#10b981' }
};

function renderMemories() {
  var state = window.AppState;
  if (!Array.isArray(state.memories)) state.memories = [];

  /* ---- VIEW SWITCHER ---- */
  var view = state.memoriesView || 'book';
  var vh = '<div class="subtab-bar">';
  [['book','📕 My Life Book'],['lane','🛤️ Memory Lane'],['analytics','📊 Data Analytics']].forEach(function(t) {
    vh += '<div class="subtab ' + (view===t[0]?'active':'') + '" onclick="switchMemoriesView(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  vh += '</div>';
  if (view === 'analytics') return vh + renderMemoriesAnalytics(state);
  if (view === 'lane')      return vh + renderMemoryLane(state);

  var h = vh;

  /* Stats */
  var counts = { win:0, hard:0, beautiful:0, lesson:0 };
  state.memories.forEach(function(m){ if (counts[m.tag] != null) counts[m.tag]++; });

  h += '<div class="grid-4" style="margin-bottom:14px;">';
  Object.keys(MEMORY_TAGS).forEach(function(k) {
    var t = MEMORY_TAGS[k];
    h += '<div class="stat-card" style="--stat-color:' + t.color + '"><div class="stat-value">' + t.icon + ' ' + counts[k] + '</div><div class="stat-label">' + t.label + 's</div></div>';
  });
  h += '</div>';

  /* Add memory */
  var selTag = state.memoryTag || 'win';
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📕 Write a Memory</div>';
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">';
  Object.keys(MEMORY_TAGS).forEach(function(k) {
    var t = MEMORY_TAGS[k], sel = selTag === k;
    h += '<div onclick="setMemoryTag(\'' + k + '\')" style="padding:6px 12px;border-radius:99px;cursor:pointer;font-size:11px;font-weight:700;border:2px solid ' + (sel?t.color:'var(--border)') + ';background:' + (sel?t.color+'22':'var(--card2)') + ';color:' + (sel?t.color:'#8899bb') + ';">' + t.icon + ' ' + t.label + '</div>';
  });
  h += '</div>';
  h += '<input id="mem-title" placeholder="Give this memory a name..." style="margin-bottom:8px;" />';
  h += '<textarea id="mem-text" rows="4" placeholder="What happened? How did it feel? What do you want future-Vasavi to know about this moment?"></textarea>';
  h += '<div style="display:flex;gap:8px;margin-top:8px;">';
  h += '<input type="date" id="mem-date" value="' + aeTodayIso() + '" style="flex:1;" />';
  h += '<button class="btn-primary" style="flex:2;" onclick="addMemory()">📕 Save to My Life Book</button>';
  h += '</div>';
  h += '</div>';

  /* Month browser + PDF button */
  var v = aeGetView('memories');
  var monthMems = state.memories.filter(function(m) {
    var d = new Date(m.date);
    return !isNaN(d) && d.getFullYear() === v.y && d.getMonth() === v.m;
  }).sort(function(a,b){ return a.date.localeCompare(b.date); });

  h += '<div class="card">';
  h += aeMonthNav('memories');
  h += '<button class="btn-primary" style="width:100%;margin-bottom:12px;" onclick="generateMonthChapter()">📕 Generate ' + AE_MONTHS[v.m] + ' ' + v.y + ' Chapter (PDF)</button>';
  h += '<div style="font-size:10px;color:#556080;text-align:center;margin-bottom:12px;">Opens a beautiful printable chapter — choose "Save as PDF" in the print box. One chapter a month = the book of your life.</div>';

  if (monthMems.length === 0) {
    h += '<div class="empty-state" style="padding:20px;"><div class="emo">📕</div><p>No memories written for ' + AE_MONTHS[v.m] + ' ' + v.y + ' yet.</p></div>';
  } else {
    monthMems.forEach(function(m) {
      var t = MEMORY_TAGS[m.tag] || MEMORY_TAGS.win;
      var realIdx = state.memories.indexOf(m);
      h += '<div style="background:var(--card2);border:1px solid var(--border);border-left:3px solid ' + t.color + ';border-radius:10px;padding:12px;margin-bottom:8px;">';
      h += '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">';
      h += '<span style="font-size:12px;font-weight:800;">' + t.icon + ' ' + escHtml(m.title||t.label) + '</span>';
      h += '<span style="display:flex;gap:8px;align-items:center;"><span style="font-size:10px;color:#556080;">' + m.date + '</span>' +
        '<button onclick="deleteMemory(' + realIdx + ')" style="background:none;border:none;color:#556080;cursor:pointer;">✕</button></span>';
      h += '</div>';
      h += '<div style="font-size:12px;line-height:1.8;color:#c4c4d4;white-space:pre-wrap;">' + escHtml(m.text) + '</div>';
      h += '</div>';
    });
  }
  h += '</div>';

  return h;
}

function setMemoryTag(t) { window.AppState.memoryTag = t; renderPage(); }
function switchMemoriesView(v) { window.AppState.memoriesView = v; saveData(); renderPage(); }

/* ============================================
   🛤️ MEMORY LANE
   Auto-detected milestones from your real data —
   proof of how far you've come, for the days you
   forget. Nothing to log; it finds them for you.
   ============================================ */
function renderMemoryLane(state) {
  var m = [];   /* {iso, icon, title, detail, color} */
  var add = function(iso, icon, title, detail, color) {
    if (!iso) return;
    m.push({ iso: iso, icon: icon, title: title, detail: detail, color: color || '#a855f7' });
  };

  /* ---- FOCUS milestones ---- */
  var fMap = aeFocusByDate(state);
  var fDays = Object.keys(fMap).filter(function(k){ return fMap[k] > 0; }).sort();
  if (fDays.length) {
    add(fDays[0], '🚀', 'First focus session ever', fMap[fDays[0]] + ' minutes — where it all began', '#a855f7');
    /* Best single day */
    var best = fDays.reduce(function(a,b){ return fMap[b] > fMap[a] ? b : a; }, fDays[0]);
    add(best, '🏆', 'Your best focus day', fMap[best] + ' minutes in one day', '#f59e0b');
    /* Cumulative hour milestones */
    var run = 0, hit = {};
    fDays.forEach(function(iso) {
      run += fMap[iso];
      [600, 1800, 3000, 6000, 12000].forEach(function(mins) {
        if (!hit[mins] && run >= mins) { hit[mins] = 1; add(iso, '⏱', (mins/60) + ' hours of focus', 'Total deep work crossed ' + (mins/60) + 'h', '#06b6d4'); }
      });
    });
    /* Day-count milestones */
    [10, 30, 50, 100, 250, 365].forEach(function(n) {
      if (fDays.length >= n) add(fDays[n-1], '📅', n + ' days of focused work', 'You showed up ' + n + ' times', '#7c3aed');
    });
  }

  /* ---- GYM milestones ---- */
  var gDays = Object.keys(aeGymByDate(state)).sort();
  if (gDays.length) {
    add(gDays[0], '💪', 'First gym day logged', 'The hardest one to start', '#f97316');
    [10, 25, 50, 100, 200].forEach(function(n) {
      if (gDays.length >= n) add(gDays[n-1], '🏋️', n + ' gym sessions', 'Your body remembers every one', '#f97316');
    });
  }

  /* ---- BOOKS finished ---- */
  (state.books||[]).forEach(function(b) {
    if (b.total > 0 && (b.done||0) >= b.total && b.finishedOn) {
      add(b.finishedOn, '📚', 'Finished "' + b.name + '"', b.total + ' pages' + (b.author ? ' · ' + b.author : ''), '#10b981');
    }
  });

  /* ---- SAVINGS milestones ---- */
  var savedTotal = (state.savingsGoals||[]).reduce(function(a,g){ return a + (g.saved||0); }, 0);
  if (savedTotal > 0) {
    var incDays = (state.income||[]).map(function(i){ return aeIso(new Date(i.date)); }).sort();
    var lastInc = incDays[incDays.length-1] || aeTodayIso();
    [1000, 5000, 10000, 25000, 50000].forEach(function(amt) {
      if (savedTotal >= amt) add(lastInc, '🏦', 'Saved ₹' + formatRupees(amt), 'Building your future, rupee by rupee', '#10b981');
    });
  }

  /* ---- LANGUAGE / VOCAB ---- */
  var vocabAll = [];
  Object.keys(state.langVocab||{}).forEach(function(k){ vocabAll = vocabAll.concat(state.langVocab[k]||[]); });
  if (vocabAll.length) {
    [10, 50, 100, 250].forEach(function(n) {
      if (vocabAll.length >= n && vocabAll[n-1] && vocabAll[n-1].date) {
        var d = new Date(vocabAll[n-1].date);
        if (!isNaN(d)) add(aeIso(d), '🗣️', n + ' words learned', 'Your vocabulary is growing', '#3b82f6');
      }
    });
  }

  /* ---- HABIT streak highs ---- */
  (state.habits||[]).forEach(function(hb) {
    var days = Object.keys(hb.history||{}).sort();
    if (days.length >= 21) add(days[20], '✅', '21 days of "' + hb.name + '"', 'Long enough to become part of you', '#10b981');
    if (days.length >= 100) add(days[99], '🌟', '100 days of "' + hb.name + '"', 'This is who you are now', '#f59e0b');
  });

  /* ---- REFLECTION / DIARY ---- */
  var refDays = Object.keys(state.reflectionArchive||{}).sort();
  if (refDays.length) {
    add(refDays[0], '🪞', 'First reflection written', 'The start of knowing yourself', '#ec4899');
    [30, 100, 365].forEach(function(n) {
      if (refDays.length >= n) add(refDays[n-1], '📖', n + ' days reflected', 'A written record of your growth', '#ec4899');
    });
  }

  /* ---- YOUR OWN pinned achievements ---- */
  (state.memories||[]).filter(function(x){ return x.tag === 'win'; }).forEach(function(x) {
    add((x.date||'').substring(0,10), '🏆', x.title || 'An achievement', x.text.substring(0,90) + (x.text.length>90?'…':''), '#f59e0b');
  });

  /* ---- JOBS ---- */
  var offers = (state.jobs||[]).filter(function(j){ return j.status === 'Offer'; });
  offers.forEach(function(j) { add((j.date||'').substring(0,10), '🎉', 'Offer from ' + j.company, j.role || '', '#10b981'); });

  if (m.length === 0) {
    return '<div class="empty-state"><div class="emo">🛤️</div><p>Your Memory Lane is empty for now.<br>Keep using the app — milestones appear here <b>automatically</b> as you hit them.<br><br>No logging needed. It finds them for you.</p></div>';
  }

  /* Sort newest first, group by year */
  m.sort(function(a,b){ return b.iso.localeCompare(a.iso); });

  var h = '';
  h += '<div class="card" style="margin-bottom:14px;text-align:center;background:linear-gradient(135deg,#1a0533,#0a1020);">';
  h += '<div style="font-size:30px;">🛤️</div>';
  h += '<div style="font-size:15px;font-weight:900;margin:6px 0;">' + m.length + ' milestones so far</div>';
  h += '<div style="font-size:11px;color:#8899bb;line-height:1.7;">Every one of these is something you actually did.<br>Read this on the days you feel like you are going nowhere. 💜</div>';
  h += '</div>';

  var lastYear = '';
  m.forEach(function(x) {
    var year = x.iso.substring(0,4);
    if (year !== lastYear) {
      lastYear = year;
      h += '<div style="font-size:17px;font-weight:900;color:#a855f7;margin:16px 0 8px;">' + year + '</div>';
    }
    var d = new Date(x.iso);
    h += '<div style="display:flex;gap:12px;margin-bottom:10px;">';
    h += '<div style="flex-shrink:0;width:36px;height:36px;border-radius:50%;background:' + x.color + '22;border:2px solid ' + x.color + ';display:flex;align-items:center;justify-content:center;font-size:16px;">' + x.icon + '</div>';
    h += '<div style="flex:1;background:var(--card2);border:1px solid var(--border);border-left:3px solid ' + x.color + ';border-radius:10px;padding:10px 12px;">';
    h += '<div style="font-size:12px;font-weight:800;color:' + x.color + ';">' + escHtml(x.title) + '</div>';
    h += '<div style="font-size:11px;color:#a0aec0;margin-top:2px;line-height:1.6;">' + escHtml(x.detail) + '</div>';
    h += '<div style="font-size:10px;color:#556080;margin-top:4px;">' + (isNaN(d) ? x.iso : d.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'long',year:'numeric'})) + '</div>';
    h += '</div></div>';
  });

  return h;
}

/* ============================================
   LIFE MEMORIES — DATA ANALYTICS
   How many memories per month/year, the balance
   of achievements vs hard times, your richest
   months, and how much of your life is captured.
   ============================================ */
function renderMemoriesAnalytics(state) {
  var mems = state.memories || [];
  var h = '';
  var now = new Date();
  var v = aeGetView('memories');

  if (mems.length === 0) {
    return '<div class="empty-state"><div class="emo">📊</div><p>No memories yet.<br>Write your first one in My Life Book — analytics appear here!</p></div>';
  }

  /* Date maps */
  var byDate = {}, byDateTag = {};
  mems.forEach(function(m) {
    var iso = (m.date||'').substring(0,10);
    if (!iso) return;
    byDate[iso] = (byDate[iso]||0) + 1;
    if (!byDateTag[iso]) byDateTag[iso] = {};
    byDateTag[iso][m.tag] = (byDateTag[iso][m.tag]||0) + 1;
  });

  function inMonth(m, y, mo) { var d = new Date(m.date); return !isNaN(d) && d.getFullYear()===y && d.getMonth()===mo; }
  function inYear(m, y)      { var d = new Date(m.date); return !isNaN(d) && d.getFullYear()===y; }

  var monthMems = mems.filter(function(m){ return inMonth(m, v.y, v.m); });
  var yearMems  = mems.filter(function(m){ return inYear(m, v.y); });

  /* Tag counts helper */
  function tagCounts(list) {
    var c = { win:0, hard:0, beautiful:0, lesson:0 };
    list.forEach(function(m){ if (c[m.tag] != null) c[m.tag]++; });
    return c;
  }
  var mc = tagCounts(monthMems), yc = tagCounts(yearMems), ac = tagCounts(mems);

  /* Top stats */
  h += '<div class="grid-4" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + monthMems.length + '</div><div class="stat-label">' + AE_MONTHS_SHORT[v.m] + ' Memories</div></div>';
  h += '<div class="stat-card" style="--stat-color:#06b6d4"><div class="stat-value">' + yearMems.length + '</div><div class="stat-label">' + v.y + ' Memories</div></div>';
  h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">' + mems.length + '</div><div class="stat-label">All Time</div><div class="stat-sub">your whole book</div></div>';
  h += '<div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-value">' + Object.keys(byDate).length + '</div><div class="stat-label">Days Captured</div></div>';
  h += '</div>';

  /* 📆 Days you captured a memory */
  h += aeDaysPanel('memories', byDate, { color:'#a855f7', word:'Memory Days', label:'days with a memory' });

  /* Emotional balance — month + year */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">💜 The Shape of ' + AE_MONTHS[v.m] + ' ' + v.y + '</div>';
  var anyMonth = monthMems.length > 0;
  if (anyMonth) {
    ['win','beautiful','hard','lesson'].forEach(function(k) {
      var t = MEMORY_TAGS[k];
      if (!mc[k]) return;
      h += aeBarRow(t.icon + ' ' + t.label, mc[k], monthMems.length, t.color, mc[k] + '');
    });
    var good = mc.win + mc.beautiful, tough = mc.hard;
    h += '<div style="margin-top:10px;padding:10px;background:#0d0d1a;border-radius:8px;font-size:11px;color:#a0aec0;line-height:1.7;">' +
      (good > tough ? '✨ More achievements and beautiful moments than hard times this month. Remember this when a bad week makes you forget.' :
       tough > good ? '🤍 A heavier month — ' + tough + ' hard moment' + (tough>1?'s':'') + ' written down. Recording them is how you find the lesson later.' :
       'A balanced month — the wins and the hard parts both got their page.') + '</div>';
  } else {
    h += '<div style="font-size:11px;color:#556080;text-align:center;padding:10px;">No memories written in ' + AE_MONTHS[v.m] + ' ' + v.y + '. Use ◀ ▶ above to explore other months.</div>';
  }
  h += '</div>';

  /* Year breakdown by tag */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">🗓️ ' + v.y + ' by Feeling</div>';
  ['win','beautiful','hard','lesson'].forEach(function(k) {
    var t = MEMORY_TAGS[k];
    h += aeBarRow(t.icon + ' ' + t.label, yc[k], Math.max(yearMems.length,1), t.color, yc[k] + '');
  });
  h += '</div>';

  /* Memories per month bars */
  var monthCounts = new Array(12).fill(0);
  mems.forEach(function(m){ var d=new Date(m.date); if(!isNaN(d)&&d.getFullYear()===v.y) monthCounts[d.getMonth()]++; });
  var richest = monthCounts.indexOf(Math.max.apply(null, monthCounts));
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📈 Memories Each Month — ' + v.y + '</div>';
  h += aeYearBarChart(monthCounts, v.y===now.getFullYear()?now.getMonth():-1, '#a855f7', function(n){ return n; }, 'memories');
  if (Math.max.apply(null, monthCounts) > 0) {
    h += '<div style="font-size:11px;color:#8899bb;">Your richest month was <b style="color:#a855f7;">' + AE_MONTHS[richest] + '</b> with ' + monthCounts[richest] + ' memories.</div>';
  }
  h += '</div>';

  /* All years */
  var years = {};
  mems.forEach(function(m){ var y=(m.date||'').substring(0,4); if(y) years[y]=(years[y]||0)+1; });
  var yKeys = Object.keys(years).sort();
  if (yKeys.length > 1) {
    h += '<div class="card" style="margin-bottom:14px;"><div class="card-header">🏆 All Years</div>';
    var maxY = Math.max.apply(null, yKeys.map(function(k){ return years[k]; }));
    yKeys.forEach(function(yk){ h += aeBarRow(yk, years[yk], maxY, '#06b6d4', years[yk] + ' memories'); });
    h += '</div>';
  }

  h += '<button class="btn-primary" style="width:100%;" onclick="memoriesAISummary(this)">🤖 Summary — What My Memories Say</button>';
  h += '<div id="memories-ai-summary" style="display:none;"></div>';

  return h;
}

function memoriesAISummary(btn) {
  var state = window.AppState;
  var v = aeGetView('memories');
  var mems = (state.memories||[]).filter(function(m){
    var d = new Date(m.date); return !isNaN(d) && d.getFullYear()===v.y && d.getMonth()===v.m;
  });
  var counts = { win:0, hard:0, beautiful:0, lesson:0 };
  mems.forEach(function(m){ if (counts[m.tag]!=null) counts[m.tag]++; });

  var ctx = 'Life memories written in ' + AE_MONTHS[v.m] + ' ' + v.y + ' (' + mems.length + ' total):\n' +
    'Achievements: ' + counts.win + ', Beautiful moments: ' + counts.beautiful + ', Hard times: ' + counts.hard + ', Lessons: ' + counts.lesson + '\n\n' +
    mems.map(function(m){ return '[' + (MEMORY_TAGS[m.tag]||{label:m.tag}).label + '] ' + (m.title||'') + ': ' + m.text; }).join('\n');
  var fallback = '📕 ' + AE_MONTHS[v.m] + ' ' + v.y + ' — your memories:\n' +
    '• ' + mems.length + ' memories captured\n' +
    '• 🏆 ' + counts.win + ' achievements · 💜 ' + counts.beautiful + ' beautiful moments\n' +
    '• 💔 ' + counts.hard + ' hard times · 📖 ' + counts.lesson + ' lessons\n\n' +
    (mems.length >= 8 ? 'You are capturing your life richly. In 10 years this month will still be alive because you wrote it down.' :
     mems.length >= 3 ? 'A good start. Try writing one memory every Sunday — future-you will thank you.' :
     'Only a few memories this month. Even one line about a small good moment becomes precious years later.');
  aeAISummary('Memories Summary — ' + AE_MONTHS[v.m] + ' ' + v.y, ctx, fallback, btn, 'memories-ai-summary');
}

function addMemory() {
  var title = (document.getElementById('mem-title')||{}).value || '';
  var text  = (document.getElementById('mem-text')||{}).value || '';
  var date  = (document.getElementById('mem-date')||{}).value || aeTodayIso();
  if (!text.trim()) { alert('Write the memory first — even two lines count.'); return; }
  if (!Array.isArray(window.AppState.memories)) window.AppState.memories = [];
  window.AppState.memories.push({
    id: Date.now(),
    tag: window.AppState.memoryTag || 'win',
    title: title.trim(),
    text: text.trim(),
    date: date
  });
  var t1 = document.getElementById('mem-title'); if (t1) t1.value='';
  var t2 = document.getElementById('mem-text');  if (t2) t2.value='';
  saveData(); renderPage();
  showToast('📕 Saved to your life book.');
}

function deleteMemory(idx) {
  if (!confirm('Remove this memory from your book?')) return;
  window.AppState.memories.splice(idx, 1);
  saveData(); renderPage();
}

/* ============================================
   📕 MONTH CHAPTER → printable page → PDF
   Pulls memories + auto-facts from every module
   ============================================ */
function generateMonthChapter() {
  var state = window.AppState;
  var v = aeGetView('memories');
  var monthName = AE_MONTHS[v.m] + ' ' + v.y;

  /* Memories of the month, grouped by tag */
  var mems = (state.memories||[]).filter(function(m) {
    var d = new Date(m.date);
    return !isNaN(d) && d.getFullYear() === v.y && d.getMonth() === v.m;
  });

  /* Auto-facts from the whole OS */
  var focusMins = aeMonthTotals(aeFocusByDate(state), v.y)[v.m];
  var gymDays   = aeActiveDaysInMonth(aeGymByDate(state), v.y, v.m);
  var spend     = aeMonthTotals(aeSpendByDate(state), v.y)[v.m];
  var incomeM   = (state.income||[]).filter(function(e){ var d=new Date(e.date||0); return !isNaN(d)&&d.getFullYear()===v.y&&d.getMonth()===v.m; })
                    .reduce(function(a,e){ return a+(e.amount||0); },0);
  var goalsDone = ((state.goals&&state.goals.daily)||[]).filter(function(g){
    return g.done && g.deadline && g.deadline.indexOf(v.y + '-' + pad(v.m+1)) === 0;
  }).length;
  var langMap   = aeLangByDate(state);
  var langDays  = aeActiveDaysInMonth(langMap, v.y, v.m);

  /* Reflections of the month */
  var reflections = [];
  Object.keys(state.reflectionArchive||{}).forEach(function(iso) {
    if (iso.indexOf(v.y + '-' + pad(v.m+1)) === 0) reflections.push(Object.assign({iso:iso}, state.reflectionArchive[iso]));
  });
  (state.journalEntries||[]).forEach(function(e) {
    var d = new Date(e.date);
    if (!isNaN(d) && d.getFullYear()===v.y && d.getMonth()===v.m && (e.wins||e.gratitude)) {
      reflections.push({ iso: aeIso(d), well: e.wins||'', better: e.hard||'', tomorrow: e.tmr||'', gratitude: e.gratitude||'' });
    }
  });
  reflections.sort(function(a,b){ return a.iso.localeCompare(b.iso); });

  /* Build the printable chapter */
  var esc = escHtml;
  var c = '';
  c += '<div class="chapter">';
  c += '<div class="cover">';
  c += '<div class="book-label">THE BOOK OF VASAVI · CHAPTER</div>';
  c += '<h1>' + monthName + '</h1>';
  c += '<div class="sub">Written by me, for the me of the future.</div>';
  c += '</div>';

  /* Auto-facts strip */
  c += '<div class="facts">';
  c += '<div class="fact"><b>' + Math.round(focusMins/60) + 'h</b><span>focused work</span></div>';
  c += '<div class="fact"><b>' + gymDays + '</b><span>gym days</span></div>';
  c += '<div class="fact"><b>₹' + formatRupees(spend) + '</b><span>spent</span></div>';
  c += '<div class="fact"><b>' + (incomeM>0 ? '₹'+formatRupees(Math.max(0,incomeM-spend)) : '—') + '</b><span>saved</span></div>';
  c += '<div class="fact"><b>' + goalsDone + '</b><span>goals done</span></div>';
  c += '<div class="fact"><b>' + langDays + '</b><span>language days</span></div>';
  c += '</div>';

  var order = ['win','beautiful','hard','lesson'];
  var headers = { win:'🏆 What I Achieved', beautiful:'💜 Beautiful Moments', hard:'💔 What Was Hard', lesson:'📖 What This Month Taught Me' };
  order.forEach(function(tag) {
    var list = mems.filter(function(m){ return m.tag === tag; });
    if (!list.length) return;
    c += '<h2>' + headers[tag] + '</h2>';
    list.forEach(function(m) {
      c += '<div class="memory"><div class="mtitle">' + esc(m.title||'') + ' <span class="mdate">' + m.date + '</span></div>';
      c += '<p>' + esc(m.text).replace(/\n/g,'<br>') + '</p></div>';
    });
  });

  if (reflections.length) {
    c += '<h2>🪞 From My Daily Reflections</h2>';
    reflections.slice(0, 15).forEach(function(r) {
      c += '<div class="memory"><div class="mtitle"><span class="mdate">' + r.iso + '</span></div><p>';
      if (r.well)      c += '<b>Went well:</b> ' + esc(r.well) + '<br>';
      if (r.better)    c += '<b>Was hard / do better:</b> ' + esc(r.better) + '<br>';
      if (r.gratitude) c += '<b>Grateful for:</b> ' + esc(r.gratitude) + '<br>';
      c += '</p></div>';
    });
  }

  if (!mems.length && !reflections.length) {
    c += '<p style="text-align:center;color:#999;margin:40px 0;">No memories or reflections were written this month.<br>The numbers above still tell part of the story.</p>';
  }

  c += '<div class="footer">Generated by Vasavi\'s Life OS · ' + new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) + '</div>';
  c += '</div>';

  var css = 'body{font-family:Georgia,\'Times New Roman\',serif;color:#222;max-width:700px;margin:0 auto;padding:32px 24px;}' +
    '.cover{text-align:center;border-bottom:3px double #a855f7;padding-bottom:24px;margin-bottom:20px;}' +
    '.book-label{font-size:10px;letter-spacing:3px;color:#a855f7;font-weight:bold;}' +
    'h1{font-size:42px;margin:10px 0 6px;color:#1a1a2e;}' +
    '.sub{font-style:italic;color:#777;font-size:13px;}' +
    '.facts{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:18px 0 26px;}' +
    '.fact{text-align:center;border:1px solid #ddd;border-radius:10px;padding:10px 14px;min-width:80px;}' +
    '.fact b{display:block;font-size:18px;color:#7c3aed;}' +
    '.fact span{font-size:10px;color:#888;}' +
    'h2{font-size:17px;color:#7c3aed;border-bottom:1px solid #eee;padding-bottom:5px;margin-top:28px;}' +
    '.memory{margin:14px 0;}' +
    '.mtitle{font-weight:bold;font-size:14px;}' +
    '.mdate{font-weight:normal;font-size:11px;color:#999;margin-left:6px;}' +
    '.memory p{font-size:13px;line-height:1.9;margin:6px 0;}' +
    '.footer{text-align:center;font-size:10px;color:#aaa;margin-top:40px;border-top:1px solid #eee;padding-top:12px;}' +
    '@media print{body{padding:0;}}';

  var w = window.open('', '_blank');
  if (!w) { showToast('Popup blocked — allow popups for this site to generate the PDF.', 'error'); return; }
  w.document.write('<!DOCTYPE html><html><head><title>' + monthName + ' — The Book of Vasavi</title><style>' + css + '</style></head><body>' + c +
    '<script>setTimeout(function(){window.print();},400);<\/script></body></html>');
  w.document.close();
}

console.log('memories.js loaded OK');
