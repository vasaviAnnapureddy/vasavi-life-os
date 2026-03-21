/* ============================================
   VASAVI'S LIFE OS - BOOKS MODULE
   modules/books.js
   ============================================ */

function renderBooks() {
  var state = window.AppState;
  var books = state.books || [];

  var completed = books.filter(function(b) {
    return (b.done || 0) >= (b.total || 1);
  }).length;
  var totalPages = books.reduce(function(a, b) {
    return a + (b.done || 0);
  }, 0);

  var h = '';

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
    'Pages read so far (out of ' + book.total + '):\nCurrently: ' + book.done
  );
  if (val === null) return;
  var pages = parseInt(val);
  if (isNaN(pages) || pages < 0) {
    alert('Please enter a valid number.');
    return;
  }
  window.AppState.books[idx].done = Math.min(pages, book.total);
  saveData();
  renderPage();
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