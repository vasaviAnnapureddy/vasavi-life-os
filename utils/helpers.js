/* ============================================
   VASAVI'S LIFE OS — HELPER FUNCTIONS
   utils/helpers.js
   ============================================ */

/* --- PERCENTAGE CALCULATOR --- */
function pct(done, total) {
  if (!total || total === 0) return 0;
  return Math.round((done / total) * 100);
}

/* --- ESCAPE HTML (prevents broken UI from special characters) --- */
function escHtml(str) {
  var s = String(str || '');
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* --- FORMAT NUMBER AS INDIAN RUPEES --- */
function formatRupees(amount) {
  return Number(amount || 0).toLocaleString('en-IN');
}

/* --- FORMAT SECONDS INTO HH:MM:SS --- */
function formatTime(totalSeconds) {
  var h = Math.floor(totalSeconds / 3600);
  var m = Math.floor((totalSeconds % 3600) / 60);
  var s = totalSeconds % 60;
  return pad(h) + ':' + pad(m) + ':' + pad(s);
}

/* --- FORMAT SECONDS INTO MM:SS (for language timer) --- */
function formatMinSec(totalSeconds) {
  var m = Math.floor(totalSeconds / 60);
  var s = totalSeconds % 60;
  return pad(m) + ':' + pad(s);
}

/* --- PAD NUMBER WITH LEADING ZERO --- */
function pad(num) {
  return String(num).padStart(2, '0');
}

/* --- GET TODAY'S DATE AS STRING --- */
function todayString() {
  return new Date().toDateString();
}

/* --- GET TODAY'S DATE INDEX (0=Sun, 6=Sat) --- */
function todayIndex() {
  return new Date().getDay();
}

/* --- GET TODAY'S DAY NAME --- */
function todayName() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}

/* --- FORMAT DATE FOR DISPLAY --- */
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/* --- RING / DONUT CHART HTML --- */
function makeRing(value, color, size) {
  size = size || 70;
  var radius = size * 0.38;
  var circumference = 2 * Math.PI * radius;
  var filled = circumference * (value / 100);
  var cx = size / 2;
  var cy = size / 2;
  var strokeWidth = size * 0.1;

  return (
    '<div class="ring-wrap" style="width:' + size + 'px;height:' + size + 'px;">' +
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" ' +
          'fill="none" stroke="#1a1a35" stroke-width="' + strokeWidth + '"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" ' +
          'fill="none" stroke="' + color + '" stroke-width="' + strokeWidth + '" ' +
          'stroke-dasharray="' + filled + ' ' + circumference + '" ' +
          'stroke-linecap="round"/>' +
      '</svg>' +
      '<div class="ring-value">' + value + '%</div>' +
    '</div>'
  );
}

/* --- LIFE SCORE CALCULATOR --- */
function calcLifeScore() {
  var score = 0;
  var state = window.AppState;
  if (!state) return 0;

  /* Habits: 20 points */
  if (state.habits && state.habits.length > 0) {
    var habitsDone = state.habits.filter(function(h) {
      return (h.week || [])[todayIndex()];
    }).length;
    score += (habitsDone / state.habits.length) * 20;
  }

  /* Daily goals: 20 points */
  if (state.goals && state.goals.daily && state.goals.daily.length > 0) {
    var goalsDone = state.goals.daily.filter(function(g) {
      return g.done;
    }).length;
    score += (goalsDone / state.goals.daily.length) * 20;
  }

  /* Focus time: 20 points (target = 120 mins) */
  if (state.sessions && state.sessions.length > 0) {
    var todaySessions = state.sessions.filter(function(s) {
      return new Date(s.start).toDateString() === todayString();
    });
    var todayMins = todaySessions.reduce(function(a, s) {
      return a + s.duration;
    }, 0);
    score += Math.min(todayMins / 120, 1) * 20;
  }

  /* Finance logged: 10 points */
  if (state.expenses && state.expenses.length > 0) {
    var loggedToday = state.expenses.some(function(e) {
      return e.date === todayString();
    });
    if (loggedToday) score += 10;
  } else {
    score += 10; /* no expenses yet = no penalty */
  }

  /* Journal done: 10 points */
  var journalKey = 'journal_' + todayString();
  if (state.notes && state.notes[journalKey]) {
    score += 10;
  }

  /* DS Progress: 15 points */
  if (state.dsProgress) {
    var dsDone = Object.values(state.dsProgress).filter(function(v) {
      return v === 'done';
    }).length;
    score += Math.min(dsDone / 10, 1) * 15;
  }

  /* Language session today: 5 points */
  if (state.langSessions && state.langSessions.length > 0) {
    var langToday = state.langSessions.some(function(s) {
      return new Date(s.date).toDateString() === todayString();
    });
    if (langToday) score += 5;
  }

  return Math.round(score);
}

/* --- LIFE SCORE COLOR --- */
function lifeScoreColor(score) {
  if (score >= 70) return '#10b981'; /* green */
  if (score >= 40) return '#f59e0b'; /* yellow */
  return '#ef4444';                  /* red */
}

/* --- LIFE SCORE MESSAGE --- */
function lifeScoreMessage(score) {
  if (score >= 70) return 'Winning today!';
  if (score >= 40) return 'In progress. Keep going.';
  return 'Focus on 1 thing right now.';
}

/* --- SHOW NOTIFICATION (browser) --- */
function showNotification(title, body) {
  if (Notification && Notification.permission === 'granted') {
    new Notification(title, { body: body });
  }
}

/* --- PLAY ALARM SOUND --- */
function playAlarm() {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var oscillator = ctx.createOscillator();
    var gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = 880;
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 1.5);
  } catch (e) {
    console.log('Audio not available:', e);
  }
}

/* --- DAYS OF WEEK --- */
var DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
var DAYS_FULL  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/* --- IS TODAY SUNDAY (rest day) --- */
function isSunday() {
  return new Date().getDay() === 0;
}

/* --- CALCULATE WEEK SINCE (for analytics) --- */
function isWithinDays(dateVal, days) {
  var diff = Date.now() - new Date(dateVal).getTime();
  return diff < days * 24 * 60 * 60 * 1000;
}

console.log('helpers.js loaded OK');