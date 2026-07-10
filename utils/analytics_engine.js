/* ============================================
   VASAVI'S LIFE OS — ANALYTICS ENGINE
   utils/analytics_engine.js

   Shared engine used by every module's
   "📊 Data Analytics" view:
   - date helpers
   - calendar heatmaps (like GitHub / Google Pay)
   - month / year navigation
   - AI summaries with rule-based fallback
   ============================================ */

var AE_MONTHS = ['January','February','March','April','May','June',
                 'July','August','September','October','November','December'];
var AE_MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ---- DATE HELPERS ---- */
function aeIso(d) {
  var dt = (d instanceof Date) ? d : new Date(d);
  if (isNaN(dt)) return '';
  return dt.getFullYear() + '-' + pad(dt.getMonth()+1) + '-' + pad(dt.getDate());
}

function aeTodayIso() { return aeIso(new Date()); }

/* ============================================
   PER-MODULE MONTH/YEAR VIEW NAVIGATION
   state.aeView = { timer:{y,m}, habits:{y,m}, ... }
   ============================================ */
function aeGetView(module) {
  var s = window.AppState;
  if (!s.aeView) s.aeView = {};
  if (!s.aeView[module]) {
    var now = new Date();
    s.aeView[module] = { y: now.getFullYear(), m: now.getMonth() };
  }
  return s.aeView[module];
}

function aeShiftMonth(module, delta) {
  var v = aeGetView(module);
  v.m += delta;
  if (v.m < 0)  { v.m = 11; v.y--; }
  if (v.m > 11) { v.m = 0;  v.y++; }
  saveData(); renderPage();
}

function aeShiftYear(module, delta) {
  var v = aeGetView(module);
  v.y += delta;
  saveData(); renderPage();
}

function aeMonthNav(module) {
  var v = aeGetView(module);
  return '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
    '<button class="btn-ghost" style="padding:4px 12px;" onclick="aeShiftMonth(\'' + module + '\',-1)">◀</button>' +
    '<span style="font-size:13px;font-weight:800;">' + AE_MONTHS[v.m] + ' ' + v.y + '</span>' +
    '<button class="btn-ghost" style="padding:4px 12px;" onclick="aeShiftMonth(\'' + module + '\',1)">▶</button>' +
  '</div>';
}

function aeYearNav(module) {
  var v = aeGetView(module);
  return '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
    '<button class="btn-ghost" style="padding:4px 12px;" onclick="aeShiftYear(\'' + module + '\',-1)">◀</button>' +
    '<span style="font-size:13px;font-weight:800;">' + v.y + '</span>' +
    '<button class="btn-ghost" style="padding:4px 12px;" onclick="aeShiftYear(\'' + module + '\',1)">▶</button>' +
  '</div>';
}

/* ============================================
   CALENDAR HEATMAP for one month
   valueMap = { 'YYYY-MM-DD': number }
   colorFn(value) -> css color
   labelFn(value) -> text inside cell ('' = none)
   ============================================ */
function aeCalendarHeatmap(year, month, valueMap, colorFn, labelFn, clickFnName) {
  var daysInMonth = new Date(year, month+1, 0).getDate();
  var firstDay    = new Date(year, month, 1).getDay(); /* 0=Sun */
  var todayIso    = aeTodayIso();

  var h = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">';
  DAYS_SHORT.forEach(function(d) {
    h += '<div style="text-align:center;font-size:9px;color:#556080;font-weight:700;">' + d + '</div>';
  });
  for (var b = 0; b < firstDay; b++) h += '<div></div>';
  for (var d = 1; d <= daysInMonth; d++) {
    var iso = year + '-' + pad(month+1) + '-' + pad(d);
    var val = valueMap[iso] || 0;
    var col = colorFn(val);
    var isToday = iso === todayIso;
    var isFuture = iso > todayIso;
    var lbl = labelFn ? labelFn(val) : (val > 0 ? String(val) : '');
    var click = (clickFnName && !isFuture) ? ' onclick="' + clickFnName + '(\'' + iso + '\')"' : '';
    h += '<div' + click + ' title="' + iso + (val ? ' · ' + val : '') + ((clickFnName && !isFuture)?' — tap to change':'') + '" ' +
      'style="min-height:34px;border-radius:6px;background:' + col + ';' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;' +
      ((clickFnName && !isFuture) ? 'cursor:pointer;' : '') +
      (isToday ? 'outline:2px solid #a855f7;' : '') + '">' +
      '<span style="font-size:9px;color:' + (val>0?'#fff':'#556080') + ';font-weight:700;">' + d + '</span>' +
      (lbl ? '<span style="font-size:8px;color:#fff;">' + lbl + '</span>' : '') +
    '</div>';
  }
  h += '</div>';
  return h;
}

/* ---- MONTH BAR CHART (12 bars for a year) ----
   If module is given, every month bar is CLICKABLE
   and opens that month's detail view. tabKey is the
   AppState key that switches the module to its
   monthly tab (null if same-page). */
function aeYearBarChart(monthVals, highlightMonth, color, suffixFn, module, tabKey) {
  var maxV = Math.max.apply(null, monthVals.concat([1]));
  var h = '<div style="display:flex;align-items:flex-end;gap:4px;height:100px;margin-bottom:6px;">';
  monthVals.forEach(function(v, i) {
    var barH = Math.max(2, Math.round((v/maxV)*80));
    var isNow = i === highlightMonth;
    var click = module ? ' onclick="aeOpenMonth(\'' + module + '\',' + i + (tabKey?',\''+tabKey+'\'':'') + ')"' : '';
    h += '<div' + click + ' title="' + AE_MONTHS[i] + (v>0?' · '+(suffixFn?suffixFn(v):v):'') + (module?' — click to open':'') + '" ' +
      'style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;' + (module?'cursor:pointer;':'') + '">';
    h += '<div style="font-size:8px;color:#8899bb;">' + (v>0 ? (suffixFn?suffixFn(v):v) : '') + '</div>';
    h += '<div style="width:100%;height:' + barH + 'px;background:' + (isNow?'#f59e0b':color) + ';border-radius:3px 3px 0 0;"></div>';
    h += '<div style="font-size:8px;color:' + (module?'#8899bb':'#556080') + ';font-weight:' + (module?'700':'400') + ';">' + AE_MONTHS_SHORT[i] + '</div>';
    h += '</div>';
  });
  h += '</div>';
  if (module) {
    h += '<div style="font-size:9px;color:#556080;text-align:center;margin-bottom:4px;">👆 Tap any month bar to open that month\'s details</div>';
  }
  return h;
}

/* Click on a month bar → open that month's detail view */
function aeOpenMonth(module, monthIdx, tabKey) {
  var v = aeGetView(module);
  v.m = monthIdx;
  if (tabKey) window.AppState[tabKey] = 'monthly';
  saveData(); renderPage();
  /* Scroll up so she sees the month view that just opened */
  var c = document.getElementById('content');
  if (c) c.scrollTop = 0;
  window.scrollTo(0, 0);
}

/* ---- SIMPLE PROGRESS ROW ---- */
function aeBarRow(label, value, max, color, valueText) {
  return '<div class="progress-wrap">' +
    '<div class="progress-label"><span>' + label + '</span>' +
    '<span style="color:' + color + '">' + (valueText || value) + '</span></div>' +
    '<div class="progress-bar"><div class="progress-fill" style="width:' +
      Math.min(100, pct(value, max || 1)) + '%;background:' + color + '"></div></div>' +
  '</div>';
}

/* ============================================
   DATA AGGREGATORS
   ============================================ */

/* Focus sessions → { iso: mins } */
function aeFocusByDate(state) {
  var map = {};
  (state.sessions || state.focusSessions || []).forEach(function(s) {
    if (!s.start) return;
    var iso = aeIso(new Date(s.start));
    if (!iso) return;
    map[iso] = (map[iso]||0) + (s.duration||0);
  });
  return map;
}

/* Gym log → { iso: 1 } */
function aeGymByDate(state) {
  var map = {};
  var log = state.gymLog || {};
  Object.keys(log).forEach(function(k) {
    if (!log[k]) return;
    var iso = aeIso(new Date(k));
    if (iso) map[iso] = 1;
  });
  return map;
}

/* Expenses → { iso: amount } */
function aeSpendByDate(state) {
  var map = {};
  (state.expenses||[]).forEach(function(e) {
    var iso = aeIso(new Date(e.date || Date.now()));
    if (iso) map[iso] = (map[iso]||0) + (e.amount||0);
  });
  return map;
}

/* Language sessions → { iso: mins } (optionally per lang) */
function aeLangByDate(state, lang) {
  var map = {};
  (state.langSessions||[]).forEach(function(s) {
    if (lang && s.lang !== lang) return;
    var iso = aeIso(new Date(s.date));
    if (iso) map[iso] = (map[iso]||0) + (s.mins||0);
  });
  return map;
}

/* Generic: monthly totals for a year from an iso map */
function aeMonthTotals(valueMap, year) {
  var totals = new Array(12).fill(0);
  Object.keys(valueMap).forEach(function(iso) {
    if (parseInt(iso.substring(0,4)) === year) {
      totals[parseInt(iso.substring(5,7))-1] += valueMap[iso];
    }
  });
  return totals;
}

/* Generic: yearly totals { year: total } */
function aeYearTotals(valueMap) {
  var totals = {};
  Object.keys(valueMap).forEach(function(iso) {
    var y = iso.substring(0,4);
    totals[y] = (totals[y]||0) + valueMap[iso];
  });
  return totals;
}

/* Count of active days in a month */
function aeActiveDaysInMonth(valueMap, year, month) {
  var n = 0;
  Object.keys(valueMap).forEach(function(iso) {
    if (parseInt(iso.substring(0,4))===year && parseInt(iso.substring(5,7))===month+1 && valueMap[iso]>0) n++;
  });
  return n;
}

/* Current streak of consecutive days (ending today or yesterday) */
function aeStreak(valueMap) {
  var streak = 0;
  var d = new Date();
  if (!valueMap[aeIso(d)]) d.setDate(d.getDate()-1); /* allow today not yet done */
  while (valueMap[aeIso(d)]) {
    streak++;
    d.setDate(d.getDate()-1);
  }
  return streak;
}

/* FLEXIBLE streak — rest days allowed!
   Counts active days in the trailing run, where a gap
   of up to maxGap missed days does NOT break the streak.
   Perfect for gym (5-6 days/week with rest days). */
function aeStreakFlexible(valueMap, maxGap) {
  maxGap = maxGap || 2;
  var d = new Date();
  /* Find the most recent active day within the allowed gap from today */
  var found = false;
  for (var i = 0; i <= maxGap; i++) {
    if (valueMap[aeIso(d)]) { found = true; break; }
    d.setDate(d.getDate() - 1);
  }
  if (!found) return 0;

  /* Walk backwards counting active days; gaps <= maxGap are fine */
  var streak = 0;
  var gap = 0;
  while (gap <= maxGap) {
    if (valueMap[aeIso(d)]) {
      streak++;
      gap = 0;
    } else {
      gap++;
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

/* Color scales */
function aeFocusColor(mins) {
  return mins>=120?'#10b981':mins>=60?'#06b6d4':mins>=30?'#7c3aed':mins>0?'#a855f7':'#1a1a35';
}
function aeDoneColor(v)  { return v>0?'#10b981':'#1a1a35'; }
function aeSpendColor(amt) {
  return amt>=1000?'#ef4444':amt>=500?'#f59e0b':amt>0?'#10b981':'#1a1a35';
}

/* ============================================
   AI SUMMARY — Groq if key exists, else
   rule-based fallback. Renders into element.
   ============================================ */
function aeAISummary(title, contextText, fallbackText, btnEl, targetElId) {
  var target = document.getElementById(targetElId);
  if (!target) return;
  target.style.display = 'block';

  var showResult = function(text) {
    if (btnEl) { btnEl.disabled = false; }
    target.innerHTML =
      '<div class="card" style="margin-top:10px;border-left:3px solid #a855f7;">' +
        '<div class="card-header">🤖 ' + escHtml(title) + '</div>' +
        '<div style="font-size:12px;line-height:1.8;white-space:pre-wrap;color:#a0aec0;">' +
          escHtml(text) +
        '</div>' +
      '</div>';
  };

  if (typeof getApiKey === 'function' && getApiKey() && typeof groqChat === 'function') {
    if (btnEl) btnEl.disabled = true;
    target.innerHTML = '<div style="padding:10px;font-size:11px;color:#a855f7;">🤖 Analyzing your data...</div>';
    var sys = 'You are Vasavi\'s personal data analyst inside her Life OS. She is 23, Bengaluru, ' +
      'Data Science student hunting for a DS/AI job. Analyze the data given and reply with: ' +
      '1) What went well, 2) Where she overdid or under-performed, 3) Exactly what to reduce or cut, ' +
      '4) Top 3 specific actions for the next period. Use ₹ for money. Be direct, warm, specific. Max 220 words.';
    groqChat(sys, [{ role:'user', text: title + '\n\n' + contextText }], function(reply) {
      showResult(reply || fallbackText);
    });
  } else {
    showResult(fallbackText + '\n\n(Tip: add your Groq API key in AI Assistant for deeper AI-written summaries.)');
  }
}

console.log('analytics_engine.js loaded OK');
