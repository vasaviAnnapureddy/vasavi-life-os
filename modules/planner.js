/* ============================================
   VASAVI'S LIFE OS - DAILY PLANNER MODULE
   modules/planner.js
   ============================================ */

/* Default time blocks for Vasavi's schedule */
var DEFAULT_BLOCKS = [
  { time: '5:30',  label: 'Wake up + Morning study',  status: '' },
  { time: '7:00',  label: 'Gym',                       status: '' },
  { time: '9:30',  label: 'Breakfast + Rest',          status: '' },
  { time: '10:30', label: 'Deep Work Block 1',         status: '' },
  { time: '1:00',  label: 'Lunch Break',               status: '' },
  { time: '2:00',  label: 'Deep Work Block 2',         status: '' },
  { time: '4:00',  label: 'Rest / Nap',                status: '' },
  { time: '5:00',  label: 'Daily Learning',            status: '' },
  { time: '6:00',  label: 'Enjoy Life / Family Time',  status: '' },
  { time: '7:00',  label: 'Revision + Weak Areas',     status: '' },
  { time: '8:00',  label: 'Language Practice',         status: '' },
  { time: '8:30',  label: 'Dinner',                    status: '' },
  { time: '9:30',  label: 'Interview Prep',            status: '' },
  { time: '10:30', label: 'Journal + Plan Tomorrow',   status: '' },
  { time: '11:00', label: 'Sleep',                     status: '' }
];

function renderPlanner() {
  var state = window.AppState;
  var today = todayString();

  /* Reset planner if new day */
  if (state.planner.date !== today) {
    state.planner = {
      date:       today,
      mood:       '',
      focus:      state.planner.focus || '',
      blocks:     JSON.parse(JSON.stringify(DEFAULT_BLOCKS)),
      reflection: '',
      workingOn:  ''
    };
    saveData();
  }

  var blocks   = state.planner.blocks || DEFAULT_BLOCKS;
  var doneCnt  = blocks.filter(function(b) { return b.status === 'done'; }).length;
  var skipCnt  = blocks.filter(function(b) { return b.status === 'skip'; }).length;
  var planPct  = pct(doneCnt, blocks.length);

  /* Daily goals */
  var dailyGoals  = state.goals.daily || [];
  var goalsDone   = dailyGoals.filter(function(g) { return g.done; }).length;

  var h = '';

  /* ---- DATE HEADER ---- */
  h += '<div style="background:linear-gradient(135deg,#0d0d22,#0a1020);' +
       'border:1px solid #1a1a35;border-radius:12px;padding:18px 20px;' +
       'margin-bottom:14px;">';

  h += '<div style="font-size:20px;font-weight:900;margin-bottom:10px;">' +
    new Date().toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric',
      month: 'long',   year: 'numeric'
    }) +
  '</div>';

  /* Mood selector */
  h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">' +
    '<span style="font-size:11px;color:#8899bb;font-weight:700;">MOOD:</span>';
  ['😴','😐','🙂','😊','🔥'].forEach(function(m) {
    h += '<button class="mood-btn ' +
      (state.planner.mood === m ? 'selected' : '') + '" ' +
      'onclick="setMood(\'' + m + '\')">' + m + '</button>';
  });
  h += '</div>';

  /* Working on */
  h += '<div class="form-row">' +
    '<label>Working on today</label>' +
    '<input id="working-on-input" ' +
      'value="' + escHtml(state.planner.workingOn || '') + '" ' +
      'placeholder="What are you working on today?" />' +
  '</div>';

  /* ONE Thing */
  h += '<div style="background:#1a1a35;border-radius:9px;' +
           'padding:12px;margin-top:8px;">' +
    '<div style="font-size:10px;color:#a855f7;font-weight:800;margin-bottom:6px;">' +
      'TODAY\'S ONE THING - MOST IMPORTANT' +
    '</div>' +
    '<input id="one-thing-planner" ' +
      'value="' + escHtml(state.planner.focus || '') + '" ' +
      'placeholder="What is the ONE thing that must get done today?" ' +
      'style="background:transparent;border:none;font-size:14px;' +
             'font-weight:800;color:#f0f0ff;padding:0;width:100%;" />' +
  '</div>';

  h += '</div>';

  /* ---- STATS ROW ---- */
  h += '<div class="grid-4" style="margin-bottom:14px;">';

  h += '<div class="stat-card" style="--stat-color:#a855f7">' +
    '<div class="stat-value">' + planPct + '%</div>' +
    '<div class="stat-label">Day Complete</div>' +
    '<div class="stat-sub">' + doneCnt + ' blocks done</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#10b981">' +
    '<div class="stat-value">' + goalsDone + '/' + dailyGoals.length + '</div>' +
    '<div class="stat-label">Goals Done</div>' +
    '<div class="stat-sub">Today</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#ef4444">' +
    '<div class="stat-value">' + skipCnt + '</div>' +
    '<div class="stat-label">Skipped</div>' +
    '<div class="stat-sub">Time blocks</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#f59e0b">' +
    '<div class="stat-value">' +
      (state.planner.mood || '—') +
    '</div>' +
    '<div class="stat-label">Mood</div>' +
    '<div class="stat-sub">Today</div>' +
  '</div>';

  h += '</div>';

  /* ---- MAIN GRID ---- */
  h += '<div class="grid-2">';

  /* Time blocks */
  h += '<div class="card">';
  h += '<div class="card-header">Time Blocks ' +
    '<button class="btn-ghost btn-small" ' +
      'onclick="addTimeBlock()">+ Add Block</button>' +
  '</div>';

  blocks.forEach(function(block, i) {
    h += '<div class="time-block ' + (block.status || '') + '">';
    h += '<span class="time-label">' + escHtml(block.time) + '</span>';
    h += '<div style="flex:1;">';
    h += '<div style="font-size:11px;font-weight:600;">' +
      escHtml(block.label) + '</div>';
    h += '</div>';
    h += '<div style="display:flex;gap:4px;">';
    h += '<button class="btn-green btn-small" ' +
      'onclick="setBlockStatus(' + i + ',\'done\')" ' +
      'title="Mark done">✓</button>';
    h += '<button class="btn-red btn-small" ' +
      'onclick="setBlockStatus(' + i + ',\'skip\')" ' +
      'title="Skip">✕</button>';
    h += '</div>';
    h += '</div>';
  });

  h += '</div>';

  /* Right column */
  h += '<div>';

  /* Daily goals checklist */
  h += '<div class="card" style="margin-bottom:11px;">';
  h += '<div class="card-header">Today\'s Goals ' +
    '<span style="font-size:10px;color:#10b981;">' +
      goalsDone + '/' + dailyGoals.length +
    '</span>' +
  '</div>';

  if (dailyGoals.length > 0) {
    dailyGoals.forEach(function(goal, i) {
      var tagClass = goal.priority === 'High'   ? 'tag-high'   :
                     goal.priority === 'Medium' ? 'tag-medium' : 'tag-low';
      h += '<div class="check-item" ' +
        'onclick="toggleGoal(\'daily\',' + i + ')">';
      h += '<input type="checkbox" ' + (goal.done ? 'checked' : '') + ' />';
      h += '<span class="' + (goal.done ? 'checked-text' : '') + '" ' +
        'style="flex:1;">' + escHtml(goal.text) + '</span>';
      if (goal.time) {
        h += '<span style="font-size:10px;color:#a855f7;">🕐' +
          goal.time + '</span>';
      }
      h += '<span class="tag ' + tagClass + '">' + goal.priority + '</span>';
      h += '</div>';
    });
  } else {
    h += '<div style="color:#556080;font-size:11px;">' +
      'No goals yet. Add from Goals OS.' +
    '</div>';
  }

  h += '</div>';

  /* Evening reflection */
  h += '<div class="card">';
  h += '<div class="card-header">Evening Reflection</div>';

  h += '<div class="form-row">' +
    '<label>What went well today?</label>' +
    '<textarea id="reflect-well" rows="2" ' +
      'placeholder="Something good that happened...">' +
      escHtml((state.planner.reflection || {}).well || '') +
    '</textarea>' +
  '</div>';

  h += '<div class="form-row">' +
    '<label>What could be better?</label>' +
    '<textarea id="reflect-better" rows="2" ' +
      'placeholder="What would you change tomorrow...">' +
      escHtml((state.planner.reflection || {}).better || '') +
    '</textarea>' +
  '</div>';

  h += '<div class="form-row">' +
    '<label>Tomorrow\'s ONE thing</label>' +
    '<input id="reflect-tomorrow" ' +
      'placeholder="What is most important tomorrow?" ' +
      'value="' +
        escHtml((state.planner.reflection || {}).tomorrow || '') +
      '" />' +
  '</div>';

  h += '<button class="btn-primary" ' +
    'onclick="saveReflection()" style="width:100%;">' +
    'Save Reflection' +
  '</button>';

  /* Daily score */
  h += '<div style="margin-top:12px;padding:10px;background:#1a1a35;' +
           'border-radius:8px;text-align:center;">';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:4px;">' +
    'Daily Score' +
  '</div>';
  h += '<div style="font-size:22px;font-weight:900;color:#a855f7;">' +
    planPct + '%' +
  '</div>';
  h += '<div style="font-size:10px;color:#8899bb;">' +
    (planPct >= 70 ? 'Great day Vasavi!' :
     planPct >= 40 ? 'Good progress. Keep going!' :
     'Tomorrow is a fresh start.') +
  '</div>';
  h += '</div>';

  h += '</div>';
  h += '</div>';

  /* ---- WEEKLY OVERVIEW ---- */
  h += '<div class="card" style="margin-top:0;">';
  h += '<div class="card-header">This Week Overview</div>';
  h += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;">';

  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var todayIdx2 = new Date().getDay();

  days.forEach(function(day, i) {
    var isToday = i === todayIdx2;
    var hasSess = (state.sessions || []).some(function(s) {
      var d = new Date(s.start);
      return d.getDay() === i &&
        d >= new Date(new Date().setDate(new Date().getDate() - todayIdx2));
    });

    h += '<div style="text-align:center;padding:10px 4px;border-radius:8px;' +
             'background:' + (isToday ? '#a855f7' : hasSess ? '#052e16' : '#1a1a35') + ';' +
             'border:1px solid ' + (isToday ? '#a855f7' : '#1a1a35') + ';">';
    h += '<div style="font-size:9px;font-weight:800;color:' +
      (isToday ? '#fff' : '#556080') + ';">' + day + '</div>';
    h += '<div style="font-size:16px;margin-top:4px;">' +
      (isToday ? '⭐' : hasSess ? '✅' : '○') +
    '</div>';
    h += '</div>';
  });

  h += '</div></div>';

  return h;
}

/* ============================================
   PLANNER ACTIONS
   ============================================ */
function setMood(mood) {
  window.AppState.planner.mood = mood;
  saveData();
  renderPage();
}

function setBlockStatus(idx, status) {
  var blocks = window.AppState.planner.blocks;
  if (!blocks || !blocks[idx]) return;
  /* Toggle off if same status */
  blocks[idx].status = blocks[idx].status === status ? '' : status;
  saveData();
  renderPage();
}

function addTimeBlock() {
  var time  = prompt('Enter time (e.g. 3:00 PM):');
  var label = prompt('What is this block for?');
  if (!time || !label) return;
  window.AppState.planner.blocks.push({
    time:   time,
    label:  label,
    status: ''
  });
  saveData();
  renderPage();
}

function saveReflection() {
  var well     = document.getElementById('reflect-well');
  var better   = document.getElementById('reflect-better');
  var tomorrow = document.getElementById('reflect-tomorrow');
  var workOn   = document.getElementById('working-on-input');
  var oneThing = document.getElementById('one-thing-planner');

  window.AppState.planner.reflection = {
    well:     well     ? well.value     : '',
    better:   better   ? better.value   : '',
    tomorrow: tomorrow ? tomorrow.value : ''
  };

  if (workOn)   window.AppState.planner.workingOn = workOn.value;
  if (oneThing) window.AppState.planner.focus     = oneThing.value;

  saveData();
  alert('Reflection saved! Great work today Vasavi! 💜');
}

/* Auto-save inputs on change */
document.addEventListener('input', function(e) {
  if (e.target.id === 'working-on-input') {
    window.AppState.planner.workingOn = e.target.value;
    saveData();
  }
  if (e.target.id === 'one-thing-planner') {
    window.AppState.planner.focus = e.target.value;
    saveData();
  }
});

console.log('planner.js loaded OK');