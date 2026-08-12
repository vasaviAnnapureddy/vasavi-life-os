/* ============================================
   VASAVI'S LIFE OS — DAILY RITUALS
   modules/rituals.js

   Two short moments that hold the whole OS
   together:
   🌅 Morning Brief — yesterday in one glance,
      today's goals, your gym plan, calorie
      target, one AI byte. 60 seconds.
   🌙 Night Debrief — 3 questions that auto-save
      into My Reflections, forever.
   ============================================ */

function renderRituals() {
  var state = window.AppState;
  var hr = new Date().getHours();
  /* Default to whichever ritual fits the time of day */
  var tab = state.ritualTab || (hr >= 17 ? 'night' : 'morning');
  var h = '';

  h += '<div class="subtab-bar">';
  [['morning','🌅 Morning Brief'],['night','🌙 Night Debrief']].forEach(function(t) {
    h += '<div class="subtab ' + (tab===t[0]?'active':'') + '" onclick="switchRitualTab(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  h += '</div>';

  /* Ritual streaks */
  var mLog = state.morningLog || {}, nLog = state.nightLog || {};
  h += '<div class="grid-2" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-value">🔥 ' + aeStreakFlexible(mLog,1) + '</div><div class="stat-label">Morning Streak</div><div class="stat-sub">' + Object.keys(mLog).length + ' mornings total</div></div>';
  h += '<div class="stat-card" style="--stat-color:#6366f1"><div class="stat-value">🔥 ' + aeStreakFlexible(nLog,1) + '</div><div class="stat-label">Night Streak</div><div class="stat-sub">' + Object.keys(nLog).length + ' nights total</div></div>';
  h += '</div>';

  if (tab === 'morning') h += renderMorningBrief(state);
  if (tab === 'night')   h += renderNightDebrief(state);
  return h;
}

function switchRitualTab(t) { window.AppState.ritualTab = t; saveData(); renderPage(); }

/* ============================================
   🌅 MORNING BRIEF
   ============================================ */
function renderMorningBrief(state) {
  var h = '';
  var now = new Date();
  var todayIso = aeTodayIso();
  var yIso = aeIso(new Date(now.getTime() - 86400000));
  var done = !!(state.morningLog||{})[todayIso];

  h += '<div style="text-align:center;font-size:12px;color:#8899bb;margin-bottom:12px;">' +
    '🌅 ' + now.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) + '</div>';

  /* ---- YESTERDAY IN ONE GLANCE ---- */
  var fMap = aeFocusByDate(state), gMap = aeGymByDate(state), sMap = aeSpendByDate(state);
  var yFocus = fMap[yIso] || 0;
  var yGym   = gMap[yIso] ? 'Yes 💪' : 'No';
  var ySpend = sMap[yIso] || 0;
  var yGoals = (typeof goalsDoneByDate === 'function' ? goalsDoneByDate(state)[yIso] : 0) || 0;

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📊 Yesterday in One Glance</div>';
  h += '<div class="grid-4">';
  h += '<div style="text-align:center;"><div style="font-size:18px;font-weight:900;color:' + (yFocus>=120?'#10b981':yFocus>0?'#f59e0b':'#556080') + ';">' + yFocus + 'm</div><div style="font-size:10px;color:#8899bb;">focus</div></div>';
  h += '<div style="text-align:center;"><div style="font-size:18px;font-weight:900;color:' + (gMap[yIso]?'#10b981':'#556080') + ';">' + yGym + '</div><div style="font-size:10px;color:#8899bb;">gym</div></div>';
  h += '<div style="text-align:center;"><div style="font-size:18px;font-weight:900;color:' + (yGoals>=3?'#10b981':yGoals===2?'#f59e0b':'#556080') + ';">' + yGoals + '</div><div style="font-size:10px;color:#8899bb;">goals done</div></div>';
  h += '<div style="text-align:center;"><div style="font-size:18px;font-weight:900;color:#f59e0b;">₹' + ySpend + '</div><div style="font-size:10px;color:#8899bb;">spent</div></div>';
  h += '</div>';
  var yScore = (yFocus>=120?1:0) + (gMap[yIso]?1:0) + (yGoals>=2?1:0);
  h += '<div style="margin-top:10px;padding:9px;background:#0d0d1a;border-radius:8px;font-size:11px;color:#a0aec0;line-height:1.7;">' +
    (yScore >= 3 ? '🔥 Yesterday was a strong day. Repeat it.' :
     yScore === 2 ? '💪 Solid yesterday. One more piece today and it is a perfect day.' :
     yScore === 1 ? '⚡ Yesterday was partial — today is a clean slate.' :
     '🌱 Quiet yesterday. Nothing to fix, just start one thing today.') + '</div>';
  h += '</div>';

  /* ---- TODAY'S PLAN ---- */
  var goals = ((state.goals&&state.goals.daily)||[]).filter(function(g){ return !g.deadline || g.deadline === todayIso; });
  var gymPlan = (typeof getGymPlan === 'function') ? getGymPlan(todayName()) : null;
  var target = (typeof dietTarget === 'function' && typeof dietProfile === 'function') ? dietTarget(dietProfile(state)) : 0;
  var focusTarget = (typeof getAlertConfig === 'function') ? getAlertConfig().targetMins : 120;

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">🎯 Today\'s Mission</div>';
  h += '<div style="font-size:12px;line-height:2;color:#a0aec0;">';
  h += '⏱ Focus target: <b style="color:#a855f7;">' + focusTarget + ' mins</b><br>';
  if (gymPlan) h += '💪 Gym today: <b style="color:#f97316;">' + escHtml(gymPlan.focus) + '</b><br>';
  if (target)  h += '🥗 Calorie target: <b style="color:#10b981;">' + target + ' kcal</b><br>';
  h += '</div>';

  if (goals.length) {
    h += '<div style="margin-top:10px;padding-top:10px;border-top:1px solid #1a1a35;">';
    h += '<div style="font-size:11px;font-weight:700;color:#8899bb;margin-bottom:6px;">Your goals for today</div>';
    goals.forEach(function(g) {
      h += '<div style="font-size:12px;padding:4px 0;color:' + (g.done?'#556080':'#f0f0ff') + ';text-decoration:' + (g.done?'line-through':'none') + ';">' +
        (g.done?'✅ ':'○ ') + escHtml(g.text||'') + '</div>';
    });
    h += '</div>';
  } else {
    h += '<div style="margin-top:10px;display:flex;gap:8px;">';
    h += '<input id="ritual-goal" placeholder="What is your #1 goal today?" style="flex:1;" onkeydown="if(event.key===\'Enter\')addRitualGoal()" />';
    h += '<button class="btn-primary" onclick="addRitualGoal()">+ Add</button></div>';
  }
  h += '</div>';

  /* ---- ONE THING TO LEARN ---- */
  if (typeof AI_BYTES !== 'undefined' && typeof brainDayNumber === 'function') {
    var byte = AI_BYTES[brainDayNumber() % AI_BYTES.length];
    h += '<div class="card" style="margin-bottom:14px;border-left:3px solid #a855f7;">';
    h += '<div class="card-header">⚡ One Thing to Learn Today</div>';
    h += '<div style="font-size:13px;font-weight:800;margin-bottom:6px;">' + escHtml(byte.t) + '</div>';
    h += '<div style="font-size:12px;line-height:1.8;color:#a0aec0;">' + escHtml(byte.b) + '</div>';
    h += '</div>';
  }

  /* ---- START THE DAY ---- */
  if (!done) {
    h += '<button class="btn-primary" style="width:100%;" onclick="completeMorning()">☀️ I\'ve Read It — Start My Day</button>';
  } else {
    h += '<div style="text-align:center;padding:12px;color:#10b981;font-weight:700;font-size:13px;">✅ Morning ritual done. Go make it count, Vasavi. 💜</div>';
  }
  return h;
}

function addRitualGoal() {
  var el = document.getElementById('ritual-goal');
  if (!el || !el.value.trim()) return;
  if (!window.AppState.goals) window.AppState.goals = {};
  if (!Array.isArray(window.AppState.goals.daily)) window.AppState.goals.daily = [];
  window.AppState.goals.daily.push({
    text: el.value.trim(), priority:'High', deadline: aeTodayIso(), done:false, createdAt: new Date().toISOString()
  });
  saveData(); renderPage();
  showToast('🎯 Goal set for today!');
}

function completeMorning() {
  if (!window.AppState.morningLog) window.AppState.morningLog = {};
  window.AppState.morningLog[aeTodayIso()] = 1;
  saveData(); renderPage();
  showToast('☀️ Morning ritual complete!');
}

/* ============================================
   🌙 NIGHT DEBRIEF
   ============================================ */
function renderNightDebrief(state) {
  var h = '';
  var todayIso = aeTodayIso();
  var done = !!(state.nightLog||{})[todayIso];
  var saved = (state.reflectionArchive||{})[todayIso] || {};

  /* Today's actual numbers so reflection is grounded */
  var fMap = aeFocusByDate(state), gMap = aeGymByDate(state);
  var tFocus = fMap[todayIso] || 0;
  var tGoals = (typeof goalsDoneByDate === 'function' ? goalsDoneByDate(state)[todayIso] : 0) || 0;

  h += '<div style="text-align:center;font-size:12px;color:#8899bb;margin-bottom:12px;">🌙 Winding down — ' +
    new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'}) + '</div>';

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📊 What Today Actually Looked Like</div>';
  h += '<div style="font-size:12px;line-height:2;color:#a0aec0;">' +
    '⏱ Focus: <b style="color:#a855f7;">' + tFocus + ' mins</b> · ' +
    '💪 Gym: <b style="color:' + (gMap[todayIso]?'#10b981':'#556080') + ';">' + (gMap[todayIso]?'done':'no') + '</b> · ' +
    '🎯 Goals: <b style="color:#10b981;">' + tGoals + '</b></div>';
  h += '</div>';

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">🌙 Three Questions</div>';
  h += '<div class="form-row"><label>1. What went well today?</label>' +
    '<textarea id="nd-well" rows="2" placeholder="Even one small thing counts...">' + escHtml(saved.well||'') + '</textarea></div>';
  h += '<div class="form-row"><label>2. What was hard, or what would you do differently?</label>' +
    '<textarea id="nd-better" rows="2" placeholder="Be honest, not harsh...">' + escHtml(saved.better||'') + '</textarea></div>';
  h += '<div class="form-row"><label>3. What is the ONE thing for tomorrow?</label>' +
    '<textarea id="nd-tomorrow" rows="2" placeholder="Just one...">' + escHtml(saved.tomorrow||'') + '</textarea></div>';
  h += '<button class="btn-primary" style="width:100%;" onclick="completeNight()">🌙 ' + (done?'Update':'Save') + ' &amp; Sleep Well</button>';
  h += '<div style="font-size:10px;color:#556080;margin-top:8px;">Saved forever into Rich Notes → 🪞 My Reflections, with today\'s date.</div>';
  h += '</div>';

  if (done) {
    h += '<div style="text-align:center;padding:12px;color:#6366f1;font-weight:700;font-size:13px;">✅ Debrief done. Rest properly — sleep is when your brain files everything. 💜</div>';
  }
  return h;
}

function completeNight() {
  var g = function(id){ var el=document.getElementById(id); return el?el.value.trim():''; };
  var well = g('nd-well'), better = g('nd-better'), tomorrow = g('nd-tomorrow');
  if (!well && !better && !tomorrow) { alert('Write at least one line — even a short one.'); return; }

  var iso = aeTodayIso();
  if (!window.AppState.reflectionArchive) window.AppState.reflectionArchive = {};
  window.AppState.reflectionArchive[iso] = { well:well, better:better, tomorrow:tomorrow, date:iso };
  if (!window.AppState.nightLog) window.AppState.nightLog = {};
  window.AppState.nightLog[iso] = 1;

  /* Carry tomorrow's ONE thing into the planner focus */
  if (tomorrow && window.AppState.planner) window.AppState.planner.focus = tomorrow;

  saveData(); renderPage();
  showToast('🌙 Saved to My Reflections — forever.');
}

console.log('rituals.js loaded OK');
