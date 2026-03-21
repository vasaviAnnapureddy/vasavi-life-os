/* ============================================
   VASAVI'S LIFE OS - HABITS MODULE
   modules/habits.js
   ============================================ */

function renderHabits() {
  var state       = window.AppState;
  var habits      = state.habits || [];
  var todayIdx    = todayIndex();
  var habitsDone  = habits.filter(function(h) {
    return (h.week || [])[todayIdx];
  }).length;
  var habAvg = habits.length > 0
    ? Math.round(habits.reduce(function(a, h) {
        return a + pct((h.week || []).filter(Boolean).length, 7);
      }, 0) / habits.length)
    : 0;

  var h = '';

  /* ---- STATS ROW ---- */
  h += '<div class="grid-3" style="margin-bottom:14px;">';

  h += '<div class="stat-card" style="--stat-color:#10b981">' +
    '<div class="stat-value">' + habitsDone + '/' + habits.length + '</div>' +
    '<div class="stat-label">Done Today</div>' +
    '<div class="stat-sub">Keep going!</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#a855f7">' +
    '<div class="stat-value">' + habAvg + '%</div>' +
    '<div class="stat-label">Weekly Average</div>' +
    '<div class="stat-sub">This week</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#f59e0b">' +
    '<div class="stat-value">' + habits.length + '</div>' +
    '<div class="stat-label">Total Habits</div>' +
    '<div class="stat-sub">Tracked</div>' +
  '</div>';

  h += '</div>';

  /* ---- WEEKLY GRID ---- */
  h += '<div class="card">';
  h += '<div class="card-header">';
  h += '<span>This Week</span>';
  h += '<div style="display:flex;gap:4px;">';
  DAYS_SHORT.forEach(function(d, i) {
    h += '<span style="font-size:10px;width:25px;text-align:center;' +
      'color:' + (i === todayIdx ? '#a855f7' : '#556080') + ';' +
      'font-weight:' + (i === todayIdx ? '800' : '400') + ';">' +
      d + '</span>';
  });
  h += '</div></div>';

  if (habits.length > 0) {
    habits.forEach(function(habit, hi) {
      var streak = (habit.week || []).filter(Boolean).length;
      h += '<div class="habit-row">';

      /* Habit info */
      h += '<div>' +
        '<div style="font-weight:600;font-size:12px;">' +
          escHtml(habit.name) +
        '</div>' +
        '<div style="font-size:10px;color:#556080;margin-top:2px;">' +
          escHtml(habit.cat || 'General') +
          ' &nbsp;·&nbsp; 🔥 ' + streak + 'd streak' +
        '</div>' +
      '</div>';

      /* Day dots */
      h += '<div style="display:flex;gap:4px;">';
      var week = habit.week || [0,0,0,0,0,0,0];
      week.forEach(function(done, di) {
        h += '<div class="day-dot ' + (done ? 'done' : '') + '" ' +
          'data-habit="' + hi + '" ' +
          'data-day="' + di + '" ' +
          'onclick="toggleHabit(' + hi + ',' + di + ')">' +
          DAYS_SHORT[di] +
        '</div>';
      });
      h += '</div>';

      /* Delete button */
      h += '<button onclick="deleteHabit(' + hi + ')" ' +
        'style="background:none;border:none;color:#556080;cursor:pointer;' +
               'font-size:14px;margin-left:8px;">✕</button>';

      h += '</div>';
    });
  } else {
    h += '<div class="empty-state">' +
      '<div class="emo">✅</div>' +
      '<p>No habits yet. Click + Add to start!</p>' +
    '</div>';
  }

  /* Add Habit inline form */
  h += '<div style="display:flex;gap:8px;margin-top:12px;padding-top:12px;' +
       'border-top:1px solid #1a1a35;">' +
    '<input id="new-habit-name" placeholder="New habit name..." ' +
      'style="flex:1;" />' +
    '<input id="new-habit-cat" placeholder="Category..." ' +
      'style="width:130px;" />' +
    '<button class="btn-primary" onclick="addHabitInline()">+ Add</button>' +
  '</div>';

  h += '</div>';

  /* ---- HEALTH TRACKERS ---- */
  h += '<div class="grid-2">';

  /* Calories */
  h += '<div class="card">' +
    '<div class="card-header">Calories Today</div>' +
    '<div style="display:flex;gap:8px;margin-bottom:10px;">' +
      '<input type="number" id="cal-input" ' +
        'placeholder="Enter total calories..." ' +
        'value="' + escHtml(state.todayCalories || '') + '" />' +
      '<button class="btn-primary" style="white-space:nowrap;" ' +
        'onclick="logCalories()">Log</button>' +
    '</div>';

  if (state.todayCalories) {
    h += '<div style="font-size:13px;font-weight:700;">' +
      'Today: <span style="color:#a855f7">' +
        state.todayCalories + ' kcal' +
      '</span>' +
    '</div>';
    var calNum = parseInt(state.todayCalories);
    var calColor = calNum > 2000 ? '#ef4444' : calNum > 1500 ? '#f59e0b' : '#10b981';
    h += '<div style="font-size:10px;color:' + calColor + ';margin-top:4px;">' +
      (calNum > 2000 ? 'Above target. Watch the sweets!' :
       calNum > 1500 ? 'On track. Keep it up!' :
       'Good! You are within target.') +
    '</div>';
  }

  h += '</div>';

  /* Daily Spend */
  h += '<div class="card">' +
    '<div class="card-header">Daily Spend</div>' +
    '<div style="display:flex;gap:8px;margin-bottom:10px;">' +
      '<input type="number" id="spend-input" ' +
        'placeholder="Rs spent today..." ' +
        'value="' + escHtml(state.todaySpend || '') + '" />' +
      '<button class="btn-primary" style="white-space:nowrap;" ' +
        'onclick="logSpend()">Log</button>' +
    '</div>';

  if (state.todaySpend) {
    h += '<div style="font-size:13px;font-weight:700;">' +
      'Today: <span style="color:#f59e0b">' +
        'Rs ' + formatRupees(state.todaySpend) +
      '</span>' +
    '</div>';
  }

  h += '</div>';
  h += '</div>';

  /* ---- CONSISTENCY ANALYSIS ---- */
  if (habits.length > 0) {
    h += '<div class="card">';
    h += '<div class="card-header">Consistency Analysis</div>';

    habits.forEach(function(habit) {
      var doneDays  = (habit.week || []).filter(Boolean).length;
      var consPct   = pct(doneDays, 7);
      var consColor = consPct >= 80 ? '#10b981' :
                      consPct >= 50 ? '#f59e0b' : '#ef4444';
      var consMsg   = consPct >= 80 ? 'Strong' :
                      consPct >= 50 ? 'Building' : 'Needs work';

      h += '<div class="progress-wrap">' +
        '<div class="progress-label">' +
          '<span>' + escHtml(habit.name) + '</span>' +
          '<span style="color:' + consColor + '">' +
            consMsg + ' - ' + consPct + '%' +
          '</span>' +
        '</div>' +
        '<div class="progress-bar">' +
          '<div class="progress-fill" ' +
            'style="width:' + consPct + '%;background:' + consColor + '">' +
          '</div>' +
        '</div>' +
      '</div>';
    });

    h += '</div>';
  }

  return h;
}

/* ============================================
   HABIT ACTIONS
   ============================================ */
function toggleHabit(habitIndex, dayIndex) {
  var habits = window.AppState.habits;
  if (!habits[habitIndex]) return;
  if (!habits[habitIndex].week) {
    habits[habitIndex].week = [0,0,0,0,0,0,0];
  }
  habits[habitIndex].week[dayIndex] =
    habits[habitIndex].week[dayIndex] ? 0 : 1;
  saveData();
  renderPage();
}

function deleteHabit(index) {
  if (!confirm('Delete this habit?')) return;
  window.AppState.habits.splice(index, 1);
  saveData();
  renderPage();
}

function logCalories() {
  var input = document.getElementById('cal-input');
  if (!input || !input.value) return;
  window.AppState.todayCalories = input.value;
  saveData();
  renderPage();
}

function logSpend() {
  var input = document.getElementById('spend-input');
  if (!input || !input.value) return;
  window.AppState.todaySpend = input.value;
  saveData();
  renderPage();
}

function addHabitInline() {
  var name = document.getElementById('new-habit-name');
  var cat  = document.getElementById('new-habit-cat');
  if (!name || !name.value.trim()) {
    alert('Please enter a habit name!');
    return;
  }
  window.AppState.habits.push({
    name: name.value.trim(),
    cat:  cat.value.trim() || 'General',
    week: [0,0,0,0,0,0,0]
  });
  saveData();
  renderPage();
}

console.log('habits.js loaded OK');