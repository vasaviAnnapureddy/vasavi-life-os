/* ============================================
   VASAVI'S LIFE OS - SAVINGS MODULE
   modules/savings.js
   ============================================ */

function renderSavings() {
  var state  = window.AppState;
  var goals  = state.savingsGoals || [];

  var totalTarget = goals.reduce(function(a, g) {
    return a + (g.target || 0);
  }, 0);
  var totalSaved  = goals.reduce(function(a, g) {
    return a + (g.saved || 0);
  }, 0);
  var completed   = goals.filter(function(g) {
    return (g.saved || 0) >= (g.target || 1);
  }).length;

  var h = '';

  /* ---- STATS ---- */
  h += '<div class="grid-3" style="margin-bottom:14px;">';

  h += '<div class="stat-card" style="--stat-color:#10b981">' +
    '<div class="stat-value">Rs ' + formatRupees(totalSaved) + '</div>' +
    '<div class="stat-label">Total Saved</div>' +
    '<div class="stat-sub">Across all goals</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#a855f7">' +
    '<div class="stat-value">Rs ' + formatRupees(totalTarget - totalSaved) + '</div>' +
    '<div class="stat-label">Still Needed</div>' +
    '<div class="stat-sub">To reach all goals</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#f59e0b">' +
    '<div class="stat-value">' + completed + '/' + goals.length + '</div>' +
    '<div class="stat-label">Goals Complete</div>' +
    '<div class="stat-sub">Keep going!</div>' +
  '</div>';

  h += '</div>';

  /* ---- ADD SAVINGS GOAL ---- */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Add Savings Goal</div>';

  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';

  h += '<div class="form-row">' +
    '<label>Goal Name</label>' +
    '<input id="sv-name" placeholder="e.g. Emergency Fund, New Laptop" />' +
  '</div>';

  h += '<div class="form-row">' +
    '<label>Target Amount (Rs)</label>' +
    '<input type="number" id="sv-target" placeholder="5000" />' +
  '</div>';

  h += '<div class="form-row">' +
    '<label>Target Date</label>' +
    '<input type="date" id="sv-date" />' +
  '</div>';

  h += '<div class="form-row">' +
    '<label>Notes (optional)</label>' +
    '<input id="sv-note" placeholder="Why is this important?" />' +
  '</div>';

  h += '</div>';

  h += '<button class="btn-primary" onclick="addSavingsGoal()" ' +
    'style="width:100%;margin-top:4px;">Add Goal</button>';

  h += '</div>';

  /* ---- SAVINGS GOALS LIST ---- */
  if (goals.length > 0) {
    goals.forEach(function(goal, gi) {
      var savedPct = pct(goal.saved || 0, goal.target || 1);
      var barColor = savedPct >= 100 ? '#10b981' :
                     savedPct >= 50  ? '#06b6d4' :
                     savedPct >= 25  ? '#a855f7' : '#f59e0b';
      var isComplete = (goal.saved || 0) >= (goal.target || 1);

      h += '<div class="card" style="margin-bottom:11px;' +
        (isComplete ? 'border-color:#14532d;' : '') + '">';

      /* Header */
      h += '<div style="display:flex;justify-content:space-between;' +
               'align-items:flex-start;margin-bottom:12px;">';
      h += '<div>';
      h += '<div style="font-weight:800;font-size:14px;">';
      if (isComplete) h += '✅ ';
      h += escHtml(goal.name) + '</div>';
      if (goal.date) {
        h += '<div style="font-size:10px;color:#556080;margin-top:2px;">' +
          '🎯 Target: ' + goal.date +
        '</div>';
      }
      if (goal.note) {
        h += '<div style="font-size:10px;color:#8899bb;margin-top:2px;">' +
          escHtml(goal.note) +
        '</div>';
      }
      h += '</div>';
      h += '<button onclick="deleteSavingsGoal(' + gi + ')" ' +
        'style="background:none;border:none;color:#556080;cursor:pointer;font-size:16px;">✕</button>';
      h += '</div>';

      /* Progress */
      h += '<div style="display:flex;align-items:center;gap:14px;margin-bottom:12px;">';
      h += '<div style="flex:1;">';
      h += '<div style="display:flex;justify-content:space-between;' +
               'font-size:11px;margin-bottom:4px;">';
      h += '<span style="color:#8899bb;">' +
        'Rs ' + formatRupees(goal.saved || 0) +
        ' of Rs ' + formatRupees(goal.target) +
      '</span>';
      h += '<span style="font-weight:800;color:' + barColor + '">' +
        savedPct + '%' +
      '</span>';
      h += '</div>';
      h += '<div class="savings-bar">' +
        '<div class="savings-fill" ' +
          'style="width:' + Math.min(savedPct, 100) + '%;' +
          'background:' + barColor + ';"></div>' +
      '</div>';
      h += '</div>';
      h += makeRing(Math.min(savedPct, 100), barColor, 60);
      h += '</div>';

      /* Milestones */
      h += '<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;">';
      [25, 50, 75, 100].forEach(function(m) {
        var reached = savedPct >= m;
        h += '<span style="font-size:10px;padding:3px 8px;border-radius:99px;' +
                 'background:' + (reached ? barColor + '22' : '#1a1a35') + ';' +
                 'color:' + (reached ? barColor : '#556080') + ';' +
                 'border:1px solid ' + (reached ? barColor : '#1a1a35') + ';">' +
          m + '% ' + (reached ? '✅' : '') +
        '</span>';
      });
      h += '</div>';

      if (isComplete) {
        h += '<div style="text-align:center;padding:10px;background:#052e16;' +
                 'border-radius:8px;font-size:12px;color:#6ee7b7;font-weight:700;">' +
          '🎉 Goal Complete! Well done Vasavi! You did it!' +
        '</div>';
      } else {
        /* Add money form */
        h += '<div style="display:flex;gap:8px;">';
        h += '<input type="number" id="sv-add-' + gi + '" ' +
          'placeholder="Add Rs saved..." style="flex:1;" />';
        h += '<button class="btn-green" ' +
          'onclick="addToSavings(' + gi + ')">+ Add</button>';
        h += '</div>';

        /* How much per day */
        if (goal.date) {
          var daysLeft = Math.ceil(
            (new Date(goal.date) - new Date()) / (1000 * 60 * 60 * 24)
          );
          var needed   = (goal.target || 0) - (goal.saved || 0);
          if (daysLeft > 0 && needed > 0) {
            h += '<div style="font-size:10px;color:#f59e0b;margin-top:6px;">' +
              '📅 Rs ' + formatRupees(Math.ceil(needed / daysLeft)) +
              '/day needed to reach goal by ' + goal.date +
            '</div>';
          }
        }
      }

      h += '</div>';
    });
  } else {
    h += '<div class="empty-state">' +
      '<div class="emo">🏦</div>' +
      '<p>No savings goals yet.<br>Start saving today, Vasavi!</p>' +
    '</div>';
  }

  /* ---- SAVINGS TIPS ---- */
  h += '<div class="card">';
  h += '<div class="card-header">Smart Saving Tips for Students</div>';
  var tips = [
    'Pay yourself first - save before spending',
    'No sweets = saves Rs 50-100 per day easily',
    'Cook at home 3 days a week instead of ordering',
    'Use UPI cashback offers whenever possible',
    'Every Rs 100 saved today = Rs 200 in 5 years (at 15% return)',
    'Track every rupee - awareness reduces spending by 20%'
  ];
  tips.forEach(function(tip) {
    h += '<div style="padding:6px 0;border-bottom:1px solid #1a1a35;' +
             'font-size:11px;color:#8899bb;">💡 ' + tip + '</div>';
  });
  h += '</div>';

  return h;
}

/* ============================================
   SAVINGS ACTIONS
   ============================================ */
function addSavingsGoal() {
  var name   = document.getElementById('sv-name');
  var target = document.getElementById('sv-target');
  var date   = document.getElementById('sv-date');
  var note   = document.getElementById('sv-note');

  if (!name || !name.value.trim()) {
    alert('Please enter a goal name.');
    return;
  }
  if (!target || !target.value || parseFloat(target.value) <= 0) {
    alert('Please enter a valid target amount.');
    return;
  }

  if (!window.AppState.savingsGoals) window.AppState.savingsGoals = [];
  window.AppState.savingsGoals.push({
    name:   name.value.trim(),
    target: parseFloat(target.value),
    saved:  0,
    date:   date  ? date.value  : '',
    note:   note  ? note.value  : ''
  });

  saveData();
  renderPage();
}

function addToSavings(idx) {
  var el = document.getElementById('sv-add-' + idx);
  if (!el || !el.value) return;
  var amt = parseFloat(el.value);
  if (!amt || amt <= 0) {
    alert('Please enter a valid amount.');
    return;
  }
  window.AppState.savingsGoals[idx].saved =
    (window.AppState.savingsGoals[idx].saved || 0) + amt;
  saveData();
  renderPage();
}

function deleteSavingsGoal(idx) {
  if (!confirm('Delete this savings goal?')) return;
  window.AppState.savingsGoals.splice(idx, 1);
  saveData();
  renderPage();
}

console.log('savings.js loaded OK');