/* ============================================
   VASAVI'S LIFE OS - DASHBOARD MODULE
   modules/dashboard.js
   ============================================ */

function renderDashboard() {
  var state   = window.AppState;
  var ls      = calcLifeScore();
  var lsColor = lifeScoreColor(ls);
  var lsMsg   = lifeScoreMessage(ls);

  /* Today's sessions */
  var allSessions = state.sessions || state.focusSessions || [];
  var todaySessions = allSessions.filter(function(s) {
    return s.start && new Date(s.start).toDateString() === new Date().toDateString();
  });
  var todayMins = todaySessions.reduce(function(a, s) {
    return a + s.duration;
  }, 0);

  /* Habits done today */
  var habitsDone  = (state.habits || []).filter(function(h) {
    return (h.week || [])[todayIndex()];
  }).length;
  var habitsTotal = (state.habits || []).length;

  /* DS progress */
  var dsDone = Object.values(state.dsProgress || {}).filter(function(v) {
    return v === 'done';
  }).length;

  /* Jobs */
  var jobsApplied   = (state.jobs || []).length;
  var jobsInterview = (state.jobs || []).filter(function(j) {
    return j.status === 'Interview';
  }).length;

  /* Module averages */
  var habAvg = habitsTotal > 0
    ? Math.round((state.habits || []).reduce(function(a, h) {
        return a + pct((h.week || []).filter(Boolean).length, 7);
      }, 0) / habitsTotal)
    : 0;

  var bkAvg = (state.books || []).length > 0
    ? Math.round((state.books || []).reduce(function(a, b) {
        return a + pct(b.done || 0, b.total || 1);
      }, 0) / state.books.length)
    : 0;

  var projPhases = state.projectPhases || [];
  var projPct = projPhases.length > 0 ? pct(projPhases.filter(function(p){return p.done;}).length, projPhases.length) : 0;

  /* Pending goals */
  var goalsDaily = (state.goals && state.goals.daily) ? state.goals.daily : (Array.isArray(state.goals) ? state.goals : []);
  var pendingGoals = goalsDaily.filter(function(g) {
    return !g.done;
  }).length;

  /* Build HTML */
  var h = '';

  /* ---- SUNDAY BANNER ---- */
  if (isSunday()) {
    h += '<div style="background:linear-gradient(135deg,#1a0533,#0a1428);' +
         'border-radius:12px;padding:16px 20px;margin-bottom:14px;' +
         'display:flex;align-items:center;gap:12px;">' +
      '<div style="font-size:28px;">🙏</div>' +
      '<div>' +
        '<div style="font-weight:800;font-size:14px;">Sunday Rest Day</div>' +
        '<div style="font-size:11px;color:#94a3b8;margin-top:2px;">' +
          'No study. No guilt. You earned this rest, Vasavi.' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ---- TOP STATS ROW ---- */
  h += '<div class="grid-4" style="margin-bottom:14px;">';

  h += '<div class="stat-card" style="--stat-color:' + lsColor + ';text-align:center;">' +
    makeRing(ls, lsColor, 72) +
    '<div class="stat-label">Life Score</div>' +
    '<div class="stat-sub" style="color:' + lsColor + '">' + lsMsg + '</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#06b6d4">' +
    '<div class="stat-value">' + todayMins + 'm</div>' +
    '<div class="stat-label">Focus Today</div>' +
    '<div class="stat-sub">Target: 120 mins</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#10b981">' +
    '<div class="stat-value">' + habitsDone + '/' + habitsTotal + '</div>' +
    '<div class="stat-label">Habits Done</div>' +
    '<div class="stat-sub">Today</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#f59e0b">' +
    '<div class="stat-value">' + jobsApplied + '</div>' +
    '<div class="stat-label">Jobs Applied</div>' +
    '<div class="stat-sub">' + jobsInterview + ' interviews</div>' +
  '</div>';

  h += '</div>';

  /* ---- MIDDLE ROW ---- */
  h += '<div class="grid-2">';

  /* Module Progress Card */
  h += '<div class="card">' +
    '<div class="card-header">Module Progress</div>';

  var modules = [
    ['DS Roadmap', pct(dsDone, 10), '#a855f7'],
    ['Habits',     habAvg,          '#10b981'],
    ['Project',    projPct,         '#f59e0b'],
    ['Books',      bkAvg,           '#06b6d4']
  ];

  modules.forEach(function(m) {
    h += '<div class="progress-wrap">' +
      '<div class="progress-label">' +
        '<span>' + m[0] + '</span>' +
        '<span>' + m[1] + '%</span>' +
      '</div>' +
      '<div class="progress-bar">' +
        '<div class="progress-fill" style="width:' + m[1] + '%;' +
          'background:' + m[2] + '"></div>' +
      '</div>' +
    '</div>';
  });

  h += '</div>';

  /* Today ONE Thing + Schedule Card */
  h += '<div class="card">' +
    '<div class="card-header">Today\'s ONE Thing</div>' +
    '<div style="background:linear-gradient(135deg,#1a0533,#0a1628);' +
         'border-radius:9px;padding:14px;margin-bottom:12px;">' +
      '<div style="font-size:10px;color:#a855f7;margin-bottom:6px;font-weight:700;">' +
        'MOST IMPORTANT TODAY' +
      '</div>' +
      '<input id="one-thing-input" ' +
        'value="' + escHtml((state.planner && state.planner.focus) || state.todayFocus || '') + '" ' +
        'placeholder="What is your ONE thing today?" ' +
        'style="background:transparent;border:none;font-size:13px;' +
               'font-weight:700;color:#f0f0ff;padding:0;width:100%;" />' +
    '</div>' +
    '<div style="font-size:10px;color:#8899bb;margin-bottom:8px;' +
         'font-weight:700;text-transform:uppercase;letter-spacing:.8px;">' +
      'Today\'s Schedule' +
    '</div>';

  var schedule = [
    ['5:30',  'Wake up + Morning study'],
    ['7:00',  'Gym'],
    ['10:30', 'Deep Work Block 1'],
    ['1:00',  'Lunch break'],
    ['2:00',  'Deep Work Block 2'],
    ['5:00',  'Daily Learning'],
    ['7:00',  'Revision'],
    ['9:30',  'Interview Prep']
  ];

  schedule.forEach(function(s) {
    h += '<div style="display:flex;gap:8px;padding:3px 0;font-size:11px;">' +
      '<span style="color:#a855f7;font-weight:700;width:38px;">' + s[0] + '</span>' +
      '<span>' + s[1] + '</span>' +
    '</div>';
  });

  h += '</div>';
  h += '</div>';

  /* ---- BOTTOM ROW ---- */
  h += '<div class="grid-2">';

  /* Habit Streaks Card */
  h += '<div class="card">' +
    '<div class="card-header">Habit Streaks</div>';

  if ((state.habits || []).length > 0) {
    state.habits.slice(0, 6).forEach(function(habit) {
      var streak = (habit.week || []).filter(Boolean).length;
      h += '<div style="display:flex;justify-content:space-between;' +
               'align-items:center;padding:6px 0;' +
               'border-bottom:1px solid #1a1a35;">' +
        '<span style="font-size:12px;">' + escHtml(habit.name) + '</span>' +
        '<span class="streak-badge">🔥 ' + streak + 'd</span>' +
      '</div>';
    });
  } else {
    h += '<div class="empty-state" style="padding:20px;">' +
      '<p>Add habits to see streaks</p>' +
    '</div>';
  }

  h += '</div>';

  /* Job Hunt Status Card */
  h += '<div class="card">' +
    '<div class="card-header">Job Hunt Status</div>';

  var jobStatuses = [
    ['Applied',     '#a5b4fc'],
    ['Shortlisted', '#93c5fd'],
    ['Interview',   '#fdba74'],
    ['Offer',       '#6ee7b7'],
    ['Rejected',    '#fca5a5']
  ];

  jobStatuses.forEach(function(st) {
    var count = (state.jobs || []).filter(function(j) {
      return j.status === st[0];
    }).length;
    h += '<div style="display:flex;justify-content:space-between;' +
             'padding:6px 0;border-bottom:1px solid #1a1a35;">' +
      '<span style="font-size:11px;">' + st[0] + '</span>' +
      '<span style="font-size:13px;font-weight:800;color:' + st[1] + '">' +
        count +
      '</span>' +
    '</div>';
  });

  if (pendingGoals > 0) {
    h += '<div style="margin-top:10px;padding:8px;background:#1a1a35;' +
             'border-radius:8px;font-size:11px;color:#f59e0b;">' +
      '⚠️ ' + pendingGoals + ' daily goals pending' +
    '</div>';
  }

  h += '</div>';
  h += '</div>';

  return h;
}

console.log('dashboard.js loaded OK');