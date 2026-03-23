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

console.log('timer.js loaded OK');