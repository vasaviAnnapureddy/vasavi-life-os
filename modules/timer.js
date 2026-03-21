/* ============================================
   VASAVI'S LIFE OS - FOCUS TIMER MODULE
   modules/timer.js
   ============================================ */

/* Timer state */
var timerInterval = null;

function renderTimer() {
  var state       = window.AppState;
  var todaySess   = (state.sessions || []).filter(function(s) {
    return new Date(s.start).toDateString() === todayString();
  });
  var todayMins   = todaySess.reduce(function(a, s) { return a + s.duration; }, 0);
  var totalMins   = (state.sessions || []).reduce(function(a, s) {
    return a + s.duration;
  }, 0);
  var isActive    = state.activeSess !== null;
  var secs        = state.timerSecs  || 0;

  var h = '';

  /* ---- TIMER DISPLAY ---- */
  h += '<div class="timer-card">';
  h += '<div class="timer-display" id="timer-display">' +
    formatTime(secs) +
  '</div>';

  h += '<div style="margin:10px 0;font-size:12px;color:#8899bb;">' +
    (isActive
      ? 'Working on: <strong style="color:#a855f7">' +
        escHtml(state.timerWhat || 'Focus session') + '</strong>'
      : 'Ready to focus, Vasavi?') +
  '</div>';

  if (!isActive) {
    h += '<div class="form-row" style="max-width:320px;margin:0 auto 12px;">' +
      '<input id="session-what" ' +
        'placeholder="What are you working on? e.g. Pandas revision..." />' +
    '</div>';
    h += '<div style="display:flex;gap:8px;justify-content:center;">';
    h += '<button class="btn-primary" onclick="startTimer()">▶ Start</button>';
    h += '<button class="btn-ghost" onclick="startPomodoro()">🍅 Pomodoro 25m</button>';
    h += '<button class="btn-ghost" onclick="startDeepWork()">🧠 Deep Work 90m</button>';
    h += '</div>';
  } else {
    h += '<button class="btn-red" style="font-size:13px;padding:8px 24px;" ' +
      'onclick="stopTimer()">⏹ Stop Session</button>';
  }

  h += '</div>';

  /* ---- STATS ---- */
  h += '<div class="grid-3" style="margin-bottom:14px;">';

  h += '<div class="stat-card" style="--stat-color:#a855f7">' +
    '<div class="stat-value">' + todayMins + 'm</div>' +
    '<div class="stat-label">Focus Today</div>' +
    '<div class="stat-sub">Target: 120 mins</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#06b6d4">' +
    '<div class="stat-value">' + todaySess.length + '</div>' +
    '<div class="stat-label">Sessions Today</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#10b981">' +
    '<div class="stat-value">' + Math.round(totalMins / 60) + 'h</div>' +
    '<div class="stat-label">Total All Time</div>' +
  '</div>';

  h += '</div>';

  /* ---- PROGRESS TO TARGET ---- */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Today\'s Progress</div>';
  h += '<div class="progress-wrap">' +
    '<div class="progress-label">' +
      '<span>Focus Time</span>' +
      '<span>' + todayMins + ' / 120 mins</span>' +
    '</div>' +
    '<div class="progress-bar" style="height:8px;">' +
      '<div class="progress-fill" ' +
        'style="width:' + Math.min(pct(todayMins, 120), 100) + '%"></div>' +
    '</div>' +
  '</div>';

  if (todayMins >= 120) {
    h += '<div style="font-size:11px;color:#10b981;margin-top:6px;">' +
      '🎉 Target reached! You are on fire today, Vasavi!' +
    '</div>';
  } else {
    h += '<div style="font-size:11px;color:#8899bb;margin-top:6px;">' +
      (120 - todayMins) + ' mins remaining to hit target' +
    '</div>';
  }

  h += '</div>';

  /* ---- SESSION LOG ---- */
  h += '<div class="card">';
  h += '<div class="card-header">Today\'s Session Log</div>';

  if (todaySess.length > 0) {
    todaySess.slice().reverse().forEach(function(sess) {
      h += '<div class="session-log">' +
        '<strong>' + escHtml(sess.what) + '</strong><br>' +
        '<span style="color:#8899bb;font-size:10px;">' +
          sess.startStr + ' - ' + sess.endStr +
          ' &nbsp;·&nbsp; ' + sess.duration + ' mins' +
        '</span>' +
      '</div>';
    });
  } else {
    h += '<div class="empty-state" style="padding:20px;">' +
      '<div class="emo">⏱️</div>' +
      '<p>No sessions yet today.<br>Start your first one!</p>' +
    '</div>';
  }

  h += '</div>';

  /* ---- WEEKLY HEATMAP ---- */
  h += renderSessionHeatmap(state);

  return h;
}

/* Weekly heatmap */
function renderSessionHeatmap(state) {
  var h = '';
  h += '<div class="card">';
  h += '<div class="card-header">Weekly Focus Heatmap</div>';
  h += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">';

  var days    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var now     = new Date();
  var todayD  = now.getDay();

  days.forEach(function(day, i) {
    var dayDate  = new Date(now);
    dayDate.setDate(now.getDate() - todayD + i);
    var dateStr  = dayDate.toDateString();
    var daySess  = (state.sessions || []).filter(function(s) {
      return new Date(s.start).toDateString() === dateStr;
    });
    var dayMins  = daySess.reduce(function(a, s) { return a + s.duration; }, 0);
    var isToday  = i === todayD;

    var intensity = dayMins >= 120 ? '#10b981' :
                    dayMins >= 60  ? '#06b6d4' :
                    dayMins >= 30  ? '#7c3aed' :
                    dayMins > 0    ? '#a855f7' : '#1a1a35';

    h += '<div style="text-align:center;">';
    h += '<div style="font-size:9px;color:' +
      (isToday ? '#a855f7' : '#556080') +
      ';font-weight:' + (isToday ? '800' : '400') +
      ';margin-bottom:4px;">' + day + '</div>';
    h += '<div style="height:40px;border-radius:6px;background:' + intensity +
      ';display:flex;align-items:center;justify-content:center;' +
      'font-size:9px;color:' + (dayMins > 0 ? '#fff' : '#556080') + ';" ' +
      'title="' + dayMins + ' mins">' +
      (dayMins > 0 ? dayMins + 'm' : '') +
    '</div>';
    h += '</div>';
  });

  h += '</div>';
  h += '<div style="display:flex;gap:12px;margin-top:10px;flex-wrap:wrap;">';
  [['#1a1a35','0 mins'],['#a855f7','1-29m'],
   ['#7c3aed','30-59m'],['#06b6d4','60-119m'],
   ['#10b981','120m+ Target!']].forEach(function(l) {
    h += '<div style="display:flex;align-items:center;gap:4px;font-size:10px;color:#8899bb;">' +
      '<div style="width:10px;height:10px;border-radius:2px;background:' +
        l[0] + ';"></div>' + l[1] +
    '</div>';
  });
  h += '</div></div>';
  return h;
}

/* ============================================
   TIMER ACTIONS
   ============================================ */
function startTimer() {
  var inp = document.getElementById('session-what');
  window.AppState.timerWhat  = inp ? inp.value.trim() || 'Focus session' : 'Focus session';
  window.AppState.activeSess = Date.now();
  window.AppState.timerSecs  = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(tickTimer, 1000);
  saveData();
  renderPage();
}

function startPomodoro() {
  var inp = document.getElementById('session-what');
  window.AppState.timerWhat  = inp ? inp.value.trim() || 'Pomodoro' : 'Pomodoro';
  window.AppState.activeSess = Date.now();
  window.AppState.timerSecs  = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(function() {
    window.AppState.timerSecs++;
    if (window.AppState.timerSecs >= 1500) {
      clearInterval(timerInterval);
      playAlarm();
      alert('🍅 Pomodoro done! Take a 5 minute break. You earned it!');
      stopTimer();
    } else {
      updateTimerDisplay();
    }
  }, 1000);
  saveData();
  renderPage();
}

function startDeepWork() {
  var inp = document.getElementById('session-what');
  window.AppState.timerWhat  = inp ? inp.value.trim() || 'Deep Work' : 'Deep Work';
  window.AppState.activeSess = Date.now();
  window.AppState.timerSecs  = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(function() {
    window.AppState.timerSecs++;
    if (window.AppState.timerSecs >= 5400) {
      clearInterval(timerInterval);
      playAlarm();
      alert('🧠 90-minute Deep Work done! Take a 15 minute break!');
      stopTimer();
    } else {
      updateTimerDisplay();
    }
  }, 1000);
  saveData();
  renderPage();
}

function tickTimer() {
  window.AppState.timerSecs = (window.AppState.timerSecs || 0) + 1;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  var el = document.getElementById('timer-display');
  if (el) el.textContent = formatTime(window.AppState.timerSecs || 0);
}

function stopTimer() {
  if (!window.AppState.activeSess) return;
  clearInterval(timerInterval);
  timerInterval = null;

  var dur   = Math.round((window.AppState.timerSecs || 0) / 60);
  var start = new Date(window.AppState.activeSess);
  var end   = new Date();
  var what  = prompt(
    'Session complete! What did you accomplish?\n(' +
    dur + ' mins on: ' + window.AppState.timerWhat + ')'
  ) || window.AppState.timerWhat;

  if (!window.AppState.sessions) window.AppState.sessions = [];
  window.AppState.sessions.push({
    start:    window.AppState.activeSess,
    end:      Date.now(),
    duration: dur,
    what:     what,
    startStr: start.toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit'
    }),
    endStr: end.toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit'
    })
  });

  window.AppState.activeSess = null;
  window.AppState.timerSecs  = 0;
  window.AppState.timerWhat  = '';
  saveData();
  renderPage();
}

/* Resume timer if page reloads while active */
function resumeTimerIfActive() {
  if (window.AppState.activeSess) {
    var elapsed = Math.floor((Date.now() - window.AppState.activeSess) / 1000);
    window.AppState.timerSecs = elapsed;
    clearInterval(timerInterval);
    timerInterval = setInterval(tickTimer, 1000);
  }
}

/* Call on init - wait for AppState to be ready */
if (typeof window.AppState !== 'undefined') {
  resumeTimerIfActive();
}

console.log('timer.js loaded OK');