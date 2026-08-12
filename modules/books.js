/* ============================================
   VASAVI'S LIFE OS - BOOKS MODULE
   modules/books.js
   ============================================ */

function renderBooks() {
  var state = window.AppState;
  var books = state.books || [];

  /* ---- VIEW SWITCHER ---- */
  var view = state.booksView || 'library';
  var vh = '<div class="subtab-bar">';
  [['library','📚 My Books'],['analytics','📊 Data Analytics']].forEach(function(t) {
    vh += '<div class="subtab ' + (view===t[0]?'active':'') + '" onclick="switchBooksView(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  vh += '</div>';
  if (view === 'analytics') return vh + renderBooksAnalytics(state);

  var completed = books.filter(function(b) {
    return (b.done || 0) >= (b.total || 1);
  }).length;
  var totalPages = books.reduce(function(a, b) {
    return a + (b.done || 0);
  }, 0);

  var h = vh;

  /* ---- STATS ---- */
  h += '<div class="grid-3" style="margin-bottom:14px;">';

  h += '<div class="stat-card" style="--stat-color:#06b6d4">' +
    '<div class="stat-value">' + books.length + '</div>' +
    '<div class="stat-label">Books Tracked</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#10b981">' +
    '<div class="stat-value">' + completed + '</div>' +
    '<div class="stat-label">Completed</div>' +
    '<div class="stat-sub">Well done!</div>' +
  '</div>';

  h += '<div class="stat-card" style="--stat-color:#a855f7">' +
    '<div class="stat-value">' + totalPages + '</div>' +
    '<div class="stat-label">Pages Read</div>' +
    '<div class="stat-sub">All time</div>' +
  '</div>';

  h += '</div>';

  /* ---- ADD BOOK ---- */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Add Book</div>';

  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';

  h += '<div class="form-row">' +
    '<label>Title</label>' +
    '<input id="book-title" placeholder="e.g. Atomic Habits" />' +
  '</div>';

  h += '<div class="form-row">' +
    '<label>Author</label>' +
    '<input id="book-author" placeholder="e.g. James Clear" />' +
  '</div>';

  h += '<div class="form-row">' +
    '<label>Total Pages</label>' +
    '<input type="number" id="book-total" placeholder="300" />' +
  '</div>';

  h += '<div class="form-row">' +
    '<label>Pages Read So Far</label>' +
    '<input type="number" id="book-done" placeholder="0" />' +
  '</div>';

  h += '<div class="form-row">' +
    '<label>Emoji</label>' +
    '<input id="book-emoji" placeholder="📖" maxlength="2" />' +
  '</div>';

  h += '<div class="form-row">' +
    '<label>Finish by Date (optional)</label>' +
    '<input type="date" id="book-deadline" />' +
  '</div>';

  h += '</div>';

  h += '<button class="btn-primary" onclick="addBook()" ' +
    'style="width:100%;margin-top:4px;">Add Book</button>';

  h += '</div>';

  /* ---- SUGGESTED BOOKS ---- */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Suggested Reading for Vasavi</div>';

  var suggested = [
    { title: 'Atomic Habits',           author: 'James Clear',        emoji: '⚛️',  why: 'Build habits that stick' },
    { title: 'Deep Work',               author: 'Cal Newport',        emoji: '🧠',  why: 'Master focused work' },
    { title: 'The Psychology of Money', author: 'Morgan Housel',      emoji: '💰',  why: 'Smart money mindset' },
    { title: 'Sapiens',                 author: 'Yuval Noah Harari',  emoji: '🌍',  why: 'Understand humanity' },
    { title: 'Hands-On ML',             author: 'Aurelien Geron',     emoji: '🤖',  why: 'DS interview prep' }
  ];

  suggested.forEach(function(book) {
    var alreadyAdded = books.some(function(b) {
      return b.name.toLowerCase() === book.title.toLowerCase();
    });
    h += '<div style="display:flex;justify-content:space-between;' +
             'align-items:center;padding:8px 0;border-bottom:1px solid #1a1a35;">';
    h += '<div style="display:flex;align-items:center;gap:10px;">';
    h += '<div style="font-size:20px;">' + book.emoji + '</div>';
    h += '<div>';
    h += '<div style="font-size:12px;font-weight:700;">' +
      book.title + '</div>';
    h += '<div style="font-size:10px;color:#8899bb;">' +
      book.author + ' - ' + book.why + '</div>';
    h += '</div></div>';

    if (!alreadyAdded) {
      h += '<button class="btn-ghost btn-small" ' +
        'onclick="quickAddBook(\'' +
          book.title.replace(/'/g,'') + '\',\'' +
          book.author.replace(/'/g,'') + '\',\'' +
          book.emoji + '\')">' +
        '+ Add' +
      '</button>';
    } else {
      h += '<span style="font-size:10px;color:#10b981;">Added ✅</span>';
    }

    h += '</div>';
  });

  h += '</div>';

  /* ---- BOOKS LIST ---- */
  if (books.length > 0) {
    books.forEach(function(book, i) {
      var bookPct  = pct(book.done || 0, book.total || 1);
      var remaining = (book.total || 0) - (book.done || 0);
      var isComplete = (book.done || 0) >= (book.total || 1);

      h += '<div class="card" style="margin-bottom:11px;' +
        (isComplete ? 'border-color:#14532d;' : '') + '">';

      h += '<div style="display:flex;gap:14px;align-items:flex-start;">';

      /* Cover */
      h += '<div style="width:52px;height:70px;border-radius:8px;' +
               'background:linear-gradient(135deg,#7c3aed,#06b6d4);' +
               'display:flex;align-items:center;justify-content:center;' +
               'font-size:24px;flex-shrink:0;">' +
        (book.emoji || '📖') +
      '</div>';

      /* Info */
      h += '<div style="flex:1;">';
      h += '<div style="font-weight:800;font-size:14px;">' +
        escHtml(book.name) + '</div>';
      h += '<div style="font-size:11px;color:#8899bb;">' +
        escHtml(book.author || '') + '</div>';

      h += '<div class="progress-wrap" style="margin:8px 0;">';
      h += '<div class="progress-label">';
      h += '<span>' + (book.done || 0) + ' / ' + (book.total || 0) + ' pages</span>';
      h += '<span style="font-weight:800;">' + bookPct + '%</span>';
      h += '</div>';
      h += '<div class="progress-bar" style="height:6px;">' +
        '<div class="progress-fill" ' +
          'style="width:' + bookPct + '%;' +
          'background:linear-gradient(90deg,#06b6d4,#a855f7)"></div>' +
      '</div>';
      h += '</div>';

      if (!isComplete) {
        h += '<div style="font-size:10px;color:#8899bb;">' +
          remaining + ' pages remaining';
        if (remaining > 0) {
          h += ' &nbsp;·&nbsp; ~' +
            Math.ceil(remaining / 30) + ' pages/day to finish in a month';
        }
        h += '</div>';

        if (book.deadline) {
          var daysLeft = Math.ceil(
            (new Date(book.deadline) - new Date()) / (1000 * 60 * 60 * 24)
          );
          if (daysLeft > 0) {
            h += '<div style="font-size:10px;color:#f59e0b;margin-top:2px;">' +
              '📅 ' + daysLeft + ' days left - need ' +
              Math.ceil(remaining / daysLeft) + ' pages/day' +
            '</div>';
          }
        }
      } else {
        h += '<div style="font-size:11px;color:#10b981;font-weight:700;">' +
          '✅ Completed! Great reading, Vasavi!' +
        '</div>';
      }

      h += '</div>';

      /* Actions */
      h += '<div style="display:flex;flex-direction:column;gap:6px;">';
      if (!isComplete) {
        h += '<button class="btn-ghost btn-small" ' +
          'onclick="updateBookPages(' + i + ')">Update</button>';
      }
      h += '<button class="btn-red btn-small" ' +
        'onclick="deleteBook(' + i + ')">Delete</button>';
      h += '</div>';

      h += '</div>';

      /* Notes section */
      if (book.notes !== undefined) {
        h += '<div style="margin-top:10px;padding-top:10px;border-top:1px solid #1a1a35;">';
        h += '<div style="font-size:10px;color:#8899bb;margin-bottom:4px;">Key Insights</div>';
        h += '<textarea rows="2" ' +
          'placeholder="Write your key insights from this book..." ' +
          'data-book-idx="' + i + '" ' +
          'onchange="saveBookNotes(' + i + ',this.value)" ' +
          'style="font-size:11px;">' +
          escHtml(book.notes || '') +
        '</textarea>';
        h += '</div>';
      } else {
        h += '<div style="margin-top:8px;">';
        h += '<button class="btn-ghost btn-small" ' +
          'onclick="showBookNotes(' + i + ')">+ Add Notes</button>';
        h += '</div>';
      }

      h += '</div>';
    });
  } else {
    h += '<div class="empty-state">';
    h += '<div class="emo">📖</div>';
    h += '<p>No books yet.<br>Add your first book above!</p>';
    h += '</div>';
  }

  return h;
}

/* ============================================
   BOOKS ACTIONS
   ============================================ */
function addBook() {
  var title    = document.getElementById('book-title');
  var author   = document.getElementById('book-author');
  var total    = document.getElementById('book-total');
  var done     = document.getElementById('book-done');
  var emoji    = document.getElementById('book-emoji');
  var deadline = document.getElementById('book-deadline');

  if (!title || !title.value.trim()) {
    alert('Please enter a book title.');
    return;
  }

  if (!window.AppState.books) window.AppState.books = [];
  window.AppState.books.push({
    name:     title.value.trim(),
    author:   author   ? author.value   : '',
    total:    parseInt(total ? total.value  : 0) || 0,
    done:     parseInt(done  ? done.value   : 0) || 0,
    emoji:    emoji    ? emoji.value    || '📖' : '📖',
    deadline: deadline ? deadline.value : ''
  });

  saveData();
  renderPage();
}

function quickAddBook(title, author, emoji) {
  if (!window.AppState.books) window.AppState.books = [];
  window.AppState.books.push({
    name:   title,
    author: author,
    total:  0,
    done:   0,
    emoji:  emoji
  });
  saveData();
  renderPage();
}

function updateBookPages(idx) {
  var book = window.AppState.books[idx];
  var val  = prompt(
    'Pages read so far (out of ' + (book.total || '?') + '):\nCurrently: ' + (book.done || 0)
  );
  if (val === null) return;
  var pages = parseInt(val);
  if (isNaN(pages) || pages < 0) {
    alert('Please enter a valid number.');
    return;
  }

  /* Cap only when a total is known (total 0 = unknown length) */
  var newDone = book.total > 0 ? Math.min(pages, book.total) : pages;
  var delta   = newDone - (book.done || 0);

  /* Log pages read PER DAY so monthly/yearly reading analytics work */
  if (delta > 0) {
    if (!window.AppState.bookLog) window.AppState.bookLog = {};
    var iso = aeTodayIso();
    window.AppState.bookLog[iso] = (window.AppState.bookLog[iso] || 0) + delta;
    /* Remember when each book was finished */
    if (book.total > 0 && newDone >= book.total && !book.finishedOn) {
      book.finishedOn = iso;
    }
  }

  window.AppState.books[idx].done = newDone;
  saveData();
  renderPage();
  if (delta > 0) showToast('📖 +' + delta + ' pages logged today!');
}

function switchBooksView(v) { window.AppState.booksView = v; saveData(); renderPage(); }

/* ============================================
   BOOKS — DATA ANALYTICS
   Pages this month / year / all time, days read,
   currently reading, completed books, per-month
   pages, and a reading summary.
   ============================================ */
function renderBooksAnalytics(state) {
  var books = state.books || [];
  var log   = state.bookLog || {};
  var h = '';
  var now = new Date();
  var v = aeGetView('books');

  var monthPages = aeMonthTotals(log, v.y)[v.m];
  var yearPagesArr = aeMonthTotals(log, v.y);
  var yearPages = yearPagesArr.reduce(function(a,b){ return a+b; }, 0);
  var allPages = Object.keys(log).reduce(function(a,k){ return a + log[k]; }, 0);
  var daysRead = aeTotalActiveDays(log);

  /* Books split */
  var reading   = books.filter(function(b){ return (b.done||0) > 0 && (!b.total || b.done < b.total); });
  var completed = books.filter(function(b){ return b.total > 0 && (b.done||0) >= b.total; });
  var notStarted= books.filter(function(b){ return !(b.done||0); });

  /* Top stats */
  h += '<div class="grid-4" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#06b6d4"><div class="stat-value">' + monthPages + '</div><div class="stat-label">Pages in ' + AE_MONTHS_SHORT[v.m] + '</div><div class="stat-sub">' + v.y + '</div></div>';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + yearPages + '</div><div class="stat-label">Pages in ' + v.y + '</div></div>';
  h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">' + completed.length + '</div><div class="stat-label">Books Finished</div></div>';
  h += '<div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-value">' + allPages + '</div><div class="stat-label">Pages All Time</div><div class="stat-sub">across ' + daysRead + ' reading days</div></div>';
  h += '</div>';

  /* 📆 Reading days — month · year · all time */
  h += aeDaysPanel('books', log, { color:'#06b6d4', word:'Reading Days', label:'reading days' });

  /* Pages per month bars */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📖 Pages Read Each Month — ' + v.y + '</div>';
  h += aeYearBarChart(yearPagesArr, v.y===now.getFullYear()?now.getMonth():-1, '#06b6d4', function(n){ return n; }, 'books');
  h += '<div style="font-size:11px;color:#8899bb;">' + v.y + ' total: <b style="color:#06b6d4;">' + yearPages + ' pages</b>' +
       (yearPages>0 ? ' · about ' + Math.round(yearPages/12) + ' pages/month average' : '') + '</div>';
  h += '</div>';

  /* Monthly reading calendar */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += aeMonthNav('books');
  h += aeCalendarHeatmap(v.y, v.m, log, function(n){
    return n >= 50 ? '#0e7490' : n >= 20 ? '#06b6d4' : n > 0 ? '#67e8f9' : '#1a1a35';
  }, function(n){ return n > 0 ? n : ''; });
  h += '<div style="font-size:9px;color:#8899bb;margin-top:8px;">Numbers = pages read that day · darker = bigger reading day</div>';
  h += '</div>';

  /* Currently reading */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📚 Currently Reading (' + reading.length + ')</div>';
  if (reading.length) {
    reading.forEach(function(b) {
      var p = b.total > 0 ? pct(b.done||0, b.total) : 0;
      var left = b.total > 0 ? (b.total - (b.done||0)) : null;
      h += '<div style="margin-bottom:12px;">';
      h += '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">' +
        '<span style="font-weight:700;">' + (b.emoji||'📖') + ' ' + escHtml(b.name) + '</span>' +
        '<span style="color:#06b6d4;">' + (b.done||0) + (b.total>0 ? '/' + b.total + ' (' + p + '%)' : ' pages') + '</span></div>';
      h += '<div class="progress-bar"><div class="progress-fill" style="width:' + Math.min(p,100) + '%;background:#06b6d4;"></div></div>';
      if (left !== null) h += '<div style="font-size:10px;color:#8899bb;margin-top:3px;">' + left + ' pages left' + (b.author?' · '+escHtml(b.author):'') + '</div>';
      h += '</div>';
    });
  } else {
    h += '<div style="font-size:11px;color:#556080;text-align:center;padding:10px;">No book in progress. Start one from My Books!</div>';
  }
  h += '</div>';

  /* Completed */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">✅ Finished Books (' + completed.length + ')</div>';
  if (completed.length) {
    completed.forEach(function(b) {
      h += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #1a1a35;font-size:12px;">';
      h += '<span>' + (b.emoji||'📖') + ' ' + escHtml(b.name) + (b.author?' <span style="color:#556080;">— '+escHtml(b.author)+'</span>':'') + '</span>';
      h += '<span style="color:#10b981;font-weight:700;">' + b.total + 'p' + (b.finishedOn?' · '+b.finishedOn:'') + '</span></div>';
    });
  } else {
    h += '<div style="font-size:11px;color:#556080;text-align:center;padding:10px;">No books finished yet — the first one is coming!</div>';
  }
  if (notStarted.length) {
    h += '<div style="font-size:11px;color:#f59e0b;margin-top:10px;">📕 ' + notStarted.length + ' book' + (notStarted.length>1?'s':'') + ' not started yet: ' +
      notStarted.slice(0,4).map(function(b){ return escHtml(b.name); }).join(', ') + (notStarted.length>4?'…':'') + '</div>';
  }
  h += '</div>';

  h += '<button class="btn-primary" style="width:100%;" onclick="booksAISummary(this)">🤖 Summary — My Reading</button>';
  h += '<div id="books-ai-summary" style="display:none;"></div>';

  return h;
}

function booksAISummary(btn) {
  var state = window.AppState;
  var v = aeGetView('books');
  var log = state.bookLog || {};
  var books = state.books || [];
  var monthPages = aeMonthTotals(log, v.y)[v.m];
  var yearPages = aeMonthTotals(log, v.y).reduce(function(a,b){ return a+b; }, 0);
  var monthDays = aeActiveDaysInMonth(log, v.y, v.m);
  var reading = books.filter(function(b){ return (b.done||0)>0 && (!b.total || b.done<b.total); });
  var completed = books.filter(function(b){ return b.total>0 && (b.done||0)>=b.total; });
  var now = new Date();
  var isCur = v.y===now.getFullYear() && v.m===now.getMonth();
  var elapsed = isCur ? now.getDate() : new Date(v.y, v.m+1, 0).getDate();

  var ctx = 'Reading data for ' + AE_MONTHS[v.m] + ' ' + v.y + ':\n' +
    'Pages this month: ' + monthPages + ' across ' + monthDays + ' reading days (of ' + elapsed + ' days).\n' +
    'Pages this year: ' + yearPages + '.\n' +
    'Currently reading: ' + (reading.map(function(b){ return b.name+' ('+(b.done||0)+'/'+(b.total||'?')+')'; }).join(', ')||'none') + '\n' +
    'Finished books: ' + (completed.map(function(b){ return b.name; }).join(', ')||'none');
  var fallback = '📖 Reading — ' + AE_MONTHS[v.m] + ' ' + v.y + ':\n' +
    '• ' + monthPages + ' pages across ' + monthDays + ' reading days' + (monthDays>0 ? ' (~' + Math.round(monthPages/monthDays) + ' pages per reading day)' : '') + '\n' +
    '• ' + yearPages + ' pages so far in ' + v.y + '\n' +
    '• ' + completed.length + ' book' + (completed.length===1?'':'s') + ' finished · ' + reading.length + ' in progress\n\n' +
    (monthDays >= 20 ? '🔥 You read on most days this month — that is how books actually get finished.' :
     monthDays >= 8  ? '💪 Steady reading. Try 10 pages before bed daily — it compounds into ~300 pages a month.' :
     '📕 Reading slipped this month. Pick the book you are closest to finishing and read just 10 pages tonight.');
  aeAISummary('Reading Summary — ' + AE_MONTHS[v.m] + ' ' + v.y, ctx, fallback, btn, 'books-ai-summary');
}

function deleteBook(idx) {
  if (!confirm('Delete this book?')) return;
  window.AppState.books.splice(idx, 1);
  saveData();
  renderPage();
}

function saveBookNotes(idx, val) {
  window.AppState.books[idx].notes = val;
  saveData();
}

function showBookNotes(idx) {
  window.AppState.books[idx].notes = '';
  saveData();
  renderPage();
}

console.log('books.js loaded OK');