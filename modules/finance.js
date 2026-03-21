/* ============================================
   VASAVI'S LIFE OS - FINANCE MODULE
   modules/finance.js
   ============================================ */

var EXP_CATS   = ['Food','Gym','Transport','Shopping','Subscriptions',
                   'Health','Study','Entertainment','Other'];
var CAT_COLORS = {
  Food:'#10b981', Gym:'#f97316', Transport:'#06b6d4',
  Shopping:'#ec4899', Subscriptions:'#a855f7', Health:'#ef4444',
  Study:'#f59e0b', Entertainment:'#6366f1', Other:'#64748b'
};

function renderFinance() {
  var state      = window.AppState;
  var expenses   = state.expenses || [];
  var now        = new Date();
  var thisMonth  = now.getMonth();
  var thisYear   = now.getFullYear();

  var monthExp   = expenses.filter(function(e) {
    var d = new Date(e.date || Date.now());
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  var totalMonth = monthExp.reduce(function(a, e) {
    return a + (e.amount || 0);
  }, 0);
  var totalAll   = expenses.reduce(function(a, e) {
    return a + (e.amount || 0);
  }, 0);
  var avgDaily   = totalMonth > 0
    ? Math.round(totalMonth / now.getDate())
    : 0;

  var h = '';

  /* ---- STATS ---- */
  h += '<div class="grid-4" style="margin-bottom:14px;">';

  h += '<div class="stat-card" style="--stat-color:#f59e0b">' +
    '<div class="stat-value">Rs ' + formatRupees(totalMonth) + '</div>' +
    '<div class="stat-label">This Month</div>' +
    '<div class="stat-sub">' + monthExp.length + ' transactions</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#10b981">' +
    '<div class="stat-value">Rs ' + formatRupees(avgDaily) + '</div>' +
    '<div class="stat-label">Daily Average</div>' +
    '<div class="stat-sub">This month</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#a855f7">' +
    '<div class="stat-value">' + expenses.length + '</div>' +
    '<div class="stat-label">Total Entries</div>' +
    '<div class="stat-sub">All time</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#06b6d4">' +
    '<div class="stat-value">Rs ' + formatRupees(totalAll) + '</div>' +
    '<div class="stat-label">Total Spent</div>' +
    '<div class="stat-sub">All time</div>' +
  '</div>';

  h += '</div>';

  /* ---- ADD EXPENSE ---- */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Add Expense</div>';

  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';

  h += '<div class="form-row">' +
    '<label>Amount (Rs)</label>' +
    '<input type="number" id="exp-amount" placeholder="0" />' +
  '</div>';

  h += '<div class="form-row">' +
    '<label>Category</label>' +
    '<select id="exp-cat">' +
      EXP_CATS.map(function(c) {
        return '<option value="' + c + '">' + c + '</option>';
      }).join('') +
    '</select>' +
  '</div>';

  h += '<div class="form-row">' +
    '<label>Date (add on any date!)</label>' +
    '<input type="date" id="exp-date" ' +
      'value="' + now.toISOString().split('T')[0] + '" />' +
  '</div>';

  h += '<div class="form-row">' +
    '<label>Note</label>' +
    '<input id="exp-note" placeholder="What was this for?" />' +
  '</div>';

  h += '</div>';

  h += '<button class="btn-primary" onclick="addExpense()" ' +
    'style="width:100%;margin-top:4px;">Add Expense</button>';

  h += '</div>';

  /* ---- CATEGORY BREAKDOWN ---- */
  h += '<div class="grid-2">';

  h += '<div class="card">';
  h += '<div class="card-header">This Month by Category</div>';

  var byCat = {};
  EXP_CATS.forEach(function(c) {
    byCat[c] = monthExp.filter(function(e) {
      return e.cat === c;
    }).reduce(function(a, e) { return a + (e.amount || 0); }, 0);
  });

  var sorted = EXP_CATS.filter(function(c) {
    return byCat[c] > 0;
  }).sort(function(a, b) { return byCat[b] - byCat[a]; });

  if (sorted.length > 0) {
    sorted.forEach(function(cat) {
      h += '<div class="progress-wrap">' +
        '<div class="progress-label">' +
          '<span style="color:' + CAT_COLORS[cat] + '">' + cat + '</span>' +
          '<span>Rs ' + formatRupees(byCat[cat]) + '</span>' +
        '</div>' +
        '<div class="progress-bar">' +
          '<div class="progress-fill" style="width:' +
            pct(byCat[cat], totalMonth || 1) + '%;' +
            'background:' + CAT_COLORS[cat] + '"></div>' +
        '</div>' +
      '</div>';
    });

    /* Insight */
    var topCat = sorted[0];
    h += '<div style="margin-top:10px;padding:8px;background:#1a1a35;' +
             'border-radius:8px;font-size:11px;color:#f59e0b;">' +
      '💡 Top spend: ' + topCat + ' (Rs ' + formatRupees(byCat[topCat]) +
      ' = ' + pct(byCat[topCat], totalMonth) + '% of budget)' +
    '</div>';
  } else {
    h += '<div class="empty-state" style="padding:20px;">' +
      '<p>No expenses this month yet.</p>' +
    '</div>';
  }

  h += '</div>';

  /* Monthly summary */
  h += '<div class="card">';
  h += '<div class="card-header">Monthly Summary</div>';

  var months = [];
  expenses.forEach(function(e) {
    var d = new Date(e.date || Date.now());
    var key = d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    var found = months.find(function(m) { return m.key === key; });
    if (found) {
      found.total += e.amount || 0;
    } else {
      months.push({ key: key, total: e.amount || 0 });
    }
  });

  if (months.length > 0) {
    var maxMonth = Math.max.apply(null, months.map(function(m) { return m.total; }));
    months.slice(-6).forEach(function(m) {
      h += '<div class="progress-wrap">' +
        '<div class="progress-label">' +
          '<span>' + m.key + '</span>' +
          '<span>Rs ' + formatRupees(m.total) + '</span>' +
        '</div>' +
        '<div class="progress-bar">' +
          '<div class="progress-fill" ' +
            'style="width:' + pct(m.total, maxMonth) + '%;' +
            'background:#f59e0b"></div>' +
        '</div>' +
      '</div>';
    });
  } else {
    h += '<div style="color:#556080;font-size:11px;">No monthly data yet.</div>';
  }

  h += '</div>';
  h += '</div>';

  /* ---- RECENT EXPENSES ---- */
  h += '<div class="card">';
  h += '<div class="card-header">Recent Expenses</div>';

  if (expenses.length > 0) {
    expenses.slice().reverse().slice(0, 15).forEach(function(e, ri) {
      var realIdx = expenses.length - 1 - ri;
      h += '<div class="expense-row">';
      h += '<div>' +
        '<div style="font-weight:600;font-size:12px;">' +
          escHtml(e.note || e.cat) +
        '</div>' +
        '<div style="font-size:10px;color:#556080;margin-top:2px;">' +
          escHtml(e.date || '') +
          ' &nbsp;·&nbsp; ' +
          '<span style="color:' + (CAT_COLORS[e.cat] || '#888') + '">' +
            escHtml(e.cat) +
          '</span>' +
        '</div>' +
      '</div>';
      h += '<div style="display:flex;align-items:center;gap:8px;">' +
        '<span style="font-weight:800;color:#f59e0b;">' +
          'Rs ' + formatRupees(e.amount) +
        '</span>' +
        '<button onclick="deleteExpense(' + realIdx + ')" ' +
          'style="background:none;border:none;color:#556080;' +
                 'cursor:pointer;font-size:13px;">✕</button>' +
      '</div>';
      h += '</div>';
    });
  } else {
    h += '<div class="empty-state" style="padding:20px;">' +
      '<div class="emo">💰</div>' +
      '<p>No expenses yet.<br>Add your first one above!</p>' +
    '</div>';
  }

  h += '</div>';

  return h;
}

/* ============================================
   FINANCE ACTIONS
   ============================================ */
function addExpense() {
  var amt  = parseFloat(document.getElementById('exp-amount').value);
  var cat  = document.getElementById('exp-cat').value;
  var date = document.getElementById('exp-date').value;
  var note = document.getElementById('exp-note').value;

  if (!amt || amt <= 0) {
    alert('Please enter a valid amount.');
    return;
  }

  if (!window.AppState.expenses) window.AppState.expenses = [];
  window.AppState.expenses.push({
    amount: amt,
    cat:    cat,
    date:   date
      ? new Date(date).toDateString()
      : new Date().toDateString(),
    note:   note || ''
  });

  saveData();
  renderPage();
}

function deleteExpense(idx) {
  if (!confirm('Delete this expense?')) return;
  window.AppState.expenses.splice(idx, 1);
  saveData();
  renderPage();
}

console.log('finance.js loaded OK');