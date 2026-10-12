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

  /* ---- AT A GLANCE: what you're reading & what you've finished ---- */
  var nowReading = books.filter(function(b){ return (b.done||0) > 0 && (!b.total || b.done < b.total); });
  var doneBooks  = books.filter(function(b){ return b.total > 0 && (b.done||0) >= b.total; });
  var notStartedB= books.filter(function(b){ return !(b.done||0); });
  var pagesToday = (state.bookLog || {})[aeTodayIso()] || 0;

  if (books.length > 0) {
    h += '<div class="card" style="margin-bottom:14px;border-left:3px solid #06b6d4;">';
    h += '<div class="card-header"><span>📚 At a Glance</span>' +
      (pagesToday ? '<span style="font-size:11px;color:#10b981;">+' + pagesToday + ' pages today ✓</span>'
                  : '<span style="font-size:11px;color:#f59e0b;">nothing read today yet</span>') + '</div>';

    h += '<div style="font-size:11px;font-weight:800;color:#06b6d4;margin-bottom:4px;">📖 Currently Reading (' + nowReading.length + ')</div>';
    if (nowReading.length) {
      nowReading.forEach(function(b) {
        var p = b.total > 0 ? pct(b.done||0, b.total) : 0;
        h += '<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0;">' +
          '<span>' + (b.emoji||'📖') + ' ' + escHtml(b.name) + '</span>' +
          '<span style="color:#06b6d4;">' + (b.done||0) + (b.total?'/'+b.total+' · '+p+'%':'') + '</span></div>';
      });
    } else {
      h += '<div style="font-size:11px;color:#556080;padding:2px 0 6px;">None in progress — add pages to a book below to start one.</div>';
    }

    h += '<div style="font-size:11px;font-weight:800;color:#10b981;margin:10px 0 4px;">✅ Finished (' + doneBooks.length + ')</div>';
    if (doneBooks.length) {
      doneBooks.forEach(function(b) {
        h += '<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0;">' +
          '<span>' + (b.emoji||'📖') + ' ' + escHtml(b.name) + '</span>' +
          '<span style="color:#10b981;">' + b.total + 'p' + (b.finishedOn ? ' · ' + b.finishedOn : '') + '</span></div>';
      });
    } else {
      h += '<div style="font-size:11px;color:#556080;padding:2px 0;">No books finished yet — your first one is coming!</div>';
    }

    if (notStartedB.length) {
      h += '<div style="font-size:11px;color:#f59e0b;margin-top:10px;">📕 Not started (' + notStartedB.length + '): ' +
        notStartedB.map(function(b){ return escHtml(b.name); }).join(', ') + '</div>';
    }
    h += '</div>';
  }

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
          'onclick="updateBookPages(' + i + ')">Set total</button>';
      }
      h += '<button class="btn-red btn-small" ' +
        'onclick="deleteBook(' + i + ')">Delete</button>';
      h += '</div>';

      h += '</div>';

      /* ---- QUICK DAILY LOG — just add today's pages, no maths ---- */
      if (!isComplete) {
        var readToday = ((state.bookLogByBook || {})[book.name] || {})[aeTodayIso()] || 0;
        h += '<div style="margin-top:10px;padding-top:10px;border-top:1px solid #1a1a35;">';
        h += '<div style="font-size:10px;color:#8899bb;margin-bottom:6px;">' +
          '📖 Read today? Just add the pages — I do the maths.' +
          (readToday ? ' <span style="color:#10b981;font-weight:700;">(+' + readToday + ' logged today ✓)</span>' : '') + '</div>';
        h += '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">';
        [5, 10, 20, 30].forEach(function(n) {
          h += '<button class="btn-ghost" style="padding:6px 12px;font-size:11px;" ' +
            'onclick="addPagesToday(' + i + ',' + n + ')">+' + n + '</button>';
        });
        h += '<input type="number" id="bk-custom-' + i + '" placeholder="other" ' +
          'style="width:72px;padding:6px;font-size:11px;" ' +
          'onkeydown="if(event.key===\'Enter\')addPagesToday(' + i + ')" />';
        h += '<button class="btn-primary" style="padding:6px 12px;font-size:11px;" ' +
          'onclick="addPagesToday(' + i + ')">Add</button>';
        h += '</div></div>';
      }

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
   ➕ ADD TODAY'S PAGES
   No mental maths — you add what you read today
   and the total updates itself.
   ============================================ */
function addPagesToday(idx, pages) {
  var state = window.AppState;
  var book = (state.books || [])[idx];
  if (!book) return;

  if (pages == null) {
    var el = document.getElementById('bk-custom-' + idx);
    pages = parseInt(el ? el.value : 0);
  }
  pages = parseInt(pages);
  if (!pages || pages <= 0) { showToast('Enter how many pages you read.', 'error'); return; }

  var iso = aeTodayIso();
  var before = book.done || 0;
  var after  = before + pages;
  if (book.total > 0 && after > book.total) after = book.total;
  var actual = after - before;
  if (actual <= 0) { showToast('📘 You have already finished this book!'); return; }

  book.done = after;

  /* Overall daily reading log (drives the analytics) */
  if (!state.bookLog) state.bookLog = {};
  state.bookLog[iso] = (state.bookLog[iso] || 0) + actual;

  /* Per-book daily log, so we can show "+N today" on the card */
  if (!state.bookLogByBook) state.bookLogByBook = {};
  if (!state.bookLogByBook[book.name]) state.bookLogByBook[book.name] = {};
  state.bookLogByBook[book.name][iso] = (state.bookLogByBook[book.name][iso] || 0) + actual;

  var justFinished = false;
  if (book.total > 0 && book.done >= book.total && !book.finishedOn) {
    book.finishedOn = iso;
    justFinished = true;
  }

  saveData(); renderPage();
  if (justFinished) {
    showToast('🎉 You finished "' + book.name + '"! Well done, Vasavi.');
  } else {
    var left = book.total > 0 ? (book.total - book.done) : null;
    showToast('📖 +' + actual + ' pages' + (left !== null ? ' · ' + left + ' to go' : '') + '!');
  }
}

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
  h += '</div>';

  /* Not started yet — these used to be nearly invisible */
  if (notStarted.length) {
    h += '<div class="card" style="margin-bottom:14px;border-left:3px solid #f59e0b;">';
    h += '<div class="card-header">📕 Not Started Yet (' + notStarted.length + ')</div>';
    notStarted.forEach(function(b) {
      var realIdx = books.indexOf(b);
      h += '<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #1a1a35;">';
      h += '<span style="font-size:12px;">' + (b.emoji||'📖') + ' ' + escHtml(b.name) +
        (b.author?' <span style="color:#556080;">— '+escHtml(b.author)+'</span>':'') + '</span>';
      h += '<button class="btn-ghost" style="font-size:10px;padding:4px 10px;" onclick="updateBookPages(' + realIdx + ')">+ Log Pages</button>';
      h += '</div>';
    });
    h += '</div>';
  }

  /* Safety net: every single book, always visible */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📚 All My Books (' + books.length + ')</div>';
  if (books.length === 0) {
    h += '<div style="font-size:11px;color:#556080;text-align:center;padding:10px;">No books added yet. Go to <b>My Books</b> and add one!</div>';
  } else {
    books.forEach(function(b, i) {
      var p = b.total > 0 ? pct(b.done||0, b.total) : 0;
      h += '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #1a1a35;font-size:11px;">';
      h += '<span>' + (b.emoji||'📖') + ' ' + escHtml(b.name) + '</span>';
      h += '<span style="color:#06b6d4;">' + (b.done||0) + (b.total>0 ? '/'+b.total+' ('+p+'%)' : ' pages') + '</span>';
      h += '</div>';
    });
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