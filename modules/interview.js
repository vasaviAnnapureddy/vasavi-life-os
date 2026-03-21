/* ============================================
   VASAVI'S LIFE OS - INTERVIEW PREP MODULE
   modules/interview.js
   ============================================ */

function renderInterview() {
  var state  = window.AppState;
  var tab    = state.interviewTab || 'questions';

  var answered = INTERVIEW_QS.filter(function(q, i) {
    return (state.interviewScores || {})['iq_' + i] >= 3;
  }).length;

  var avgScore = 0;
  var scoreCount = 0;
  INTERVIEW_QS.forEach(function(q, i) {
    var s = (state.interviewScores || {})['iq_' + i];
    if (s) { avgScore += s; scoreCount++; }
  });
  avgScore = scoreCount > 0 ? Math.round((avgScore / scoreCount) * 20) : 0;

  var h = '';

  /* Stats */
  h += '<div class="grid-3" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#a855f7">' +
    '<div class="stat-value">' + INTERVIEW_QS.length + '</div>' +
    '<div class="stat-label">Total Questions</div>' +
  '</div>';
  h += '<div class="stat-card" style="--stat-color:#10b981">' +
    '<div class="stat-value">' + answered + '</div>' +
    '<div class="stat-label">Confident</div>' +
    '<div class="stat-sub">Score 3+ out of 5</div>' +
  '</div>';
  h += '<div class="stat-card" style="--stat-color:#f59e0b">' +
    '<div class="stat-value">' + avgScore + '%</div>' +
    '<div class="stat-label">Avg Readiness</div>' +
  '</div>';
  h += '</div>';

  /* Tab bar */
  h += '<div class="subtab-bar">';
  h += '<div class="subtab ' + (tab==='questions'?'active':'') + '" ' +
    'onclick="switchInterviewTab(\'questions\')">📝 All Questions</div>';
  h += '<div class="subtab ' + (tab==='mock'?'active':'') + '" ' +
    'onclick="switchInterviewTab(\'mock\')">🎤 Mock Interview</div>';
  h += '<div class="subtab ' + (tab==='weak'?'active':'') + '" ' +
    'onclick="switchInterviewTab(\'weak\')">⚠️ Weak Areas</div>';
  h += '<div class="subtab ' + (tab==='tips'?'active':'') + '" ' +
    'onclick="switchInterviewTab(\'tips\')">💡 Tips</div>';
  h += '</div>';

  if (tab === 'questions') h += renderAllQuestions(state);
  if (tab === 'mock')      h += renderMockInterview(state);
  if (tab === 'weak')      h += renderWeakAreas(state);
  if (tab === 'tips')      h += renderInterviewTips();

  return h;
}

/* ---- ALL QUESTIONS ---- */
function renderAllQuestions(state) {
  var cat = state.iqCategory || 'All';
  var cats = ['All','Python','Statistics','ML','Pandas','SQL'];
  var h = '';

  /* Category filter */
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">';
  cats.forEach(function(c) {
    var catQs  = c==='All' ? INTERVIEW_QS : INTERVIEW_QS.filter(function(q){return q.cat===c;});
    var catDone = catQs.filter(function(q,i) {
      var realIdx = INTERVIEW_QS.indexOf(q);
      return (state.interviewScores||{})['iq_'+realIdx] >= 3;
    }).length;
    h += '<div style="padding:5px 12px;border-radius:99px;cursor:pointer;font-size:11px;' +
             'font-weight:700;background:' + (cat===c?'var(--accent)':'var(--card2)') + ';' +
             'border:1px solid ' + (cat===c?'var(--accent)':'var(--border)') + ';' +
             'color:' + (cat===c?'#fff':'var(--muted2)') + ';" ' +
      'onclick="setIQCategory(\'' + c + '\')">' +
      c +
      (c!=='All' ? ' <span style="font-size:9px;opacity:.8;">' +
        catDone + '/' + catQs.length + '</span>' : '') +
    '</div>';
  });
  h += '</div>';

  var filtered = cat==='All'
    ? INTERVIEW_QS
    : INTERVIEW_QS.filter(function(q){return q.cat===cat;});

  h += '<div style="background:#1a1a35;border-radius:8px;padding:10px;' +
           'font-size:11px;color:#8899bb;margin-bottom:12px;">';
  h += '💡 Answer each question → Rate yourself 1-5 → ' +
    'Copy hard ones to ChatGPT Go for detailed feedback';
  h += '</div>';

  filtered.forEach(function(q) {
    var qi      = INTERVIEW_QS.indexOf(q);
    var score   = (state.interviewScores||{})['iq_'+qi];
    var saved   = (state.notes||{})['iq_ans_'+qi] || '';
    var tagColor = q.cat==='ML'     ? 'tag-high'   :
                   q.cat==='Python' ? 'tag-medium'  : 'tag-low';

    h += '<div style="background:var(--card2);border:1px solid ' +
             (score>=4?'#14532d':score>=2?'#451a03':'var(--border)') +
             ';border-radius:9px;padding:12px;margin-bottom:8px;">';

    h += '<div style="display:flex;justify-content:space-between;' +
             'align-items:flex-start;margin-bottom:8px;">';
    h += '<div style="flex:1;">';
    h += '<span class="tag ' + tagColor + '" style="margin-bottom:5px;' +
             'display:inline-block;">' + q.cat + '</span>';
    h += '<div style="font-size:12px;font-weight:700;">' + escHtml(q.q) + '</div>';
    h += '</div>';
    if (score) {
      h += '<span style="font-size:14px;font-weight:900;color:' +
        (score>=4?'#10b981':score>=3?'#f59e0b':'#ef4444') + ';margin-left:10px;">' +
        score + '/5' +
      '</span>';
    }
    h += '</div>';

    h += '<textarea rows="2" placeholder="Your answer..." ' +
      'onchange="saveIQAnswer(' + qi + ',this.value)" ' +
      'style="margin-bottom:8px;">' +
      escHtml(saved) +
    '</textarea>';

    h += '<div style="display:flex;gap:6px;align-items:center;">';
    h += '<span style="font-size:10px;color:#8899bb;">Rate:</span>';
    [1,2,3,4,5].forEach(function(n) {
      h += '<button onclick="rateIQ(' + qi + ',' + n + ')" ' +
        'style="width:28px;height:28px;border-radius:50%;border:1px solid ' +
               (score===n?'#a855f7':'#1a1a35') + ';background:' +
               (score===n?'#a855f7':'transparent') + ';color:' +
               (score===n?'#fff':'#8899bb') + ';cursor:pointer;font-size:11px;' +
               'font-weight:700;">' + n + '</button>';
    });
    h += '<span style="font-size:10px;color:#556080;margin-left:4px;">' +
      (score ? (score<=2?'Needs work':score<=3?'Getting there':'Confident!') : '') +
    '</span>';
    h += '</div>';

    h += '</div>';
  });

  return h;
}

/* ---- MOCK INTERVIEW ---- */
function renderMockInterview(state) {
  var h = '';

  if (state.mockMode) {
    var mockQs  = state.mockQuestions || [];
    var mockIdx = state.mockIndex     || 0;

    if (mockIdx >= mockQs.length) {
      /* Mock complete */
      h += '<div class="card" style="text-align:center;padding:30px;">';
      h += '<div style="font-size:40px;margin-bottom:12px;">🎉</div>';
      h += '<div style="font-size:18px;font-weight:800;margin-bottom:8px;">' +
        'Mock Interview Complete!' +
      '</div>';
      h += '<div style="font-size:12px;color:#8899bb;margin-bottom:16px;">' +
        'Review your answers. Copy them to ChatGPT Go for detailed feedback and scoring!' +
      '</div>';
      h += '<button class="btn-primary" onclick="endMock()">Back to Questions</button>';
      h += '</div>';
      return h;
    }

    var q = INTERVIEW_QS[mockQs[mockIdx]];
    var saved = (state.notes||{})['mock_'+mockQs[mockIdx]] || '';

    h += '<div style="background:linear-gradient(135deg,#1a0533,#0a1020);' +
         'border-radius:12px;padding:20px;margin-bottom:14px;">';
    h += '<div style="font-size:10px;color:#a855f7;font-weight:800;margin-bottom:8px;">' +
      'MOCK INTERVIEW · Question ' + (mockIdx+1) + ' of ' + mockQs.length +
    '</div>';
    h += '<div style="font-size:16px;font-weight:800;margin-bottom:10px;">' +
      escHtml(q.q) +
    '</div>';
    h += '<span class="tag tag-high">' + q.cat + '</span>';
    h += '</div>';

    h += '<div class="card">';
    h += '<div class="card-header">Your Answer</div>';
    h += '<textarea rows="6" id="mock-ans-inp" ' +
      'placeholder="Take your time. Answer as if in a real interview..." ' +
      'style="margin-bottom:10px;">' +
      escHtml(saved) +
    '</textarea>';
    h += '<div style="display:flex;gap:8px;">';
    h += '<button class="btn-ghost" onclick="saveMockAns(' + mockQs[mockIdx] + ')">' +
      'Save Answer' +
    '</button>';
    h += '<button class="btn-primary" onclick="nextMockQ()">Next Question →</button>';
    h += '</div></div>';

    return h;
  }

  /* Mock setup */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div style="text-align:center;padding:10px 0 16px;">';
  h += '<div style="font-size:36px;margin-bottom:8px;">🎤</div>';
  h += '<div style="font-size:16px;font-weight:800;margin-bottom:6px;">' +
    'Mock Interview Mode' +
  '</div>';
  h += '<div style="font-size:12px;color:#8899bb;margin-bottom:16px;">' +
    'Simulates a real DS interview. 10 random questions, timed. ' +
    'Best time: 9:00 PM as per your schedule!' +
  '</div>';
  h += '</div>';

  h += '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">';
  h += '<button class="btn-primary" onclick="startMock(10)">🎯 Full Mock (10 Qs)</button>';
  h += '<button class="btn-ghost" onclick="startMock(5)">⚡ Quick Mock (5 Qs)</button>';
  h += '<button class="btn-ghost" onclick="startMockByCat(\'Python\')">' +
    '🐍 Python Only</button>';
  h += '<button class="btn-ghost" onclick="startMockByCat(\'ML\')">' +
    '🤖 ML Only</button>';
  h += '<button class="btn-ghost" onclick="startMockByCat(\'SQL\')">' +
    '🗄️ SQL Only</button>';
  h += '</div></div>';

  /* Past mock scores */
  var mockScores = Object.keys(state.interviewScores || {}).filter(function(k) {
    return k.startsWith('mock_');
  });

  if (mockScores.length > 0) {
    h += '<div class="card">';
    h += '<div class="card-header">Previous Mock Answers</div>';
    h += '<div style="font-size:11px;color:#8899bb;margin-bottom:8px;">' +
      'Copy these to ChatGPT Go for detailed feedback!' +
    '</div>';
    mockScores.slice(-5).forEach(function(key) {
      var qi  = parseInt(key.replace('mock_',''));
      var q   = INTERVIEW_QS[qi];
      var ans = (state.notes || {})['mock_' + qi] || '';
      if (!q || !ans) return;
      h += '<div style="background:var(--card2);border-radius:8px;padding:10px;' +
               'margin-bottom:6px;">';
      h += '<div style="font-size:11px;font-weight:700;color:#f59e0b;">' +
        escHtml(q.q) + '</div>';
      h += '<div style="font-size:11px;color:#8899bb;margin-top:4px;">' +
        escHtml(ans.substring(0,100)) + (ans.length>100?'...':'') + '</div>';
      h += '</div>';
    });
    h += '</div>';
  }

  return h;
}

/* ---- WEAK AREAS ---- */
function renderWeakAreas(state) {
  var h = '';
  var cats = ['Python','Statistics','ML','Pandas','SQL'];

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Category Readiness</div>';

  cats.forEach(function(cat) {
    var catQs   = INTERVIEW_QS.filter(function(q){return q.cat===cat;});
    var scores  = catQs.map(function(q) {
      return (state.interviewScores||{})['iq_'+INTERVIEW_QS.indexOf(q)] || 0;
    });
    var avgCat  = scores.length
      ? Math.round(scores.reduce(function(a,b){return a+b;},0)/scores.length*20)
      : 0;
    var color   = avgCat>=70?'#10b981':avgCat>=40?'#f59e0b':'#ef4444';

    h += '<div class="progress-wrap">';
    h += '<div class="progress-label">';
    h += '<span>' + cat + '</span>';
    h += '<span style="color:' + color + ';">' +
      (avgCat>=70?'Strong':avgCat>=40?'Building':'Needs work') +
      ' - ' + avgCat + '%</span>';
    h += '</div>';
    h += '<div class="progress-bar" style="height:8px;">';
    h += '<div class="progress-fill" style="width:' + avgCat + '%;background:' + color + '"></div>';
    h += '</div></div>';
  });
  h += '</div>';

  /* Weakest questions */
  var weak = [];
  INTERVIEW_QS.forEach(function(q, i) {
    var s = (state.interviewScores||{})['iq_'+i] || 0;
    if (s <= 2) weak.push({ q:q, i:i, s:s });
  });

  if (weak.length > 0) {
    h += '<div class="card">';
    h += '<div class="card-header">Focus These First (Score 0-2)</div>';
    h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;">' +
      'These are your weak areas. Spend extra time on these!' +
    '</div>';
    weak.forEach(function(item) {
      h += '<div style="background:var(--card2);border:1px solid #7f1d1d;' +
               'border-radius:9px;padding:10px;margin-bottom:6px;">';
      h += '<div style="display:flex;justify-content:space-between;">';
      h += '<span class="tag tag-high">' + item.q.cat + '</span>';
      h += '<span style="font-size:12px;font-weight:800;color:#ef4444;">' +
        (item.s||0) + '/5</span>';
      h += '</div>';
      h += '<div style="font-size:12px;font-weight:600;margin-top:6px;">' +
        escHtml(item.q.q) + '</div>';
      h += '<button class="btn-ghost btn-small" style="margin-top:8px;" ' +
        'onclick="setIQCategoryAndGo(\'' + item.q.cat + '\')">' +
        'Practice Now' +
      '</button>';
      h += '</div>';
    });
    h += '</div>';
  } else if (Object.keys(state.interviewScores||{}).length > 0) {
    h += '<div class="empty-state">';
    h += '<div class="emo">🎉</div>';
    h += '<p>No weak areas! All rated 3+.<br>You are getting interview-ready!</p>';
    h += '</div>';
  } else {
    h += '<div class="empty-state">';
    h += '<div class="emo">📝</div>';
    h += '<p>Rate yourself on questions first to see weak areas!</p>';
    h += '</div>';
  }

  return h;
}

/* ---- TIPS ---- */
function renderInterviewTips() {
  var h = '';

  var tips = [
    {
      title: 'Before the Interview',
      icon:  '📋',
      items: [
        'Research the company - their products, tech stack, recent news',
        'Review your project end-to-end - know every line of code',
        'Practice STAR method for behavioral questions (Situation, Task, Action, Result)',
        'Prepare 3 questions to ask the interviewer',
        'Sleep 8 hours before. Brain needs to be sharp!',
        'Test your internet and camera if it is online'
      ]
    },
    {
      title: 'During Technical Questions',
      icon:  '💻',
      items: [
        'Think out loud - show your thought process, not just the answer',
        'Ask clarifying questions before jumping to answer',
        'If you do not know - say "I am not sure but my understanding is..."',
        'Draw diagrams or write formulas when explaining ML concepts',
        'Connect your answer to real examples from your project',
        'Take 5 seconds to think before answering complex questions'
      ]
    },
    {
      title: 'For DS Specific Interviews',
      icon:  '📊',
      items: [
        'Always explain WHY you chose an algorithm, not just what it does',
        'Know tradeoffs - every algorithm has pros and cons',
        'Be ready to code Pandas operations live in Python',
        'Know your project metrics - R squared, accuracy, precision values',
        'Prepare for: How would you improve your project?',
        'Know how to handle real-world problems - missing data, imbalanced classes'
      ]
    },
    {
      title: 'After the Interview',
      icon:  '📧',
      items: [
        'Send thank you email within 24 hours',
        'Follow up after 7 days if no response',
        'Note what questions you could not answer - study those',
        'Update your tracker immediately with status',
        'Never lose hope - rejection is data, not failure'
      ]
    }
  ];

  tips.forEach(function(section) {
    h += '<div class="card" style="margin-bottom:11px;">';
    h += '<div class="card-header">' + section.icon + ' ' + section.title + '</div>';
    section.items.forEach(function(item) {
      h += '<div style="padding:6px 0;border-bottom:1px solid #1a1a35;font-size:12px;">' +
        '✅ ' + escHtml(item) +
      '</div>';
    });
    h += '</div>';
  });

  return h;
}

/* ============================================
   INTERVIEW ACTIONS
   ============================================ */
function switchInterviewTab(tab) {
  window.AppState.interviewTab = tab;
  saveData();
  renderPage();
}

function setIQCategory(cat) {
  window.AppState.iqCategory = cat;
  saveData();
  renderPage();
}

function setIQCategoryAndGo(cat) {
  window.AppState.iqCategory   = cat;
  window.AppState.interviewTab = 'questions';
  saveData();
  renderPage();
}

function saveIQAnswer(qi, val) {
  if (!window.AppState.notes) window.AppState.notes = {};
  window.AppState.notes['iq_ans_'+qi] = val;
  saveData();
}

function rateIQ(qi, score) {
  if (!window.AppState.interviewScores) window.AppState.interviewScores = {};
  window.AppState.interviewScores['iq_'+qi] = score;
  saveData();
  renderPage();
}

function startMock(count) {
  var idxs = [];
  var pool = INTERVIEW_QS.map(function(_,i){return i;});
  while (idxs.length < Math.min(count, pool.length)) {
    var r = Math.floor(Math.random() * pool.length);
    if (idxs.indexOf(pool[r]) === -1) idxs.push(pool[r]);
  }
  window.AppState.mockMode      = true;
  window.AppState.mockQuestions = idxs;
  window.AppState.mockIndex     = 0;
  saveData();
  renderPage();
}

function startMockByCat(cat) {
  var pool = [];
  INTERVIEW_QS.forEach(function(q,i){ if(q.cat===cat) pool.push(i); });
  window.AppState.mockMode      = true;
  window.AppState.mockQuestions = pool;
  window.AppState.mockIndex     = 0;
  saveData();
  renderPage();
}

function nextMockQ() {
  var el = document.getElementById('mock-ans-inp');
  if (el) saveMockAns(
    window.AppState.mockQuestions[window.AppState.mockIndex||0]
  );
  window.AppState.mockIndex = (window.AppState.mockIndex||0) + 1;
  saveData();
  renderPage();
}

function saveMockAns(qi) {
  var el = document.getElementById('mock-ans-inp');
  if (!el) return;
  if (!window.AppState.notes) window.AppState.notes = {};
  window.AppState.notes['mock_'+qi] = el.value;
  if (!window.AppState.interviewScores) window.AppState.interviewScores = {};
  window.AppState.interviewScores['mock_'+qi] = 1;
  saveData();
}

function endMock() {
  window.AppState.mockMode      = false;
  window.AppState.mockIndex     = 0;
  window.AppState.mockQuestions = [];
  saveData();
  renderPage();
}

console.log('interview.js loaded OK');