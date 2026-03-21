/* ============================================
   VASAVI'S LIFE OS - PROJECT TRACKER MODULE
   modules/project.js
   ============================================ */

function renderProject() {
  var state  = window.AppState;
  var phases = state.projectPhases || [];
  var done   = phases.filter(function(p){return p.done;}).length;
  var projPct= pct(done, phases.length||1);
  var tab    = state.projectTab || 'main';

  var h = '';

  /* Header */
  h += '<div style="background:linear-gradient(135deg,#0d0d22,#0a1020);' +
       'border-radius:12px;padding:18px 20px;margin-bottom:14px;">';
  h += '<div style="font-size:10px;color:#a855f7;font-weight:800;margin-bottom:4px;">' +
    'PORTFOLIO PROJECT - INTERVIEW READY' +
  '</div>';
  h += '<div style="font-size:20px;font-weight:900;margin-bottom:6px;">' +
    'Personal Finance Intelligence Dashboard' +
  '</div>';
  h += '<div style="font-size:12px;color:#8899bb;margin-bottom:14px;">' +
    'Python · Pandas · Scikit-learn · Flask · GitHub · Matplotlib' +
  '</div>';
  h += '<div style="display:flex;align-items:center;gap:16px;">';
  h += makeRing(projPct, '#f59e0b', 72);
  h += '<div>';
  h += '<div style="font-size:22px;font-weight:900;color:#f59e0b;">' +
    projPct + '% Complete</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-top:4px;">' +
    done + ' of ' + phases.length + ' phases done</div>';
  h += (projPct===100
    ? '<div style="font-size:11px;color:#10b981;margin-top:4px;">' +
        '🎉 Project complete! Add to GitHub and LinkedIn NOW!' +
      '</div>'
    : '<div style="font-size:11px;color:#f59e0b;margin-top:4px;">' +
        'Keep going - this is your interview weapon!' +
      '</div>');
  h += '</div></div></div>';

  /* Tab bar */
  h += '<div class="subtab-bar">';
  h += '<div class="subtab ' + (tab==='main'?'active':'') + '" ' +
    'onclick="switchProjectTab(\'main\')">📋 Phases</div>';
  h += '<div class="subtab ' + (tab==='notes'?'active':'') + '" ' +
    'onclick="switchProjectTab(\'notes\')">📝 Notes</div>';
  h += '<div class="subtab ' + (tab==='ideas'?'active':'') + '" ' +
    'onclick="switchProjectTab(\'ideas\')">💡 Ideas</div>';
  h += '<div class="subtab ' + (tab==='present'?'active':'') + '" ' +
    'onclick="switchProjectTab(\'present\')">🎤 How to Present</div>';
  h += '</div>';

  if (tab === 'main')    h += renderProjectPhases(state, phases, done);
  if (tab === 'notes')   h += renderProjectNotes(state);
  if (tab === 'ideas')   h += renderProjectIdeas(state);
  if (tab === 'present') h += renderProjectPresentation();

  return h;
}

/* ---- PHASES ---- */
function renderProjectPhases(state, phases, done) {
  var h = '';

  h += '<div class="card">';
  h += '<div class="card-header">Project Phases</div>';

  phases.forEach(function(phase, i) {
    h += '<div style="background:var(--card2);border-radius:9px;padding:12px;' +
             'margin-bottom:8px;border-left:3px solid ' +
             (phase.done?'#10b981':'#1a1a35') + ';">';

    h += '<div class="check-item" onclick="togglePhase(' + i + ')">';
    h += '<input type="checkbox" ' + (phase.done?'checked':'') + ' />';
    h += '<span style="font-weight:700;font-size:12px;' +
      (phase.done?'text-decoration:line-through;color:#556080;':'') + '">' +
      escHtml(phase.label) +
    '</span>';
    h += '</div>';

    h += '<textarea rows="2" placeholder="Notes for this phase..." ' +
      'onchange="savePhaseNote(' + i + ',this.value)" ' +
      'style="margin-top:8px;font-size:11px;">' +
      escHtml(phase.note||'') +
    '</textarea>';

    h += '</div>';
  });

  /* Add custom phase */
  h += '<div style="display:flex;gap:8px;margin-top:8px;">';
  h += '<input id="phase-inp" placeholder="Add custom phase..." style="flex:1;" />';
  h += '<button class="btn-primary btn-small" onclick="addPhase()">+ Add</button>';
  h += '</div>';

  h += '</div>';

  /* Why this project wins */
  h += '<div class="card">';
  h += '<div class="card-header">Why This Project Wins Interviews</div>';
  var reasons = [
    'Personal data = unique story no other fresher has',
    'Shows FULL DS pipeline: data collection, EDA, ML, deployment',
    'Relatable to any interviewer - everyone manages money',
    'Live demo-able during interview from your laptop',
    'Flask + GitHub = technical proof of deployment skills',
    'Explains well in 2 minutes - interviewers love concise projects'
  ];
  reasons.forEach(function(r) {
    h += '<div style="padding:6px 0;border-bottom:1px solid #1a1a35;font-size:12px;">' +
      '✅ ' + r + '</div>';
  });
  h += '</div>';

  return h;
}

/* ---- NOTES ---- */
function renderProjectNotes(state) {
  var h = '';
  var noteTypes = [
    { key:'proj_eda',    label:'EDA Findings',      hint:'What patterns did you find in the data?' },
    { key:'proj_model',  label:'Model Details',     hint:'Which model, what accuracy, why this model?' },
    { key:'proj_challenges', label:'Challenges Faced', hint:'What went wrong and how did you fix it?' },
    { key:'proj_results', label:'Results and Metrics', hint:'R squared, accuracy, precision, recall values' },
    { key:'proj_future', label:'Future Improvements', hint:'What would you add if you had more time?' }
  ];

  noteTypes.forEach(function(nt) {
    var saved = (state.notes||{})[nt.key] || '';
    h += '<div class="card" style="margin-bottom:11px;">';
    h += '<div class="card-header">' + nt.label + '</div>';
    h += '<textarea rows="4" placeholder="' + nt.hint + '" ' +
      'onchange="saveProjectNote(\'' + nt.key + '\',this.value)">' +
      escHtml(saved) +
    '</textarea>';
    h += '</div>';
  });

  return h;
}

/* ---- IDEAS ---- */
function renderProjectIdeas(state) {
  var h = '';

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Future Project Ideas for Vasavi</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;">' +
    'After your main project is done, these will make you stand out even more!' +
  '</div>';

  var ideas = [
    {
      title: 'Job Market Analyzer',
      desc:  'Scrape Naukri/LinkedIn DS jobs in Bangalore. EDA on required skills, salaries. ML model: predict which jobs you will get shortlisted for based on your profile.',
      tags:  'Web Scraping · Pandas · NLP · Sklearn'
    },
    {
      title: 'Gym Progress Tracker with ML',
      desc:  'Track your gym sessions from this OS. EDA on workout patterns. ML model: predict weight loss based on gym + food data. Personal and unique!',
      tags:  'Time Series · Regression · Matplotlib'
    },
    {
      title: 'Smart Expense Categorizer',
      desc:  'Take expense descriptions and auto-categorize them using NLP. Train on your own expense data from this OS. Shows NLP skills to interviewers!',
      tags:  'NLP · Classification · Flask API'
    },
    {
      title: 'Stock Market Sentiment Analysis',
      desc:  'Scrape financial news headlines. Sentiment analysis on headlines. Correlate sentiment with stock price movement for Indian stocks.',
      tags:  'NLP · Time Series · Web Scraping'
    }
  ];

  ideas.forEach(function(idea) {
    h += '<div style="background:var(--card2);border:1px solid var(--border);' +
             'border-radius:10px;padding:14px;margin-bottom:10px;">';
    h += '<div style="font-weight:800;font-size:13px;margin-bottom:6px;">' +
      escHtml(idea.title) + '</div>';
    h += '<div style="font-size:11px;color:#8899bb;margin-bottom:8px;">' +
      escHtml(idea.desc) + '</div>';
    h += '<div style="font-size:10px;color:#a855f7;font-weight:700;">' +
      escHtml(idea.tags) + '</div>';
    h += '</div>';
  });

  h += '</div>';
  return h;
}

/* ---- HOW TO PRESENT ---- */
function renderProjectPresentation() {
  var h = '';

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">2-Minute Project Pitch (Memorize This!)</div>';
  h += '<div style="background:#1a1a35;border-radius:9px;padding:14px;' +
           'font-size:12px;line-height:1.9;">';
  h += '<strong style="color:#a855f7;">Problem:</strong> ' +
    '"I wanted to understand where my money goes each month and predict future spending."<br>';
  h += '<strong style="color:#a855f7;">Data:</strong> ' +
    '"I collected my own expense data - X months, Y transactions, Z categories."<br>';
  h += '<strong style="color:#a855f7;">EDA:</strong> ' +
    '"I found that food and transport were 60% of my spending. Detected seasonal patterns."<br>';
  h += '<strong style="color:#a855f7;">Model:</strong> ' +
    '"I used Random Forest for category-wise prediction. Achieved R-squared of 0.XX."<br>';
  h += '<strong style="color:#a855f7;">Deployment:</strong> ' +
    '"Wrapped in Flask API, can enter expenses and get next month prediction."<br>';
  h += '<strong style="color:#a855f7;">Impact:</strong> ' +
    '"Helped me reduce food spending by 20% by making data-driven decisions."';
  h += '</div>';
  h += '</div>';

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Common Project Questions + Your Answers</div>';

  var qas = [
    {
      q: 'Why did you choose Random Forest over other algorithms?',
      a: 'I tried Linear Regression first but R-squared was low due to non-linear patterns in spending. Random Forest handled non-linearity better, gave me feature importance to understand which months/categories drive predictions, and was more robust to outliers like festival spending spikes.'
    },
    {
      q: 'How did you handle missing data?',
      a: 'I had about 5% missing values in transaction notes. I used median imputation for numeric columns and mode for categorical. For dates, I used forward fill since expenses are continuous.'
    },
    {
      q: 'What would you improve if you had more time?',
      a: 'I would add anomaly detection to flag unusual spending, integrate UPI transaction data automatically, add a neural network for better time series forecasting, and build a mobile-friendly interface.'
    },
    {
      q: 'What was your biggest challenge?',
      a: 'Feature engineering for time-based patterns was the hardest. I had to create lag features, rolling averages, and month/day indicators to capture seasonality. Reading about time series feature engineering helped me solve this.'
    }
  ];

  qas.forEach(function(qa) {
    h += '<div style="background:var(--card2);border-radius:9px;padding:12px;margin-bottom:8px;">';
    h += '<div style="font-size:12px;font-weight:700;color:#f59e0b;margin-bottom:6px;">' +
      escHtml(qa.q) + '</div>';
    h += '<div style="font-size:11px;color:#8899bb;">' + escHtml(qa.a) + '</div>';
    h += '</div>';
  });

  h += '</div>';
  return h;
}

/* ============================================
   PROJECT ACTIONS
   ============================================ */
function switchProjectTab(tab) {
  window.AppState.projectTab = tab;
  saveData();
  renderPage();
}

function togglePhase(i) {
  window.AppState.projectPhases[i].done =
    !window.AppState.projectPhases[i].done;
  saveData();
  renderPage();
}

function savePhaseNote(i, val) {
  window.AppState.projectPhases[i].note = val;
  saveData();
}

function addPhase() {
  var inp = document.getElementById('phase-inp');
  if (!inp || !inp.value.trim()) return;
  window.AppState.projectPhases.push({
    label: inp.value.trim(),
    done:  false,
    note:  ''
  });
  inp.value = '';
  saveData();
  renderPage();
}

function saveProjectNote(key, val) {
  if (!window.AppState.notes) window.AppState.notes = {};
  window.AppState.notes[key] = val;
  saveData();
}

console.log('project.js loaded OK');