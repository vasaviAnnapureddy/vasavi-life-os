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

/* Custom categories (e.g. "Gifts", "Rent") get a stable color too */
var CAT_PALETTE = ['#14b8a6','#8b5cf6','#f43f5e','#84cc16','#0ea5e9','#d946ef','#eab308','#fb7185'];
function catColor(cat) {
  if (CAT_COLORS[cat]) return CAT_COLORS[cat];
  var hash = 0;
  String(cat||'').split('').forEach(function(ch){ hash = (hash*31 + ch.charCodeAt(0)) % 997; });
  return CAT_PALETTE[hash % CAT_PALETTE.length];
}

function renderFinance() {
  var state      = window.AppState;
  var expenses   = state.expenses || [];
  var now        = new Date();
  var thisMonth  = now.getMonth();
  var thisYear   = now.getFullYear();

  /* ---- VIEW SWITCHER ---- */
  var view = state.financeView || 'main';
  var vh = '<div class="subtab-bar">';
  [['main','💰 Expenses'],['income','💵 Income'],['savings','🏦 Savings + AI'],['analytics','📊 Data Analytics']].forEach(function(t) {
    vh += '<div class="subtab ' + (view===t[0]?'active':'') + '" onclick="switchFinanceView(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  vh += '</div>';
  if (view === 'analytics') return vh + renderFinanceAnalytics(state);
  if (view === 'income')    return vh + renderFinanceIncome(state);
  if (view === 'savings')   return vh + renderFinanceSavings(state);

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

  var h = vh;

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
    '<select id="exp-cat" onchange="toggleCustomCat(this)">' +
      EXP_CATS.map(function(c) {
        return '<option value="' + c + '">' + (c==='Other' ? 'Other (type what it is!)' : c) + '</option>';
      }).join('') +
    '</select>' +
    '<input id="exp-cat-custom" placeholder="What is it? e.g. Rent, Gifts, Mobile recharge..." ' +
      'style="display:none;margin-top:6px;border-color:#f59e0b;" />' +
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

  /* ---- CATEGORY BREAKDOWN (includes custom categories) ---- */
  h += '<div class="grid-2">';

  h += '<div class="card">';
  h += '<div class="card-header">This Month by Category</div>';

  var byCat = financeCatTotals(monthExp);
  var sorted = Object.keys(byCat).filter(function(c) {
    return byCat[c] > 0;
  }).sort(function(a, b) { return byCat[b] - byCat[a]; });

  if (sorted.length > 0) {
    sorted.forEach(function(cat) {
      h += '<div class="progress-wrap">' +
        '<div class="progress-label">' +
          '<span style="color:' + catColor(cat) + '">' + escHtml(cat) + '</span>' +
          '<span>Rs ' + formatRupees(byCat[cat]) + '</span>' +
        '</div>' +
        '<div class="progress-bar">' +
          '<div class="progress-fill" style="width:' +
            pct(byCat[cat], totalMonth || 1) + '%;' +
            'background:' + catColor(cat) + '"></div>' +
        '</div>' +
      '</div>';
    });

    /* Insight */
    var topCat = sorted[0];
    h += '<div style="margin-top:10px;padding:8px;background:#1a1a35;' +
             'border-radius:8px;font-size:11px;color:#f59e0b;">' +
      '💡 Top spend: ' + escHtml(topCat) + ' (Rs ' + formatRupees(byCat[topCat]) +
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

  /* ---- MONTH-BY-MONTH EXPENSE LIST ----
     Browse ANY month with ◀ ▶ and see every
     transaction of that month grouped by day */
  var lv = aeGetView('financeList');
  var listExp = financeMonthExpenses(expenses, lv.y, lv.m);
  var listTotal = listExp.reduce(function(a,e){ return a+(e.amount||0); }, 0);

  h += '<div class="card">';
  h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
    '<button class="btn-ghost" style="padding:4px 12px;" onclick="aeShiftMonth(\'financeList\',-1)">◀</button>' +
    '<div style="text-align:center;">' +
      '<div style="font-size:13px;font-weight:800;">' + AE_MONTHS[lv.m] + ' ' + lv.y + ' Expenses</div>' +
      '<div style="font-size:11px;color:#f59e0b;font-weight:700;">Rs ' + formatRupees(listTotal) + ' · ' + listExp.length + ' transactions</div>' +
    '</div>' +
    '<button class="btn-ghost" style="padding:4px 12px;" onclick="aeShiftMonth(\'financeList\',1)">▶</button>' +
  '</div>';

  if (listExp.length > 0) {
    /* Sort newest first, group by day */
    var sortedExp = listExp.slice().sort(function(a,b){ return new Date(b.date) - new Date(a.date); });
    var lastDay = '';
    sortedExp.forEach(function(e) {
      var d = new Date(e.date || Date.now());
      var dayKey = aeIso(d);
      if (dayKey !== lastDay) {
        lastDay = dayKey;
        var dayTotal = listExp.filter(function(x){ return aeIso(new Date(x.date||0)) === dayKey; })
                              .reduce(function(a,x){ return a+(x.amount||0); }, 0);
        h += '<div style="display:flex;justify-content:space-between;margin:12px 0 4px;font-size:10px;font-weight:800;color:#8899bb;text-transform:uppercase;">' +
          '<span>' + d.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'}) + '</span>' +
          '<span>Rs ' + formatRupees(dayTotal) + '</span>' +
        '</div>';
      }
      var realIdx = expenses.indexOf(e);
      h += '<div class="expense-row">';
      h += '<div>' +
        '<div style="font-weight:600;font-size:12px;">' + escHtml(e.note || e.cat) + '</div>' +
        '<div style="font-size:10px;margin-top:2px;">' +
          '<span style="color:' + catColor(e.cat) + '">' + escHtml(e.cat) + '</span>' +
        '</div>' +
      '</div>';
      h += '<div style="display:flex;align-items:center;gap:8px;">' +
        '<span style="font-weight:800;color:#f59e0b;">Rs ' + formatRupees(e.amount) + '</span>' +
        '<button onclick="deleteExpense(' + realIdx + ')" ' +
          'style="background:none;border:none;color:#556080;cursor:pointer;font-size:13px;">✕</button>' +
      '</div>';
      h += '</div>';
    });
  } else {
    h += '<div class="empty-state" style="padding:20px;">' +
      '<div class="emo">💰</div>' +
      '<p>No expenses in ' + AE_MONTHS[lv.m] + ' ' + lv.y + '.<br>Use ◀ ▶ to browse other months.</p>' +
    '</div>';
  }

  h += '</div>';

  return h;
}

/* ============================================
   💵 INCOME TAB — money coming IN
   ============================================ */
function renderFinanceIncome(state) {
  var income = state.income || [];
  var now = new Date();
  var h = '';

  /* This month numbers */
  var mInc = income.filter(function(e){ var d=new Date(e.date||0); return !isNaN(d)&&d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear(); });
  var mExp = financeMonthExpenses(state.expenses||[], now.getFullYear(), now.getMonth());
  var incTotal = mInc.reduce(function(a,e){ return a+(e.amount||0); },0);
  var expTotal = mExp.reduce(function(a,e){ return a+(e.amount||0); },0);
  var net = incTotal - expTotal;
  var rate = incTotal > 0 ? Math.round((net/incTotal)*100) : 0;

  h += '<div class="grid-4" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">₹' + formatRupees(incTotal) + '</div><div class="stat-label">Income</div><div class="stat-sub">This month</div></div>';
  h += '<div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-value">₹' + formatRupees(expTotal) + '</div><div class="stat-label">Spent</div><div class="stat-sub">This month</div></div>';
  h += '<div class="stat-card" style="--stat-color:' + (net>=0?'#10b981':'#ef4444') + '"><div class="stat-value">' + (net>=0?'₹'+formatRupees(net):'-₹'+formatRupees(-net)) + '</div><div class="stat-label">' + (net>=0?'Saved':'Overspent') + '</div><div class="stat-sub">Income − expenses</div></div>';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + (incTotal>0?rate+'%':'—') + '</div><div class="stat-label">Savings Rate</div><div class="stat-sub">' + (incTotal>0?'of income kept':'add income first') + '</div></div>';
  h += '</div>';

  /* Add income */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">+ Add Income</div>';
  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
  h += '<div class="form-row"><label>Amount (₹)</label><input type="number" id="inc-amount" placeholder="0" /></div>';
  h += '<div class="form-row"><label>Source</label><select id="inc-source">' +
    ['Salary','Stipend','Freelance','Tutoring','Side Hustle','Gift','Cashback','Other'].map(function(s){ return '<option>'+s+'</option>'; }).join('') +
    '</select></div>';
  h += '<div class="form-row"><label>Date</label><input type="date" id="inc-date" value="' + now.toISOString().split('T')[0] + '" /></div>';
  h += '<div class="form-row"><label>Note</label><input id="inc-note" placeholder="From whom / for what?" /></div>';
  h += '</div>';
  h += '<button class="btn-primary" onclick="addIncome()" style="width:100%;margin-top:4px;">Add Income</button>';
  h += '</div>';

  /* Month-by-month income list */
  var lv = aeGetView('incomeList');
  var listInc = income.filter(function(e){ var d=new Date(e.date||0); return !isNaN(d)&&d.getFullYear()===lv.y&&d.getMonth()===lv.m; });
  var listTotal = listInc.reduce(function(a,e){ return a+(e.amount||0); },0);

  h += '<div class="card">';
  h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
    '<button class="btn-ghost" style="padding:4px 12px;" onclick="aeShiftMonth(\'incomeList\',-1)">◀</button>' +
    '<div style="text-align:center;"><div style="font-size:13px;font-weight:800;">' + AE_MONTHS[lv.m] + ' ' + lv.y + ' Income</div>' +
    '<div style="font-size:11px;color:#10b981;font-weight:700;">₹' + formatRupees(listTotal) + ' · ' + listInc.length + ' entries</div></div>' +
    '<button class="btn-ghost" style="padding:4px 12px;" onclick="aeShiftMonth(\'incomeList\',1)">▶</button>' +
  '</div>';

  if (listInc.length) {
    listInc.slice().sort(function(a,b){ return new Date(b.date)-new Date(a.date); }).forEach(function(e) {
      var realIdx = income.indexOf(e);
      h += '<div class="expense-row">';
      h += '<div><div style="font-weight:600;font-size:12px;">' + escHtml(e.source||'Income') + '</div>' +
        '<div style="font-size:10px;color:#556080;margin-top:2px;">' + aeIso(new Date(e.date)) + (e.note?' · '+escHtml(e.note):'') + '</div></div>';
      h += '<div style="display:flex;align-items:center;gap:8px;">' +
        '<span style="font-weight:800;color:#10b981;">+₹' + formatRupees(e.amount) + '</span>' +
        '<button onclick="deleteIncome(' + realIdx + ')" style="background:none;border:none;color:#556080;cursor:pointer;font-size:13px;">✕</button></div>';
      h += '</div>';
    });
  } else {
    h += '<div class="empty-state" style="padding:20px;"><div class="emo">💵</div><p>No income logged in ' + AE_MONTHS[lv.m] + '.<br>Every rupee that comes in, log it here!</p></div>';
  }
  h += '</div>';

  return h;
}

function addIncome() {
  var amt = parseFloat(document.getElementById('inc-amount').value);
  if (!amt || amt <= 0) { alert('Please enter a valid amount.'); return; }
  if (!Array.isArray(window.AppState.income)) window.AppState.income = [];
  window.AppState.income.push({
    amount: amt,
    source: document.getElementById('inc-source').value,
    date:   document.getElementById('inc-date').value ? new Date(document.getElementById('inc-date').value).toDateString() : new Date().toDateString(),
    note:   document.getElementById('inc-note').value || ''
  });
  saveData(); renderPage();
  showToast('💵 Income added!');
}

function deleteIncome(idx) {
  if (!confirm('Delete this income entry?')) return;
  window.AppState.income.splice(idx, 1);
  saveData(); renderPage();
}

/* ============================================
   🏦 SAVINGS + AI TAB — goals + a money AI
   that knows EVERYTHING about her finances
   ============================================ */
function renderFinanceSavings(state) {
  var goals = state.savingsGoals || [];
  var h = '';

  /* Goals summary */
  var totalSaved  = goals.reduce(function(a,g){ return a+(g.saved||0); },0);
  var totalTarget = goals.reduce(function(a,g){ return a+(g.target||0); },0);

  h += '<div class="grid-2" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">₹' + formatRupees(totalSaved) + '</div><div class="stat-label">Total Saved</div><div class="stat-sub">across ' + goals.length + ' goals</div></div>';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + pct(totalSaved, totalTarget||1) + '%</div><div class="stat-label">Of Target</div><div class="stat-sub">₹' + formatRupees(totalTarget) + ' goal</div></div>';
  h += '</div>';

  /* Goals list with quick add-money */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">🏦 Savings Goals</div>';
  if (goals.length) {
    goals.forEach(function(g, i) {
      var gp = pct(g.saved||0, g.target||1);
      h += '<div style="margin-bottom:12px;">';
      h += '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">' +
        '<span style="font-weight:700;">' + escHtml(g.name) + '</span>' +
        '<span style="color:#10b981;">₹' + formatRupees(g.saved||0) + ' / ₹' + formatRupees(g.target) + ' (' + gp + '%)</span></div>';
      h += '<div class="progress-bar" style="margin-bottom:6px;"><div class="progress-fill" style="width:' + Math.min(gp,100) + '%;background:#10b981;"></div></div>';
      h += '<div style="display:flex;gap:6px;">' +
        '<input type="number" id="sav-add-' + i + '" placeholder="Add ₹..." style="flex:1;font-size:11px;padding:5px 8px;" />' +
        '<button class="btn-ghost" style="font-size:11px;" onclick="savAddMoney(' + i + ')">+ Add</button>' +
        '<button style="background:none;border:none;color:#556080;cursor:pointer;" onclick="deleteSavingsGoal(' + i + ')">✕</button></div>';
      h += '</div>';
    });
  } else {
    h += '<div style="font-size:11px;color:#556080;margin-bottom:8px;">No savings goals yet. Create one below!</div>';
  }
  /* Inline new goal */
  h += '<div style="display:flex;gap:6px;margin-top:8px;padding-top:10px;border-top:1px solid #1a1a35;">' +
    '<input id="sav-new-name" placeholder="Goal name (e.g. Emergency Fund)" style="flex:2;" />' +
    '<input type="number" id="sav-new-target" placeholder="Target ₹" style="flex:1;" />' +
    '<button class="btn-primary" onclick="savNewGoal()">+ Goal</button></div>';
  h += '</div>';

  /* ---- MONEY AI CHAT ---- */
  var msgs = state.moneyChat || [];
  h += '<div class="card">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">';
  h += '<div style="width:36px;height:36px;border-radius:50%;background:#10b981;display:flex;align-items:center;justify-content:center;font-size:16px;">🏦</div>';
  h += '<div><div style="font-size:13px;font-weight:800;">Your Money AI</div>';
  h += '<div style="font-size:11px;color:#10b981;">● Knows your full income, spending & savings — ask anything</div></div>';
  h += '</div>';

  h += '<div id="money-chat-msgs" style="min-height:120px;max-height:350px;overflow-y:auto;margin-bottom:10px;">';
  if (msgs.length === 0) {
    h += '<div style="background:#1a1a35;border-radius:0 10px 10px 10px;padding:12px;font-size:12px;line-height:1.7;">' +
      'Hi Vasavi! I can see your real money data — every income, expense and savings goal.<br><br>' +
      '<b>Try:</b> "How am I doing with my savings?" · "Can I afford ₹2000 shopping this month?" · "Make me a savings plan for ₹50,000" · "Where did my money go this month?"</div>';
  } else {
    msgs.forEach(function(m) {
      if (m.role === 'user') {
        h += '<div style="display:flex;justify-content:flex-end;margin-bottom:8px;"><div style="background:var(--accent);border-radius:10px 0 10px 10px;padding:9px 12px;font-size:12px;line-height:1.6;max-width:80%;color:#fff;">' + escHtml(m.text) + '</div></div>';
      } else {
        h += '<div style="display:flex;gap:8px;margin-bottom:8px;"><span style="font-size:16px;flex-shrink:0;">🏦</span><div style="background:#1a1a35;border-radius:0 10px 10px 10px;padding:9px 12px;font-size:12px;line-height:1.7;max-width:88%;white-space:pre-wrap;">' + escHtml(m.text) + '</div></div>';
      }
    });
  }
  h += '</div>';
  h += '<div id="money-loading" style="display:none;text-align:center;padding:8px;font-size:11px;color:#10b981;">🏦 Checking your money...</div>';

  /* Quick prompts */
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">';
  ['How are my savings going?','Where to cut spending?','Plan: save ₹5000/month','Can I afford a trip?'].forEach(function(p) {
    h += '<div onclick="sendMoneyMsg(\'' + p.replace(/'/g,'') + '\')" style="padding:5px 10px;border-radius:99px;background:#1a1a35;border:1px solid var(--border);font-size:10px;cursor:pointer;color:#a0aec0;">' + p + '</div>';
  });
  h += '</div>';

  h += '<div style="display:flex;gap:8px;">' +
    '<input id="money-input" placeholder="Ask about your money..." style="flex:1;" onkeydown="if(event.key===\'Enter\')sendMoneyFromInput()" />' +
    '<button class="btn-primary" onclick="sendMoneyFromInput()">Ask</button></div>';
  if (msgs.length > 0) h += '<div style="text-align:right;margin-top:4px;"><span onclick="clearMoneyChat()" style="font-size:10px;color:#556080;cursor:pointer;">Clear chat</span></div>';
  h += '</div>';

  return h;
}

function savNewGoal() {
  var name = (document.getElementById('sav-new-name')||{}).value || '';
  var target = parseFloat((document.getElementById('sav-new-target')||{}).value);
  if (!name.trim() || !target) { alert('Enter a goal name and target amount.'); return; }
  if (!window.AppState.savingsGoals) window.AppState.savingsGoals = [];
  window.AppState.savingsGoals.push({ name:name.trim(), target:target, saved:0, date:'' });
  saveData(); renderPage();
}

function savAddMoney(idx) {
  var el = document.getElementById('sav-add-' + idx);
  var amt = parseFloat(el ? el.value : 0);
  if (!amt || amt <= 0) return;
  window.AppState.savingsGoals[idx].saved = (window.AppState.savingsGoals[idx].saved||0) + amt;
  saveData(); renderPage();
  showToast('🏦 ₹' + formatRupees(amt) + ' added to ' + window.AppState.savingsGoals[idx].name + '!');
}

function clearMoneyChat() { window.AppState.moneyChat = []; saveData(); renderPage(); }

function sendMoneyFromInput() {
  var el = document.getElementById('money-input');
  if (!el || !el.value.trim()) return;
  sendMoneyMsg(el.value.trim());
  el.value = '';
}

function sendMoneyMsg(msg) {
  var state = window.AppState;
  if (!Array.isArray(state.moneyChat)) state.moneyChat = [];
  state.moneyChat.push({ role:'user', text:msg });
  saveData(); renderPage();

  var ld = document.getElementById('money-loading');
  if (ld) ld.style.display = 'block';

  var sys = 'You are Vasavi\'s personal money advisor inside her Life OS. She is 23, Bengaluru, ' +
    'Data Science fresher hunting for her first job. Be warm but honest about her money. ' +
    'Use ₹ always. Give specific numbers from her REAL data below, not generic advice. ' +
    'When she asks "can I afford X", calculate from her actual income minus spending. ' +
    'Keep replies under 200 words unless she asks for a full plan.\n\n' +
    (typeof buildMoneyContext === 'function' ? buildMoneyContext(state) : '');

  var finish = function(reply) {
    var ld2 = document.getElementById('money-loading');
    if (ld2) ld2.style.display = 'none';
    state.moneyChat.push({ role:'ai', text:reply });
    saveData(); renderPage();
    setTimeout(function(){ var el=document.getElementById('money-chat-msgs'); if(el) el.scrollTop=el.scrollHeight; },100);
  };

  if (typeof groqChat === 'function' && typeof getApiKey === 'function' && getApiKey()) {
    groqChat(sys, state.moneyChat.slice(-8), finish);
  } else {
    /* No API key — honest data-based fallback */
    var goals = state.savingsGoals || [];
    var saved = goals.reduce(function(a,g){ return a+(g.saved||0); },0);
    var target = goals.reduce(function(a,g){ return a+(g.target||0); },0);
    finish('Without an API key I can still show your numbers:\n\n• Saved: ₹' + formatRupees(saved) + ' of ₹' + formatRupees(target) + ' (' + pct(saved, target||1) + '%)\n\nAdd your Groq (free) or Claude API key in AI Assistant and I become a real advisor who plans with you.');
  }
}

/* Show the custom category box when "Other" is picked */
function toggleCustomCat(sel) {
  var box = document.getElementById(sel.id === 'exp-cat' ? 'exp-cat-custom' : 'm-cat-custom');
  if (box) {
    box.style.display = sel.value === 'Other' ? 'block' : 'none';
    if (sel.value === 'Other') box.focus();
  }
}

/* ============================================
   FINANCE ACTIONS
   ============================================ */
function addExpense() {
  var amt  = parseFloat(document.getElementById('exp-amount').value);
  var cat  = document.getElementById('exp-cat').value;
  var date = document.getElementById('exp-date').value;
  var note = document.getElementById('exp-note').value;

  /* "Other" + typed name → becomes its own real category */
  var customEl = document.getElementById('exp-cat-custom');
  if (cat === 'Other' && customEl && customEl.value.trim()) {
    var c = customEl.value.trim();
    cat = c.charAt(0).toUpperCase() + c.slice(1);
  }

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

function switchFinanceView(v) { window.AppState.financeView = v; saveData(); renderPage(); }
function switchFinanceAnalyticsTab(t) { window.AppState.financeAnalyticsTab = t; saveData(); renderPage(); }

/* ============================================
   FINANCE — DATA ANALYTICS (Google Pay style)
   Pick any month → total, category breakdown,
   compare with last month. Yearly → per-month
   and per-year totals. AI summary of where to
   reduce.
   ============================================ */
function financeMonthExpenses(expenses, year, month) {
  return expenses.filter(function(e) {
    var d = new Date(e.date || Date.now());
    return !isNaN(d) && d.getFullYear() === year && d.getMonth() === month;
  });
}

function financeCatTotals(list) {
  var byCat = {};
  list.forEach(function(e) {
    var c = e.cat || 'Other';
    byCat[c] = (byCat[c]||0) + (e.amount||0);
  });
  return byCat;
}

function renderFinanceAnalytics(state) {
  var expenses = state.expenses || [];
  var tab = state.financeAnalyticsTab || 'monthly';
  var h = '';

  h += '<div class="subtab-bar">';
  [['monthly','📈 Monthly'],['yearly','🏆 Yearly']].forEach(function(t) {
    h += '<div class="subtab ' + (tab===t[0]?'active':'') + '" onclick="switchFinanceAnalyticsTab(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  h += '</div>';

  if (expenses.length === 0) {
    return h + '<div class="empty-state"><div class="emo">💰</div><p>No expenses yet. Add expenses first, then your money analytics appear here!</p></div>';
  }

  if (tab === 'monthly') {
    var v = aeGetView('finance');
    var monthExp = financeMonthExpenses(expenses, v.y, v.m);
    var total    = monthExp.reduce(function(a,e){ return a+(e.amount||0); }, 0);

    /* Previous month comparison */
    var pm = v.m===0 ? 11 : v.m-1;
    var py = v.m===0 ? v.y-1 : v.y;
    var prevTotal = financeMonthExpenses(expenses, py, pm).reduce(function(a,e){ return a+(e.amount||0); }, 0);
    var diff = total - prevTotal;

    h += '<div class="card" style="margin-bottom:14px;">';
    h += aeMonthNav('finance');

    /* Big Google-Pay-style total */
    h += '<div style="text-align:center;padding:10px 0 16px;">';
    h += '<div style="font-size:11px;color:#8899bb;">Total spent in ' + AE_MONTHS[v.m] + '</div>';
    h += '<div style="font-size:40px;font-weight:900;color:#f59e0b;">₹' + formatRupees(total) + '</div>';
    h += '<div style="font-size:11px;color:#8899bb;">' + monthExp.length + ' transactions';
    if (prevTotal > 0) {
      h += ' · <span style="color:' + (diff>0?'#ef4444':'#10b981') + ';font-weight:700;">' +
        (diff>0?'▲ ₹'+formatRupees(diff)+' more':'▼ ₹'+formatRupees(-diff)+' less') + ' than ' + AE_MONTHS[pm] + '</span>';
    }
    h += '</div></div>';

    /* Category breakdown with % */
    var byCat  = financeCatTotals(monthExp);
    var sorted = Object.keys(byCat).sort(function(a,b){ return byCat[b]-byCat[a]; });
    if (sorted.length) {
      h += '<div style="border-top:1px solid #1a1a35;padding-top:12px;">';
      h += '<div class="card-header">Where the money went</div>';
      sorted.forEach(function(cat) {
        var col = catColor(cat);
        var share = pct(byCat[cat], total || 1);
        h += '<div class="progress-wrap">' +
          '<div class="progress-label">' +
            '<span style="color:' + col + '">' + cat + ' <span style="color:#556080;">(' + share + '%)</span></span>' +
            '<span>₹' + formatRupees(byCat[cat]) + '</span>' +
          '</div>' +
          '<div class="progress-bar"><div class="progress-fill" style="width:' + share + '%;background:' + col + '"></div></div>' +
        '</div>';
      });
      h += '</div>';
    }
    h += '</div>';

    /* Daily spend heatmap for the month */
    var spendMap = aeSpendByDate(state);
    h += '<div class="card" style="margin-bottom:14px;">';
    h += '<div class="card-header">Daily Spending Heatmap</div>';
    h += aeCalendarHeatmap(v.y, v.m, spendMap, aeSpendColor, function(val){ return val>0?'₹'+(val>=1000?Math.round(val/100)/10+'k':val):''; });
    h += '<div style="font-size:9px;color:#8899bb;margin-top:8px;">Green = light spend · Orange = ₹500+ · Red = ₹1000+ day</div>';
    h += '</div>';

    /* Biggest single expenses */
    var top5 = monthExp.slice().sort(function(a,b){ return (b.amount||0)-(a.amount||0); }).slice(0,5);
    if (top5.length) {
      h += '<div class="card" style="margin-bottom:14px;"><div class="card-header">Biggest Expenses This Month</div>';
      top5.forEach(function(e) {
        h += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #1a1a35;font-size:11px;">';
        h += '<span>' + escHtml(e.note||e.cat) + ' <span style="color:' + catColor(e.cat) + ';">· ' + escHtml(e.cat||'') + '</span></span>';
        h += '<span style="color:#f59e0b;font-weight:800;">₹' + formatRupees(e.amount) + '</span></div>';
      });
      h += '</div>';
    }

    h += '<button class="btn-primary" style="width:100%;" onclick="financeMonthAISummary(this)">🤖 AI Summary — Where To Reduce In ' + AE_MONTHS[v.m] + '?</button>';
    h += '<div id="finance-ai-summary" style="display:none;"></div>';
  }

  if (tab === 'yearly') {
    var vy = aeGetView('finance');
    var spendMap2 = aeSpendByDate(state);
    var monthVals = aeMonthTotals(spendMap2, vy.y);
    var yearTotal = monthVals.reduce(function(a,b){ return a+b; }, 0);

    h += '<div class="card" style="margin-bottom:14px;">';
    h += aeYearNav('finance');
    h += '<div style="text-align:center;padding:6px 0 14px;">';
    h += '<div style="font-size:11px;color:#8899bb;">Total spent in ' + vy.y + '</div>';
    h += '<div style="font-size:36px;font-weight:900;color:#f59e0b;">₹' + formatRupees(yearTotal) + '</div>';
    h += '<div style="font-size:11px;color:#8899bb;">Average ₹' + formatRupees(Math.round(yearTotal/12)) + ' / month</div>';
    h += '</div>';
    h += aeYearBarChart(monthVals, vy.y===new Date().getFullYear()?new Date().getMonth():-1, '#f59e0b', function(vv){ return '₹'+(vv>=1000?Math.round(vv/1000)+'k':vv); }, 'finance', 'financeAnalyticsTab');
    h += '</div>';

    /* Year category breakdown */
    var yearExp = expenses.filter(function(e){ var d=new Date(e.date||Date.now()); return !isNaN(d)&&d.getFullYear()===vy.y; });
    var byCatY  = financeCatTotals(yearExp);
    var sortedY = Object.keys(byCatY).sort(function(a,b){ return byCatY[b]-byCatY[a]; });
    if (sortedY.length) {
      h += '<div class="card" style="margin-bottom:14px;"><div class="card-header">' + vy.y + ' by Category</div>';
      sortedY.forEach(function(cat) {
        var col = catColor(cat);
        h += aeBarRow(cat + ' (' + pct(byCatY[cat], yearTotal||1) + '%)', byCatY[cat], yearTotal||1, col, '₹' + formatRupees(byCatY[cat]));
      });
      h += '</div>';
    }

    /* All years */
    var years = aeYearTotals(spendMap2);
    var yKeys = Object.keys(years).sort();
    if (yKeys.length) {
      var maxY = Math.max.apply(null, yKeys.map(function(k){ return years[k]; }));
      h += '<div class="card" style="margin-bottom:14px;"><div class="card-header">All Years</div>';
      yKeys.forEach(function(yk) {
        h += aeBarRow(yk, years[yk], maxY, '#06b6d4', '₹' + formatRupees(years[yk]));
      });
      h += '</div>';
    }

    h += '<button class="btn-primary" style="width:100%;" onclick="financeYearAISummary(this)">🤖 AI Summary — How To Improve Next Year?</button>';
    h += '<div id="finance-ai-summary-y" style="display:none;"></div>';
  }

  return h;
}

function financeMonthAISummary(btn) {
  var state = window.AppState;
  var v = aeGetView('finance');
  var monthExp = financeMonthExpenses(state.expenses||[], v.y, v.m);
  var total = monthExp.reduce(function(a,e){ return a+(e.amount||0); }, 0);
  var byCat = financeCatTotals(monthExp);
  var sorted = Object.keys(byCat).sort(function(a,b){ return byCat[b]-byCat[a]; });

  var pm = v.m===0?11:v.m-1, py = v.m===0?v.y-1:v.y;
  var prevTotal = financeMonthExpenses(state.expenses||[], py, pm).reduce(function(a,e){ return a+(e.amount||0); }, 0);

  var catLines = sorted.map(function(c){ return c + ': ₹' + byCat[c] + ' (' + pct(byCat[c], total||1) + '%)'; }).join('\n');
  var txLines = monthExp.map(function(e){ return aeIso(new Date(e.date)) + ' · ' + (e.note||e.cat) + ' · ₹' + e.amount + ' (' + e.cat + ')'; }).join('\n');
  var ctx = 'Spending for ' + AE_MONTHS[v.m] + ' ' + v.y + ': total ₹' + total + ' across ' + monthExp.length +
    ' transactions. Previous month total: ₹' + prevTotal + '.\nBy category:\n' + catLines + '\nAll transactions:\n' + txLines;

  var topCat = sorted[0];
  var fallback = '💰 ' + AE_MONTHS[v.m] + ' ' + v.y + ' money summary:\n' +
    '• Total: ₹' + formatRupees(total) + (prevTotal>0 ? ' (' + (total>prevTotal?'+':'') + formatRupees(total-prevTotal) + ' vs last month)' : '') + '\n' +
    (topCat ? '• Biggest drain: ' + topCat + ' at ₹' + formatRupees(byCat[topCat]) + ' = ' + pct(byCat[topCat], total||1) + '% of everything\n' : '') +
    (sorted[1] ? '• Second: ' + sorted[1] + ' (₹' + formatRupees(byCat[sorted[1]]) + ')\n' : '') + '\n' +
    'Where to reduce:\n' +
    (topCat ? '1. Cap ' + topCat + ' at ₹' + formatRupees(Math.round(byCat[topCat]*0.8)) + ' next month (20% cut).\n' : '') +
    (byCat['Subscriptions'] ? '2. Review Subscriptions (₹' + formatRupees(byCat['Subscriptions']) + ') — cancel anything unused 30 days.\n' : '') +
    (byCat['Entertainment'] || byCat['Shopping'] ? '3. ' + (byCat['Shopping']?'Shopping':'Entertainment') + ' is a want, not a need — set a fixed weekly limit.\n' : '') +
    '\nRule for next month: log every expense same-day, review this page every Sunday.';
  aeAISummary('Money Summary — ' + AE_MONTHS[v.m] + ' ' + v.y, ctx, fallback, btn, 'finance-ai-summary');
}

function financeYearAISummary(btn) {
  var state = window.AppState;
  var vy = aeGetView('finance');
  var yearExp = (state.expenses||[]).filter(function(e){ var d=new Date(e.date||Date.now()); return !isNaN(d)&&d.getFullYear()===vy.y; });
  var total = yearExp.reduce(function(a,e){ return a+(e.amount||0); }, 0);
  var byCat = financeCatTotals(yearExp);
  var sorted = Object.keys(byCat).sort(function(a,b){ return byCat[b]-byCat[a]; });
  var monthVals = aeMonthTotals(aeSpendByDate(state), vy.y);
  var maxM = monthVals.indexOf(Math.max.apply(null, monthVals));

  var ctx = 'Spending for year ' + vy.y + ': total ₹' + total + '.\nPer month: ' +
    monthVals.map(function(m,i){ return AE_MONTHS_SHORT[i] + ' ₹' + m; }).join(', ') + '\nBy category:\n' +
    sorted.map(function(c){ return c + ': ₹' + byCat[c] + ' (' + pct(byCat[c], total||1) + '%)'; }).join('\n');

  var fallback = '🏆 ' + vy.y + ' money summary:\n' +
    '• Total: ₹' + formatRupees(total) + ' (avg ₹' + formatRupees(Math.round(total/12)) + '/month)\n' +
    (sorted[0] ? '• Top category all year: ' + sorted[0] + ' (₹' + formatRupees(byCat[sorted[0]]) + ')\n' : '') +
    '• Most expensive month: ' + AE_MONTHS[maxM] + ' (₹' + formatRupees(monthVals[maxM]||0) + ')\n\n' +
    'Improve next year:\n' +
    '1. Set a monthly budget of ₹' + formatRupees(Math.round((total/12)*0.85)) + ' (15% below your average).\n' +
    (sorted[0] ? '2. ' + sorted[0] + ' alone was ' + pct(byCat[sorted[0]], total||1) + '% — plan it weekly instead of impulse spending.\n' : '') +
    '3. Move the saved difference into your Savings goals on the 1st of each month.';
  aeAISummary('Year Summary — ' + vy.y, ctx, fallback, btn, 'finance-ai-summary-y');
}

console.log('finance.js loaded OK');