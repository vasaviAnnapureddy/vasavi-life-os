/* ============================================
   VASAVI'S LIFE OS - ANALYTICS MODULE
   modules/analytics.js
   Daily / Weekly / Monthly / Yearly views
   ============================================ */

function renderAnalytics() {
  var state = window.AppState;
  var tab   = state.analyticsTab || 'daily';
  var h     = '';

  /* Tabs */
  h += '<div class="subtab-bar">';
  [['daily','📅 Daily'],['weekly','📊 Weekly'],['monthly','📈 Monthly'],['yearly','🏆 Yearly']].forEach(function(t) {
    h += '<div class="subtab ' + (tab === t[0] ? 'active' : '') + '" onclick="switchAnalyticsTab(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  h += '</div>';

  if (tab === 'daily')   h += renderAnalyticsDaily(state);
  if (tab === 'weekly')  h += renderAnalyticsWeekly(state);
  if (tab === 'monthly') h += renderAnalyticsMonthly(state);
  if (tab === 'yearly')  h += renderAnalyticsYearly(state);

  return h;
}

/* ---- DAILY ---- */
function renderAnalyticsDaily(state) {
  var h = '';
  var today = todayString();
  var ls    = typeof calcLifeScore === 'function' ? calcLifeScore() : 0;
  var lsColor = ls >= 70 ? '#10b981' : ls >= 40 ? '#f59e0b' : '#ef4444';
  var lsMsg   = ls >= 70 ? 'Vasavi is winning 🔥' : ls >= 40 ? 'In progress. Keep going.' : '⚠️ Emergency: pick 1 task';

  /* Life Score card */
  h += '<div style="background:linear-gradient(135deg,#1a0533,#0a1020);border-radius:12px;padding:20px;text-align:center;margin-bottom:14px;">';
  h += '<div style="font-size:10px;color:#a855f7;font-weight:800;margin-bottom:4px;">TODAY\'S LIFE SCORE</div>';
  h += '<div style="font-size:64px;font-weight:900;color:' + lsColor + ';line-height:1;">' + ls + '</div>';
  h += '<div style="font-size:12px;color:#a0aec0;margin-top:6px;">' + lsMsg + '</div>';
  h += '<div style="margin-top:14px;background:#1a1a35;border-radius:99px;height:12px;">';
  h += '<div style="height:12px;border-radius:99px;background:' + lsColor + ';width:' + ls + '%;transition:width .4s;"></div>';
  h += '</div></div>';

  /* Score breakdown */
  var habits    = state.habits || [];
  var todayIdx  = todayIndex();
  var habitsDone = habits.filter(function(h){ return (h.week||[])[todayIdx]; }).length;
  var sessions  = (state.sessions || []).filter(function(s){ return new Date(s.start).toDateString() === today; });
  var focusMins = sessions.reduce(function(a,s){ return a+s.duration; }, 0);
  var tasks     = state.goals || {};
  var todayTasks = (tasks.daily || []);
  var tasksDone  = todayTasks.filter(function(t){ return t.done; }).length;
  var expenses   = (state.expenses || []).filter(function(e){ return e.date === today; }).length;
  var dsDone     = Object.values(state.dsProgress || {}).filter(function(v){ return v === 'done'; }).length;
  var todayEntry = (state.journalEntries || []).find(function(e){ return e.date === today; });
  var langToday  = (state.langSessions || []).filter(function(s){ return s.date === today; }).length;

  var breakdown = [
    { label:'Habits Done',     val: habitsDone + '/' + habits.length, pts: Math.round((habitsDone / Math.max(habits.length,1)) * 20), max:20, color:'#10b981' },
    { label:'Focus Time',      val: focusMins + ' mins',               pts: focusMins >= 120 ? 20 : Math.round((focusMins/120)*20), max:20, color:'#a855f7' },
    { label:'Tasks Done',      val: tasksDone + '/' + todayTasks.length, pts: Math.round((tasksDone/Math.max(todayTasks.length,1))*20), max:20, color:'#3b82f6' },
    { label:'Finance Logged',  val: expenses > 0 ? '✅' : '—',          pts: expenses > 0 ? 10 : 0, max:10, color:'#f59e0b' },
    { label:'Reflection Done', val: todayEntry ? '✅' : '—',             pts: todayEntry ? 10 : 0, max:10, color:'#ec4899' },
    { label:'DS / Learning',   val: dsDone + ' days done',              pts: dsDone > 0 ? 15 : 0, max:15, color:'#06b6d4' },
    { label:'Language Session',val: langToday > 0 ? '✅' : '—',          pts: langToday > 0 ? 5 : 0, max:5, color:'#f97316' }
  ];

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📊 Score Breakdown</div>';
  breakdown.forEach(function(b) {
    var pct = Math.round((b.pts / b.max) * 100);
    h += '<div style="margin-bottom:12px;">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">';
    h += '<span style="font-size:12px;font-weight:600;">' + b.label + '</span>';
    h += '<div style="display:flex;align-items:center;gap:8px;">';
    h += '<span style="font-size:11px;color:#8899bb;">' + b.val + '</span>';
    h += '<span style="font-size:12px;font-weight:800;color:' + b.color + ';">' + b.pts + '/' + b.max + '</span>';
    h += '</div></div>';
    h += '<div style="background:#1a1a35;border-radius:99px;height:6px;">';
    h += '<div style="height:6px;border-radius:99px;background:' + b.color + ';width:' + pct + '%;"></div>';
    h += '</div></div>';
  });
  h += '</div>';

  /* Focus sessions today */
  if (sessions.length > 0) {
    h += '<div class="card" style="margin-bottom:14px;">';
    h += '<div class="card-header">⏱ Focus Sessions Today</div>';
    sessions.forEach(function(s) {
      h += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1a1a35;font-size:12px;">';
      h += '<span>' + escHtml(s.topic || 'Focus') + '</span>';
      h += '<span style="color:#a855f7;font-weight:700;">' + s.duration + ' mins</span>';
      h += '</div>';
    });
    h += '<div style="text-align:right;font-size:13px;font-weight:800;color:#10b981;margin-top:8px;">Total: ' + focusMins + ' mins</div>';
    h += '</div>';
  }

  return h;
}

/* ---- WEEKLY ---- */
function renderAnalyticsWeekly(state) {
  var h = '';
  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var today = new Date();
  var dayOfWeek = today.getDay();

  /* Build last 7 days data */
  var weekData = [];
  for (var i = 6; i >= 0; i--) {
    var d = new Date(today);
    d.setDate(today.getDate() - i);
    var dStr = d.toDateString();
    var sessions = (state.sessions || []).filter(function(s){ return new Date(s.start).toDateString() === dStr; });
    var focusMins = sessions.reduce(function(a,s){ return a+s.duration; }, 0);
    var expenses  = (state.expenses || []).filter(function(e){ return e.date === dStr; });
    var totalSpend = expenses.reduce(function(a,e){ return a+(e.amount||0); }, 0);
    var entry = (state.journalEntries || []).find(function(e){ return e.date === dStr; });
    weekData.push({ day: days[d.getDay()], date: dStr, focus: focusMins, spend: totalSpend, reflected: !!entry });
  }

  /* Bar chart — focus hours */
  var maxFocus = Math.max.apply(null, weekData.map(function(d){ return d.focus; })) || 1;
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">⏱ Focus Time — Last 7 Days</div>';
  h += '<div style="display:flex;gap:6px;align-items:flex-end;height:100px;margin:12px 0;">';
  weekData.forEach(function(d) {
    var barH = Math.max(4, Math.round((d.focus / Math.max(maxFocus, 120)) * 90));
    var isToday = d.date === today.toDateString();
    h += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">';
    h += '<div style="font-size:9px;color:#8899bb;">' + (d.focus >= 60 ? Math.round(d.focus/60) + 'h' : d.focus > 0 ? d.focus + 'm' : '') + '</div>';
    h += '<div style="width:100%;border-radius:4px 4px 0 0;background:' + (isToday ? '#a855f7' : '#3b82f6') + ';height:' + barH + 'px;min-height:4px;"></div>';
    h += '<div style="font-size:9px;color:' + (isToday ? '#a855f7' : '#8899bb') + ';font-weight:' + (isToday ? '800' : '400') + ';">' + d.day + '</div>';
    h += '</div>';
  });
  h += '</div></div>';

  /* Summary stats */
  var totalFocus = weekData.reduce(function(a,d){ return a+d.focus; }, 0);
  var totalSpend = weekData.reduce(function(a,d){ return a+d.spend; }, 0);
  var reflectedDays = weekData.filter(function(d){ return d.reflected; }).length;
  var bestDay = weekData.reduce(function(best, d){ return d.focus > best.focus ? d : best; }, weekData[0]);

  h += '<div class="grid-2" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + Math.round(totalFocus/60) + 'h</div><div class="stat-label">Total Focus</div><div class="stat-sub">' + totalFocus + ' minutes</div></div>';
  h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">' + reflectedDays + '/7</div><div class="stat-label">Days Reflected</div></div>';
  h += '</div>';
  h += '<div class="grid-2" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-value">₹' + formatRupees(totalSpend) + '</div><div class="stat-label">Week Spend</div></div>';
  h += '<div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-value">' + (bestDay ? bestDay.day : '—') + '</div><div class="stat-label">Best Focus Day</div><div class="stat-sub">' + (bestDay ? bestDay.focus + ' mins' : '') + '</div></div>';
  h += '</div>';

  /* Habits consistency */
  var habits = state.habits || [];
  if (habits.length > 0) {
    h += '<div class="card" style="margin-bottom:14px;">';
    h += '<div class="card-header">✅ Habits Consistency This Week</div>';
    habits.forEach(function(habit) {
      var weekDone = (habit.week || []).filter(Boolean).length;
      var pct = Math.round((weekDone / 7) * 100);
      h += '<div style="margin-bottom:10px;">';
      h += '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">';
      h += '<span style="font-size:12px;">' + escHtml(habit.name) + '</span>';
      h += '<span style="font-size:12px;font-weight:700;color:' + (pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444') + ';">' + weekDone + '/7</span>';
      h += '</div>';
      h += '<div style="background:#1a1a35;border-radius:99px;height:6px;">';
      h += '<div style="height:6px;border-radius:99px;background:' + (pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444') + ';width:' + pct + '%;"></div>';
      h += '</div></div>';
    });
    h += '</div>';
  }

  /* Auto Sunday review */
  if (new Date().getDay() === 0) {
    var weekGoalsDone = (state.goals.weekly || []).filter(function(g){ return g.done; }).length;
    var weekGoalsTotal = (state.goals.weekly || []).length;
    h += '<div style="background:#1a1500;border:1px solid #d97706;border-radius:10px;padding:14px;margin-bottom:14px;">';
    h += '<div style="font-size:10px;color:#f59e0b;font-weight:800;margin-bottom:8px;">☀️ SUNDAY WEEKLY REVIEW</div>';
    h += '<div style="font-size:12px;line-height:1.7;">';
    h += '✅ Weekly goals: ' + weekGoalsDone + '/' + weekGoalsTotal + '<br>';
    h += '⏱ Total focus: ' + Math.round(totalFocus/60) + ' hours<br>';
    h += '💰 Spent: ₹' + formatRupees(totalSpend) + '<br>';
    h += '📔 Reflected: ' + reflectedDays + '/7 days<br>';
    h += '🎯 Best day: ' + (bestDay ? bestDay.day + ' (' + bestDay.focus + ' mins focus)' : '—');
    h += '</div></div>';
  }

  return h;
}

/* ---- MONTHLY ---- */
function renderAnalyticsMonthly(state) {
  var h = '';
  var now    = new Date();
  var month  = now.getMonth();
  var year   = now.getFullYear();

  var monthExpenses = (state.expenses || []).filter(function(e) {
    var d = new Date(e.date || Date.now());
    return d.getMonth() === month && d.getFullYear() === year;
  });
  var totalSpend = monthExpenses.reduce(function(a,e){ return a+(e.amount||0); }, 0);

  var monthSessions = (state.sessions || []).filter(function(s) {
    var d = new Date(s.start);
    return d.getMonth() === month && d.getFullYear() === year;
  });
  var monthFocus = monthSessions.reduce(function(a,s){ return a+s.duration; }, 0);

  var dsDone = Object.values(state.dsProgress || {}).filter(function(v){ return v === 'done'; }).length;
  var jobsApplied = (state.jobs || []).filter(function(j){
    var d = new Date(j.date);
    return d.getMonth() === month && d.getFullYear() === year;
  }).length;
  var langSessions = (state.langSessions || []).filter(function(s) {
    var d = new Date(s.date);
    return d.getMonth() === month && d.getFullYear() === year;
  }).length;
  var journalEntries = (state.journalEntries || []).filter(function(e) {
    var d = new Date(e.date);
    return d.getMonth() === month && d.getFullYear() === year;
  }).length;

  var monthName = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  h += '<div style="background:linear-gradient(135deg,#1a0533,#0a1020);border-radius:12px;padding:16px;margin-bottom:14px;">';
  h += '<div style="font-size:10px;color:#a855f7;font-weight:800;">MONTHLY REPORT</div>';
  h += '<div style="font-size:18px;font-weight:800;">' + monthName + '</div>';
  h += '</div>';

  var metrics = [
    { icon:'⏱', label:'Focus Hours',     val: Math.round(monthFocus/60) + 'h', sub: monthFocus + ' total mins', color:'#a855f7' },
    { icon:'💻', label:'DS Days Done',    val: dsDone + '/8', sub:'roadmap progress', color:'#3b82f6' },
    { icon:'💼', label:'Jobs Applied',    val: jobsApplied, sub:'this month', color:'#10b981' },
    { icon:'🗣', label:'Lang Sessions',   val: langSessions, sub:'English + Korean', color:'#f59e0b' },
    { icon:'📔', label:'Journal Entries', val: journalEntries, sub:'days reflected', color:'#ec4899' },
    { icon:'💰', label:'Total Spent',     val: '₹' + formatRupees(totalSpend), sub:'this month', color:'#ef4444' }
  ];

  h += '<div class="grid-3" style="margin-bottom:14px;">';
  metrics.forEach(function(m) {
    h += '<div class="stat-card" style="--stat-color:' + m.color + '">';
    h += '<div style="font-size:20px;">' + m.icon + '</div>';
    h += '<div class="stat-value">' + m.val + '</div>';
    h += '<div class="stat-label">' + m.label + '</div>';
    h += '<div class="stat-sub">' + m.sub + '</div>';
    h += '</div>';
  });
  h += '</div>';

  /* Expense by category */
  if (monthExpenses.length > 0) {
    var catTotals = {};
    monthExpenses.forEach(function(e) { catTotals[e.cat] = (catTotals[e.cat] || 0) + e.amount; });
    h += '<div class="card" style="margin-bottom:14px;">';
    h += '<div class="card-header">💰 Spend by Category</div>';
    Object.keys(catTotals).sort(function(a,b){ return catTotals[b]-catTotals[a]; }).forEach(function(cat) {
      var pct = Math.round((catTotals[cat] / totalSpend) * 100);
      h += '<div style="margin-bottom:10px;">';
      h += '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">';
      h += '<span style="font-size:12px;">' + escHtml(cat) + '</span>';
      h += '<span style="font-size:12px;font-weight:700;">₹' + formatRupees(catTotals[cat]) + ' <span style="color:#8899bb;font-size:10px;">(' + pct + '%)</span></span>';
      h += '</div>';
      h += '<div style="background:#1a1a35;border-radius:99px;height:6px;">';
      h += '<div style="height:6px;border-radius:99px;background:#a855f7;width:' + pct + '%;"></div>';
      h += '</div></div>';
    });
    h += '</div>';
  }

  return h;
}

/* ---- YEARLY ---- */
function renderAnalyticsYearly(state) {
  var h = '';
  var year = new Date().getFullYear();

  var yearExpenses = (state.expenses || []).filter(function(e){ return new Date(e.date).getFullYear() === year; });
  var yearSpend    = yearExpenses.reduce(function(a,e){ return a+(e.amount||0); }, 0);
  var yearFocus    = (state.sessions || []).filter(function(s){ return new Date(s.start).getFullYear() === year; }).reduce(function(a,s){ return a+s.duration; }, 0);
  var yearJobs     = (state.jobs || []).filter(function(j){ return new Date(j.date).getFullYear() === year; }).length;
  var yearWords    = ((state.langWords || {}).en || []).length + ((state.langWords || {}).ko || []).length;
  var dsDone       = Object.values(state.dsProgress || {}).filter(function(v){ return v === 'done'; }).length;

  h += '<div style="background:linear-gradient(135deg,#0a1533,#1a0533);border-radius:12px;padding:20px;margin-bottom:14px;">';
  h += '<div style="font-size:10px;color:#a855f7;font-weight:800;">YEAR IN REVIEW — ' + year + '</div>';
  h += '<div style="font-size:20px;font-weight:900;margin-top:4px;">Vasavi\'s Progress Story</div>';
  h += '</div>';

  var cards = [
    { val: Math.round(yearFocus/60) + 'h', label: 'Focus Hours', icon:'⏱', color:'#a855f7' },
    { val: dsDone + '/8', label: 'DS Days Done', icon:'💻', color:'#3b82f6' },
    { val: yearJobs, label: 'Jobs Applied', icon:'💼', color:'#10b981' },
    { val: yearWords, label: 'Words Learned', icon:'🗣', color:'#f59e0b' },
    { val: '₹' + formatRupees(yearSpend), label: 'Total Spent', icon:'💰', color:'#ef4444' },
    { val: (state.journalEntries || []).length, label: 'Journal Entries', icon:'📔', color:'#ec4899' }
  ];

  h += '<div class="grid-3" style="margin-bottom:14px;">';
  cards.forEach(function(c) {
    h += '<div class="stat-card" style="--stat-color:' + c.color + '"><div style="font-size:20px;">' + c.icon + '</div><div class="stat-value">' + c.val + '</div><div class="stat-label">' + c.label + '</div></div>';
  });
  h += '</div>';

  /* Achievements */
  h += '<div class="card">';
  h += '<div class="card-header">🏆 Achievements Unlocked</div>';
  var achievements = [];
  if (dsDone >= 1) achievements.push({ icon:'📚', text:'Started DS Roadmap — the hardest step is first.' });
  if (dsDone >= 5) achievements.push({ icon:'🔥', text:'5 DS days done — you are building momentum.' });
  if (dsDone >= 8) achievements.push({ icon:'🏆', text:'10-Day DS Roadmap Complete! Interview-ready.' });
  if (yearJobs >= 1) achievements.push({ icon:'💼', text:'First job application sent — action taker!' });
  if (yearJobs >= 10) achievements.push({ icon:'🚀', text:'10+ applications — you are in the game.' });
  if (Math.round(yearFocus/60) >= 10) achievements.push({ icon:'⏱', text:'10+ focus hours logged — discipline building.' });
  if ((state.journalEntries || []).length >= 7) achievements.push({ icon:'📔', text:'7-day reflection streak — self-awareness growing.' });
  if (yearWords >= 50) achievements.push({ icon:'🌍', text:'50 words learned — multilingual in progress!' });

  if (achievements.length === 0) {
    h += '<div style="font-size:12px;color:#8899bb;padding:10px;">Your achievements will appear here as you progress. Start using the app daily!</div>';
  } else {
    achievements.forEach(function(a) {
      h += '<div style="display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid #1a1a35;">';
      h += '<span style="font-size:20px;">' + a.icon + '</span>';
      h += '<span style="font-size:12px;line-height:1.5;">' + a.text + '</span>';
      h += '</div>';
    });
  }
  h += '</div>';

  return h;
}

/* ============================================
   ACTIONS
   ============================================ */
function switchAnalyticsTab(tab) { window.AppState.analyticsTab = tab; saveData(); renderPage(); }

console.log('analytics.js loaded OK');