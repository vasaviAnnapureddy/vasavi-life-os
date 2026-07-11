/* ============================================
   VASAVI'S LIFE OS — AI DIETICIAN
   modules/diet.js

   - Profile: height, weight, age → BMI, BMR,
     daily calorie target (Mifflin-St Jeor)
   - Log meals by text ("2 cups rice, pappu,
     curd") → AI estimates kcal (Andhra-aware,
     knows HER portions)
   - 📷 Plate photo → AI reads calories
   - Steps → calories burned
   - Daily balance + weekly analytics
   - Dietician AI chat with full context
   ============================================ */

function dietProfile(state) {
  return Object.assign({
    heightCm: 0, weightKg: 0, age: 23,
    activity: 'light', goal: 'maintain',
    portions: ''
  }, state.dietProfile || {});
}

/* BMR — Mifflin-St Jeor (female) */
function dietBMR(p) {
  if (!p.heightCm || !p.weightKg) return 0;
  return Math.round(10*p.weightKg + 6.25*p.heightCm - 5*(p.age||23) - 161);
}

var DIET_ACTIVITY = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725 };

function dietTDEE(p) {
  var bmr = dietBMR(p);
  return bmr ? Math.round(bmr * (DIET_ACTIVITY[p.activity]||1.375)) : 0;
}

function dietTarget(p) {
  var tdee = dietTDEE(p);
  if (!tdee) return 0;
  if (p.goal === 'lose') return tdee - 400;
  if (p.goal === 'gain') return tdee + 300;
  return tdee;
}

function dietDay(state, iso) {
  if (!state.dietLog) state.dietLog = {};
  if (!state.dietLog[iso]) state.dietLog[iso] = { meals: [], steps: 0 };
  return state.dietLog[iso];
}

function dietEaten(day) {
  return (day.meals||[]).reduce(function(a,m){ return a+(m.kcal||0); }, 0);
}

/* ============================================
   MAIN RENDER
   ============================================ */
function renderDiet() {
  var state = window.AppState;
  var tab = state.dietTab || 'today';
  var p = dietProfile(state);
  var h = '';

  h += '<div class="subtab-bar">';
  [['today','🍛 Today'],['profile','👤 My Profile'],['analytics','📊 Analytics'],['chat','💬 Dietician AI']].forEach(function(t) {
    h += '<div class="subtab ' + (tab===t[0]?'active':'') + '" onclick="switchDietTab(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  h += '</div>';

  /* Nudge to fill profile first */
  if ((!p.heightCm || !p.weightKg) && tab !== 'profile') {
    h += '<div style="background:#1a1533;border:1px solid #a855f7;border-radius:10px;padding:12px;margin-bottom:14px;font-size:12px;">' +
      '👤 <b>First step:</b> fill your height, weight and goal in My Profile — then I can calculate your daily calorie target. ' +
      '<span onclick="switchDietTab(\'profile\')" style="color:#a855f7;cursor:pointer;font-weight:700;">Open Profile →</span></div>';
  }

  if (tab === 'today')     h += renderDietToday(state, p);
  if (tab === 'profile')   h += renderDietProfile(state, p);
  if (tab === 'analytics') h += renderDietAnalytics(state, p);
  if (tab === 'chat')      h += renderDietChat(state, p);

  return h;
}

function switchDietTab(t) { window.AppState.dietTab = t; saveData(); renderPage(); }

/* ============================================
   👤 PROFILE
   ============================================ */
function renderDietProfile(state, p) {
  var h = '';
  var bmi = (p.heightCm && p.weightKg) ? (p.weightKg / Math.pow(p.heightCm/100, 2)) : 0;
  var bmiRound = Math.round(bmi*10)/10;
  var bmiColor = bmi===0?'#8899bb':bmi<18.5?'#f59e0b':bmi<25?'#10b981':bmi<30?'#f59e0b':'#ef4444';
  var bmiLabel = bmi===0?'—':bmi<18.5?'Underweight':bmi<25?'Healthy range':bmi<30?'Overweight':'Obese range';

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">👤 Your Body Profile</div>';
  h += '<div class="grid-2" style="gap:10px;">';
  h += '<div class="form-row"><label>Height (cm)</label><input type="number" id="dp-height" value="' + (p.heightCm||'') + '" placeholder="e.g. 158" /></div>';
  h += '<div class="form-row"><label>Weight (kg)</label><input type="number" id="dp-weight" value="' + (p.weightKg||'') + '" placeholder="e.g. 55" step="0.1" /></div>';
  h += '<div class="form-row"><label>Age</label><input type="number" id="dp-age" value="' + (p.age||23) + '" /></div>';
  h += '<div class="form-row"><label>Activity level</label><select id="dp-activity">' +
    [['sedentary','Sedentary (desk, no exercise)'],['light','Light (gym 1-3 days/wk)'],['moderate','Moderate (gym 4-5 days/wk)'],['active','Very active (daily + hard)']].map(function(o){
      return '<option value="' + o[0] + '"' + (p.activity===o[0]?' selected':'') + '>' + o[1] + '</option>';
    }).join('') + '</select></div>';
  h += '<div class="form-row"><label>Goal</label><select id="dp-goal">' +
    [['lose','Lose fat (−400 kcal/day)'],['maintain','Maintain weight'],['gain','Gain / build muscle (+300 kcal/day)']].map(function(o){
      return '<option value="' + o[0] + '"' + (p.goal===o[0]?' selected':'') + '>' + o[1] + '</option>';
    }).join('') + '</select></div>';
  h += '</div>';

  h += '<div class="form-row"><label>My usual portions (the AI uses this to estimate YOUR plate!)</label>';
  h += '<textarea id="dp-portions" rows="3" placeholder="e.g. Lunch: 1.5 cups rice + pappu + 1 sabzi + curd. Breakfast: 3 idlis or 1 dosa. I use 2 spoons oil while cooking...">' + escHtml(p.portions||'') + '</textarea></div>';

  h += '<button class="btn-primary" style="width:100%;" onclick="saveDietProfile()">💾 Save Profile</button>';
  h += '</div>';

  /* Computed numbers */
  if (p.heightCm && p.weightKg) {
    h += '<div class="grid-4" style="margin-bottom:14px;">';
    h += '<div class="stat-card" style="--stat-color:' + bmiColor + '"><div class="stat-value">' + bmiRound + '</div><div class="stat-label">BMI</div><div class="stat-sub" style="color:' + bmiColor + '">' + bmiLabel + '</div></div>';
    h += '<div class="stat-card" style="--stat-color:#06b6d4"><div class="stat-value">' + dietBMR(p) + '</div><div class="stat-label">BMR (kcal)</div><div class="stat-sub">burned at rest</div></div>';
    h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + dietTDEE(p) + '</div><div class="stat-label">TDEE (kcal)</div><div class="stat-sub">daily burn</div></div>';
    h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">' + dietTarget(p) + '</div><div class="stat-label">Daily Target</div><div class="stat-sub">for your goal</div></div>';
    h += '</div>';
    h += '<div style="font-size:10px;color:#556080;">BMR = calories your body burns doing nothing (Mifflin-St Jeor formula). TDEE = BMR × activity. Target adjusts TDEE for your goal. Steps you log add extra burn on top.</div>';
  }

  return h;
}

function saveDietProfile() {
  var g = function(id){ var el=document.getElementById(id); return el?el.value:''; };
  window.AppState.dietProfile = {
    heightCm: parseFloat(g('dp-height'))||0,
    weightKg: parseFloat(g('dp-weight'))||0,
    age:      parseInt(g('dp-age'))||23,
    activity: g('dp-activity')||'light',
    goal:     g('dp-goal')||'maintain',
    portions: g('dp-portions')||''
  };
  saveData(); renderPage();
  showToast('👤 Profile saved! Your targets are ready.');
}

/* ============================================
   🍛 TODAY
   ============================================ */
function renderDietToday(state, p) {
  var iso = aeTodayIso();
  var day = dietDay(state, iso);
  var eaten = dietEaten(day);
  var target = dietTarget(p);
  var stepsBurn = Math.round((day.steps||0) * 0.04);
  var budget = target + stepsBurn;   /* steps earn extra budget */
  var remaining = budget - eaten;
  var h = '';

  /* Balance card */
  h += '<div class="card" style="margin-bottom:14px;text-align:center;">';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:4px;">TODAY\'S CALORIE BALANCE</div>';
  h += '<div style="font-size:38px;font-weight:900;color:' + (target===0?'#8899bb':remaining>=0?'#10b981':'#ef4444') + ';">' + eaten + '<span style="font-size:16px;color:#8899bb;"> / ' + (budget||'?') + ' kcal</span></div>';
  if (target > 0) {
    h += '<div class="progress-bar" style="height:10px;margin:10px 0;"><div class="progress-fill" style="width:' + Math.min(100, pct(eaten, budget||1)) + '%;background:' + (remaining>=0?'#10b981':'#ef4444') + ';"></div></div>';
    h += '<div style="font-size:12px;color:' + (remaining>=0?'#10b981':'#ef4444') + ';font-weight:700;">' +
      (remaining>=0 ? remaining + ' kcal remaining' : (-remaining) + ' kcal OVER — light dinner tonight!') + '</div>';
    if (stepsBurn > 0) h += '<div style="font-size:10px;color:#06b6d4;margin-top:4px;">👟 +' + stepsBurn + ' kcal earned from ' + day.steps + ' steps</div>';
  } else {
    h += '<div style="font-size:11px;color:#f59e0b;">Set your profile to get a personal target.</div>';
  }
  h += '</div>';

  /* Steps */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">👟 Steps Today</div>';
  h += '<div style="display:flex;gap:8px;">';
  h += '<input type="number" id="diet-steps" placeholder="Check your phone\'s step counter..." value="' + (day.steps||'') + '" style="flex:1;" />';
  h += '<button class="btn-primary" onclick="saveDietSteps()">Save</button>';
  h += '</div>';
  h += '<div style="font-size:10px;color:#556080;margin-top:6px;">Every 1000 steps ≈ 40 kcal burned — added to your daily budget. (Copy the number from Google Fit / your phone\'s health app.)</div>';
  h += '</div>';

  /* Add meal by TEXT */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">🍛 Log Food — tell me what you ate</div>';
  h += '<textarea id="diet-meal-text" rows="2" placeholder="e.g. 1.5 cups rice, tomato pappu, bendakaya fry, 1 cup curd, 1 rasam"></textarea>';
  h += '<div style="display:flex;gap:8px;margin-top:8px;">';
  h += '<button class="btn-primary" style="flex:2;" onclick="dietEstimateText(this)">🤖 Estimate Calories</button>';
  h += '<input type="number" id="diet-meal-kcal" placeholder="kcal" style="flex:1;" />';
  h += '<button class="btn-ghost" onclick="dietAddMeal()">+ Add</button>';
  h += '</div>';
  h += '<div id="diet-estimate-result" style="display:none;margin-top:10px;background:#0d0d1a;border-left:3px solid #10b981;padding:10px;border-radius:0 8px 8px 0;font-size:12px;line-height:1.7;white-space:pre-wrap;color:#a0aec0;"></div>';
  h += '</div>';

  /* Add meal by PHOTO */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📷 Or Snap Your Plate</div>';
  h += '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">';
  h += '<label style="padding:10px 14px;border-radius:8px;border:1px solid #a855f7;background:#1a0533;cursor:pointer;font-size:12px;color:#a855f7;font-weight:700;">' +
    '📷 Take / Choose Photo<input type="file" id="diet-photo" accept="image/*" capture="environment" style="display:none;" onchange="dietAnalyzePhoto(this)" /></label>';
  h += '<div id="diet-photo-status" style="font-size:11px;color:#8899bb;"></div>';
  h += '</div>';
  h += '<div id="diet-photo-preview" style="margin-top:8px;"></div>';
  h += '<div style="font-size:10px;color:#556080;margin-top:6px;">AI looks at your plate, recognizes the items (it knows Andhra food!) and estimates total calories. Then one tap to log it.</div>';
  h += '</div>';

  /* Today's meals */
  h += '<div class="card">';
  h += '<div class="card-header">Today\'s Meals — ' + eaten + ' kcal total</div>';
  if ((day.meals||[]).length) {
    day.meals.forEach(function(m, i) {
      h += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #1a1a35;">';
      h += '<div style="flex:1;"><div style="font-size:12px;">' + escHtml(m.desc) + '</div>';
      h += '<div style="font-size:10px;color:#556080;">' + (m.time||'') + (m.source==='photo'?' · 📷 from photo':m.source==='ai'?' · 🤖 AI estimated':'') + '</div></div>';
      h += '<div style="display:flex;align-items:center;gap:8px;">';
      h += '<span style="font-weight:800;color:#f59e0b;">' + m.kcal + ' kcal</span>';
      h += '<button onclick="dietDeleteMeal(' + i + ')" style="background:none;border:none;color:#556080;cursor:pointer;">✕</button>';
      h += '</div></div>';
    });
  } else {
    h += '<div style="font-size:11px;color:#556080;text-align:center;padding:14px;">Nothing logged yet today. Log your breakfast!</div>';
  }
  h += '</div>';

  return h;
}

function saveDietSteps() {
  var el = document.getElementById('diet-steps');
  var day = dietDay(window.AppState, aeTodayIso());
  day.steps = parseInt(el ? el.value : 0) || 0;
  saveData(); renderPage();
  showToast('👟 ' + day.steps + ' steps saved!');
}

function dietAddMeal(desc, kcal, source) {
  desc = desc || (document.getElementById('diet-meal-text')||{}).value || '';
  kcal = kcal || parseInt((document.getElementById('diet-meal-kcal')||{}).value) || 0;
  if (!desc.trim() || !kcal) { alert('Describe the food and enter (or AI-estimate) calories first.'); return; }
  var day = dietDay(window.AppState, aeTodayIso());
  day.meals.push({
    desc: desc.trim(), kcal: kcal,
    time: new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),
    source: source || 'manual'
  });
  saveData(); renderPage();
  showToast('🍛 Logged ' + kcal + ' kcal!');
}

/* ---- TEXT → AI CALORIE ESTIMATE ---- */
function dietEstimateText(btn) {
  var el = document.getElementById('diet-meal-text');
  if (!el || !el.value.trim()) { alert('First type what you ate!'); return; }
  var state = window.AppState;
  var p = dietProfile(state);
  var food = el.value.trim();

  var result = document.getElementById('diet-estimate-result');
  result.style.display = 'block';
  result.textContent = '🤖 Estimating your Andhra plate...';
  btn.disabled = true;

  var sys = 'You are an expert Indian nutritionist who knows Andhra/South Indian home cooking deeply ' +
    '(pappu, rasam, sambar, idli, dosa, upma, pulihora, gongura, curd rice, podi, home oil quantities). ' +
    'Estimate calories realistically for HOME-COOKED food.\n' +
    (p.portions ? 'HER USUAL PORTIONS (use these when quantity is not mentioned): ' + p.portions + '\n' : '') +
    'Reply format: one line per item with kcal, then ALWAYS end with exactly this line:\nTOTAL_KCAL: <number>';

  var finish = function(reply) {
    btn.disabled = false;
    var m = reply.match(/TOTAL_KCAL:\s*(\d+)/i);
    result.textContent = reply.replace(/TOTAL_KCAL:\s*\d+/i, '').trim();
    if (m) {
      var kcal = parseInt(m[1]);
      var kcalEl = document.getElementById('diet-meal-kcal');
      if (kcalEl) kcalEl.value = kcal;
      result.textContent += '\n\n✅ Total: ' + kcal + ' kcal — press "+ Add" to log it.';
    } else {
      result.textContent += '\n\n(Could not read a total — enter kcal manually and press + Add.)';
    }
  };

  if (typeof groqChat === 'function' && typeof getApiKey === 'function' && getApiKey()) {
    groqChat(sys, [{ role:'user', text:'I ate: ' + food }], finish);
  } else {
    finish('No API key set — add your free Groq key in AI Assistant for automatic estimates.\nTOTAL_KCAL: 0');
  }
}

/* ---- PHOTO → AI CALORIE ESTIMATE ---- */
function dietAnalyzePhoto(input) {
  if (!input.files || !input.files[0]) return;
  var status = document.getElementById('diet-photo-status');
  var preview = document.getElementById('diet-photo-preview');
  status.textContent = '📤 Reading photo...';

  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      /* Resize to max 900px so the API call stays fast + cheap */
      var canvas = document.createElement('canvas');
      var scale = Math.min(1, 900 / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      var dataUrl = canvas.toDataURL('image/jpeg', 0.8);

      preview.innerHTML = '<img src="' + dataUrl + '" style="max-width:200px;border-radius:8px;border:1px solid var(--border);" />' +
        '<div id="diet-photo-result" style="margin-top:8px;background:#0d0d1a;border-left:3px solid #a855f7;padding:10px;border-radius:0 8px 8px 0;font-size:12px;line-height:1.7;white-space:pre-wrap;color:#a0aec0;">🤖 Looking at your plate...</div>';
      status.textContent = '';

      var p = dietProfile(window.AppState);
      var prompt = 'You are an expert Indian nutritionist. Look at this plate of food (likely Andhra/South Indian home cooking). ' +
        'Identify each item and estimate realistic calories for home-cooked portions as shown. ' +
        (p.portions ? 'Her usual portions for reference: ' + p.portions + '. ' : '') +
        'Reply: one line per item with kcal, then ALWAYS end with exactly:\nTOTAL_KCAL: <number>';

      aiVision(prompt, dataUrl, function(reply) {
        var res = document.getElementById('diet-photo-result');
        if (!res) return;
        var m = reply.match(/TOTAL_KCAL:\s*(\d+)/i);
        var text = reply.replace(/TOTAL_KCAL:\s*\d+/i, '').trim();
        if (m) {
          var kcal = parseInt(m[1]);
          res.innerHTML = escHtml(text).replace(/\n/g,'<br>') +
            '<div style="margin-top:10px;"><button class="btn-primary" style="width:100%;" onclick="dietAddMeal(\'📷 Plate photo meal\',' + kcal + ',\'photo\')">✅ Log This Plate — ' + kcal + ' kcal</button></div>';
        } else {
          res.textContent = text + '\n\n(No clear total — type the meal in the text box instead.)';
        }
      });
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}

function dietDeleteMeal(i) {
  var day = dietDay(window.AppState, aeTodayIso());
  day.meals.splice(i, 1);
  saveData(); renderPage();
}

/* ============================================
   📊 ANALYTICS
   ============================================ */
function renderDietAnalytics(state, p) {
  var target = dietTarget(p);
  var h = '';

  /* Last 7 days */
  h += '<div class="card" style="margin-bottom:14px;"><div class="card-header">Last 7 Days — Calories' + (target?' (target ' + target + ')':'') + '</div>';
  var now = new Date();
  for (var i = 6; i >= 0; i--) {
    var d = new Date(now); d.setDate(now.getDate()-i);
    var iso = aeIso(d);
    var day = (state.dietLog||{})[iso] || { meals:[], steps:0 };
    var eaten = dietEaten(day);
    var col = target===0 ? '#a855f7' : eaten===0 ? '#556080' : eaten <= target + Math.round((day.steps||0)*0.04) ? '#10b981' : '#ef4444';
    var label = (i===0?'Today':d.toLocaleDateString('en-IN',{weekday:'short',day:'numeric'}));
    h += aeBarRow(label + ((day.steps||0)>0?' · 👟'+day.steps:''), eaten, Math.max(target||2000, eaten), col, eaten>0 ? eaten+' kcal' : '—');
  }
  h += '</div>';

  /* Month calendar: green = within budget, red = over */
  var v = aeGetView('diet');
  var calMap = {};
  Object.keys(state.dietLog||{}).forEach(function(iso) {
    calMap[iso] = dietEaten(state.dietLog[iso]);
  });
  h += '<div class="card" style="margin-bottom:14px;">';
  h += aeMonthNav('diet');
  h += aeCalendarHeatmap(v.y, v.m, calMap, function(val){
    if (!val) return '#1a1a35';
    if (!target) return '#a855f7';
    return val <= target ? '#10b981' : '#ef4444';
  }, function(val){ return val>0 ? Math.round(val/100)/10+'k' : ''; });
  h += '<div style="font-size:9px;color:#8899bb;margin-top:8px;">🟢 Within target · 🔴 Over target · numbers are kcal (1.2k = 1200)</div>';
  h += '</div>';

  /* Averages */
  var isoKeys = Object.keys(state.dietLog||{}).filter(function(k){ return dietEaten(state.dietLog[k])>0; });
  if (isoKeys.length) {
    var avg = Math.round(isoKeys.reduce(function(a,k){ return a+dietEaten(state.dietLog[k]); },0) / isoKeys.length);
    var avgSteps = Math.round(isoKeys.reduce(function(a,k){ return a+((state.dietLog[k].steps)||0); },0) / isoKeys.length);
    h += '<div class="grid-3" style="margin-bottom:14px;">';
    h += '<div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-value">' + avg + '</div><div class="stat-label">Avg kcal/day</div></div>';
    h += '<div class="stat-card" style="--stat-color:#06b6d4"><div class="stat-value">' + avgSteps + '</div><div class="stat-label">Avg Steps</div></div>';
    h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">' + isoKeys.length + '</div><div class="stat-label">Days Tracked</div></div>';
    h += '</div>';
  }

  return h;
}

/* ============================================
   💬 DIETICIAN AI CHAT — knows everything
   ============================================ */
function buildDietContext(state) {
  var p = dietProfile(state);
  var out = 'HER BODY PROFILE: height ' + (p.heightCm||'?') + 'cm, weight ' + (p.weightKg||'?') + 'kg, age ' + p.age +
    ', activity ' + p.activity + ', goal: ' + p.goal + '. BMR ' + dietBMR(p) + ', TDEE ' + dietTDEE(p) + ', daily target ' + dietTarget(p) + ' kcal.\n' +
    (p.portions ? 'Usual portions: ' + p.portions + '\n' : '');

  out += 'LAST 7 DAYS FOOD LOG:\n';
  var now = new Date();
  for (var i = 6; i >= 0; i--) {
    var d = new Date(now); d.setDate(now.getDate()-i);
    var iso = aeIso(d);
    var day = (state.dietLog||{})[iso];
    if (!day || (!day.meals.length && !day.steps)) continue;
    out += iso + ': ' + dietEaten(day) + ' kcal (' + day.meals.map(function(m){ return m.desc+' '+m.kcal; }).join('; ') + ')' +
      (day.steps ? ' · ' + day.steps + ' steps' : '') + '\n';
  }

  /* Gym context connects diet to training */
  try {
    var gymWeek = 0;
    var gymMap = aeGymByDate(state);
    for (var g = 0; g < 7; g++) {
      var gd = new Date(now); gd.setDate(now.getDate()-g);
      if (gymMap[aeIso(gd)]) gymWeek++;
    }
    out += 'Gym sessions in last 7 days: ' + gymWeek + '\n';
  } catch(e) {}

  return out;
}

function renderDietChat(state, p) {
  var msgs = state.dietChat || [];
  var h = '';

  h += '<div class="card">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">';
  h += '<div style="width:36px;height:36px;border-radius:50%;background:#10b981;display:flex;align-items:center;justify-content:center;font-size:16px;">🥗</div>';
  h += '<div><div style="font-size:13px;font-weight:800;">Your AI Dietician</div>';
  h += '<div style="font-size:11px;color:#10b981;">● Knows your body, your food log, your gym days</div></div>';
  h += '</div>';

  h += '<div id="diet-chat-msgs" style="min-height:140px;max-height:380px;overflow-y:auto;margin-bottom:10px;">';
  if (msgs.length === 0) {
    h += '<div style="background:#1a1a35;border-radius:0 10px 10px 10px;padding:12px;font-size:12px;line-height:1.7;">' +
      'Hi Vasavi! I\'m your dietician — I can see your profile, everything you\'ve eaten, your steps and gym days.<br><br>' +
      '<b>Try:</b> "Am I eating enough protein?" · "Plan tomorrow\'s Andhra menu within my target" · "Why am I hungry at 5 PM?" · "What should I eat after gym?"</div>';
  } else {
    msgs.forEach(function(m) {
      if (m.role === 'user') {
        h += '<div style="display:flex;justify-content:flex-end;margin-bottom:8px;"><div style="background:var(--accent);border-radius:10px 0 10px 10px;padding:9px 12px;font-size:12px;line-height:1.6;max-width:80%;color:#fff;">' + escHtml(m.text) + '</div></div>';
      } else {
        h += '<div style="display:flex;gap:8px;margin-bottom:8px;"><span style="font-size:16px;flex-shrink:0;">🥗</span><div style="background:#1a1a35;border-radius:0 10px 10px 10px;padding:9px 12px;font-size:12px;line-height:1.7;max-width:88%;white-space:pre-wrap;">' + escHtml(m.text) + '</div></div>';
      }
    });
  }
  h += '</div>';
  h += '<div id="diet-loading" style="display:none;text-align:center;padding:8px;font-size:11px;color:#10b981;">🥗 Thinking about your nutrition...</div>';

  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">';
  ['Plan tomorrow\'s menu','Enough protein?','Post-gym meal?','Why always hungry at 5pm?'].forEach(function(pr) {
    h += '<div onclick="sendDietMsg(\'' + pr.replace(/'/g,'\\\'') + '\')" style="padding:5px 10px;border-radius:99px;background:#1a1a35;border:1px solid var(--border);font-size:10px;cursor:pointer;color:#a0aec0;">' + pr + '</div>';
  });
  h += '</div>';

  h += '<div style="display:flex;gap:8px;">' +
    '<input id="diet-input" placeholder="Ask your dietician..." style="flex:1;" onkeydown="if(event.key===\'Enter\')sendDietFromInput()" />' +
    '<button class="btn-primary" onclick="sendDietFromInput()">Ask</button></div>';
  if (msgs.length > 0) h += '<div style="text-align:right;margin-top:4px;"><span onclick="clearDietChat()" style="font-size:10px;color:#556080;cursor:pointer;">Clear chat</span></div>';
  h += '</div>';

  return h;
}

function clearDietChat() { window.AppState.dietChat = []; saveData(); renderPage(); }

function sendDietFromInput() {
  var el = document.getElementById('diet-input');
  if (!el || !el.value.trim()) return;
  sendDietMsg(el.value.trim());
  el.value = '';
}

function sendDietMsg(msg) {
  var state = window.AppState;
  if (!Array.isArray(state.dietChat)) state.dietChat = [];
  state.dietChat.push({ role:'user', text:msg });
  saveData(); renderPage();

  var ld = document.getElementById('diet-loading');
  if (ld) ld.style.display = 'block';

  var sys = 'You are Vasavi\'s personal AI dietician inside her Life OS. She is 23, Bengaluru, cooks Andhra-style ' +
    'food daily (rice, pappu, rasam, curd, idli, dosa), goes to the gym mornings, and is job-hunting (stress eating risk!). ' +
    'Be warm, specific and practical — suggest ANDHRA/South Indian foods she actually cooks, never foreign diet foods. ' +
    'Use her real numbers below. Keep replies under 200 words unless she asks for a full plan.\n\n' + buildDietContext(state);

  var finish = function(reply) {
    var ld2 = document.getElementById('diet-loading');
    if (ld2) ld2.style.display = 'none';
    state.dietChat.push({ role:'ai', text:reply });
    saveData(); renderPage();
    setTimeout(function(){ var el=document.getElementById('diet-chat-msgs'); if(el) el.scrollTop=el.scrollHeight; },100);
  };

  if (typeof groqChat === 'function' && typeof getApiKey === 'function' && getApiKey()) {
    groqChat(sys, state.dietChat.slice(-8), finish);
  } else {
    var p = dietProfile(state);
    finish('Your numbers: target ' + (dietTarget(p)||'—') + ' kcal/day, today ' + dietEaten(dietDay(state, aeTodayIso())) + ' kcal eaten.\n\nAdd your free Groq API key in AI Assistant and I become a real dietician who plans your Andhra meals with you!');
  }
}

console.log('diet.js loaded OK');
