/* ============================================
   VASAVI'S LIFE OS - GYM PLANNER MODULE
   modules/gym.js
   ============================================ */

function renderGym() {
  var state   = window.AppState;
  var gymTab  = state.gymTab || 'workout';
  var today   = todayName();
  var plan    = GYM_PLAN[today] || { focus: 'REST DAY', exercises: [] };
  var logged  = (state.gymLog || {})[todayString()] || false;

  var h = '';

  h += '<div class="subtab-bar">';
  [['workout','💪 Workout'],['nutrition','🥗 Nutrition'],['period','🌸 Period Yoga']].forEach(function(t) {
    h += '<div class="subtab ' + (gymTab===t[0]?'active':'') + '" onclick="switchGymTab(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  h += '</div>';

  if (gymTab === 'nutrition') return h + renderNutritionPlan();
  if (gymTab === 'period')    return h + renderPeriodYoga();

  /* Day selector */
  var days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  var viewDay = state.gymViewDay || today;
  h += '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;">';
  days.forEach(function(d) {
    var isActive = viewDay === d;
    var isToday  = d === today;
    h += '<div onclick="showDayWorkout(\'' + d + '\')" style="padding:5px 10px;border-radius:8px;font-size:11px;cursor:pointer;font-weight:' + (isToday?'700':'400') + ';background:' + (isActive?'#a855f7':'#1a1a35') + ';color:' + (isActive?'#fff':isToday?'#a855f7':'#8899bb') + ';border:1px solid ' + (isToday?'#a855f7':'transparent') + ';">' + d.substring(0,3) + '</div>';
  });
  h += '</div>';

  /* Show selected day plan */
  var viewPlan = GYM_PLAN[viewDay] || { focus: 'REST DAY', exercises: [] };
  if (viewDay !== today) {
    plan = viewPlan;
  }

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

/* ============================================
   NUTRITION PLAN — Vasavi's Daily Meal Plan
   South Indian focus, gym-optimized
   ============================================ */
function switchGymTab(tab) {
  window.AppState.gymTab = tab;
  renderPage();
}

function renderPeriodYoga() {
  var h = '';
  h += '<div class="card" style="margin-bottom:12px;">';
  h += '<div class="card-header">🌸 Period Yoga — Phase-wise Routine</div>';
  h += '<div style="font-size:12px;color:#8899bb;margin-bottom:10px;">Rest, don\'t push. This heals and helps.</div>';

  var phases = [
    { phase: 'Days 1-2 (Heavy flow)', color:'#ec4899', poses: ['Butterfly pose (Baddha Konasana) — opens hips, reduces cramps','Supine butterfly — lie on back, feet together, knees out','Child\'s pose (Balasana) — back pain relief','Supported fish pose with pillow — chest opener, fatigue relief','Legs up the wall (Viparita Karani) — circulation, swelling'] },
    { phase: 'Days 3-4 (Medium flow)', color:'#a855f7', poses: ['Cat-cow stretches — spine mobility','Seated forward fold — hamstring release, calms mind','Pigeon pose (light) — hip flexor release','Supine twist — digestive support, back relief','Bridge pose (gentle) — pelvic strength'] },
    { phase: 'Days 5-7 (Light/End)', color:'#10b981', poses: ['Sun salutations (slow) — full body wake up','Warrior 1 and 2 (light) — energy rebuild','Tree pose — balance, grounding','Camel pose (if comfortable) — hormone balance','Full savasana 10 min — complete rest and integration'] }
  ];

  phases.forEach(function(p) {
    h += '<div style="margin-bottom:14px;padding:12px;background:#0d0d1a;border-radius:8px;border-left:3px solid ' + p.color + ';">';
    h += '<div style="font-size:12px;font-weight:700;color:' + p.color + ';margin-bottom:8px;">' + p.phase + '</div>';
    p.poses.forEach(function(pose) {
      h += '<div style="font-size:11px;padding:3px 0;color:#a0aec0;">🧘 ' + pose + '</div>';
    });
    h += '</div>';
  });
  h += '</div>';
  return h;
}

function renderNutritionPlan() {
  var h = '';

  h += '<div class="card" style="margin-bottom:12px;">';
  h += '<div class="card-header">🌅 Pre-Gym (6:00-6:30 AM)</div>';
  h += '<div style="font-size:12px;line-height:2;">';
  h += '• 3-4 dates + small banana OR papaya slice<br>';
  h += '• 1 glass warm water with lemon<br>';
  h += '<span style="color:#f59e0b;font-size:11px;">⚡ Quick energy, no heavy food before gym</span>';
  h += '</div></div>';

  h += '<div class="card" style="margin-bottom:12px;">';
  h += '<div class="card-header">🍳 Post-Gym Breakfast (8:30-9:00 AM)</div>';
  h += '<div style="font-size:12px;line-height:2;">';
  h += '• 3 egg whites + 1 whole egg (boiled/omelette) + 2 idlis with sambar<br>';
  h += '• OR ragi dosa with coconut chutney + curd<br>';
  h += '• 1 glass milk OR curd (protein for muscle recovery)<br>';
  h += '<span style="color:#10b981;font-size:11px;">💪 Protein within 30 min of gym for muscle repair</span>';
  h += '</div></div>';

  h += '<div class="card" style="margin-bottom:12px;">';
  h += '<div class="card-header">🥗 Mid-Morning (11 AM)</div>';
  h += '<div style="font-size:12px;line-height:2;">';
  h += '• Handful of mixed nuts (almonds, walnuts, cashews)<br>';
  h += '• 1 seasonal fruit (guava, papaya, apple)<br>';
  h += '• 2L water target — track through day';
  h += '</div></div>';

  h += '<div class="card" style="margin-bottom:12px;">';
  h += '<div class="card-header">🍛 Lunch (1:00 PM)</div>';
  h += '<div style="font-size:12px;line-height:2;">';
  h += '• 1 cup brown rice + dal/sambar + 2 sabzis<br>';
  h += '• OR 2 jowar/bajra roti + dal + vegetable curry<br>';
  h += '• Rasam (digestion) + salad (cucumber, tomato, carrot)<br>';
  h += '• Buttermilk / curd (probiotic, cooling)<br>';
  h += '<span style="color:#3b82f6;font-size:11px;">🌿 Full South Indian thali — balanced and complete</span>';
  h += '</div></div>';

  h += '<div class="card" style="margin-bottom:12px;">';
  h += '<div class="card-header">☕ Evening Snack (4:00 PM)</div>';
  h += '<div style="font-size:12px;line-height:2;">';
  h += '• Green tea / black coffee (no sugar)<br>';
  h += '• Roasted chana / sprouts / makhana<br>';
  h += '• OR ragi cookies / multigrain biscuits (2-3 only)';
  h += '</div></div>';

  h += '<div class="card" style="margin-bottom:12px;">';
  h += '<div class="card-header">🌙 Dinner (7:00-7:30 PM)</div>';
  h += '<div style="font-size:12px;line-height:2;">';
  h += '• 2 phulkas + dal + vegetable sabzi<br>';
  h += '• OR idli/dosa (lighter option) + sambar<br>';
  h += '• Avial / kootu on weekends<br>';
  h += '<span style="color:#ec4899;font-size:11px;">⏰ No food after 8 PM for better sleep and fat loss</span>';
  h += '</div></div>';

  h += '<div class="card" style="margin-bottom:12px;background:linear-gradient(135deg,#0d1a0d,#0a1428);">';
  h += '<div class="card-header">💊 Supplements</div>';
  h += '<div style="font-size:12px;line-height:2;">';
  h += '• Morning with food: Vitamin D3<br>';
  h += '• Night: Vitamin B12<br>';
  h += '• During gym: Electrolytes in water (pinch salt + lemon)<br>';
  h += '<span style="color:#f59e0b;font-size:11px;">⚠️ Book doctor for Vit D levels check</span>';
  h += '</div></div>';

  h += '<div class="card" style="background:linear-gradient(135deg,#1a0533,#0a1020);">';
  h += '<div class="card-header">⚡ Chloe Ting / Home Workout Days</div>';
  h += '<div style="font-size:12px;line-height:2;">';
  h += '• Eat snack 45-60 min BEFORE: banana + peanut butter OR dates + milk<br>';
  h += '• This fixes dizziness during workout<br>';
  h += '• Keep water + banana nearby during session<br>';
  h += '<span style="color:#10b981;font-size:11px;">✅ Low blood sugar causes dizziness — solved with pre-workout snack</span>';
  h += '</div></div>';

  return h;
}

function showDayWorkout(dayName) {
  window.AppState.gymViewDay = dayName;
  renderPage();
}

console.log('gym.js loaded OK');