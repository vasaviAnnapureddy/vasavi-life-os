/* ============================================
   VASAVI'S LIFE OS - GYM PLANNER MODULE
   modules/gym.js
   ============================================ */

function renderGym() {
  var state   = window.AppState;
  var today   = todayName();
  var plan    = GYM_PLAN[today] || { focus: 'REST DAY', exercises: [] };
  var logged  = (state.gymLog || {})[todayString()] || false;

  var h = '';

  /* ---- TODAY BANNER ---- */
  h += '<div style="background:linear-gradient(135deg,#0d0d22,#0a1020);' +
       'border:1px solid #1a1a35;border-radius:12px;padding:20px;' +
       'margin-bottom:14px;">';

  h += '<div style="font-size:10px;color:#a855f7;font-weight:800;' +
       'margin-bottom:4px;">TODAY - ' + today.toUpperCase() + '</div>';

  h += '<div style="font-size:20px;font-weight:900;margin-bottom:6px;">' +
    plan.focus +
  '</div>';

  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:14px;">' +
    'Treadmill (incline 2, 1km) → Cycling 10min → Cross trainer 10min → Main workout → Stretch 15min' +
  '</div>';

  if (plan.focus === 'REST DAY') {
    h += '<div style="font-size:14px;color:#10b981;">🙏 Rest day. Recovery is progress, Vasavi.</div>';
  } else if (!logged) {
    h += '<button class="btn-primary" onclick="logGym()" ' +
      'style="font-size:12px;">✅ Log Today\'s Gym Session</button>';
  } else {
    h += '<div style="color:#10b981;font-size:13px;font-weight:700;">' +
      '✅ Gym logged today! Great work Vasavi! 💜' +
    '</div>';
  }

  h += '</div>';

  /* ---- TODAY EXERCISES ---- */
  if (plan.exercises && plan.exercises.length > 0) {
    h += '<div class="card" style="margin-bottom:14px;">';
    h += '<div class="card-header">Today\'s Exercises</div>';

    plan.exercises.forEach(function(ex) {
      h += '<div style="background:var(--card2);border:1px solid var(--border);' +
               'border-radius:8px;padding:10px 12px;margin-bottom:6px;' +
               'display:flex;justify-content:space-between;align-items:center;">';

      h += '<div>' +
        '<div style="font-weight:700;font-size:12px;">' +
          escHtml(ex.name) +
        '</div>' +
        '<div style="font-size:10px;color:#556080;margin-top:2px;">' +
          escHtml(ex.sets) +
        '</div>' +
      '</div>';

      if (ex.link) {
        h += '<a href="' + ex.link + '" target="_blank" ' +
          'class="btn-ghost" ' +
          'style="font-size:10px;padding:4px 10px;text-decoration:none;">' +
          '▶ How to' +
        '</a>';
      }

      h += '</div>';
    });

    h += '</div>';
  }

  /* ---- WEEKLY SPLIT ---- */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Weekly Split</div>';

  var days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  days.forEach(function(day) {
    var dayPlan  = GYM_PLAN[day];
    var isToday  = day === today;
    var isLogged = (state.gymLog || {})[todayString()] && isToday;

    h += '<div style="display:flex;justify-content:space-between;' +
             'align-items:center;padding:8px 0;' +
             'border-bottom:1px solid #1a1a35;">';

    h += '<span style="font-size:12px;font-weight:' +
      (isToday ? '800' : '400') + ';color:' +
      (isToday ? '#a855f7' : '#f0f0ff') + ';">' +
      day +
    '</span>';

    h += '<span style="font-size:11px;color:#8899bb;">' +
      (dayPlan ? escHtml(dayPlan.focus) : 'REST') +
    '</span>';

    if (isLogged) {
      h += '<span style="font-size:10px;color:#10b981;">✅ Done</span>';
    }

    h += '</div>';
  });

  h += '</div>';

  /* ---- TUTORIAL VIDEOS ---- */
  h += '<div class="card">';
  h += '<div class="card-header">Tutorial Videos - How to Use Each Machine</div>';

  GYM_TUTORIALS.forEach(function(tutorial) {
    h += '<div style="display:flex;justify-content:space-between;' +
             'align-items:center;padding:8px 0;' +
             'border-bottom:1px solid #1a1a35;">';

    h += '<span style="font-size:12px;">' +
      escHtml(tutorial.name) +
    '</span>';

    h += '<a href="' + tutorial.link + '" target="_blank" ' +
      'class="btn-ghost" ' +
      'style="font-size:10px;padding:3px 9px;text-decoration:none;">' +
      '▶ Watch' +
    '</a>';

    h += '</div>';
  });

  /* Food rule */
  h += '<div style="margin-top:12px;padding:10px;background:#1a1a35;' +
           'border-radius:8px;font-size:11px;color:#f59e0b;">' +
    '🥗 ' + escHtml(GYM_FOOD_RULE) +
  '</div>';

  h += '</div>';

  /* ---- GYM LOG HISTORY ---- */
  var gymDays = Object.keys(state.gymLog || {}).filter(function(d) {
    return state.gymLog[d];
  });

  if (gymDays.length > 0) {
    h += '<div class="card">';
    h += '<div class="card-header">Gym Log - ' +
      gymDays.length + ' sessions total</div>';

    gymDays.slice(-7).reverse().forEach(function(d) {
      h += '<div style="padding:6px 0;border-bottom:1px solid #1a1a35;' +
               'font-size:11px;color:#8899bb;">' +
        '✅ ' + d +
      '</div>';
    });

    h += '</div>';
  }

  return h;
}

/* ============================================
   GYM ACTIONS
   ============================================ */
function logGym() {
  if (!window.AppState.gymLog) {
    window.AppState.gymLog = {};
  }
  window.AppState.gymLog[todayString()] = true;
  saveData();
  renderPage();
}

console.log('gym.js loaded OK');