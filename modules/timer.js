/* ============================================
   VASAVI'S LIFE OS - FOCUS TIMER MODULE
   modules/timer.js — FIXED VERSION
   ============================================ */

var timerInterval = null;

function renderTimer() {
  var state     = window.AppState;

  /* Support both sessions and focusSessions */
  var allSess   = (state.sessions || state.focusSessions || []);
  var todayStr  = new Date().toDateString();
  var todaySess = allSess.filter(function(s) {
    return s.start && new Date(s.start).toDateString() === todayStr;
  });
  var todayMins = todaySess.reduce(function(a,s){ return a+(s.duration||0); },0);
  var totalMins = allSess.reduce(function(a,s){ return a+(s.duration||0); },0);
  var isActive  = !!state.activeSess;
  var secs      = state.timerSecs || 0;

  /* Restore interval if active session exists but interval stopped */
  if (isActive && !timerInterval) {
    var elapsed = Math.floor((Date.now() - state.activeSess) / 1000);
    state.timerSecs = elapsed;
    timerInterval = setInterval(tickTimer, 1000);
  }

  var h = '';

  /* ---- VIEW SWITCHER: Timer | Analytics | Alerts ---- */
  var view = state.timerView || 'timer';
  h += '<div class="subtab-bar">';
  [['timer','⏱ Timer'],['analytics','📊 Data Analytics'],['alerts','🔔 Alerts']].forEach(function(t) {
    h += '<div class="subtab ' + (view===t[0]?'active':'') + '" onclick="switchTimerView(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  h += '</div>';

  if (view === 'analytics') return h + renderTimerAnalytics(state);
  if (view === 'alerts')    return h + (typeof renderAlertSettings === 'function' ? renderAlertSettings(state) : '<div class="empty-state"><p>Alert engine not loaded.</p></div>');

  h += '<div class="timer-card">';
  h += '<div class="timer-display" id="timer-display">' + formatTime(secs) + '</div>';
  h += '<div style="margin:10px 0;font-size:12px;color:#8899bb;">' +
    (isActive ? 'Working on: <strong style="color:#a855f7">' + escHtml(state.timerWhat||'Focus session') + '</strong>'
              : 'Ready to focus, Vasavi?') + '</div>';

  if (!isActive) {
    h += '<div class="form-row" style="max-width:320px;margin:0 auto 12px;">';
    h += '<input id="session-what" placeholder="What are you working on? e.g. Pandas revision..." />';
    h += '</div>';
    h += '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">';
    h += '<button class="btn-primary" onclick="startTimer()">▶ Start</button>';
    h += '<button class="btn-ghost" onclick="startPomodoro()">🍅 Pomodoro 25m</button>';
    h += '<button class="btn-ghost" onclick="startDeepWork()">🧠 Deep Work 90m</button>';
    h += '</div>';
  } else {
    h += '<button class="btn-red" style="font-size:13px;padding:8px 24px;" onclick="stopTimer()">⏹ Stop Session</button>';
  }
  h += '</div>';

  h += '<div class="grid-3" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + todayMins + 'm</div><div class="stat-label">Focus Today</div><div class="stat-sub">Target: 120 mins</div></div>';
  h += '<div class="stat-card" style="--stat-color:#06b6d4"><div class="stat-value">' + todaySess.length + '</div><div class="stat-label">Sessions Today</div></div>';
  h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">' + Math.round(totalMins/60) + 'h</div><div class="stat-label">Total All Time</div></div>';
  h += '</div>';

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Today\'s Progress</div>';
  h += '<div class="progress-wrap"><div class="progress-label"><span>Focus Time</span><span>' + todayMins + ' / 120 mins</span></div>';
  h += '<div class="progress-bar" style="height:8px;"><div class="progress-fill" style="width:' + Math.min(pct(todayMins,120),100) + '%"></div></div></div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-top:6px;">' + (todayMins >= 120 ? '🎉 Target reached!' : (120-todayMins) + ' mins remaining') + '</div>';
  h += '</div>';

  h += '<div class="card">';
  h += '<div class="card-header">Today\'s Session Log</div>';
  if (todaySess.length > 0) {
    todaySess.slice().reverse().forEach(function(sess) {
      h += '<div class="session-log"><strong>' + escHtml(sess.what||'Focus') + '</strong><br>';
      h += '<span style="color:#8899bb;font-size:10px;">' + (sess.startStr||'') + ' - ' + (sess.endStr||'') + ' · ' + (sess.duration||0) + ' mins</span></div>';
    });
  } else {
    h += '<div class="empty-state" style="padding:20px;"><div class="emo">⏱️</div><p>No sessions yet today.<br>Start your first one!</p></div>';
  }
  h += '</div>';

  h += '<div class="card">';
  h += '<div class="card-header">Weekly Focus Heatmap</div>';
  h += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">';
  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var now  = new Date();
  var todayD = now.getDay();
  days.forEach(function(day,i) {
    var dd = new Date(now); dd.setDate(now.getDate()-todayD+i);
    var ds = dd.toDateString();
    var dm = allSess.filter(function(s){ return s.start && new Date(s.start).toDateString()===ds; })
                    .reduce(function(a,s){ return a+(s.duration||0); },0);
    var col = dm>=120?'#10b981':dm>=60?'#06b6d4':dm>=30?'#7c3aed':dm>0?'#a855f7':'#1a1a35';
    h += '<div style="text-align:center;">';
    h += '<div style="font-size:9px;color:' + (i===todayD?'#a855f7':'#556080') + ';margin-bottom:4px;">' + day + '</div>';
    h += '<div style="height:40px;border-radius:6px;background:'+col+';display:flex;align-items:center;justify-content:center;font-size:9px;color:'+(dm>0?'#fff':'#556080')+'" title="'+dm+'m">' + (dm>0?dm+'m':'') + '</div>';
    h += '</div>';
  });
  h += '</div></div>';

  return h;
}

function startTimer() {
  var inp = document.getElementById('session-what');
  window.AppState.timerWhat  = inp ? (inp.value.trim()||'Focus session') : 'Focus session';
  window.AppState.activeSess = Date.now();
  window.AppState.timerSecs  = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(tickTimer, 1000);
  saveData(); renderPage();
}

function startPomodoro() {
  var inp = document.getElementById('session-what');
  window.AppState.timerWhat  = inp ? (inp.value.trim()||'Pomodoro 25m') : 'Pomodoro 25m';
  window.AppState.activeSess = Date.now();
  window.AppState.timerSecs  = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(function() {
    window.AppState.timerSecs = (window.AppState.timerSecs||0) + 1;
    if (window.AppState.timerSecs >= 1500) {
      clearInterval(timerInterval); timerInterval = null;
      playAlarm();
      alert('🍅 Pomodoro done! Take a 5 minute break. You earned it!');
      stopTimer();
    } else { updateTimerDisplay(); }
  }, 1000);
  saveData(); renderPage();
}

function startDeepWork() {
  var inp = document.getElementById('session-what');
  window.AppState.timerWhat  = inp ? (inp.value.trim()||'Deep Work 90m') : 'Deep Work 90m';
  window.AppState.activeSess = Date.now();
  window.AppState.timerSecs  = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(function() {
    window.AppState.timerSecs = (window.AppState.timerSecs||0) + 1;
    if (window.AppState.timerSecs >= 5400) {
      clearInterval(timerInterval); timerInterval = null;
      playAlarm();
      alert('🧠 90-minute Deep Work done! Take a 15 minute break!');
      stopTimer();
    } else { updateTimerDisplay(); }
  }, 1000);
  saveData(); renderPage();
}

function tickTimer() {
  window.AppState.timerSecs = (window.AppState.timerSecs||0) + 1;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  var el = document.getElementById('timer-display');
  if (el) el.textContent = formatTime(window.AppState.timerSecs||0);
}

function stopTimer() {
  if (!window.AppState.activeSess) return;
  clearInterval(timerInterval); timerInterval = null;

  var dur   = Math.round((window.AppState.timerSecs||0) / 60);
  var start = new Date(window.AppState.activeSess);
  var end   = new Date();
  var what  = window.AppState.timerWhat || 'Focus session';

  if (!window.AppState.sessions) window.AppState.sessions = [];
  if (!window.AppState.focusSessions) window.AppState.focusSessions = window.AppState.sessions;
  window.AppState.sessions.push({
    start:    window.AppState.activeSess,
    end:      Date.now(),
    duration: dur,
    what:     what,
    startStr: start.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),
    endStr:   end.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})
  });

  window.AppState.activeSess = null;
  window.AppState.timerSecs  = 0;
  window.AppState.timerWhat  = '';
  saveData(); renderPage();
}

function playAlarm() {
  try {
    var ctx = new (window.AudioContext||window.webkitAudioContext)();
    var osc = ctx.createOscillator();
    osc.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.start(); osc.stop(ctx.currentTime + 0.5);
  } catch(e) {}
}

function switchTimerView(v) {
  window.AppState.timerView = v;
  saveData(); renderPage();
}

function switchTimerAnalyticsTab(t) {
  window.AppState.timerAnalyticsTab = t;
  saveData(); renderPage();
}

/* ============================================
   FOCUS TIMER — DATA ANALYTICS VIEW
   Daily / Weekly / Monthly / Yearly
   ============================================ */
function renderTimerAnalytics(state) {
  var tab = state.timerAnalyticsTab || 'monthly';
  var byDate = aeFocusByDate(state);
  var target = (getAlertConfig && getAlertConfig().targetMins) || 120;
  var h = '';

  h += '<div class="subtab-bar">';
  [['daily','📅 Daily'],['weekly','📊 Weekly'],['monthly','📈 Monthly'],['yearly','🏆 Yearly']].forEach(function(t) {
    h += '<div class="subtab ' + (tab===t[0]?'active':'') + '" onclick="switchTimerAnalyticsTab(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  h += '</div>';

  /* Always-on top stats */
  var streak = aeStreak(byDate);
  var totalDays = Object.keys(byDate).filter(function(k){ return byDate[k]>0; }).length;
  var targetDays = Object.keys(byDate).filter(function(k){ return byDate[k]>=target; }).length;
  var totalMins = 0; Object.keys(byDate).forEach(function(k){ totalMins += byDate[k]; });

  h += '<div class="grid-4" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">🔥 ' + streak + '</div><div class="stat-label">Day Streak</div></div>';
  h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">' + targetDays + '</div><div class="stat-label">Days Hit ' + target + 'm</div></div>';
  h += '<div class="stat-card" style="--stat-color:#06b6d4"><div class="stat-value">' + totalDays + '</div><div class="stat-label">Total Active Days</div></div>';
  h += '<div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-value">' + Math.round(totalMins/60) + 'h</div><div class="stat-label">All-Time Focus</div></div>';
  h += '</div>';

  if (tab === 'daily') {
    /* Last 14 days bars */
    h += '<div class="card" style="margin-bottom:14px;">';
    h += '<div class="card-header">Last 14 Days</div>';
    for (var i = 13; i >= 0; i--) {
      var d = new Date(); d.setDate(d.getDate()-i);
      var iso = aeIso(d);
      var mins = byDate[iso] || 0;
      var label = i===0 ? 'Today' : d.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'});
      h += aeBarRow(label, mins, target, aeFocusColor(mins), mins + 'm' + (mins>=target?' ✅':''));
    }
    h += '</div>';

    /* Today's sessions with what she worked on */
    var todayStr = new Date().toDateString();
    var todaySess = (state.sessions||state.focusSessions||[]).filter(function(s){ return s.start && new Date(s.start).toDateString()===todayStr; });
    h += '<div class="card"><div class="card-header">What You Worked On Today</div>';
    if (todaySess.length) {
      todaySess.forEach(function(s) {
        h += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #1a1a35;font-size:11px;">';
        h += '<span>' + escHtml(s.what||'Focus') + '</span><span style="color:#a855f7;">' + (s.duration||0) + 'm · ' + (s.startStr||'') + '</span></div>';
      });
    } else {
      h += '<div style="font-size:11px;color:#556080;">Nothing yet today — go start a session!</div>';
    }
    h += '</div>';
  }

  if (tab === 'weekly') {
    /* This week heatmap */
    h += '<div class="card" style="margin-bottom:14px;">';
    h += '<div class="card-header">This Week Heatmap</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">';
    var now = new Date();
    var todayD = now.getDay();
    var weekTotal = 0;
    DAYS_SHORT.forEach(function(day, i) {
      var dd = new Date(now); dd.setDate(now.getDate()-todayD+i);
      var dm = byDate[aeIso(dd)] || 0;
      weekTotal += dm;
      h += '<div style="text-align:center;">';
      h += '<div style="font-size:9px;color:' + (i===todayD?'#a855f7':'#556080') + ';margin-bottom:4px;">' + day + '</div>';
      h += '<div style="height:40px;border-radius:6px;background:' + aeFocusColor(dm) + ';display:flex;align-items:center;justify-content:center;font-size:9px;color:' + (dm>0?'#fff':'#556080') + '">' + (dm>0?dm+'m':'') + '</div>';
      h += '</div>';
    });
    h += '</div>';
    h += '<div style="font-size:11px;color:#8899bb;margin-top:8px;">Week total: <b style="color:#a855f7;">' + weekTotal + ' mins</b> · Weekly target: ' + (target*7) + ' mins (' + pct(weekTotal, target*7) + '%)</div>';
    h += '</div>';

    /* Last 8 weeks */
    h += '<div class="card"><div class="card-header">Last 8 Weeks</div>';
    var maxWk = 1; var weeks = [];
    for (var w = 7; w >= 0; w--) {
      var ws = new Date(now); ws.setDate(now.getDate()-now.getDay()-w*7);
      var tot = 0;
      for (var dd2 = 0; dd2 < 7; dd2++) {
        var wd = new Date(ws); wd.setDate(ws.getDate()+dd2);
        tot += byDate[aeIso(wd)] || 0;
      }
      weeks.push({ label: ws.toLocaleDateString('en-IN',{day:'numeric',month:'short'}) + ' week', total: tot });
      if (tot > maxWk) maxWk = tot;
    }
    weeks.forEach(function(wk) {
      h += aeBarRow(wk.label, wk.total, Math.max(maxWk, target*7), wk.total>=target*7?'#10b981':'#a855f7', wk.total + 'm');
    });
    h += '</div>';
  }

  if (tab === 'monthly') {
    var v = aeGetView('timer');
    var monthTotal = 0, monthActive = 0, monthHit = 0;
    Object.keys(byDate).forEach(function(iso) {
      if (parseInt(iso.substring(0,4))===v.y && parseInt(iso.substring(5,7))===v.m+1) {
        monthTotal += byDate[iso];
        if (byDate[iso] > 0) monthActive++;
        if (byDate[iso] >= target) monthHit++;
      }
    });
    h += '<div class="card" style="margin-bottom:14px;">';
    h += aeMonthNav('timer');
    h += aeCalendarHeatmap(v.y, v.m, byDate, aeFocusColor, function(val){ return val>0?val+'m':''; });
    h += '<div style="display:flex;gap:8px;margin-top:10px;font-size:9px;color:#8899bb;flex-wrap:wrap;">';
    [['#1a1a35','0m'],['#a855f7','<30m'],['#7c3aed','30m+'],['#06b6d4','60m+'],['#10b981',target+'m+ 🎯']].forEach(function(l) {
      h += '<span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:3px;background:' + l[0] + ';display:inline-block;"></span>' + l[1] + '</span>';
    });
    h += '</div></div>';

    h += '<div class="grid-4" style="margin-bottom:14px;">';
    h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + Math.round(monthTotal/60) + 'h</div><div class="stat-label">Month Total</div><div class="stat-sub">' + monthTotal + ' mins</div></div>';
    h += '<div class="stat-card" style="--stat-color:#06b6d4"><div class="stat-value">' + monthActive + '</div><div class="stat-label">Active Days</div></div>';
    h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">' + monthHit + '</div><div class="stat-label">Target Days</div><div class="stat-sub">' + target + '+ mins</div></div>';
    h += '<div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-value">' + (monthActive>0?Math.round(monthTotal/monthActive):0) + 'm</div><div class="stat-label">Avg / Active Day</div></div>';
    h += '</div>';

    h += '<button class="btn-primary" style="width:100%;" onclick="timerMonthAISummary(this)">🤖 AI Summary — How Was ' + AE_MONTHS[v.m] + '?</button>';
    h += '<div id="timer-ai-summary" style="display:none;"></div>';
  }

  if (tab === 'yearly') {
    var vy = aeGetView('timer');
    var monthVals = aeMonthTotals(byDate, vy.y);
    var yearTotal = monthVals.reduce(function(a,b){ return a+b; },0);
    var yearActive = Object.keys(byDate).filter(function(iso){ return parseInt(iso.substring(0,4))===vy.y && byDate[iso]>0; }).length;

    h += '<div class="card" style="margin-bottom:14px;">';
    h += aeYearNav('timer');
    h += aeYearBarChart(monthVals, (vy.y===new Date().getFullYear()?new Date().getMonth():-1), '#a855f7', function(vv){ return Math.round(vv/60)+'h'; }, 'timer', 'timerAnalyticsTab');
    h += '<div style="font-size:11px;color:#8899bb;">Year total: <b style="color:#a855f7;">' + Math.round(yearTotal/60) + ' hours</b> across ' + yearActive + ' active days</div>';
    h += '</div>';

    /* All years */
    var years = aeYearTotals(byDate);
    h += '<div class="card"><div class="card-header">All Years</div>';
    var yKeys = Object.keys(years).sort();
    if (yKeys.length) {
      var maxY = Math.max.apply(null, yKeys.map(function(k){ return years[k]; }));
      yKeys.forEach(function(yk) {
        h += aeBarRow(yk, years[yk], maxY, '#06b6d4', Math.round(years[yk]/60) + 'h (' + years[yk] + 'm)');
      });
    } else {
      h += '<div style="font-size:11px;color:#556080;">No focus data yet.</div>';
    }
    h += '</div>';
  }

  return h;
}

function timerMonthAISummary(btn) {
  var state  = window.AppState;
  var v      = aeGetView('timer');
  var byDate = aeFocusByDate(state);
  var target = (typeof getAlertConfig==='function' && getAlertConfig().targetMins) || 120;
  var daysInMonth = new Date(v.y, v.m+1, 0).getDate();
  var total=0, active=0, hit=0, best={iso:'',mins:0};
  var lines = [];
  for (var d=1; d<=daysInMonth; d++) {
    var iso = v.y + '-' + pad(v.m+1) + '-' + pad(d);
    var mins = byDate[iso]||0;
    total += mins; if (mins>0) active++; if (mins>=target) hit++;
    if (mins>best.mins) best={iso:iso,mins:mins};
    lines.push(iso + ': ' + mins + 'm');
  }
  var missed = daysInMonth - active;
  var ctx = 'Focus Timer data for ' + AE_MONTHS[v.m] + ' ' + v.y + ' (daily target ' + target + ' mins):\n' +
    'Total: ' + total + ' mins · Active days: ' + active + '/' + daysInMonth + ' · Days that hit target: ' + hit + '\n' +
    'Day by day:\n' + lines.join('\n');
  var fallback = '📊 ' + AE_MONTHS[v.m] + ' ' + v.y + ' summary:\n' +
    '• Total focus: ' + Math.round(total/60) + 'h (' + total + ' mins)\n' +
    '• Active on ' + active + ' of ' + daysInMonth + ' days — missed ' + missed + ' days completely\n' +
    '• Hit your ' + target + '-min target on ' + hit + ' days\n' +
    '• Best day: ' + (best.mins?best.iso + ' with ' + best.mins + ' mins':'—') + '\n\n' +
    (hit >= 20 ? '🔥 Outstanding consistency. Protect this rhythm.' :
     hit >= 10 ? '💪 Good month. Aim to convert ' + Math.min(missed,5) + ' of the missed days next month.' :
     '⚠️ Focus was inconsistent. Next month rule: never miss 2 days in a row.');
  aeAISummary('Focus Month Summary — ' + AE_MONTHS[v.m] + ' ' + v.y, ctx, fallback, btn, 'timer-ai-summary');
}

console.log('timer.js loaded OK');