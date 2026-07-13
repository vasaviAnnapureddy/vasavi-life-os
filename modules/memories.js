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
  var h = '';

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
