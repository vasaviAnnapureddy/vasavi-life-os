/* ============================================
   VASAVI'S LIFE OS - HABITS MODULE
   modules/habits.js
   ============================================ */

/* ============================================
   HABIT HISTORY SYNC
   Old version only stored one week [0..6] which
   got overwritten forever. Now every tick is
   stored per-date in habit.history = {'YYYY-MM-DD':1}
   so monthly + yearly analytics work.
   ============================================ */
function habitWeekDates() {
  var now = new Date();
  var dates = [];
  for (var i = 0; i < 7; i++) {
    var d = new Date(now);
    d.setDate(now.getDate() - now.getDay() + i);
    dates.push(aeIso(d));
  }
  return dates;
}

function syncHabitHistory(state) {
  var habits = state.habits || [];
  var weekDates = habitWeekDates();
  habits.forEach(function(habit) {
    if (!habit.history) habit.history = {};
    /* One-time migration: copy current week ticks into dated history */
    if (!habit.historyMigrated) {
      (habit.week || []).forEach(function(done, i) {
        if (done) habit.history[weekDates[i]] = 1;
      });
      habit.historyMigrated = true;
    }
    /* Rebuild week view from history (auto-resets each new week) */
    habit.week = weekDates.map(function(iso) {
      return habit.history[iso] ? 1 : 0;
    });
  });
}

function renderHabits() {
  var state       = window.AppState;
  var habits      = state.habits || [];
  syncHabitHistory(state);

  /* ---- VIEW SWITCHER ---- */
  var view = state.habitsView || 'week';
  var vh = '<div class="subtab-bar">';
  [['week','✅ This Week'],['mood','💗 Mood &amp; Cycle'],['analytics','📊 Data Analytics']].forEach(function(t) {
    vh += '<div class="subtab ' + (view===t[0]?'active':'') + '" onclick="switchHabitsView(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  vh += '</div>';
  if (view === 'analytics') return vh + renderHabitsAnalytics(state);
  if (view === 'mood')      return vh + renderMoodCycle(state);

  var todayIdx    = todayIndex();
  var habitsDone  = habits.filter(function(h) {
    return (h.week || [])[todayIdx];
  }).length;
  var habAvg = habits.length > 0
    ? Math.round(habits.reduce(function(a, h) {
        return a + pct((h.week || []).filter(Boolean).length, 7);
      }, 0) / habits.length)
    : 0;

  var h = vh;

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
      var streak = aeStreakFlexible(habit.history || {}, 1);
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
  var habit = habits[habitIndex];
  if (!habit.week)    habit.week = [0,0,0,0,0,0,0];
  if (!habit.history) habit.history = {};

  var iso = habitWeekDates()[dayIndex];
  if (habit.week[dayIndex]) {
    habit.week[dayIndex] = 0;
    delete habit.history[iso];
  } else {
    habit.week[dayIndex] = 1;
    habit.history[iso] = 1;
  }
  saveData();
  renderPage();
}

function switchHabitsView(v)  { window.AppState.habitsView = v; saveData(); renderPage(); }
function setHabitAnalyticsSel(i) { window.AppState.habitSel = i; saveData(); renderPage(); }

/* ============================================
   💗 MOOD, ENERGY & CYCLE
   10 seconds a day. Over months it shows you
   patterns nothing else can — how your energy
   moves with your cycle, and how that lines up
   with focus and gym. Your body as data.
   ============================================ */
var MOOD_FACES  = ['😞','😕','😐','🙂','😄'];
var ENERGY_BARS = ['🪫','🔋','🔋','⚡','⚡'];

function renderMoodCycle(state) {
  var h = '';
  var iso = aeTodayIso();
  var log = state.moodLog || {};      /* iso -> {mood, energy} */
  var today = log[iso] || {};
  var cycles = (state.cycleStarts || []).slice().sort();   /* array of iso dates */

  /* ---- TODAY'S CHECK-IN ---- */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">💗 How are you today?</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;">Ten seconds. Be honest — this is only for you.</div>';

  h += '<div style="font-size:11px;font-weight:700;color:#8899bb;margin-bottom:6px;">Mood</div>';
  h += '<div style="display:flex;gap:6px;margin-bottom:12px;">';
  MOOD_FACES.forEach(function(f, i) {
    var sel = today.mood === (i+1);
    h += '<div onclick="setMood(' + (i+1) + ')" style="flex:1;text-align:center;padding:10px 4px;border-radius:10px;cursor:pointer;font-size:22px;' +
      'background:' + (sel?'#ec489922':'var(--card2)') + ';border:2px solid ' + (sel?'#ec4899':'var(--border)') + ';">' + f + '</div>';
  });
  h += '</div>';

  h += '<div style="font-size:11px;font-weight:700;color:#8899bb;margin-bottom:6px;">Energy</div>';
  h += '<div style="display:flex;gap:6px;margin-bottom:8px;">';
  [1,2,3,4,5].forEach(function(n) {
    var sel = today.energy === n;
    h += '<div onclick="setEnergy(' + n + ')" style="flex:1;text-align:center;padding:9px 4px;border-radius:10px;cursor:pointer;font-size:12px;font-weight:800;' +
      'background:' + (sel?'#06b6d422':'var(--card2)') + ';border:2px solid ' + (sel?'#06b6d4':'var(--border)') + ';color:' + (sel?'#06b6d4':'#8899bb') + ';">' + n + '</div>';
  });
  h += '</div>';
  if (today.mood || today.energy) {
    h += '<div style="font-size:11px;color:#10b981;text-align:center;">✓ Logged for today — mood ' + (today.mood||'–') + '/5, energy ' + (today.energy||'–') + '/5</div>';
  }
  h += '</div>';

  /* ---- CYCLE ---- */
  var lastStart = cycles[cycles.length-1];
  var dayOfCycle = null, avgLen = 28;
  if (cycles.length >= 2) {
    var gaps = [];
    for (var i = 1; i < cycles.length; i++) {
      gaps.push(Math.round((new Date(cycles[i]) - new Date(cycles[i-1])) / 86400000));
    }
    var valid = gaps.filter(function(g){ return g >= 18 && g <= 45; });
    if (valid.length) avgLen = Math.round(valid.reduce(function(a,b){return a+b;},0) / valid.length);
  }
  if (lastStart) dayOfCycle = Math.floor((new Date(iso) - new Date(lastStart)) / 86400000) + 1;

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">🌸 Cycle Tracking</div>';
  if (dayOfCycle && dayOfCycle > 0 && dayOfCycle < 60) {
    var phase, pcol, advice;
    if (dayOfCycle <= 5)       { phase = 'Period';      pcol='#ec4899'; advice='Rest is productive. Switch to Period Yoga in Gym Planner and lower your focus target — that is smart, not weak.'; }
    else if (dayOfCycle <= 13) { phase = 'Follicular';  pcol='#10b981'; advice='Energy climbing. Best window for hard study, new topics and heavy gym days. Push now.'; }
    else if (dayOfCycle <= 16) { phase = 'Ovulation';   pcol='#f59e0b'; advice='Peak energy and confidence. Ideal for interviews, presentations and your hardest work.'; }
    else                       { phase = 'Luteal';      pcol='#6366f1'; advice='Energy dips gradually. Favour revision over new topics; expect more cravings — plan meals ahead.'; }

    h += '<div style="text-align:center;padding:8px 0 12px;">';
    h += '<div style="font-size:11px;color:#8899bb;">Day of cycle</div>';
    h += '<div style="font-size:34px;font-weight:900;color:' + pcol + ';">' + dayOfCycle + '</div>';
    h += '<div style="font-size:13px;font-weight:800;color:' + pcol + ';">' + phase + ' phase</div>';
    if (cycles.length >= 2) {
      var nextIn = avgLen - dayOfCycle;
      h += '<div style="font-size:11px;color:#8899bb;margin-top:4px;">Avg cycle ' + avgLen + ' days · next expected ' + (nextIn > 0 ? 'in ' + nextIn + ' days' : 'any day now') + '</div>';
    }
    h += '</div>';
    h += '<div style="padding:10px;background:#0d0d1a;border-radius:8px;border-left:3px solid ' + pcol + ';font-size:11px;color:#a0aec0;line-height:1.7;">💡 ' + advice + '</div>';
  } else {
    h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;">Log the first day of your period and the app will track your phases — and tell you which days are naturally best for hard study vs rest.</div>';
  }
  h += '<button class="btn-primary" style="width:100%;margin-top:10px;" onclick="logCycleStart()">🌸 Period Started Today</button>';
  if (cycles.length) {
    h += '<div style="font-size:10px;color:#556080;margin-top:8px;">Logged starts: ' + cycles.slice(-4).map(function(c){ return c; }).join(' · ') +
      ' <span onclick="undoCycleStart()" style="color:#ef4444;cursor:pointer;">(undo last)</span></div>';
  }
  h += '</div>';

  /* ---- MONTH VIEW ---- */
  var v = aeGetView('mood');
  var moodMap = {}, energyMap = {};
  Object.keys(log).forEach(function(k){
    if (log[k].mood)   moodMap[k]   = log[k].mood;
    if (log[k].energy) energyMap[k] = log[k].energy;
  });

  h += '<div class="card" style="margin-bottom:14px;">';
  h += aeMonthNav('mood');
  h += '<div style="font-size:11px;font-weight:700;color:#8899bb;margin-bottom:6px;">Mood</div>';
  h += aeCalendarHeatmap(v.y, v.m, moodMap, function(n){
    return n >= 5 ? '#10b981' : n === 4 ? '#65a30d' : n === 3 ? '#f59e0b' : n === 2 ? '#f97316' : n === 1 ? '#ef4444' : '#1a1a35';
  }, function(n){ return n > 0 ? MOOD_FACES[n-1] : ''; });

  /* Monthly averages + honest read */
  var mVals = [], eVals = [];
  Object.keys(log).forEach(function(k) {
    if (parseInt(k.substring(0,4))===v.y && parseInt(k.substring(5,7))===v.m+1) {
      if (log[k].mood) mVals.push(log[k].mood);
      if (log[k].energy) eVals.push(log[k].energy);
    }
  });
  var avg = function(a){ return a.length ? Math.round(a.reduce(function(x,y){return x+y;},0)/a.length*10)/10 : 0; };
  h += '<div style="display:flex;gap:10px;margin-top:12px;">';
  h += '<div style="flex:1;text-align:center;"><div style="font-size:20px;font-weight:900;color:#ec4899;">' + (avg(mVals)||'–') + '</div><div style="font-size:10px;color:#8899bb;">avg mood</div></div>';
  h += '<div style="flex:1;text-align:center;"><div style="font-size:20px;font-weight:900;color:#06b6d4;">' + (avg(eVals)||'–') + '</div><div style="font-size:10px;color:#8899bb;">avg energy</div></div>';
  h += '<div style="flex:1;text-align:center;"><div style="font-size:20px;font-weight:900;color:#a855f7;">' + mVals.length + '</div><div style="font-size:10px;color:#8899bb;">days logged</div></div>';
  h += '</div>';
  h += '</div>';

  /* ---- PATTERN: energy vs focus ---- */
  var fMap = aeFocusByDate(state);
  var highE = [], lowE = [];
  Object.keys(log).forEach(function(k) {
    if (!log[k].energy) return;
    var f = fMap[k] || 0;
    if (log[k].energy >= 4) highE.push(f); else if (log[k].energy <= 2) lowE.push(f);
  });
  if (highE.length >= 3 && lowE.length >= 3) {
    var hAvg = Math.round(highE.reduce(function(a,b){return a+b;},0)/highE.length);
    var lAvg = Math.round(lowE.reduce(function(a,b){return a+b;},0)/lowE.length);
    h += '<div class="card" style="margin-bottom:14px;border-left:3px solid #06b6d4;">';
    h += '<div class="card-header">🔍 Your Pattern</div>';
    h += '<div style="font-size:12px;line-height:1.9;color:#a0aec0;">' +
      'On <b style="color:#10b981;">high-energy days</b> you focus <b>' + hAvg + ' mins</b> on average.<br>' +
      'On <b style="color:#ef4444;">low-energy days</b>, only <b>' + lAvg + ' mins</b>.<br><br>' +
      (hAvg > lAvg * 1.5
        ? '💡 Your energy strongly drives your output. Protect sleep and food on low days rather than forcing work — and front-load hard tasks onto high-energy days.'
        : '💡 Impressively, you produce steadily regardless of energy. That is real discipline.') + '</div>';
    h += '</div>';
  } else {
    h += '<div style="font-size:11px;color:#556080;text-align:center;padding:10px;">Log mood &amp; energy for ~2 weeks and your personal patterns will appear here automatically.</div>';
  }

  return h;
}

function setMood(n) {
  var s = window.AppState; var iso = aeTodayIso();
  if (!s.moodLog) s.moodLog = {};
  if (!s.moodLog[iso]) s.moodLog[iso] = {};
  s.moodLog[iso].mood = n;
  saveData(); renderPage();
}

function setEnergy(n) {
  var s = window.AppState; var iso = aeTodayIso();
  if (!s.moodLog) s.moodLog = {};
  if (!s.moodLog[iso]) s.moodLog[iso] = {};
  s.moodLog[iso].energy = n;
  saveData(); renderPage();
}

function logCycleStart() {
  var s = window.AppState; var iso = aeTodayIso();
  if (!Array.isArray(s.cycleStarts)) s.cycleStarts = [];
  if (s.cycleStarts.indexOf(iso) !== -1) { showToast('Already logged for today.'); return; }
  s.cycleStarts.push(iso);
  saveData(); renderPage();
  showToast('🌸 Logged. Rest well — your plan adapts now.');
}

function undoCycleStart() {
  var s = window.AppState;
  if (!s.cycleStarts || !s.cycleStarts.length) return;
  if (!confirm('Remove the last logged period start?')) return;
  s.cycleStarts.sort();
  s.cycleStarts.pop();
  saveData(); renderPage();
}

/* ============================================
   HABITS — DATA ANALYTICS
   Per-habit monthly calendar, yearly totals,
   missed days, all-time stats
   ============================================ */
function renderHabitsAnalytics(state) {
  var habits = state.habits || [];
  var h = '';

  if (habits.length === 0) {
    return '<div class="empty-state"><div class="emo">📊</div><p>No habits yet. Add habits first, then analytics appear here!</p></div>';
  }

  /* Habit selector pills */
  var sel = (typeof state.habitSel === 'number' && state.habitSel < habits.length) ? state.habitSel : 0;
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">';
  habits.forEach(function(habit, i) {
    h += '<div onclick="setHabitAnalyticsSel(' + i + ')" style="padding:7px 14px;border-radius:99px;cursor:pointer;font-weight:700;font-size:12px;border:2px solid ' +
      (sel===i?'#10b981':'var(--border)') + ';background:' + (sel===i?'#10b98122':'var(--card2)') + ';color:' + (sel===i?'#10b981':'#8899bb') + ';">' +
      escHtml(habit.name) + '</div>';
  });
  h += '</div>';

  var habit  = habits[sel];
  var hist   = habit.history || {};
  var v      = aeGetView('habits');
  var streak = aeStreakFlexible(hist, 1); /* 1 missed day doesn't break it */
  var totalDone = Object.keys(hist).filter(function(k){ return hist[k]; }).length;

  /* First tracked date → tracked-days denominator */
  var isoKeys = Object.keys(hist).sort();
  var firstIso = isoKeys[0] || aeTodayIso();
  var trackedDays = Math.max(1, Math.round((new Date(aeTodayIso()) - new Date(firstIso)) / 86400000) + 1);

  h += '<div class="grid-4" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">🔥 ' + streak + '</div><div class="stat-label">Current Streak</div><div class="stat-sub">1 off-day allowed</div></div>';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + totalDone + '</div><div class="stat-label">Total Days Done</div></div>';
  h += '<div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-value">' + (trackedDays - totalDone) + '</div><div class="stat-label">Days Missed</div><div class="stat-sub">since ' + firstIso + '</div></div>';
  h += '<div class="stat-card" style="--stat-color:#06b6d4"><div class="stat-value">' + pct(totalDone, trackedDays) + '%</div><div class="stat-label">All-Time Rate</div></div>';
  h += '</div>';

  /* Monthly calendar */
  var daysInMonth   = new Date(v.y, v.m+1, 0).getDate();
  var monthDone     = aeActiveDaysInMonth(hist, v.y, v.m);
  var now           = new Date();
  var isCurrentMonth= v.y===now.getFullYear() && v.m===now.getMonth();
  var elapsedDays   = isCurrentMonth ? now.getDate() : daysInMonth;

  h += '<div class="card" style="margin-bottom:14px;">';
  h += aeMonthNav('habits');
  h += aeCalendarHeatmap(v.y, v.m, hist, aeDoneColor, function(val){ return val>0?'✓':''; });
  h += '<div style="font-size:11px;color:#8899bb;margin-top:10px;">' +
    '<b style="color:#10b981;">' + monthDone + '</b> days done · ' +
    '<b style="color:#ef4444;">' + Math.max(0, elapsedDays - monthDone) + '</b> days missed · ' +
    pct(monthDone, elapsedDays) + '% of ' + AE_MONTHS[v.m] + (isCurrentMonth?' so far':'') + '</div>';
  h += '</div>';

  /* 📆 Days done — month · year · all time · every month */
  h += aeDaysPanel('habits', hist, { color:'#10b981', word:escHtml(habit.name) + ' Days', label:'days done' });

  /* Yearly: per-month done counts */
  var monthVals = aeMonthTotals(hist, v.y);
  h += '<div class="card" style="margin-bottom:14px;">';
  h += aeYearNav('habits');
  h += aeYearBarChart(monthVals, isCurrentMonth && v.y===now.getFullYear() ? now.getMonth() : -1, '#10b981', function(vv){ return vv+'d'; }, 'habits');
  h += '<div style="font-size:11px;color:#8899bb;">' + v.y + ' total: <b style="color:#10b981;">' + monthVals.reduce(function(a,b){return a+b;},0) + ' days</b> of ' + escHtml(habit.name) + '</div>';
  h += '</div>';

  /* All years */
  var years = aeYearTotals(hist);
  var yKeys = Object.keys(years).sort();
  if (yKeys.length) {
    h += '<div class="card" style="margin-bottom:14px;"><div class="card-header">All Years — ' + escHtml(habit.name) + '</div>';
    yKeys.forEach(function(yk) {
      h += aeBarRow(yk, years[yk], 365, '#06b6d4', years[yk] + ' days');
    });
    h += '</div>';
  }

  /* AI summary */
  h += '<button class="btn-primary" style="width:100%;" onclick="habitAISummary(this,' + sel + ')">🤖 AI Summary — ' + escHtml(habit.name) + ' This Month</button>';
  h += '<div id="habit-ai-summary" style="display:none;"></div>';

  return h;
}

function habitAISummary(btn, sel) {
  var state = window.AppState;
  var habit = (state.habits||[])[sel];
  if (!habit) return;
  var v    = aeGetView('habits');
  var hist = habit.history || {};
  var daysInMonth = new Date(v.y, v.m+1, 0).getDate();
  var now  = new Date();
  var isCur = v.y===now.getFullYear() && v.m===now.getMonth();
  var elapsed = isCur ? now.getDate() : daysInMonth;
  var doneDates = [], missDates = [];
  for (var d=1; d<=elapsed; d++) {
    var iso = v.y + '-' + pad(v.m+1) + '-' + pad(d);
    if (hist[iso]) doneDates.push(iso); else missDates.push(iso);
  }
  /* Which weekdays are weakest? */
  var missByDay = [0,0,0,0,0,0,0];
  missDates.forEach(function(iso){ missByDay[new Date(iso).getDay()]++; });
  var worstDay = DAYS_FULL[missByDay.indexOf(Math.max.apply(null, missByDay))];

  var ctx = 'Habit: ' + habit.name + ' (' + (habit.cat||'General') + ') — ' + AE_MONTHS[v.m] + ' ' + v.y + '\n' +
    'Done ' + doneDates.length + '/' + elapsed + ' days. Missed dates: ' + (missDates.join(', ')||'none') + '\n' +
    'Current streak: ' + aeStreakFlexible(hist, 1) + ' days.';
  var fallback = '📊 ' + habit.name + ' — ' + AE_MONTHS[v.m] + ' ' + v.y + ':\n' +
    '• Done ' + doneDates.length + ' of ' + elapsed + ' days (' + pct(doneDates.length, elapsed) + '%)\n' +
    '• Missed ' + missDates.length + ' days' + (missDates.length ? ' — you skip most on ' + worstDay + 's' : '') + '\n' +
    '• Current streak: ' + aeStreakFlexible(hist, 1) + ' days\n\n' +
    (pct(doneDates.length, elapsed) >= 80 ? '🔥 Strong! This habit is nearly automatic now.' :
     pct(doneDates.length, elapsed) >= 50 ? '💪 Building. Plan ' + habit.name + ' at a fixed time on ' + worstDay + 's — that\'s your weak day.' :
     '⚠️ This habit is slipping. Shrink it: do a 2-minute version daily rather than skipping.');
  aeAISummary(habit.name + ' — Month Summary', ctx, fallback, btn, 'habit-ai-summary');
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