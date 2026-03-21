/* ============================================
   VASAVI'S LIFE OS - CORE APP
   app.js
   Main router + navigation + events
   ============================================ */

/* ============================================
   PAGE CONFIG
   ============================================ */
var PAGE_TITLES = {
  dashboard:  'Dashboard',
  planner:    'Daily Planner',
  timer:      'Focus Timer',
  goals:      'Goals OS',
  dsroad:     '10-Day DS Roadmap',
  interview:  'Interview Prep',
  project:    'Project Tracker',
  learning:   'Learning OS',
  language:   'Language OS',
  books:      'Books',
  habits:     'Habits + Health',
  gym:        'Gym Planner',
  finance:    'Finance OS',
  savings:    'Savings',
  jobs:       'Job Tracker',
  resume:     'Resume Builder',
  travel:     'Travel OS',
  notes:      'Rich Notes',
  journal:    'Journal + Talk',
  analytics:  'Analytics',
  ai:         'AI Assistant'
};

var PAGE_SUBS = {
  dashboard:  'Your life at a glance',
  planner:    'Plan. Execute. Reflect.',
  timer:      'Every minute logged is proof.',
  goals:      'Nothing falls through the cracks.',
  dsroad:     '10 days to interview-ready.',
  interview:  'Practice until it is effortless.',
  project:    'Finance Intelligence Dashboard',
  learning:   'Your complete second brain.',
  language:   'English + Korean daily.',
  books:      'Read more. Retain more.',
  habits:     'Build who you want to be.',
  gym:        'Your weekly workout plan.',
  finance:    'Every rupee accounted for.',
  savings:    'Building your future.',
  jobs:       'Land that DS/AI role.',
  resume:     'Your story on one page.',
  travel:     'Plan trips. Save memories.',
  notes:      'Write, record, capture everything.',
  journal:    'Talk to your OS. It listens.',
  analytics:  'See your life as data.',
  ai:         'Your personal AI mentor.'
};

/* ============================================
   NAVIGATION
   ============================================ */
function goToPage(page) {
  if (!PAGE_TITLES[page]) return;

  /* Update state */
  window.AppState.currentPage = page;

  /* Update sidebar active item */
  document.querySelectorAll('.nav-item').forEach(function(item) {
    item.classList.toggle('active', item.getAttribute('data-page') === page);
  });

  /* Update topbar */
  document.getElementById('page-title').textContent    = PAGE_TITLES[page];
  document.getElementById('page-subtitle').textContent = PAGE_SUBS[page];

  /* Render the page */
  renderPage();

  /* Setup page specific events after render */
  setupPageEvents();

  /* Save current page */
  saveData();
}

/* ============================================
   PAGE RENDERER
   Routes to the correct module render function
   ============================================ */
function renderPage() {
  var content = document.getElementById('content');
  if (!content) return;

  var page = window.AppState.currentPage || 'dashboard';

  var renderers = {
    dashboard:  typeof renderDashboard  === 'function' ? renderDashboard  : null,
    planner:    typeof renderPlanner    === 'function' ? renderPlanner    : null,
    timer:      typeof renderTimer      === 'function' ? renderTimer      : null,
    goals:      typeof renderGoals      === 'function' ? renderGoals      : null,
    dsroad:     typeof renderDSRoad     === 'function' ? renderDSRoad     : null,
    interview:  typeof renderInterview  === 'function' ? renderInterview  : null,
    project:    typeof renderProject    === 'function' ? renderProject    : null,
    learning:   typeof renderLearning   === 'function' ? renderLearning   : null,
    language:   typeof renderLanguage   === 'function' ? renderLanguage   : null,
    books:      typeof renderBooks      === 'function' ? renderBooks      : null,
    habits:     typeof renderHabits     === 'function' ? renderHabits     : null,
    gym:        typeof renderGym        === 'function' ? renderGym        : null,
    finance:    typeof renderFinance    === 'function' ? renderFinance    : null,
    savings:    typeof renderSavings    === 'function' ? renderSavings    : null,
    jobs:       typeof renderJobs       === 'function' ? renderJobs       : null,
    resume:     typeof renderResume     === 'function' ? renderResume     : null,
    travel:     typeof renderTravel     === 'function' ? renderTravel     : null,
    notes:      typeof renderNotes      === 'function' ? renderNotes      : null,
    journal:    typeof renderJournal    === 'function' ? renderJournal    : null,
    analytics:  typeof renderAnalytics  === 'function' ? renderAnalytics  : null,
    ai:         typeof renderAI         === 'function' ? renderAI         : null
  };

  var fn = renderers[page];

  if (fn) {
    try {
      content.innerHTML = fn();
    } catch (err) {
      content.innerHTML = errorPage(page, err.message);
      console.error('Render error on page ' + page + ':', err);
    }
  } else {
    content.innerHTML = comingSoonPage(page);
  }
}

/* ============================================
   PLACEHOLDER PAGES
   ============================================ */
function comingSoonPage(page) {
  return (
    '<div class="empty-state">' +
      '<div class="emo">🚧</div>' +
      '<p style="font-size:16px;font-weight:700;margin-bottom:8px;">' +
        PAGE_TITLES[page] +
      '</p>' +
      '<p>This module is being built. Come back soon!</p>' +
    '</div>'
  );
}

function errorPage(page, msg) {
  return (
    '<div class="empty-state">' +
      '<div class="emo">⚠️</div>' +
      '<p style="font-size:14px;font-weight:700;color:#ef4444;margin-bottom:8px;">' +
        'Error in ' + PAGE_TITLES[page] +
      '</p>' +
      '<p style="font-size:11px;color:#888;">' + msg + '</p>' +
    '</div>'
  );
}

/* ============================================
   SETUP PAGE SPECIFIC EVENTS
   Called after every page render
   ============================================ */
function setupPageEvents() {
  var page = window.AppState.currentPage;

  /* Dashboard - ONE thing input */
  if (page === 'dashboard') {
    var input = document.getElementById('one-thing-input');
    if (input) {
      input.addEventListener('input', function() {
        window.AppState.planner.focus = this.value;
        saveData();
      });
    }
  }
}

/* ============================================
   MODAL SYSTEM
   ============================================ */
function openModal(title, bodyHTML, saveCallback) {
  document.getElementById('modal-title').textContent  = title;
  document.getElementById('modal-body').innerHTML     = bodyHTML;
  document.getElementById('modal-overlay').classList.remove('hidden');
  window._modalSaveCallback = saveCallback || null;
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-body').innerHTML = '';
  window._modalSaveCallback = null;
}

/* ============================================
   + ADD BUTTON HANDLER
   ============================================ */
function handleAddButton() {
  var page = window.AppState.currentPage;

  var modals = {
    dashboard: openAddTaskModal,
    planner:   openAddTaskModal,
    goals:     openAddGoalModal,
    habits:    openAddHabitModal,
    books:     openAddBookModal,
    travel:    openAddTripModal,
    jobs:      openAddJobModal,
    finance:   openAddExpenseModal,
    savings:   openAddSavingsModal
  };

  var fn = modals[page];
  if (fn) {
    fn();
  } else {
    openModal(
      'Add to ' + (PAGE_TITLES[page] || page),
      '<p style="color:#888;font-size:13px;">Use the form on this page to add items.</p>',
      null
    );
  }
}

/* ============================================
   QUICK ADD MODALS
   ============================================ */
function openAddTaskModal() {
  openModal('Add Task',
    '<div class="form-row">' +
      '<label>Task Name</label>' +
      '<input id="m-name" placeholder="What needs to be done?" />' +
    '</div>' +
    '<div class="form-row">' +
      '<label>Priority</label>' +
      '<select id="m-priority">' +
        '<option value="High">High</option>' +
        '<option value="Medium" selected>Medium</option>' +
        '<option value="Low">Low</option>' +
      '</select>' +
    '</div>' +
    '<div class="form-row">' +
      '<label>Deadline (optional)</label>' +
      '<input type="date" id="m-deadline" />' +
    '</div>',
    function() {
      var name = document.getElementById('m-name').value.trim();
      if (!name) { alert('Please enter a task name.'); return; }
      var tab = window.AppState.goalTab || 'daily';
      window.AppState.goals[tab].push({
        text:     name,
        priority: document.getElementById('m-priority').value,
        deadline: document.getElementById('m-deadline').value || '',
        done:     false
      });
      saveData();
      renderPage();
    }
  );
}

function openAddGoalModal() {
  var tab = window.AppState.goalTab || 'daily';
  openModal('Add ' + tab.charAt(0).toUpperCase() + tab.slice(1) + ' Goal',
    '<div class="form-row">' +
      '<label>Goal</label>' +
      '<input id="m-name" placeholder="Enter your goal..." />' +
    '</div>' +
    '<div class="form-row">' +
      '<label>Priority</label>' +
      '<select id="m-priority">' +
        '<option value="High">High</option>' +
        '<option value="Medium" selected>Medium</option>' +
        '<option value="Low">Low</option>' +
      '</select>' +
    '</div>',
    function() {
      var name = document.getElementById('m-name').value.trim();
      if (!name) { alert('Please enter a goal.'); return; }
      window.AppState.goals[tab].push({
        text:     name,
        priority: document.getElementById('m-priority').value,
        done:     false
      });
      saveData();
      renderPage();
    }
  );
}

function openAddHabitModal() {
  openModal('Add Habit',
    '<div class="form-row">' +
      '<label>Habit Name</label>' +
      '<input id="m-name" placeholder="e.g. Gym, Read, Meditate" />' +
    '</div>' +
    '<div class="form-row">' +
      '<label>Category</label>' +
      '<input id="m-cat" placeholder="Health / Study / Mindset" />' +
    '</div>',
    function() {
      var name = document.getElementById('m-name').value.trim();
      if (!name) { alert('Please enter a habit name.'); return; }
      window.AppState.habits.push({
        name: name,
        cat:  document.getElementById('m-cat').value || 'General',
        week: [0, 0, 0, 0, 0, 0, 0]
      });
      saveData();
      renderPage();
    }
  );
}

function openAddBookModal() {
  openModal('Add Book',
    '<div class="form-row">' +
      '<label>Book Title</label>' +
      '<input id="m-name" placeholder="e.g. Atomic Habits" />' +
    '</div>' +
    '<div class="form-row">' +
      '<label>Author</label>' +
      '<input id="m-author" placeholder="e.g. James Clear" />' +
    '</div>' +
    '<div class="form-row-inline">' +
      '<div class="form-row" style="flex:1">' +
        '<label>Total Pages</label>' +
        '<input type="number" id="m-total" placeholder="300" />' +
      '</div>' +
      '<div class="form-row" style="flex:1">' +
        '<label>Pages Read</label>' +
        '<input type="number" id="m-done" placeholder="0" />' +
      '</div>' +
    '</div>' +
    '<div class="form-row">' +
      '<label>Emoji</label>' +
      '<input id="m-emoji" placeholder="📖" maxlength="2" />' +
    '</div>',
    function() {
      var name = document.getElementById('m-name').value.trim();
      if (!name) { alert('Please enter a book title.'); return; }
      window.AppState.books.push({
        name:   name,
        author: document.getElementById('m-author').value || '',
        total:  parseInt(document.getElementById('m-total').value) || 0,
        done:   parseInt(document.getElementById('m-done').value)  || 0,
        emoji:  document.getElementById('m-emoji').value || '📖'
      });
      saveData();
      renderPage();
    }
  );
}

function openAddTripModal() {
  openModal('New Trip',
    '<div class="form-row">' +
      '<label>Destination</label>' +
      '<input id="m-name" placeholder="e.g. Goa, Manali, Singapore" />' +
    '</div>' +
    '<div class="form-row">' +
      '<label>Dates</label>' +
      '<input id="m-dates" placeholder="e.g. Apr 15-20" />' +
    '</div>' +
    '<div class="form-row">' +
      '<label>Budget (Rs)</label>' +
      '<input type="number" id="m-budget" placeholder="15000" />' +
    '</div>',
    function() {
      var name = document.getElementById('m-name').value.trim();
      if (!name) { alert('Please enter a destination.'); return; }
      window.AppState.trips.push({
        dest:      name,
        dates:     document.getElementById('m-dates').value  || '',
        budget:    document.getElementById('m-budget').value || '',
        checklist: [],
        reels:     [],
        notes:     ''
      });
      saveData();
      renderPage();
    }
  );
}

function openAddJobModal() {
  openModal('Add Job Application',
    '<div class="form-row">' +
      '<label>Company Name</label>' +
      '<input id="m-name" placeholder="e.g. Swiggy" />' +
    '</div>' +
    '<div class="form-row">' +
      '<label>Role</label>' +
      '<input id="m-role" placeholder="e.g. Data Scientist" />' +
    '</div>' +
    '<div class="form-row">' +
      '<label>Job Link</label>' +
      '<input id="m-link" placeholder="https://..." />' +
    '</div>' +
    '<div class="form-row">' +
      '<label>Date Applied</label>' +
      '<input type="date" id="m-date" value="' +
        new Date().toISOString().split('T')[0] + '" />' +
    '</div>',
    function() {
      var name = document.getElementById('m-name').value.trim();
      if (!name) { alert('Please enter a company name.'); return; }
      window.AppState.jobs.push({
        company:    name,
        role:       document.getElementById('m-role').value || '',
        link:       document.getElementById('m-link').value || '',
        date:       document.getElementById('m-date').value || todayString(),
        status:     'Applied',
        appliedTs:  new Date().toISOString(),
        reflection: '',
        notes:      ''
      });
      saveData();
      renderPage();
    }
  );
}

function openAddExpenseModal() {
  openModal('Add Expense',
    '<div class="form-row">' +
      '<label>Amount (Rs)</label>' +
      '<input type="number" id="m-amount" placeholder="0" />' +
    '</div>' +
    '<div class="form-row">' +
      '<label>Category</label>' +
      '<select id="m-cat">' +
        '<option>Food</option>' +
        '<option>Gym</option>' +
        '<option>Transport</option>' +
        '<option>Shopping</option>' +
        '<option>Subscriptions</option>' +
        '<option>Health</option>' +
        '<option>Study</option>' +
        '<option>Entertainment</option>' +
        '<option>Other</option>' +
      '</select>' +
    '</div>' +
    '<div class="form-row">' +
      '<label>Date</label>' +
      '<input type="date" id="m-date" value="' +
        new Date().toISOString().split('T')[0] + '" />' +
    '</div>' +
    '<div class="form-row">' +
      '<label>Note</label>' +
      '<input id="m-note" placeholder="What was this for?" />' +
    '</div>',
    function() {
      var amount = parseFloat(document.getElementById('m-amount').value);
      if (!amount || amount <= 0) { alert('Please enter a valid amount.'); return; }
      window.AppState.expenses.push({
        amount: amount,
        cat:    document.getElementById('m-cat').value,
        date:   new Date(
                  document.getElementById('m-date').value
                ).toDateString(),
        note:   document.getElementById('m-note').value || ''
      });
      saveData();
      renderPage();
    }
  );
}

function openAddSavingsModal() {
  openModal('Add Savings Goal',
    '<div class="form-row">' +
      '<label>Goal Name</label>' +
      '<input id="m-name" placeholder="e.g. Emergency Fund" />' +
    '</div>' +
    '<div class="form-row">' +
      '<label>Target Amount (Rs)</label>' +
      '<input type="number" id="m-target" placeholder="5000" />' +
    '</div>' +
    '<div class="form-row">' +
      '<label>Target Date</label>' +
      '<input type="date" id="m-date" />' +
    '</div>',
    function() {
      var name   = document.getElementById('m-name').value.trim();
      var target = parseFloat(document.getElementById('m-target').value);
      if (!name)   { alert('Please enter a goal name.'); return; }
      if (!target) { alert('Please enter a target amount.'); return; }
      window.AppState.savingsGoals.push({
        name:   name,
        target: target,
        saved:  0,
        date:   document.getElementById('m-date').value || ''
      });
      saveData();
      renderPage();
    }
  );
}

/* ============================================
   EVENT LISTENERS
   ============================================ */
function setupEvents() {

  /* Sidebar navigation */
  document.querySelectorAll('.nav-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var page = this.getAttribute('data-page');
      if (page) goToPage(page);
    });
  });

  /* Backup button */
  document.getElementById('btn-backup').addEventListener('click', backupData);

  /* Restore button */
  document.getElementById('btn-restore').addEventListener('click', function() {
    document.getElementById('restore-file-input').click();
  });

  /* Restore file input */
  document.getElementById('restore-file-input').addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
      restoreData(e.target.files[0]);
    }
  });

  /* Add button */
  document.getElementById('btn-add').addEventListener('click', handleAddButton);

  /* Modal cancel */
  document.getElementById('btn-modal-cancel').addEventListener('click', closeModal);

  /* Modal save */
  document.getElementById('btn-modal-save').addEventListener('click', function() {
    if (typeof window._modalSaveCallback === 'function') {
      window._modalSaveCallback();
      closeModal();
    }
  });

  /* Close modal when clicking outside */
  document.getElementById('modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
}

/* ============================================
   DAY NUMBER SETUP
   ============================================ */
function setupDayDisplay() {
  var state   = window.AppState;
  var lastDate = state.lastOpenedDate || '';
  var today    = todayString();

  if (lastDate !== today) {
    state.lastOpenedDate = today;
    if (lastDate !== '') {
      state.dayNumber = (state.dayNumber || 1) + 1;
    }
    saveData();
  }

  document.getElementById('day-number').textContent = state.dayNumber || 1;
  document.getElementById('today-date').textContent =
    new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/* ============================================
   INIT
   ============================================ */
function init() {
  loadData();
  setupDayDisplay();
  setupEvents();
  if (typeof initNotifications === 'function') initNotifications();
  if (typeof initFirebase === 'function') initFirebase();

  var startPage = window.AppState.currentPage || 'dashboard';
  goToPage(startPage);
  setupPageEvents();

  console.log('app.js loaded OK - Vasavi Life OS ready!');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}