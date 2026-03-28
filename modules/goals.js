/* ============================================
   VASAVI'S LIFE OS - GOALS MODULE
   modules/goals.js
   ============================================ */

/* Goal categories config */
var GOAL_CATEGORIES = [
  { key: 'career',   icon: '💼', label: 'Career & Interview',
    hint: 'Job applications, mock interviews, skill targets' },
  { key: 'health',   icon: '💪', label: 'Health & Fitness',
    hint: 'Weight targets, gym goals, food discipline' },
  { key: 'finance',  icon: '💰', label: 'Finance',
    hint: 'Savings targets, spending limits, investment goals' },
  { key: 'learning', icon: '📚', label: 'Learning',
    hint: 'Books, courses, DS roadmap, language goals' },
  { key: 'personal', icon: '🧘', label: 'Personal Growth',
    hint: 'Meditation, journaling, habits, mindset' },
  { key: 'relations',icon: '👥', label: 'Relationships',
    hint: 'Family time, friendships, networking' },
  { key: 'rewards',  icon: '🏆', label: 'Rewards & Bucket List',
    hint: 'Milestones to celebrate, experiences to have' },
  { key: 'timeblock',icon: '⏰', label: 'Time-Blocked Goals',
    hint: 'Morning block, evening block, specific time goals' }
];

/* Timeline options */
var GOAL_TIMELINES = [
  'Today', 'This Week', 'This Month',
  'This Year', 'Custom Date', 'No Deadline'
];

function renderGoals() {
  var state = window.AppState;
  var tab   = state.goalTab || 'bytime';

  var h = '';

  /* ---- MAIN TAB BAR ---- */
  h += '<div class="subtab-bar" style="margin-bottom:14px;">';
  h += '<div class="subtab ' + (tab === 'focus' ? 'active' : '') + '" ' +
    'onclick="switchGoalTab(\'focus\')">🎯 Daily Focus</div>';
  h += '<div class="subtab ' + (tab === 'bytime' ? 'active' : '') + '" ' +
    'onclick="switchGoalTab(\'bytime\')">📅 By Time</div>';
  h += '<div class="subtab ' + (tab === 'bycat' ? 'active' : '') + '" ' +
    'onclick="switchGoalTab(\'bycat\')">🗂️ By Category</div>';
  h += '<div class="subtab ' + (tab === 'vision' ? 'active' : '') + '" ' +
    'onclick="switchGoalTab(\'vision\')">🌟 Vision</div>';
  h += '</div>';

  if (tab === 'focus')    h += renderTodaysFocus(state);
  if (tab === 'bytime')   h += renderByTime(state);
  if (tab === 'bycat')    h += renderByCategory(state);
  if (tab === 'vision')   h += renderVision(state);
  if (tab === 'calendar') h += renderCalendarView(state);

  return h;
}

/* ============================================
   BY TIME VIEW
   ============================================ */
function renderByTime(state) {
  var subTab = state.goalSubTab || 'daily';
  var h = '';

  h += '<div class="subtab-bar">';
  ['daily','weekly','monthly','yearly'].forEach(function(t) {
    var goals   = state.goals[t] || [];
    var pending = goals.filter(function(g) { return !g.done; }).length;
    h += '<div class="subtab ' + (subTab === t ? 'active' : '') + '" ' +
      'onclick="switchGoalSubTab(\'' + t + '\')">' +
      t.charAt(0).toUpperCase() + t.slice(1) +
      (pending > 0
        ? ' <span style="background:#ef4444;color:#fff;font-size:9px;' +
          'padding:1px 5px;border-radius:99px;margin-left:3px;">' +
          pending + '</span>' : '') +
    '</div>';
  });
  h += '</div>';

  if (subTab === 'weekly') return h + renderWeeklyDays(state);
  return h + renderTimeGoals(state, subTab);
}

function renderTimeGoals(state, period) {
  var goals   = state.goals[period] || [];
  var done    = goals.filter(function(g) { return g.done; }).length;
  var pending = goals.length - done;
  var h = '';

  /* Stats */
  h += '<div class="grid-3" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#a855f7">' +
    '<div class="stat-value">' + goals.length + '</div>' +
    '<div class="stat-label">' + period.charAt(0).toUpperCase() +
    period.slice(1) + ' Goals</div></div>';
  h += '<div class="stat-card" style="--stat-color:#10b981">' +
    '<div class="stat-value">' + done + '</div>' +
    '<div class="stat-label">Done</div>' +
    '<div class="stat-sub">' + pct(done, goals.length) + '%</div></div>';
  h += '<div class="stat-card" style="--stat-color:#ef4444">' +
    '<div class="stat-value">' + pending + '</div>' +
    '<div class="stat-label">Pending</div>' +
    '<div class="stat-sub">Carry forward</div></div>';
  h += '</div>';

  /* Progress */
  if (goals.length > 0) {
    h += '<div class="card" style="margin-bottom:14px;">' +
      '<div class="progress-wrap">' +
        '<div class="progress-label">' +
          '<span>' + period + ' progress</span>' +
          '<span>' + pct(done, goals.length) + '%</span>' +
        '</div>' +
        '<div class="progress-bar" style="height:8px;">' +
          '<div class="progress-fill" ' +
            'style="width:' + pct(done, goals.length) + '%"></div>' +
        '</div>' +
      '</div></div>';
  }

  /* Add form */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Add ' +
    period.charAt(0).toUpperCase() + period.slice(1) + ' Goal</div>';
  h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">' +
    '<input id="goal-text-input" ' +
      'placeholder="Enter goal..." style="flex:1;min-width:180px;" />' +
    '<select id="goal-priority-select" style="width:110px;">' +
      '<option value="High">High</option>' +
      '<option value="Medium" selected>Medium</option>' +
      '<option value="Low">Low</option>' +
    '</select>' +
  '</div>';
  h += '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
    '<input type="date" id="goal-date-input" style="width:155px;" />' +
    '<input type="time" id="goal-time-input" style="width:130px;" ' +
      'title="Set time for Google Calendar" />' +
    '<button class="btn-primary" ' +
      'onclick="addGoalInline(\'' + period + '\')">+ Add</button>' +
  '</div>';
  h += '</div>';

  /* Goals list */
  h += '<div class="card">';
  h += '<div class="card-header">Goals</div>';
  if (goals.length > 0) {
    goals.forEach(function(goal, idx) {
      h += renderGoalRow(goal, idx, period, false);
    });
    if (pending > 0) {
      h += '<div style="margin-top:10px;padding:10px;background:#1a1a35;' +
               'border-radius:8px;font-size:11px;color:#f59e0b;">' +
        '⏳ ' + pending + ' pending - carry forward automatically' +
      '</div>';
    }
  } else {
    h += '<div class="empty-state"><div class="emo">🎯</div>' +
      '<p>No ' + period + ' goals yet!</p></div>';
  }
  h += '</div>';

  return h;
}

/* ============================================
   WEEKLY DAY-BY-DAY VIEW
   ============================================ */
function renderWeeklyDays(state) {
  var h = '';
  var days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  var todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  /* Week stats */
  var allGoals = [];
  days.forEach(function(d) {
    allGoals = allGoals.concat(
      ((state.goals.weekdays || {})[d]) || []
    );
  });
  var weekDone = allGoals.filter(function(g) { return g.done; }).length;

  h += '<div class="grid-3" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#a855f7">' +
    '<div class="stat-value">' + allGoals.length + '</div>' +
    '<div class="stat-label">Week Total</div></div>';
  h += '<div class="stat-card" style="--stat-color:#10b981">' +
    '<div class="stat-value">' + weekDone + '</div>' +
    '<div class="stat-label">Done</div>' +
    '<div class="stat-sub">' + pct(weekDone, allGoals.length) + '%</div></div>';
  h += '<div class="stat-card" style="--stat-color:#06b6d4">' +
    '<div class="stat-value">' + todayDay.slice(0,3) + '</div>' +
    '<div class="stat-label">Today</div>' +
    '<div class="stat-sub">Focus day</div></div>';
  h += '</div>';

  days.forEach(function(day) {
    var isToday  = day === todayDay;
    var dayGoals = ((state.goals.weekdays || {})[day]) || [];
    var dayDone  = dayGoals.filter(function(g) { return g.done; }).length;

    h += '<div class="card" style="margin-bottom:10px;' +
      (isToday ? 'border-color:#a855f7;' : '') + '">';

    /* Day header */
    h += '<div style="display:flex;justify-content:space-between;' +
             'align-items:center;margin-bottom:10px;">';
    h += '<div style="font-weight:800;font-size:13px;color:' +
      (isToday ? '#a855f7' : '#f0f0ff') + ';">' +
      day + (isToday ? ' - Today' : '') + '</div>';
    if (dayGoals.length > 0) {
      h += '<div style="font-size:10px;color:#8899bb;">' +
        dayDone + '/' + dayGoals.length + ' done</div>';
    }
    h += '</div>';

    /* Goals */
    if (dayGoals.length > 0) {
      dayGoals.forEach(function(goal, gi) {
        h += '<div style="display:flex;align-items:center;gap:8px;' +
                 'padding:7px 0;border-bottom:1px solid #1a1a35;">';
        h += '<input type="checkbox" ' + (goal.done ? 'checked' : '') +
          ' onchange="toggleWeekdayGoal(\'' + day + '\',' + gi + ')" ' +
          'style="width:13px;height:13px;accent-color:#a855f7;cursor:pointer;" />';
        h += '<span style="flex:1;font-size:12px;' +
          (goal.done ? 'text-decoration:line-through;color:#556080;' : '') + '">' +
          escHtml(goal.text) + '</span>';
        if (goal.time) {
          h += '<span style="font-size:10px;color:#a855f7;">🕐' + goal.time + '</span>';
          h += '<button onclick="exportToGCal(\'' +
            escHtml(goal.text) + '\',\'' + goal.time + '\',\'' + day + '\')" ' +
            'style="background:none;border:1px solid #1a1a35;color:#8899bb;' +
                   'border-radius:5px;padding:2px 5px;cursor:pointer;font-size:9px;">' +
            '📅</button>';
        }
        var tagClass = goal.priority === 'High'   ? 'tag-high'   :
                       goal.priority === 'Medium' ? 'tag-medium' : 'tag-low';
        h += '<span class="tag ' + tagClass + '">' + goal.priority + '</span>';
        h += '<button onclick="deleteWeekdayGoal(\'' + day + '\',' + gi + ')" ' +
          'style="background:none;border:none;color:#556080;cursor:pointer;' +
                 'font-size:13px;">✕</button>';
        h += '</div>';
      });
    } else {
      h += '<div style="font-size:11px;color:#556080;padding:4px 0;">' +
        'No goals for ' + day + ' yet.</div>';
    }

    /* Add form */
    h += '<div style="display:flex;gap:6px;margin-top:8px;' +
             'padding-top:8px;border-top:1px solid #1a1a35;">' +
      '<input id="wd-inp-' + day + '" ' +
        'placeholder="Add goal for ' + day + '..." ' +
        'style="flex:1;font-size:11px;" />' +
      '<input type="time" id="wd-time-' + day + '" ' +
        'style="width:100px;font-size:11px;" />' +
      '<select id="wd-pri-' + day + '" style="width:90px;font-size:11px;">' +
        '<option value="High">High</option>' +
        '<option value="Medium" selected>Medium</option>' +
        '<option value="Low">Low</option>' +
      '</select>' +
      '<button class="btn-primary btn-small" ' +
        'onclick="addWeekdayGoal(\'' + day + '\')">+</button>' +
    '</div>';

    h += '</div>';
  });

  return h;
}

/* ============================================
   BY CATEGORY VIEW
   ============================================ */
function renderByCategory(state) {
  var activecat = state.goalActiveCat || 'career';
  var h = '';

  /* Category pills */
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">';
  GOAL_CATEGORIES.forEach(function(cat) {
    var catGoals   = ((state.goals.categories || {})[cat.key]) || [];
    var catPending = catGoals.filter(function(g) { return !g.done; }).length;
    h += '<div style="padding:6px 12px;border-radius:99px;cursor:pointer;' +
             'font-size:11px;font-weight:700;transition:.12s;' +
             'background:' + (activecat === cat.key ? 'var(--accent)' : 'var(--card2)') + ';' +
             'border:1px solid ' + (activecat === cat.key ? 'var(--accent)' : 'var(--border)') + ';' +
             'color:' + (activecat === cat.key ? '#fff' : 'var(--muted2)') + ';" ' +
      'onclick="switchGoalCat(\'' + cat.key + '\')">' +
      cat.icon + ' ' + cat.label +
      (catPending > 0
        ? ' <span style="background:#ef4444;color:#fff;font-size:9px;' +
          'padding:1px 5px;border-radius:99px;margin-left:3px;">' +
          catPending + '</span>' : '') +
    '</div>';
  });
  h += '</div>';

  /* Active category */
  var cat = GOAL_CATEGORIES.find(function(c) { return c.key === activecat; });
  if (!cat) return h;

  var catGoals = ((state.goals.categories || {})[activecat]) || [];
  var done     = catGoals.filter(function(g) { return g.done; }).length;
  var pending  = catGoals.length - done;

  /* Category header */
  h += '<div style="background:linear-gradient(135deg,#1a0533,#0a1020);' +
       'border-radius:12px;padding:16px;margin-bottom:14px;' +
       'display:flex;align-items:center;gap:14px;">';
  h += '<div style="font-size:32px;">' + cat.icon + '</div>';
  h += '<div>';
  h += '<div style="font-size:15px;font-weight:900;">' + cat.label + '</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-top:2px;">' +
    cat.hint + '</div>';
  h += '<div style="font-size:11px;color:#10b981;margin-top:4px;">' +
    done + ' done · ' + pending + ' pending</div>';
  h += '</div></div>';

  /* Add form */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Add ' + cat.label + ' Goal</div>';

  h += '<div class="form-row">' +
    '<input id="cat-goal-text" placeholder="' + cat.hint + '" />' +
  '</div>';

  h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">' +
    '<select id="cat-goal-timeline" style="flex:1;min-width:140px;">' +
      GOAL_TIMELINES.map(function(t) {
        return '<option value="' + t + '">' + t + '</option>';
      }).join('') +
    '</select>' +
    '<select id="cat-goal-priority" style="width:110px;">' +
      '<option value="High">High</option>' +
      '<option value="Medium" selected>Medium</option>' +
      '<option value="Low">Low</option>' +
    '</select>' +
  '</div>';

  h += '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
    '<input type="date" id="cat-goal-date" style="width:155px;" />' +
    '<input type="time" id="cat-goal-time" style="width:130px;" ' +
      'title="Time for Google Calendar" />' +
    '<button class="btn-primary" ' +
      'onclick="addCatGoal(\'' + activecat + '\')">+ Add</button>' +
  '</div>';

  /* Category-specific suggestions */
  var suggestions = getCatSuggestions(activecat);
  if (suggestions.length > 0) {
    h += '<div style="margin-top:10px;">';
    h += '<div style="font-size:10px;color:#8899bb;margin-bottom:6px;">' +
      '💡 Quick suggestions — click to add:' +
    '</div>';
    h += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    suggestions.forEach(function(s) {
      h += '<div onclick="quickAddCatGoal(\'' + activecat + '\',\'' +
        s.replace(/'/g, '') + '\')" ' +
        'style="padding:4px 10px;border-radius:99px;border:1px solid #1a1a35;' +
               'font-size:10px;color:#8899bb;cursor:pointer;' +
               'transition:.12s;" ' +
        'onmouseover="this.style.borderColor=\'#a855f7\';this.style.color=\'#a855f7\';" ' +
        'onmouseout="this.style.borderColor=\'#1a1a35\';this.style.color=\'#8899bb\';">' +
        '+ ' + s +
      '</div>';
    });
    h += '</div></div>';
  }

  h += '</div>';

  /* Goals list */
  h += '<div class="card">';
  h += '<div class="card-header">' + cat.icon + ' ' + cat.label + ' Goals</div>';

  if (catGoals.length > 0) {
    /* Group by timeline */
    var grouped = {};
    catGoals.forEach(function(goal, idx) {
      var tl = goal.timeline || 'No Deadline';
      if (!grouped[tl]) grouped[tl] = [];
      grouped[tl].push({ goal: goal, idx: idx });
    });

    Object.keys(grouped).forEach(function(timeline) {
      h += '<div style="font-size:10px;color:#a855f7;font-weight:800;' +
               'text-transform:uppercase;letter-spacing:.8px;' +
               'margin:10px 0 6px;">📅 ' + timeline + '</div>';

      grouped[timeline].forEach(function(item) {
        h += renderGoalRow(item.goal, item.idx, 'cat_' + activecat, true);
      });
    });

    if (pending > 0) {
      h += '<div style="margin-top:10px;padding:10px;background:#1a1a35;' +
               'border-radius:8px;font-size:11px;color:#f59e0b;">' +
        '⏳ ' + pending + ' pending goals in ' + cat.label +
      '</div>';
    }
  } else {
    h += '<div class="empty-state">' +
      '<div style="font-size:32px;margin-bottom:8px;">' + cat.icon + '</div>' +
      '<p>No ' + cat.label + ' goals yet.<br>Add your first one above!</p>' +
    '</div>';
  }

  h += '</div>';
  return h;
}

/* Category-specific suggestions */
function getCatSuggestions(catKey) {
  var map = {
    career:    ['Apply to 10 companies this week',
                'Complete DS Roadmap Day 1',
                'Update LinkedIn profile',
                'Push project to GitHub',
                'Practice 5 interview questions'],
    health:    ['Gym 5 days this week',
                'No sweets before 6PM',
                'Drink 2L water daily',
                'Sleep by 11PM for 7 days',
                'Log calories daily'],
    finance:   ['Save Rs 1000 this month',
                'Track all expenses this week',
                'No unnecessary shopping',
                'Review monthly spending',
                'Start emergency fund'],
    learning:  ['Complete DS Day 1 revision',
                'Read 30 mins daily',
                'Learn 10 Korean words',
                'Finish Atomic Habits',
                'Watch 1 learning video daily'],
    personal:  ['Meditate 10 mins daily',
                'Write journal every night',
                '3 gratitude points daily',
                'No phone after 10PM',
                'Morning routine for 7 days'],
    relations: ['Call family daily',
                'Quality time 1hr with family',
                'Connect with 5 DS people LinkedIn',
                'Message one friend this week',
                'Attend networking event'],
    rewards:   ['Movie night after 10-day DS plan',
                'Buy something nice after job offer',
                'Celebrate every streak milestone',
                'Trip to Coorg after first salary',
                'Korean food restaurant in Bangalore'],
    timeblock: ['Study 5:30-7AM every day',
                'Deep work 10:30AM-1PM',
                'No phone during work blocks',
                'Evening workout 9-9:30PM',
                'Interview prep 9:30-10:30PM']
  };
  return map[catKey] || [];
}

/* ============================================
   CALENDAR VIEW
   ============================================ */
function renderCalendarView(state) {
  var h = '';
  var now   = new Date();
  var year  = now.getFullYear();
  var month = now.getMonth();

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">' +
    now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) +
    ' - Activity & Streaks' +
  '</div>';

  /* Day labels */
  h += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:4px;">';
  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(function(d) {
    h += '<div style="text-align:center;font-size:9px;color:#556080;font-weight:700;">' +
      d + '</div>';
  });
  h += '</div>';

  /* Calendar cells */
  h += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;">';

  var firstDay    = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var today       = now.getDate();

  for (var e = 0; e < firstDay; e++) {
    h += '<div></div>';
  }

  for (var d = 1; d <= daysInMonth; d++) {
    var dateStr    = new Date(year, month, d).toDateString();
    var isToday    = d === today;
    var hasSession = (state.sessions || []).some(function(s) {
      return new Date(s.start).toDateString() === dateStr;
    });
    var gymDone    = (state.gymLog || {})[dateStr];

    var bg = isToday    ? '#a855f7' :
             hasSession ? '#10b981' :
             gymDone    ? '#06b6d4' : '#1a1a35';
    var fg = (isToday || hasSession || gymDone) ? '#fff' : '#556080';

    h += '<div style="aspect-ratio:1;display:flex;align-items:center;' +
             'justify-content:center;border-radius:4px;font-size:10px;' +
             'font-weight:' + (isToday ? '800' : '400') + ';' +
             'background:' + bg + ';color:' + fg + ';" ' +
             'title="' + dateStr + '">' + d + '</div>';
  }

  h += '</div>';

  /* Legend */
  h += '<div style="display:flex;gap:14px;margin-top:12px;flex-wrap:wrap;">';
  [['#a855f7','Today'],['#10b981','Focus session'],
   ['#06b6d4','Gym done'],['#1a1a35','No activity']].forEach(function(l) {
    h += '<div style="display:flex;align-items:center;gap:5px;' +
             'font-size:10px;color:#8899bb;">' +
      '<div style="width:10px;height:10px;border-radius:2px;background:' +
        l[0] + ';"></div>' + l[1] +
    '</div>';
  });
  h += '</div>';
  h += '</div>';

  /* Streak summary */
  h += '<div class="card">';
  h += '<div class="card-header">Current Streaks</div>';

  var habits    = state.habits || [];
  var gymCount  = Object.values(state.gymLog || {}).filter(Boolean).length;
  var sessCount = (state.sessions || []).length;

  if (habits.length > 0) {
    habits.forEach(function(habit) {
      var streak = (habit.week || []).filter(Boolean).length;
      h += '<div style="display:flex;justify-content:space-between;' +
               'padding:7px 0;border-bottom:1px solid #1a1a35;">' +
        '<span style="font-size:12px;">' + escHtml(habit.name) + '</span>' +
        '<span class="streak-badge">🔥 ' + streak + 'd</span>' +
      '</div>';
    });
  }

  h += '<div style="display:flex;justify-content:space-between;' +
           'padding:7px 0;border-bottom:1px solid #1a1a35;">' +
    '<span style="font-size:12px;">Gym sessions total</span>' +
    '<span class="streak-badge">🏋️ ' + gymCount + '</span>' +
  '</div>';

  h += '<div style="display:flex;justify-content:space-between;padding:7px 0;">' +
    '<span style="font-size:12px;">Focus sessions total</span>' +
    '<span class="streak-badge">💻 ' + sessCount + '</span>' +
  '</div>';

  h += '</div>';
  return h;
}

/* ============================================
   VISION TAB
   ============================================ */
function renderVision(state) {
  var vision = state.vision || {};
  var h = '';

  h += '<div style="background:linear-gradient(135deg,#1a0533,#0a1428);' +
       'border-radius:12px;padding:20px;margin-bottom:14px;text-align:center;">';
  h += '<div style="font-size:28px;margin-bottom:8px;">🌟</div>';
  h += '<div style="font-size:16px;font-weight:900;margin-bottom:4px;">' +
    'Vasavi\'s Long-Term Vision</div>';
  h += '<div style="font-size:11px;color:#8899bb;">' +
    'Write what you want. Read it every day. Make it real.</div>';
  h += '</div>';

  var visions = [
    { key:'oneYear',   icon:'🎯', label:'1 Year Vision',
      hint:'Where do you want to be in 1 year?' },
    { key:'threeYear', icon:'🚀', label:'3 Year Vision',
      hint:'What does your life look like in 3 years?' },
    { key:'fiveYear',  icon:'🌟', label:'5 Year Vision',
      hint:'Your biggest dream - write it boldly!' }
  ];

  h += '<div class="grid-3" style="margin-bottom:14px;">';
  visions.forEach(function(v) {
    h += '<div class="card">';
    h += '<div style="text-align:center;font-size:24px;margin-bottom:6px;">' +
      v.icon + '</div>';
    h += '<div style="font-size:10px;color:#a855f7;font-weight:800;' +
             'text-align:center;margin-bottom:8px;">' + v.label + '</div>';
    h += '<textarea rows="4" id="vision-' + v.key + '" ' +
      'placeholder="' + v.hint + '" style="font-size:11px;resize:none;">' +
      escHtml(vision[v.key] || '') + '</textarea>';
    h += '</div>';
  });
  h += '</div>';

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">My Core Values</div>';
  h += '<textarea rows="3" id="vision-values" ' +
    'placeholder="What values matter most? e.g. Growth, Family, Creativity...">' +
    escHtml(vision.values || '') + '</textarea>';
  h += '</div>';

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">My Purpose - Why I Do This</div>';
  h += '<textarea rows="3" id="vision-purpose" ' +
    'placeholder="Why do you want all of this? What drives you?">' +
    escHtml(vision.purpose || '') + '</textarea>';
  h += '</div>';

  h += '<div class="card">';
  h += '<div class="card-header">Free Notes - Write Anything</div>';
  h += '<textarea rows="6" id="vision-notes" ' +
    'placeholder="Your dreams, thoughts, ideas...">' +
    escHtml(vision.notes || '') + '</textarea>';
  h += '<button class="btn-primary" ' +
    'style="margin-top:10px;" onclick="saveVision()">Save Vision 🌟</button>';
  h += '</div>';

  return h;
}

/* ============================================
   GOAL ROW HELPER
   ============================================ */
function renderGoalRow(goal, idx, tabOrCat, showTimeline) {
  var tagClass = goal.priority === 'High'   ? 'tag-high'   :
                 goal.priority === 'Medium' ? 'tag-medium' : 'tag-low';

  var isCat = tabOrCat.startsWith('cat_');
  var catKey = isCat ? tabOrCat.replace('cat_', '') : null;

  var h = '<div style="background:' +
    (goal.done ? '#0d1f0d' : 'var(--card2)') +
    ';border:1px solid ' +
    (goal.done ? '#14532d' : 'var(--border)') +
    ';border-radius:9px;padding:11px;margin-bottom:7px;' +
    'display:flex;align-items:center;gap:8px;">';

  var toggleFn = isCat
    ? 'toggleCatGoal(\'' + catKey + '\',' + idx + ')'
    : 'toggleGoal(\'' + tabOrCat + '\',' + idx + ')';

  var deleteFn = isCat
    ? 'deleteCatGoal(\'' + catKey + '\',' + idx + ')'
    : 'deleteGoal(\'' + tabOrCat + '\',' + idx + ')';

  h += '<input type="checkbox" ' + (goal.done ? 'checked' : '') +
    ' onchange="' + toggleFn + '" ' +
    'style="width:15px;height:15px;accent-color:#a855f7;cursor:pointer;flex-shrink:0;" />';

  h += '<div style="flex:1;">';
  h += '<div style="font-size:12px;font-weight:600;' +
    (goal.done ? 'text-decoration:line-through;color:#556080;' : '') + '">' +
    escHtml(goal.text) + '</div>';

  var meta = [];
  if (showTimeline && goal.timeline) meta.push('📋 ' + goal.timeline);
  if (goal.deadline) meta.push('📅 ' + goal.deadline);
  if (goal.time)     meta.push('🕐 ' + goal.time);
  if (meta.length > 0) {
    h += '<div style="font-size:10px;color:#556080;margin-top:2px;">' +
      meta.join(' &nbsp;·&nbsp; ') + '</div>';
  }
  h += '</div>';

  h += '<span class="tag ' + tagClass + '">' + goal.priority + '</span>';

  if (goal.time || goal.deadline) {
    h += '<button onclick="exportToGCal(\'' +
      escHtml(goal.text) + '\',\'' + (goal.time || '09:00') +
      '\',\'' + (goal.deadline || new Date().toISOString().split('T')[0]) + '\')" ' +
      'style="background:none;border:1px solid #1a1a35;color:#8899bb;' +
             'border-radius:5px;padding:2px 6px;cursor:pointer;font-size:9px;" ' +
      'title="Export to Google Calendar">📅</button>';
  }

  h += '<button onclick="' + deleteFn + '" ' +
    'style="background:none;border:none;color:#556080;cursor:pointer;font-size:14px;">✕</button>';

  h += '</div>';
  return h;
}

/* ============================================
   ALL ACTIONS
   ============================================ */
function switchGoalTab(tab) {
  window.AppState.goalTab = tab;
  saveData(); renderPage();
}

function switchGoalSubTab(tab) {
  window.AppState.goalSubTab = tab;
  saveData(); renderPage();
}

function switchGoalCat(cat) {
  window.AppState.goalActiveCat = cat;
  saveData(); renderPage();
}

function addGoalInline(period) {
  var t = document.getElementById('goal-text-input');
  var p = document.getElementById('goal-priority-select');
  var d = document.getElementById('goal-date-input');
  var tm= document.getElementById('goal-time-input');
  if (!t || !t.value.trim()) { showToast('Please enter a goal!','error'); return; }
  /* Ensure goals structure exists */
  if (!window.AppState.goals) window.AppState.goals = {};
  if (!window.AppState.goals[period]) window.AppState.goals[period] = [];
  if (!Array.isArray(window.AppState.goals[period])) window.AppState.goals[period] = [];

  window.AppState.goals[period].push({
    id:       Date.now(),
    text:     t.value.trim(),
    priority: p  ? p.value  : 'Medium',
    deadline: d  ? d.value  : '',
    time:     tm ? tm.value : '',
    done:     false,
    createdAt: new Date().toISOString()
  });
  t.value = '';
  saveData(); renderPage();
  showToast('Goal added! ✅');
}

function toggleGoal(tab, idx) {
  var goals = window.AppState.goals[tab];
  if (!goals || !goals[idx]) return;
  goals[idx].done = !goals[idx].done;
  saveData(); renderPage();
}

function deleteGoal(tab, idx) {
  if (!confirm('Delete this goal?')) return;
  window.AppState.goals[tab].splice(idx, 1);
  saveData(); renderPage();
}

function addCatGoal(catKey) {
  var t  = document.getElementById('cat-goal-text');
  var tl = document.getElementById('cat-goal-timeline');
  var p  = document.getElementById('cat-goal-priority');
  var d  = document.getElementById('cat-goal-date');
  var tm = document.getElementById('cat-goal-time');
  if (!t || !t.value.trim()) { alert('Please enter a goal!'); return; }
  if (!window.AppState.goals.categories) window.AppState.goals.categories = {};
  if (!window.AppState.goals.categories[catKey]) {
    window.AppState.goals.categories[catKey] = [];
  }
  window.AppState.goals.categories[catKey].push({
    text:     t.value.trim(),
    timeline: tl ? tl.value : 'No Deadline',
    priority: p  ? p.value  : 'Medium',
    deadline: d  ? d.value  : '',
    time:     tm ? tm.value : '',
    done:     false
  });
  saveData(); renderPage();
}

function quickAddCatGoal(catKey, text) {
  if (!window.AppState.goals.categories) window.AppState.goals.categories = {};
  if (!window.AppState.goals.categories[catKey]) {
    window.AppState.goals.categories[catKey] = [];
  }
  window.AppState.goals.categories[catKey].push({
    text:     text,
    timeline: 'This Week',
    priority: 'Medium',
    done:     false
  });
  saveData(); renderPage();
}

function toggleCatGoal(catKey, idx) {
  var goals = ((window.AppState.goals.categories || {})[catKey]);
  if (!goals || !goals[idx]) return;
  goals[idx].done = !goals[idx].done;
  saveData(); renderPage();
}

function deleteCatGoal(catKey, idx) {
  if (!confirm('Delete this goal?')) return;
  window.AppState.goals.categories[catKey].splice(idx, 1);
  saveData(); renderPage();
}

function addWeekdayGoal(day) {
  var inp = document.getElementById('wd-inp-'  + day);
  var tim = document.getElementById('wd-time-' + day);
  var pri = document.getElementById('wd-pri-'  + day);
  if (!inp || !inp.value.trim()) return;
  if (!window.AppState.goals.weekdays) window.AppState.goals.weekdays = {};
  if (!window.AppState.goals.weekdays[day]) window.AppState.goals.weekdays[day] = [];
  window.AppState.goals.weekdays[day].push({
    text:     inp.value.trim(),
    priority: pri ? pri.value : 'Medium',
    time:     tim ? tim.value : '',
    done:     false
  });
  saveData(); renderPage();
}

function toggleWeekdayGoal(day, idx) {
  var goals = ((window.AppState.goals.weekdays || {})[day]);
  if (!goals || !goals[idx]) return;
  goals[idx].done = !goals[idx].done;
  saveData(); renderPage();
}

function deleteWeekdayGoal(day, idx) {
  if (!confirm('Delete this goal?')) return;
  window.AppState.goals.weekdays[day].splice(idx, 1);
  saveData(); renderPage();
}

function saveVision() {
  if (!window.AppState.vision) window.AppState.vision = {};
  ['oneYear','threeYear','fiveYear','values','purpose','notes'].forEach(function(f) {
    var el = document.getElementById('vision-' + f);
    if (el) window.AppState.vision[f] = el.value;
  });
  saveData();
  alert('Vision saved! Read this every day. 🌟');
}

function exportToGCal(title, time, date) {
  try {
    var dateStr = typeof date === 'string' && date.includes('-')
      ? date.replace(/-/g, '')
      : new Date().toISOString().split('T')[0].replace(/-/g, '');
    var timeStr = time ? time.replace(':', '') + '00' : '090000';
    var startH  = parseInt(timeStr.substring(0, 2));
    var endStr  = String(startH + 1).padStart(2, '0') + timeStr.substring(2);
    var url = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text='    + encodeURIComponent(title) +
      '&dates='   + dateStr + 'T' + timeStr + '/' + dateStr + 'T' + endStr +
      '&details=' + encodeURIComponent('Added from Vasavi Life OS') +
      '&location=Bengaluru';
    window.open(url, '_blank');
  } catch(e) {
    alert('Could not open Google Calendar. Check date and time.');
  }
}

/* ============================================
   TODAY'S FOCUS — Hourly Planner
   Write what you are doing every hour
   ============================================ */
function renderTodaysFocus(state) {
  if (!state.hourlyFocus) state.hourlyFocus = {};
  var today = new Date().toISOString().split('T')[0];
  if (!state.hourlyFocus[today]) state.hourlyFocus[today] = {};
  var todayHours = state.hourlyFocus[today];

  var h = '';

  /* Today's ONE Thing */
  h += '<div class="card" style="margin-bottom:12px;">';
  h += '<div class="card-header">⭐ Today\'s ONE Thing</div>';
  h += '<input id="one-thing-focus" value="' + escHtml((state.planner && state.planner.focus) || '') + '" ';
  h += 'placeholder="What is the ONE most important thing today?" ';
  h += 'style="width:100%;font-size:14px;font-weight:700;" ';
  h += 'onchange="saveOneThing(this.value)" />';
  h += '</div>';

  /* Hourly blocks */
  h += '<div class="card">';
  h += '<div class="card-header">📋 Hour by Hour — What are you doing?</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;">Tap any hour to write what you did or are doing</div>';

  var hours = [
    '5 AM','6 AM','7 AM','8 AM','9 AM','10 AM','11 AM',
    '12 PM','1 PM','2 PM','3 PM','4 PM','5 PM','6 PM',
    '7 PM','8 PM','9 PM','10 PM'
  ];

  var nowHour = new Date().getHours();

  hours.forEach(function(hr) {
    var key = hr.replace(' ','').toLowerCase();
    var val = todayHours[key] || '';
    var hrNum = parseInt(hr);
    var isPM = hr.includes('PM');
    var h24 = isPM && hrNum !== 12 ? hrNum + 12 : (!isPM && hrNum === 12 ? 0 : hrNum);
    var isNow = Math.abs(h24 - nowHour) <= 1;
    var isDone = val.trim() !== '';

    h += '<div style="display:flex;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid #1a1a35;">';
    h += '<div style="width:52px;font-size:11px;font-weight:700;color:' + (isNow ? '#a855f7' : '#556080') + ';flex-shrink:0;">' + hr + '</div>';
    h += '<div style="width:8px;height:8px;border-radius:50%;background:' + (isDone ? '#10b981' : isNow ? '#a855f7' : '#1a1a35') + ';flex-shrink:0;"></div>';
    h += '<input value="' + escHtml(val) + '" placeholder="' + (isNow ? 'What are you doing right now?' : 'What did you do?') + '" ';
    h += 'style="flex:1;font-size:12px;background:transparent;border:none;border-bottom:1px solid ' + (isNow ? '#a855f7' : '#1a1a35') + ';padding:2px 0;" ';
    h += 'onchange="saveHourlyFocus(\'' + key + '\', this.value)" />';
    h += '</div>';
  });

  h += '</div>';

  /* Quick summary */
  var filled = Object.keys(todayHours).filter(function(k){ return todayHours[k].trim(); }).length;
  if (filled > 0) {
    h += '<div class="card" style="margin-top:12px;">';
    h += '<div class="card-header">📊 Today\'s Summary</div>';
    h += '<div style="font-size:12px;color:#10b981;margin-bottom:8px;">' + filled + ' hours logged today ✅</div>';
    Object.keys(todayHours).forEach(function(k) {
      if (todayHours[k].trim()) {
        h += '<div style="font-size:11px;padding:4px 0;color:#a0aec0;">' +
          '<span style="color:#a855f7;font-weight:700;">' + k.toUpperCase() + '</span> — ' +
          escHtml(todayHours[k]) + '</div>';
      }
    });
    h += '</div>';
  }

  return h;
}

function saveOneThing(val) {
  if (!window.AppState.planner) window.AppState.planner = {};
  window.AppState.planner.focus = val;
  saveData();
}

function saveHourlyFocus(hourKey, val) {
  var today = new Date().toISOString().split('T')[0];
  if (!window.AppState.hourlyFocus) window.AppState.hourlyFocus = {};
  if (!window.AppState.hourlyFocus[today]) window.AppState.hourlyFocus[today] = {};
  window.AppState.hourlyFocus[today][hourKey] = val;
  saveData();
}

console.log('goals.js loaded OK');