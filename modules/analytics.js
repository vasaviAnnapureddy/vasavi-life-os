/* ============================================
   VASAVI'S LIFE OS - ANALYTICS MODULE
   modules/analytics.js
   All data connected and live synced
   ============================================ */

function renderAnalytics() {
  var state = window.AppState;
  var tab   = state.analyticsTab || 'daily';
  var h     = '';

  h += '<div class="subtab-bar">';
  [['daily','📅 Daily'],['weekly','📊 Weekly'],['monthly','📈 Monthly'],['yearly','🏆 Yearly']].forEach(function(t) {
    h += '<div class="subtab ' + (tab===t[0]?'active':'') + '" onclick="switchAnalyticsTab(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  h += '</div>';

  if (tab === 'daily')   h += renderAnalyticsDaily(state);
  if (tab === 'weekly')  h += renderAnalyticsWeekly(state);
  if (tab === 'monthly') h += renderAnalyticsMonthly(state);
  if (tab === 'yearly')  h += renderAnalyticsYearly(state);

  return h;
}

function switchAnalyticsTab(tab) {
  window.AppState.analyticsTab = tab;
  renderPage();
}

/* ============================================
   DAILY ANALYTICS
   ============================================ */
function renderAnalyticsDaily(state) {
  var today    = new Date().toISOString().split('T')[0];
  var todayStr = new Date().toDateString();

  /* Focus time - check both sessions and focusSessions */
  var allSessions  = (state.sessions || state.focusSessions || []);
  var todaySessions = allSessions.filter(function(s){
    return s.start && new Date(s.start).toDateString() === todayStr;
  });
  var focusMins = todaySessions.reduce(function(a,s){ return a+(s.duration||0); }, 0);

  /* Habits */
  var habits     = state.habits || [];
  var habitsDone = habits.filter(function(h){ return (h.week||[])[todayIndex()]; }).length;

  /* Goals - daily + category all combined */
  var dailyGoals = Array.isArray(state.goals && state.goals.daily) ? state.goals.daily : [];
  var catGoals   = [];
  if (state.goals && state.goals.categories) {
    Object.values(state.goals.categories).forEach(function(arr) {
      if (Array.isArray(arr)) {
        arr.forEach(function(g) {
          if (g.deadline === today || g.deadline === '') catGoals.push(g);
        });
      }
    });
  }
  var allTodayGoals = dailyGoals.concat(catGoals);
  var goalsDone  = allTodayGoals.filter(function(g){ return g.done; }).length;
  var goalsTotal = allTodayGoals.length;

  /* Reflection */
  var journal    = state.journalEntries || [];
  var todayEntry = journal.find(function(e){ return e.date === today; });

  /* DS Progress */
  var dsDone = Object.values(state.dsProgress || {}).filter(function(v){ return v==='done'; }).length;

  /* Hourly focus filled */
  var hourlyToday = (state.hourlyFocus && state.hourlyFocus[today]) || {};
  var hoursLogged = Object.keys(hourlyToday).filter(function(k){ return hourlyToday[k].trim(); }).length;

  /* Life score calculation */
  var score = 0;
  var maxScore = 100;
  score += Math.round((habitsDone/Math.max(habits.length,1))*25);
  score += focusMins >= 120 ? 25 : Math.round((focusMins/120)*25);
  score += goalsTotal > 0 ? Math.round((goalsDone/goalsTotal)*25) : 0;
  score += todayEntry ? 15 : 0;
  score += dsDone > 0 ? 10 : 0;
  score = Math.min(score, 100);

  var h = '';

  /* Life Score Ring */
  var scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#a855f7' : score >= 40 ? '#f59e0b' : '#ef4444';
  var scoreMsg = score >= 80 ? 'Amazing day! 🔥' : score >= 60 ? 'Good progress! 💪' : score >= 40 ? 'Keep going! ⚡' : 'Start something! 🎯';

  h += '<div class="card" style="text-align:center;margin-bottom:14px;background:linear-gradient(135deg,#0d0d22,#0a1020);">';
  h += '<div style="font-size:10px;color:#8899bb;margin-bottom:8px;">TODAY\'S LIFE SCORE</div>';
  h += '<div style="font-size:64px;font-weight:900;color:' + scoreColor + ';">' + score + '</div>';
  h += '<div style="font-size:12px;color:' + scoreColor + ';margin-bottom:8px;">' + scoreMsg + '</div>';
  h += '<div style="background:#1a1a35;border-radius:8px;height:8px;"><div style="background:' + scoreColor + ';height:8px;border-radius:8px;width:' + score + '%;transition:width 1s;"></div></div>';
  h += '</div>';

  /* Score Breakdown */
  var breakdown = [
    { label:'Habits Done',     val: habitsDone+'/'+habits.length,     pts: Math.round((habitsDone/Math.max(habits.length,1))*25), max:25, color:'#10b981' },
    { label:'Focus Time',      val: focusMins+' mins',                pts: focusMins>=120?25:Math.round((focusMins/120)*25), max:25, color:'#a855f7' },
    { label:'Goals Completed', val: goalsDone+'/'+goalsTotal,         pts: goalsTotal>0?Math.round((goalsDone/goalsTotal)*25):0, max:25, color:'#3b82f6' },
    { label:'Reflection',      val: todayEntry?'✅':'—',               pts: todayEntry?15:0, max:15, color:'#ec4899' },
    { label:'DS Learning',     val: dsDone+' topics done',            pts: dsDone>0?10:0, max:10, color:'#06b6d4' }
  ];

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📊 Score Breakdown</div>';
  breakdown.forEach(function(b) {
    var bpct = Math.round((b.pts/b.max)*100);
    h += '<div style="margin-bottom:12px;">';
    h += '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">';
    h += '<span style="font-size:12px;font-weight:600;">' + b.label + '</span>';
    h += '<div style="display:flex;align-items:center;gap:8px;">';
    h += '<span style="font-size:11px;color:#8899bb;">' + b.val + '</span>';
    h += '<span style="font-size:12px;font-weight:800;color:' + b.color + ';">' + b.pts + '/' + b.max + '</span>';
    h += '</div></div>';
    h += '<div style="background:#1a1a35;border-radius:4px;height:6px;">';
    h += '<div style="background:' + b.color + ';height:6px;border-radius:4px;width:' + bpct + '%;"></div>';
    h += '</div></div>';
  });
  h += '</div>';

  /* Today's Goals */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">🎯 Today\'s Goals (' + goalsDone + '/' + goalsTotal + ' done)</div>';

  /* Quick add goal */
  h += '<div style="display:flex;gap:8px;margin-bottom:12px;">';
  h += '<input id="dash-goal-input" placeholder="Add a goal for today..." style="flex:1;" onkeydown="if(event.key===\'Enter\')addDashGoal()" />';
  h += '<button class="btn-primary" onclick="addDashGoal()" style="font-size:12px;">+ Add</button>';
  h += '</div>';

  if (allTodayGoals.length === 0) {
    h += '<div style="text-align:center;color:#556080;font-size:12px;padding:16px;">No goals yet today. Add one above! 🎯</div>';
  } else {
    allTodayGoals.forEach(function(g, i) {
      h += '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #1a1a35;">';
      h += '<div onclick="toggleDashGoal(' + i + ')" style="width:18px;height:18px;border-radius:50%;border:2px solid ' + (g.done?'#10b981':'#556080') + ';background:' + (g.done?'#10b981':'transparent') + ';cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;">';
      if (g.done) h += '<span style="color:#fff;font-size:10px;">✓</span>';
      h += '</div>';
      h += '<span style="font-size:12px;flex:1;text-decoration:' + (g.done?'line-through':'none') + ';color:' + (g.done?'#556080':'#f0f0ff') + ';">' + escHtml(g.text||g.name||'') + '</span>';
      h += '</div>';
    });
  }
  h += '</div>';

  /* Today's Focus Sessions */
  if (todaySessions.length > 0) {
    h += '<div class="card" style="margin-bottom:14px;">';
    h += '<div class="card-header">⏱️ Focus Sessions Today — ' + focusMins + ' mins total</div>';
    todaySessions.forEach(function(s) {
      h += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #1a1a35;font-size:11px;">';
      h += '<span>' + escHtml(s.what||'Focus session') + '</span>';
      h += '<span style="color:#a855f7;">' + (s.duration||0) + ' mins</span>';
      h += '</div>';
    });
    h += '</div>';
  }

  /* Hourly Reflection Summary */
  if (hoursLogged > 0) {
    h += '<div class="card">';
    h += '<div class="card-header">📋 Hourly Reflection — ' + hoursLogged + ' hours logged</div>';
    Object.keys(hourlyToday).sort().forEach(function(k) {
      if (hourlyToday[k].trim()) {
        h += '<div style="display:flex;gap:10px;padding:5px 0;font-size:11px;">';
        h += '<span style="color:#a855f7;font-weight:700;width:50px;">' + k.toUpperCase() + '</span>';
        h += '<span>' + escHtml(hourlyToday[k]) + '</span>';
        h += '</div>';
      }
    });
    h += '</div>';
  }

  return h;
}

/* ============================================
   ADD GOAL FROM DASHBOARD
   ============================================ */
function addDashGoal() {
  var el = document.getElementById('dash-goal-input');
  if (!el || !el.value.trim()) return;
  if (!window.AppState.goals) window.AppState.goals = {};
  if (!Array.isArray(window.AppState.goals.daily)) window.AppState.goals.daily = [];
  window.AppState.goals.daily.push({
    id: Date.now(),
    text: el.value.trim(),
    priority: 'Medium',
    deadline: new Date().toISOString().split('T')[0],
    done: false,
    createdAt: new Date().toISOString()
  });
  el.value = '';
  saveData(); renderPage();
  showToast('Goal added! ✅');
}

function toggleDashGoal(idx) {
  var daily = window.AppState.goals && window.AppState.goals.daily;
  if (!Array.isArray(daily) || !daily[idx]) return;
  daily[idx].done = !daily[idx].done;
  saveData(); renderPage();
}

/* ============================================
   WEEKLY ANALYTICS
   ============================================ */
function renderAnalyticsWeekly(state) {
  var now  = new Date();
  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var weekData = [];

  for (var i = 0; i < 7; i++) {
    var d = new Date(now);
    d.setDate(now.getDate() - now.getDay() + i);
    var dStr    = d.toDateString();
    var dIso    = d.toISOString().split('T')[0];
    var allSess = (state.sessions || state.focusSessions || []);
    var sessions = allSess.filter(function(s){ return s.start && new Date(s.start).toDateString() === dStr; });
    var focusMins = sessions.reduce(function(a,s){ return a+(s.duration||0); }, 0);
    var journal = state.journalEntries || [];
    var reflected = !!journal.find(function(e){ return e.date === dIso; });
    var dailyGoals = Array.isArray(state.goals && state.goals.daily) ? state.goals.daily : [];
    var goalsDone = dailyGoals.filter(function(g){ return g.done && g.deadline === dIso; }).length;
    weekData.push({ day:days[d.getDay()], date:dStr, focus:focusMins, reflected:reflected, goalsDone:goalsDone });
  }

  var h = '';
  var maxFocus = Math.max.apply(null, weekData.map(function(d){ return d.focus; })) || 120;

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">⏱️ Focus Time — Last 7 Days</div>';
  h += '<div style="display:flex;align-items:flex-end;gap:8px;height:120px;padding:10px 0;">';
  weekData.forEach(function(d) {
    var barH = Math.max(4, Math.round((d.focus/Math.max(maxFocus,120))*100));
    var isToday = d.date === new Date().toDateString();
    var col = d.focus >= 120 ? '#10b981' : d.focus >= 60 ? '#a855f7' : d.focus > 0 ? '#3b82f6' : '#1a1a35';
    h += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">';
    h += '<div style="font-size:9px;color:#8899bb;">' + (d.focus>0?d.focus+'m':'') + '</div>';
    h += '<div style="width:100%;height:' + barH + 'px;background:' + col + ';border-radius:4px 4px 0 0;"></div>';
    h += '<div style="font-size:9px;color:' + (isToday?'#a855f7':'#556080') + ';font-weight:' + (isToday?'700':'400') + ';">' + d.day + '</div>';
    h += '</div>';
  });
  h += '</div></div>';

  var totalFocus = weekData.reduce(function(a,d){ return a+d.focus; }, 0);
  var daysReflected = weekData.filter(function(d){ return d.reflected; }).length;
  var bestDay = weekData.reduce(function(b,d){ return d.focus>b.focus?d:b; }, weekData[0]);

  /* Finance this week */
  var weekStart = new Date(now); weekStart.setDate(now.getDate()-now.getDay());
  var weekExpenses = (state.expenses||[]).filter(function(e){
    return e.date && new Date(e.date) >= weekStart;
  });
  var weekSpend = weekExpenses.reduce(function(a,e){ return a+(e.amount||0); }, 0);
  var weekBudget = state.weeklyBudget || 3000;

  /* Jobs this week */
  var jobs = state.jobs || [];
  var weekJobs = jobs.filter(function(j){
    return j.appliedDate && new Date(j.appliedDate) >= weekStart;
  });
  var interviews = jobs.filter(function(j){ return j.status==='Interview'; }).length;
  var offers     = jobs.filter(function(j){ return j.status==='Offer'; }).length;

  h += '<div class="grid-3" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + Math.round(totalFocus/60) + 'h</div><div class="stat-label">Total Focus</div><div class="stat-sub">' + totalFocus + ' mins</div></div>';
  h += '<div class="stat-card" style="--stat-color:#ec4899"><div class="stat-value">' + daysReflected + '/7</div><div class="stat-label">Days Reflected</div></div>';
  h += '<div class="stat-card" style="--stat-color:#06b6d4"><div class="stat-value">' + (bestDay?bestDay.day:'—') + '</div><div class="stat-label">Best Focus Day</div><div class="stat-sub">' + (bestDay?bestDay.focus+' mins':'') + '</div></div>';
  h += '</div>';

  /* Finance Card */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">💰 Finance This Week</div>';
  h += '<div class="grid-2" style="margin-bottom:10px;">';
  h += '<div style="text-align:center;"><div style="font-size:22px;font-weight:900;color:' + (weekSpend>weekBudget?'#ef4444':'#10b981') + ';">₹' + weekSpend + '</div><div style="font-size:10px;color:#8899bb;">Spent this week</div></div>';
  h += '<div style="text-align:center;"><div style="font-size:22px;font-weight:900;color:#f59e0b;">₹' + Math.max(0,weekBudget-weekSpend) + '</div><div style="font-size:10px;color:#8899bb;">Remaining (₹' + weekBudget + ' budget)</div></div>';
  h += '</div>';
  if (weekExpenses.length > 0) {
    h += '<div style="font-size:10px;color:#8899bb;margin-bottom:6px;">' + weekExpenses.length + ' transactions this week</div>';
    /* Category breakdown */
    var cats = {};
    weekExpenses.forEach(function(e){ cats[e.category||'Other'] = (cats[e.category||'Other']||0) + (e.amount||0); });
    Object.keys(cats).sort(function(a,b){ return cats[b]-cats[a]; }).slice(0,4).forEach(function(cat) {
      h += '<div style="display:flex;justify-content:space-between;font-size:11px;padding:3px 0;">';
      h += '<span>' + cat + '</span><span style="color:#f59e0b;">₹' + cats[cat] + '</span>';
      h += '</div>';
    });
  } else {
    h += '<div style="font-size:11px;color:#556080;text-align:center;">No expenses logged this week. Log in Finance OS!</div>';
  }
  h += '</div>';

  /* Jobs Card */
  h += '<div class="card">';
  h += '<div class="card-header">💼 Job Hunt This Week</div>';
  h += '<div class="grid-3" style="margin-bottom:10px;">';
  h += '<div style="text-align:center;"><div style="font-size:20px;font-weight:900;color:#a855f7;">' + weekJobs.length + '</div><div style="font-size:10px;color:#8899bb;">Applied</div></div>';
  h += '<div style="text-align:center;"><div style="font-size:20px;font-weight:900;color:#f59e0b;">' + interviews + '</div><div style="font-size:10px;color:#8899bb;">Interviews</div></div>';
  h += '<div style="text-align:center;"><div style="font-size:20px;font-weight:900;color:#10b981;">' + offers + '</div><div style="font-size:10px;color:#8899bb;">Offers</div></div>';
  h += '</div>';
  if (jobs.length === 0) {
    h += '<div style="font-size:11px;color:#556080;text-align:center;">No applications yet. Start applying in Job Tracker!</div>';
  } else {
    h += '<div style="font-size:11px;color:#8899bb;">' + jobs.length + ' total applications tracked</div>';
  }
  h += '</div>';

  return h;
}

/* ============================================
   MONTHLY ANALYTICS
   ============================================ */
function renderAnalyticsMonthly(state) {
  var now   = new Date();
  var month = now.getMonth();
  var year  = now.getFullYear();
  var daysInMonth = new Date(year, month+1, 0).getDate();

  var allSess = state.sessions || state.focusSessions || [];
  var totalFocus = 0;
  var activeDays = 0;

  for (var d = 1; d <= daysInMonth; d++) {
    var date = new Date(year, month, d);
    var dStr = date.toDateString();
    var dayMins = allSess.filter(function(s){ return s.start && new Date(s.start).toDateString()===dStr; })
                         .reduce(function(a,s){ return a+(s.duration||0); }, 0);
    if (dayMins > 0) activeDays++;
    totalFocus += dayMins;
  }

  var habits     = state.habits || [];
  var habitsAvg  = habits.length > 0 ? Math.round(habits.reduce(function(a,h){ return a+(h.week||[]).filter(Boolean).length; },0)/habits.length*100/7) : 0;

  var h = '';
  h += '<div class="grid-2" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + Math.round(totalFocus/60) + 'h</div><div class="stat-label">Month Focus</div></div>';
  h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">' + activeDays + '</div><div class="stat-label">Active Days</div></div>';
  h += '<div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-value">' + habitsAvg + '%</div><div class="stat-label">Habit Rate</div></div>';
  h += '<div class="stat-card" style="--stat-color:#06b6d4"><div class="stat-value">' + daysInMonth + '</div><div class="stat-label">Days in Month</div></div>';
  h += '</div>';

  h += '<div class="card">';
  h += '<div class="card-header">Keep going Vasavi! Every day counts. 💜</div>';
  h += '<div style="font-size:12px;line-height:2;color:#a0aec0;">';
  h += '• ' + activeDays + ' out of ' + daysInMonth + ' days with focus sessions<br>';
  h += '• Average: ' + (activeDays > 0 ? Math.round(totalFocus/activeDays) : 0) + ' mins per active day<br>';
  h += '• Habit consistency: ' + habitsAvg + '%';
  h += '</div></div>';

  return h;
}

/* ============================================
   YEARLY ANALYTICS
   ============================================ */
function renderAnalyticsYearly(state) {
  var h = '';
  var now  = new Date();
  var year = now.getFullYear();

  /* Total focus all time */
  var allSess   = state.sessions || state.focusSessions || [];
  var totalMins = allSess.reduce(function(a,s){ return a+(s.duration||0); }, 0);

  /* Total expenses all time */
  var allExpenses = state.expenses || [];
  var totalSpend  = allExpenses.reduce(function(a,e){ return a+(e.amount||0); }, 0);

  /* Jobs all time */
  var jobs      = state.jobs || [];
  var jobsDone  = jobs.filter(function(j){ return j.status==='Offer'; }).length;

  /* Habits */
  var habits    = state.habits || [];
  var totalTicks= habits.reduce(function(a,h){ return a+(h.week||[]).filter(Boolean).length; }, 0);

  /* Goals completed */
  var daily     = Array.isArray(state.goals&&state.goals.daily) ? state.goals.daily : [];
  var goalsDone = daily.filter(function(g){ return g.done; }).length;

  h += '<div class="card" style="margin-bottom:14px;background:linear-gradient(135deg,#0d0d22,#0a1020);">';
  h += '<div class="card-header">🏆 ' + year + ' — Your Year So Far</div>';
  h += '<div class="grid-2" style="margin-bottom:14px;">';
  h += '<div style="text-align:center;padding:12px;"><div style="font-size:28px;font-weight:900;color:#a855f7;">' + Math.round(totalMins/60) + 'h</div><div style="font-size:11px;color:#8899bb;">Total Focus Time</div></div>';
  h += '<div style="text-align:center;padding:12px;"><div style="font-size:28px;font-weight:900;color:#10b981;">' + totalTicks + '</div><div style="font-size:11px;color:#8899bb;">Habit Completions</div></div>';
  h += '<div style="text-align:center;padding:12px;"><div style="font-size:28px;font-weight:900;color:#f59e0b;">₹' + totalSpend + '</div><div style="font-size:11px;color:#8899bb;">Total Tracked Spend</div></div>';
  h += '<div style="text-align:center;padding:12px;"><div style="font-size:28px;font-weight:900;color:#3b82f6;">' + jobs.length + '</div><div style="font-size:11px;color:#8899bb;">Jobs Applied</div></div>';
  h += '</div>';

  /* Finance yearly breakdown by month */
  h += '<div class="card-header" style="margin-bottom:8px;">💰 Spending by Month</div>';
  var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var monthSpend = new Array(12).fill(0);
  allExpenses.forEach(function(e) {
    if (e.date) {
      var m = new Date(e.date).getMonth();
      monthSpend[m] += (e.amount||0);
    }
  });
  var maxSpend = Math.max.apply(null, monthSpend) || 1;
  h += '<div style="display:flex;align-items:flex-end;gap:4px;height:80px;margin-bottom:8px;">';
  monthSpend.forEach(function(spend, i) {
    var barH = Math.max(2, Math.round((spend/maxSpend)*70));
    var isNow = i === now.getMonth();
    h += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;">';
    h += '<div style="width:100%;height:' + barH + 'px;background:' + (isNow?'#f59e0b':'#3b82f6') + ';border-radius:3px 3px 0 0;"></div>';
    h += '<div style="font-size:8px;color:#556080;">' + monthNames[i] + '</div>';
    h += '</div>';
  });
  h += '</div>';
  h += '</div>';

  h += '<div class="card">';
  h += '<div style="font-size:12px;color:#a855f7;font-weight:700;text-align:center;padding:10px;">';
  h += 'You are building your life, Vasavi.<br>One day at a time. 💜';
  h += '</div></div>';
  return h;
}

console.log('analytics.js loaded OK');