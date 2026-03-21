/* ============================================
   VASAVI'S LIFE OS - TRAVEL MODULE
   modules/travel.js
   ============================================ */

function renderTravel() {
  var state = window.AppState;
  var trips = state.trips || [];

  var h = '';

  /* ---- STATS ---- */
  h += '<div class="grid-3" style="margin-bottom:14px;">';

  h += '<div class="stat-card" style="--stat-color:#f97316">' +
    '<div class="stat-value">' + trips.length + '</div>' +
    '<div class="stat-label">Trips Planned</div>' +
  '</div>';

  var readyTrips = trips.filter(function(t) {
    return pct(
      (t.checklist||[]).filter(function(c){return c.done;}).length,
      (t.checklist||[]).length||1
    ) === 100;
  }).length;

  h += '<div class="stat-card" style="--stat-color:#10b981">' +
    '<div class="stat-value">' + readyTrips + '</div>' +
    '<div class="stat-label">Ready to Go</div>' +
    '<div class="stat-sub">100% packed</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#a855f7">' +
    '<div class="stat-value">' +
      trips.reduce(function(a,t){return a+(t.reels||[]).length;},0) +
    '</div>' +
    '<div class="stat-label">Saved Reels</div>' +
    '<div class="stat-sub">Travel inspo</div>' +
  '</div>';

  h += '</div>';

  /* ---- ADD TRIP ---- */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Plan New Trip</div>';

  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';

  h += '<div class="form-row">' +
    '<label>Destination</label>' +
    '<input id="trip-dest" placeholder="e.g. Goa, Manali, Coorg" />' +
  '</div>';

  h += '<div class="form-row">' +
    '<label>Dates</label>' +
    '<input id="trip-dates" placeholder="e.g. Apr 15-20, 2026" />' +
  '</div>';

  h += '<div class="form-row">' +
    '<label>Budget (Rs)</label>' +
    '<input type="number" id="trip-budget" placeholder="15000" />' +
  '</div>';

  h += '<div class="form-row">' +
    '<label>Notes</label>' +
    '<input id="trip-notes" placeholder="With who? Purpose?" />' +
  '</div>';

  h += '</div>';

  h += '<button class="btn-primary" onclick="addTrip()" ' +
    'style="width:100%;margin-top:4px;">Plan Trip</button>';

  h += '</div>';

  /* ---- BUCKET LIST DESTINATIONS ---- */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Bucket List Destinations</div>';

  var bucketList = [
    { dest: 'Coorg, Karnataka',     emoji: '🌿', why: 'Coffee estates, misty hills' },
    { dest: 'Hampi, Karnataka',     emoji: '🏛️', why: 'Ancient ruins, backpacker heaven' },
    { dest: 'Pondicherry',          emoji: '🌊', why: 'French quarter, beaches' },
    { dest: 'Munnar, Kerala',       emoji: '🍵', why: 'Tea gardens, cool weather' },
    { dest: 'Goa',                  emoji: '🏖️', why: 'Beaches, nightlife, food' },
    { dest: 'Spiti Valley, HP',     emoji: '🏔️', why: 'Himalayas, adventure' },
    { dest: 'Seoul, South Korea',   emoji: '🇰🇷', why: 'K-culture, food, tech' },
    { dest: 'Bali, Indonesia',      emoji: '🌺', why: 'Temples, rice fields, beaches' }
  ];

  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
  bucketList.forEach(function(dest) {
    var added = trips.some(function(t) {
      return t.dest.toLowerCase().includes(dest.dest.split(',')[0].toLowerCase());
    });
    h += '<div style="background:var(--card2);border:1px solid var(--border);' +
             'border-radius:9px;padding:10px;display:flex;' +
             'justify-content:space-between;align-items:center;">';
    h += '<div style="display:flex;gap:8px;align-items:center;">';
    h += '<span style="font-size:18px;">' + dest.emoji + '</span>';
    h += '<div>';
    h += '<div style="font-size:11px;font-weight:700;">' + dest.dest + '</div>';
    h += '<div style="font-size:10px;color:#8899bb;">' + dest.why + '</div>';
    h += '</div></div>';
    if (!added) {
      h += '<button class="btn-ghost btn-small" ' +
        'onclick="quickAddTrip(\'' + dest.dest.replace(/'/g,'') +
        '\',\'' + dest.emoji + '\')">' +
        '+ Plan' +
      '</button>';
    } else {
      h += '<span style="font-size:10px;color:#10b981;">Planned ✅</span>';
    }
    h += '</div>';
  });
  h += '</div></div>';

  /* ---- TRIPS LIST ---- */
  if (trips.length > 0) {
    trips.forEach(function(trip, ti) {
      var checklist  = trip.checklist || [];
      var checkDone  = checklist.filter(function(c){return c.done;}).length;
      var checkPct   = pct(checkDone, checklist.length || 1);

      h += '<div class="card" style="margin-bottom:11px;">';

      /* Trip header */
      h += '<div style="display:flex;justify-content:space-between;' +
               'align-items:flex-start;margin-bottom:12px;">';
      h += '<div>';
      h += '<div style="font-size:16px;font-weight:900;">✈️ ' +
        escHtml(trip.dest) + '</div>';
      if (trip.dates) {
        h += '<div style="font-size:11px;color:#8899bb;margin-top:2px;">' +
          '📅 ' + escHtml(trip.dates) + '</div>';
      }
      if (trip.budget) {
        h += '<div style="font-size:11px;color:#f59e0b;margin-top:2px;">' +
          '💰 Budget: Rs ' + formatRupees(trip.budget) + '</div>';
      }
      if (trip.notes) {
        h += '<div style="font-size:10px;color:#8899bb;margin-top:2px;">' +
          escHtml(trip.notes) + '</div>';
      }
      h += '</div>';
      h += '<button onclick="deleteTrip(' + ti + ')" ' +
        'style="background:none;border:none;color:#556080;cursor:pointer;font-size:16px;">✕</button>';
      h += '</div>';

      /* Prep progress */
      h += '<div class="progress-wrap" style="margin-bottom:12px;">';
      h += '<div class="progress-label">';
      h += '<span>Preparation</span>';
      h += '<span>' + checkPct + '%</span>';
      h += '</div>';
      h += '<div class="progress-bar" style="height:6px;">' +
        '<div class="progress-fill" style="width:' + checkPct +
        '%;background:#f97316"></div></div>';
      h += '</div>';

      /* Tabs for trip */
      var tripTab = (window.AppState._tripTabs || {})[ti] || 'packing';
      h += '<div class="subtab-bar">';
      ['packing','reels','budget'].forEach(function(tab) {
        h += '<div class="subtab ' + (tripTab === tab ? 'active' : '') + '" ' +
          'onclick="setTripTab(' + ti + ',\'' + tab + '\')">' +
          (tab === 'packing' ? '🎒 Packing' :
           tab === 'reels'   ? '🎬 Reels' : '💰 Budget') +
        '</div>';
      });
      h += '</div>';

      /* Packing checklist */
      if (tripTab === 'packing') {
        if (checklist.length > 0) {
          checklist.forEach(function(item, ci) {
            h += '<div class="check-item" ' +
              'onclick="toggleTripItem(' + ti + ',' + ci + ')">';
            h += '<input type="checkbox" ' + (item.done ? 'checked' : '') + ' />';
            h += '<span class="' + (item.done ? 'checked-text' : '') + '">' +
              escHtml(item.text) + '</span>';
            h += '<button onclick="deleteTripItem(' + ti + ',' + ci + ')" ' +
              'style="background:none;border:none;color:#556080;cursor:pointer;font-size:12px;">✕</button>';
            h += '</div>';
          });
        } else {
          h += '<div style="font-size:11px;color:#556080;padding:8px 0;">' +
            'No packing items yet. Add below!</div>';
        }

        /* Add packing item */
        h += '<div style="display:flex;gap:8px;margin-top:8px;">';
        h += '<input id="pack-inp-' + ti + '" ' +
          'placeholder="Add packing item..." style="flex:1;" />';
        h += '<button class="btn-primary btn-small" ' +
          'onclick="addTripItem(' + ti + ')">+</button>';
        h += '</div>';

        /* Quick add common items */
        h += '<div style="margin-top:8px;">';
        h += '<div style="font-size:10px;color:#8899bb;margin-bottom:4px;">' +
          'Quick add:</div>';
        var commonItems = ['Passport/ID','Phone charger','Medicines',
          'Clothes','Toiletries','Camera','Cash','Earphones'];
        h += '<div style="display:flex;gap:5px;flex-wrap:wrap;">';
        commonItems.forEach(function(item) {
          h += '<div onclick="quickAddTripItem(' + ti + ',\'' + item + '\')" ' +
            'style="padding:3px 8px;border-radius:99px;border:1px solid #1a1a35;' +
                   'font-size:10px;color:#8899bb;cursor:pointer;">+ ' + item + '</div>';
        });
        h += '</div></div>';
      }

      /* Travel reels */
      if (tripTab === 'reels') {
        var reels = trip.reels || [];
        if (reels.length > 0) {
          reels.forEach(function(reel, ri) {
            h += '<div style="display:flex;justify-content:space-between;' +
                     'align-items:center;padding:7px 0;border-bottom:1px solid #1a1a35;">';
            h += '<a href="' + escHtml(reel) + '" target="_blank" ' +
              'style="color:#a855f7;font-size:11px;text-decoration:none;' +
                     'flex:1;overflow:hidden;text-overflow:ellipsis;">' +
              escHtml(reel) + '</a>';
            h += '<button onclick="deleteTripReel(' + ti + ',' + ri + ')" ' +
              'style="background:none;border:none;color:#556080;cursor:pointer;font-size:12px;margin-left:8px;">✕</button>';
            h += '</div>';
          });
        } else {
          h += '<div style="font-size:11px;color:#556080;padding:8px 0;">' +
            'No reels saved yet. Paste YouTube/Instagram links below!</div>';
        }
        h += '<div style="display:flex;gap:8px;margin-top:8px;">';
        h += '<input id="reel-inp-' + ti + '" ' +
          'placeholder="Paste YouTube/Instagram reel link..." style="flex:1;" />';
        h += '<button class="btn-primary btn-small" ' +
          'onclick="addTripReel(' + ti + ')">+</button>';
        h += '</div>';
      }

      /* Budget tracker */
      if (tripTab === 'budget') {
        var tripExpenses = trip.expenses || [];
        var totalSpent   = tripExpenses.reduce(function(a,e){return a+(e.amount||0);},0);
        var budget       = parseFloat(trip.budget) || 0;

        if (budget > 0) {
          h += '<div class="progress-wrap" style="margin-bottom:10px;">';
          h += '<div class="progress-label">' +
            '<span>Spent: Rs ' + formatRupees(totalSpent) + '</span>' +
            '<span>Budget: Rs ' + formatRupees(budget) + '</span>' +
          '</div>';
          h += '<div class="progress-bar" style="height:8px;">' +
            '<div class="progress-fill" style="width:' +
              Math.min(pct(totalSpent, budget), 100) +
            '%;background:' + (totalSpent > budget ? '#ef4444' : '#10b981') + '"></div>' +
          '</div></div>';
        }

        tripExpenses.forEach(function(exp, ei) {
          h += '<div style="display:flex;justify-content:space-between;' +
                   'padding:6px 0;border-bottom:1px solid #1a1a35;font-size:11px;">';
          h += '<span>' + escHtml(exp.note || 'Expense') + '</span>';
          h += '<span style="color:#f59e0b;">Rs ' + formatRupees(exp.amount) + '</span>';
          h += '</div>';
        });

        h += '<div style="display:flex;gap:8px;margin-top:8px;">';
        h += '<input type="number" id="texp-amt-' + ti + '" ' +
          'placeholder="Rs spent..." style="width:120px;" />';
        h += '<input id="texp-note-' + ti + '" ' +
          'placeholder="What for?" style="flex:1;" />';
        h += '<button class="btn-primary btn-small" ' +
          'onclick="addTripExpense(' + ti + ')">+</button>';
        h += '</div>';
      }

      h += '</div>';
    });
  } else {
    h += '<div class="empty-state">';
    h += '<div class="emo">✈️</div>';
    h += '<p>No trips yet.<br>Plan your first adventure!</p>';
    h += '</div>';
  }

  return h;
}

/* ============================================
   TRAVEL ACTIONS
   ============================================ */
function addTrip() {
  var dest   = document.getElementById('trip-dest');
  var dates  = document.getElementById('trip-dates');
  var budget = document.getElementById('trip-budget');
  var notes  = document.getElementById('trip-notes');

  if (!dest || !dest.value.trim()) {
    alert('Please enter a destination.');
    return;
  }

  if (!window.AppState.trips) window.AppState.trips = [];
  window.AppState.trips.push({
    dest:      dest.value.trim(),
    dates:     dates  ? dates.value  : '',
    budget:    budget ? budget.value : '',
    notes:     notes  ? notes.value  : '',
    checklist: [],
    reels:     [],
    expenses:  []
  });

  saveData();
  renderPage();
}

function quickAddTrip(dest, emoji) {
  if (!window.AppState.trips) window.AppState.trips = [];
  window.AppState.trips.push({
    dest:      dest,
    dates:     '',
    budget:    '',
    notes:     '',
    checklist: [],
    reels:     [],
    expenses:  []
  });
  saveData();
  renderPage();
}

function deleteTrip(idx) {
  if (!confirm('Delete this trip?')) return;
  window.AppState.trips.splice(idx, 1);
  saveData();
  renderPage();
}

function setTripTab(ti, tab) {
  if (!window.AppState._tripTabs) window.AppState._tripTabs = {};
  window.AppState._tripTabs[ti] = tab;
  renderPage();
}

function addTripItem(ti) {
  var inp = document.getElementById('pack-inp-' + ti);
  if (!inp || !inp.value.trim()) return;
  if (!window.AppState.trips[ti].checklist) {
    window.AppState.trips[ti].checklist = [];
  }
  window.AppState.trips[ti].checklist.push({
    text: inp.value.trim(),
    done: false
  });
  inp.value = '';
  saveData();
  renderPage();
}

function quickAddTripItem(ti, text) {
  if (!window.AppState.trips[ti].checklist) {
    window.AppState.trips[ti].checklist = [];
  }
  window.AppState.trips[ti].checklist.push({ text: text, done: false });
  saveData();
  renderPage();
}

function toggleTripItem(ti, ci) {
  window.AppState.trips[ti].checklist[ci].done =
    !window.AppState.trips[ti].checklist[ci].done;
  saveData();
  renderPage();
}

function deleteTripItem(ti, ci) {
  window.AppState.trips[ti].checklist.splice(ci, 1);
  saveData();
  renderPage();
}

function addTripReel(ti) {
  var inp = document.getElementById('reel-inp-' + ti);
  if (!inp || !inp.value.trim()) return;
  if (!window.AppState.trips[ti].reels) {
    window.AppState.trips[ti].reels = [];
  }
  window.AppState.trips[ti].reels.push(inp.value.trim());
  inp.value = '';
  saveData();
  renderPage();
}

function deleteTripReel(ti, ri) {
  window.AppState.trips[ti].reels.splice(ri, 1);
  saveData();
  renderPage();
}

function addTripExpense(ti) {
  var amt  = document.getElementById('texp-amt-'  + ti);
  var note = document.getElementById('texp-note-' + ti);
  if (!amt || !amt.value) return;
  if (!window.AppState.trips[ti].expenses) {
    window.AppState.trips[ti].expenses = [];
  }
  window.AppState.trips[ti].expenses.push({
    amount: parseFloat(amt.value),
    note:   note ? note.value : ''
  });
  amt.value  = '';
  if (note) note.value = '';
  saveData();
  renderPage();
}

console.log('travel.js loaded OK');