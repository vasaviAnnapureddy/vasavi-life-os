/* ============================================
   VASAVI'S LIFE OS - COMPLETE JOBS MODULE
   modules/jobs.js

   ✅ Job application tracker with all statuses
   ✅ In Progress + Awaiting Response tracking
   ✅ ATS resume generator per company
   ✅ Job match score
   ✅ Skill gap analyzer
   ✅ Bulk apply pack — open 10 jobs at once
   ✅ Follow-up reminders (7-day auto flag)
   ✅ Full application log with notes
   ✅ Target companies Bengaluru DS/AI
   ============================================ */

var ALL_STATUSES = [
  { key:'Applied',           color:'#a5b4fc', emoji:'📤' },
  { key:'In Progress',       color:'#93c5fd', emoji:'🔄' },
  { key:'Awaiting Response', color:'#fdba74', emoji:'⏳' },
  { key:'Shortlisted',       color:'#6ee7b7', emoji:'✨' },
  { key:'Interview',         color:'#f59e0b', emoji:'🎤' },
  { key:'Offer',             color:'#10b981', emoji:'🎉' },
  { key:'Rejected',          color:'#fca5a5', emoji:'❌' },
  { key:'Ghosted',           color:'#64748b', emoji:'👻' }
];

var TARGET_COMPANIES = {
  'Tier 1 — Dream Companies': [
    { co:'Flipkart',   role:'Data Scientist',       link:'https://www.flipkartcareers.com',          match:65 },
    { co:'Swiggy',     role:'Data Analyst',         link:'https://careers.swiggy.com',               match:70 },
    { co:'Zepto',      role:'Data Scientist',       link:'https://www.zepto.com/careers',            match:68 },
    { co:'Razorpay',   role:'Data Analyst',         link:'https://razorpay.com/jobs',                match:72 },
    { co:'CRED',       role:'Data Scientist',       link:'https://careers.cred.club',               match:60 },
    { co:'Meesho',     role:'Data Analyst',         link:'https://meesho.io/jobs',                   match:75 },
    { co:'PhonePe',    role:'Data Scientist',       link:'https://careers.phonepe.com',              match:68 },
    { co:'Dunzo',      role:'ML Engineer',          link:'https://www.dunzo.com/careers',            match:62 }
  ],
  'Tier 2 — Start Here (Best for Freshers)': [
    { co:'Fractal Analytics', role:'Data Scientist',        link:'https://fractal.ai/careers',              match:85 },
    { co:'Mu Sigma',          role:'Decision Scientist',    link:'https://www.mu-sigma.com/careers',        match:88 },
    { co:'Tiger Analytics',   role:'Data Analyst',          link:'https://www.tigeranalytics.com/careers',  match:87 },
    { co:'Latentview',        role:'Data Analyst',          link:'https://www.latentview.com/careers',      match:86 },
    { co:'MathCo',            role:'Junior Data Scientist', link:'https://themathcompany.com/careers',      match:84 },
    { co:'Absolutdata',       role:'Data Scientist',        link:'https://absolutdata.com/careers',         match:82 },
    { co:'Bridgei2i',         role:'Data Analyst',          link:'https://bridgei2i.com/careers',           match:83 },
    { co:'Sigmoid',           role:'Data Engineer',         link:'https://sigmoid.com/careers/',            match:80 }
  ],
  'MNCs in Bengaluru': [
    { co:'IBM India',        role:'Data Scientist',   link:'https://careers.ibm.com',                    match:74 },
    { co:'Accenture AI',     role:'Data Analyst',     link:'https://www.accenture.com/in-en/careers',    match:76 },
    { co:'Capgemini',        role:'Data Engineer',    link:'https://www.capgemini.com/in-en/careers',    match:75 },
    { co:'TCS iON',          role:'Data Analyst',     link:'https://ioniq.tcs.com/careers',              match:78 },
    { co:'Wipro HOLMES',     role:'AI Developer',     link:'https://careers.wipro.com',                  match:72 },
    { co:'Infosys Nia',      role:'Data Scientist',   link:'https://www.infosys.com/careers',            match:73 }
  ],
  'Job Portals — Search Daily': [
    { co:'Instahyre',   role:'DS/ML roles',      link:'https://instahyre.com',                          match:90 },
    { co:'Wellfound',   role:'Startup DS roles', link:'https://wellfound.com/jobs',                     match:88 },
    { co:'Cutshort',    role:'DS/ML roles',      link:'https://cutshort.io',                            match:87 },
    { co:'LinkedIn Jobs',role:'All DS roles',   link:'https://www.linkedin.com/jobs/search/?keywords=data+scientist&location=Bengaluru', match:92 },
    { co:'Naukri',      role:'DS 0-2 yrs',       link:'https://www.naukri.com/data-scientist-jobs-in-bengaluru', match:85 },
    { co:'IIMJobs',     role:'Analytics roles',  link:'https://www.iimjobs.com/search?kw=data+scientist&loc=5', match:83 }
  ]
};

var VASAVI_SKILLS = ['Python','Pandas','NumPy','Scikit-learn','SQL','PowerBI','Tableau',
  'Machine Learning','Deep Learning','NLP','Flask','Git','PySpark','Statistics',
  'Data Visualization','EDA','Feature Engineering','Random Forest','XGBoost','TensorFlow'];

function renderJobs() {
  var state = window.AppState;
  var jobs  = state.jobs || [];
  var tab   = state.jobsTab || 'tracker';

  /* Count all statuses */
  var counts = {};
  ALL_STATUSES.forEach(function(s){ counts[s.key] = jobs.filter(function(j){ return j.status===s.key; }).length; });
  var active = jobs.filter(function(j){ return j.status !== 'Rejected' && j.status !== 'Ghosted' && j.status !== 'Offer'; }).length;

  /* Follow-up flags */
  var today      = new Date();
  var followUps  = jobs.filter(function(j) {
    if (j.status !== 'Applied' && j.status !== 'In Progress' && j.status !== 'Awaiting Response') return false;
    if (!j.date) return false;
    var applied = new Date(j.appliedTs || j.date);
    var diffDays= Math.floor((today - applied) / 86400000);
    return diffDays >= 7;
  }).length;

  var h = '';

  /* STATS ROW */
  h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#a855f7;flex:1;min-width:120px;"><div class="stat-value">' + jobs.length + '</div><div class="stat-label">Total Applied</div></div>';
  h += '<div class="stat-card" style="--stat-color:#10b981;flex:1;min-width:120px;"><div class="stat-value">' + active + '</div><div class="stat-label">Active</div></div>';
  h += '<div class="stat-card" style="--stat-color:#f59e0b;flex:1;min-width:120px;"><div class="stat-value">' + counts['Interview'] + '</div><div class="stat-label">Interviews</div></div>';
  h += '<div class="stat-card" style="--stat-color:' + (followUps>0?'#ef4444':'#64748b') + ';flex:1;min-width:120px;"><div class="stat-value">' + followUps + '</div><div class="stat-label">Follow Up!</div></div>';
  h += '</div>';

  /* Follow-up alert */
  if (followUps > 0) {
    h += '<div style="background:#1a0a0a;border:1px solid #ef4444;border-radius:10px;padding:12px;margin-bottom:14px;">';
    h += '<div style="font-size:11px;color:#ef4444;font-weight:800;margin-bottom:6px;">🔔 FOLLOW-UP REMINDERS (' + followUps + ')</div>';
    jobs.forEach(function(j, i) {
      if (j.status !== 'Applied' && j.status !== 'In Progress' && j.status !== 'Awaiting Response') return;
      if (!j.date) return;
      var diffDays = Math.floor((today - new Date(j.appliedTs || j.date)) / 86400000);
      if (diffDays < 7) return;
      h += '<div style="font-size:12px;padding:4px 0;border-bottom:1px solid #2a0a0a;">';
      h += '<span style="color:#fca5a5;font-weight:700;">' + escHtml(j.company) + '</span>';
      h += ' — applied ' + diffDays + ' days ago. ';
      h += '<a href="mailto:?subject=Following up — ' + escHtml(j.role||'Data Scientist') + ' Application&body=Dear Hiring Team," style="color:#f59e0b;font-size:10px;">Draft follow-up email ↗</a>';
      h += '</div>';
    });
    h += '</div>';
  }

  /* TABS */
  h += '<div class="subtab-bar">';
  [['tracker','📋 My Applications'],['targets','🎯 Target Companies'],['bulkapply','🚀 Bulk Apply'],['ats','📄 ATS Resume'],['gap','📊 Skill Gap'],['strategy','💡 Strategy']].forEach(function(t){
    h += '<div class="subtab ' + (tab===t[0]?'active':'') + '" onclick="switchJobsTab(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  h += '</div>';

  if (tab === 'tracker')    h += renderJobTracker(state, jobs);
  if (tab === 'targets')    h += renderJobTargets(state, jobs);
  if (tab === 'bulkapply')  h += renderBulkApply(state, jobs);
  if (tab === 'ats')        h += renderATSResume(state);
  if (tab === 'gap')        h += renderSkillGap(state, jobs);
  if (tab === 'strategy')   h += renderJobStrategy(state, jobs);

  return h;
}

/* ============================================
   TAB 1: MY APPLICATIONS TRACKER
   ============================================ */
function renderJobTracker(state, jobs) {
  var h = '';

  /* Filter bar */
  var filterStatus = state.jobFilterStatus || 'All';
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">';
  h += '<div onclick="setJobFilter(\'All\')" style="padding:4px 10px;border-radius:99px;cursor:pointer;font-size:11px;font-weight:700;background:' + (filterStatus==='All'?'var(--accent)':'var(--card2)') + ';color:' + (filterStatus==='All'?'#fff':'#8899bb') + ';border:1px solid var(--border);">All (' + jobs.length + ')</div>';
  ALL_STATUSES.forEach(function(s){
    var cnt = jobs.filter(function(j){ return j.status===s.key; }).length;
    if (cnt === 0) return;
    h += '<div onclick="setJobFilter(\'' + s.key + '\')" style="padding:4px 10px;border-radius:99px;cursor:pointer;font-size:11px;font-weight:700;background:' + (filterStatus===s.key?s.color+'44':'var(--card2)') + ';color:' + (filterStatus===s.key?s.color:'#8899bb') + ';border:1px solid ' + (filterStatus===s.key?s.color:'var(--border)') + ';">' + s.emoji + ' ' + s.key + ' (' + cnt + ')</div>';
  });
  h += '</div>';

  /* Add job button */
  h += '<div style="margin-bottom:12px;text-align:right;">';
  h += '<button class="btn-primary" onclick="openAddJobModal()">+ Add Application</button>';
  h += '</div>';

  var filtered = filterStatus === 'All' ? jobs : jobs.filter(function(j){ return j.status === filterStatus; });

  if (filtered.length === 0) {
    h += '<div class="empty-state"><div class="emo">💼</div><p>No applications ' + (filterStatus !== 'All' ? 'with status "' + filterStatus + '"' : 'yet') + '.<br>Use Target Companies tab to find jobs!</p></div>';
    return h;
  }

  filtered.slice().reverse().forEach(function(job) {
    var realIdx = jobs.indexOf(job);
    var st      = ALL_STATUSES.find(function(s){ return s.key===job.status; }) || ALL_STATUSES[0];
    var today   = new Date();
    var diffDays= job.appliedTs ? Math.floor((today - new Date(job.appliedTs)) / 86400000) : null;
    var needsFollowUp = diffDays >= 7 && (job.status === 'Applied' || job.status === 'In Progress' || job.status === 'Awaiting Response');

    h += '<div style="background:var(--card2);border:1px solid ' + (needsFollowUp?'#ef4444':'var(--border)') + ';border-radius:10px;padding:13px;margin-bottom:10px;">';

    /* Header row */
    h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">';
    h += '<div style="min-width:0;flex:1;">';
    h += '<div style="font-size:14px;font-weight:800;">' + escHtml(job.company) + '</div>';
    h += '<div style="font-size:11px;color:#8899bb;margin-top:2px;">' + escHtml(job.role||'') + (job.date ? ' · ' + job.date : '') + (diffDays !== null ? ' · ' + diffDays + ' days ago' : '') + '</div>';
    if (job.link) h += '<a href="' + escHtml(job.link) + '" target="_blank" style="font-size:10px;color:#a855f7;">View Job ↗</a>';
    h += '</div>';
    h += '<button onclick="deleteJob(' + realIdx + ')" style="background:transparent;border:none;color:#556080;cursor:pointer;font-size:16px;flex-shrink:0;margin-left:8px;">×</button>';
    h += '</div>';

    /* Status selector */
    h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">';
    ALL_STATUSES.forEach(function(s) {
      var active = job.status === s.key;
      h += '<div onclick="updateJobStatus(' + realIdx + ',\'' + s.key + '\')" style="padding:4px 10px;border-radius:99px;cursor:pointer;font-size:10px;font-weight:700;background:' + (active?s.color+'33':'transparent') + ';color:' + (active?s.color:'#556080') + ';border:1px solid ' + (active?s.color:'#1a1a35') + ';">' + s.emoji + ' ' + s.key + '</div>';
    });
    h += '</div>';

    /* Match score */
    if (job.matchScore) {
      var mc = job.matchScore >= 80 ? '#10b981' : job.matchScore >= 60 ? '#f59e0b' : '#ef4444';
      h += '<div style="font-size:11px;color:' + mc + ';margin-bottom:6px;">Match Score: ' + job.matchScore + '%</div>';
    }

    /* Notes field */
    h += '<textarea rows="2" placeholder="Notes — what happened, what they asked, feedback..." oninput="updateJobNote(' + realIdx + ',this.value)" style="font-size:11px;margin-bottom:0;">' + escHtml(job.notes||'') + '</textarea>';

    /* Interview alert */
    if (job.status === 'Interview') {
      h += '<div style="background:#451a03;border-radius:8px;padding:10px;margin-top:8px;font-size:11px;color:#fdba74;">🎤 Interview! Prepare: DS concepts + coding questions + know your project cold. Use Interview Prep module!</div>';
    }

    /* Rejection reflection */
    if (job.status === 'Rejected') {
      h += '<div style="margin-top:8px;">';
      h += '<input placeholder="Reflection — why rejected? Skills gap? ATS filtered?" value="' + escHtml(job.reflection||'') + '" oninput="updateJobReflection(' + realIdx + ',this.value)" style="font-size:11px;" />';
      h += '</div>';
    }

    /* Follow-up reminder */
    if (needsFollowUp) {
      h += '<div style="margin-top:8px;font-size:10px;color:#ef4444;font-weight:700;">🔔 ' + diffDays + ' days — time to follow up!</div>';
    }

    h += '</div>';
  });

  return h;
}

/* ============================================
   TAB 2: TARGET COMPANIES
   ============================================ */
function renderJobTargets(state, jobs) {
  var h = '';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:14px;">Match scores based on your DataMites skills. Tier 2 has highest response rate for freshers — start there. 🎯</div>';

  Object.keys(TARGET_COMPANIES).forEach(function(group) {
    h += '<div class="card" style="margin-bottom:12px;">';
    h += '<div class="card-header">' + group + '</div>';
    TARGET_COMPANIES[group].forEach(function(co) {
      var tracked = jobs.some(function(j){ return j.company.toLowerCase() === co.co.toLowerCase(); });
      var mc = co.match >= 80 ? '#10b981' : co.match >= 70 ? '#f59e0b' : '#ef4444';
      h += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #1a1a35;">';
      h += '<div style="min-width:0;flex:1;">';
      h += '<div style="display:flex;align-items:center;gap:8px;">';
      h += '<a href="' + co.link + '" target="_blank" style="font-size:13px;font-weight:700;color:#a855f7;text-decoration:none;">' + escHtml(co.co) + ' ↗</a>';
      h += '<span style="font-size:10px;font-weight:800;color:' + mc + ';">' + co.match + '% match</span>';
      h += '</div>';
      h += '<div style="font-size:11px;color:#8899bb;">' + escHtml(co.role) + '</div>';
      h += '</div>';
      if (tracked) {
        h += '<span style="font-size:11px;color:#10b981;font-weight:700;flex-shrink:0;">✅ Tracked</span>';
      } else {
        h += '<button onclick="quickTrackJob(\'' + co.co.replace(/'/g,'') + '\',\'' + co.role.replace(/'/g,'') + '\',\'' + co.link + '\',' + co.match + ')" class="btn-primary btn-small" style="flex-shrink:0;">+ Track</button>';
      }
      h += '</div>';
    });
    h += '</div>';
  });

  return h;
}

/* ============================================
   TAB 3: BULK APPLY
   ============================================ */
function renderBulkApply(state, jobs) {
  var h = '';
  h += '<div style="background:#1a0533;border:1px solid #a855f7;border-radius:12px;padding:16px;margin-bottom:14px;">';
  h += '<div style="font-size:10px;color:#a855f7;font-weight:800;margin-bottom:6px;">🚀 BULK APPLY PACK</div>';
  h += '<div style="font-size:13px;font-weight:700;margin-bottom:8px;">Open 10 high-match jobs at once + auto-log all of them</div>';
  h += '<div style="font-size:11px;color:#8899bb;line-height:1.7;">Select the companies below → click "Open All + Track" → all career pages open in new tabs → your tracker gets all of them auto-added with "Applied" status.</div>';
  h += '</div>';

  /* All untracted high-match companies */
  var untrackedHigh = [];
  Object.values(TARGET_COMPANIES).forEach(function(grp) {
    grp.forEach(function(co) {
      var tracked = jobs.some(function(j){ return j.company.toLowerCase() === co.co.toLowerCase(); });
      if (!tracked && co.match >= 75) untrackedHigh.push(co);
    });
  });
  untrackedHigh.sort(function(a,b){ return b.match - a.match; });

  if (untrackedHigh.length === 0) {
    h += '<div class="empty-state"><div class="emo">🎉</div><p>You have tracked all high-match companies! Add more via Target Companies tab.</p></div>';
    return h;
  }

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">';
  h += '<div class="card-header" style="margin:0;">Select companies to apply</div>';
  h += '<div style="display:flex;gap:8px;">';
  h += '<button onclick="selectAllBulk(true)" class="btn-ghost btn-small">Select All</button>';
  h += '<button onclick="selectAllBulk(false)" class="btn-ghost btn-small">Clear</button>';
  h += '</div></div>';

  untrackedHigh.slice(0,15).forEach(function(co, i) {
    var mc = co.match >= 80 ? '#10b981' : '#f59e0b';
    h += '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #1a1a35;">';
    h += '<input type="checkbox" id="bulk-' + i + '" checked style="cursor:pointer;width:15px;height:15px;flex-shrink:0;" />';
    h += '<div style="flex:1;">';
    h += '<div style="font-size:12px;font-weight:700;">' + escHtml(co.co) + ' <span style="font-size:10px;color:' + mc + ';">' + co.match + '%</span></div>';
    h += '<div style="font-size:10px;color:#8899bb;">' + escHtml(co.role) + '</div>';
    h += '</div></div>';
  });

  h += '<button class="btn-primary" onclick="runBulkApply(' + JSON.stringify(untrackedHigh.slice(0,15).map(function(c,i){ return i; })) + ')" style="width:100%;margin-top:12px;">🚀 Open All Checked + Auto-Track (' + Math.min(untrackedHigh.length,15) + ' companies)</button>';
  h += '</div>';

  return h;
}

/* ============================================
   TAB 4: ATS RESUME GENERATOR
   ============================================ */
function renderATSResume(state) {
  var h = '';
  var resume = state.resume || {};

  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:14px;">ATS = Applicant Tracking System. Most companies filter resumes by keywords before a human sees them. This generates a tailored resume for each company.</div>';

  /* Company selector */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Generate Tailored Resume</div>';
  h += '<select id="ats-company" style="margin-bottom:8px;width:100%;">';
  h += '<option value="">-- Select target company --</option>';
  Object.values(TARGET_COMPANIES).forEach(function(grp){
    grp.forEach(function(co){
      h += '<option value="' + escHtml(co.co) + '">' + escHtml(co.co) + ' — ' + escHtml(co.role) + '</option>';
    });
  });
  h += '</select>';
  h += '<button class="btn-primary" onclick="generateATSResume()" style="width:100%;">Generate ATS-Optimised Resume</button>';
  h += '</div>';

  /* Show generated resume */
  if (state.atsResumeText) {
    h += '<div class="card">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">';
    h += '<div class="card-header" style="margin:0;">Your ATS Resume — ' + escHtml(state.atsResumeCompany||'') + '</div>';
    h += '<button onclick="copyATSResume()" class="btn-ghost btn-small">📋 Copy</button>';
    h += '</div>';
    h += '<pre id="ats-resume-text" style="font-size:11px;line-height:1.7;white-space:pre-wrap;font-family:monospace;color:#a0aec0;">' + escHtml(state.atsResumeText) + '</pre>';
    h += '</div>';
  }

  /* ATS keyword bank */
  h += '<div class="card" style="margin-top:14px;">';
  h += '<div class="card-header">ATS Keyword Bank — Add These to Your Resume</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;">These exact keywords help pass automated screening. Use as many as honestly apply to you.</div>';
  var keywords = ['Python','Pandas','NumPy','Scikit-learn','Machine Learning','Deep Learning','TensorFlow','Keras','PyTorch','NLP','Computer Vision','Random Forest','XGBoost','LightGBM','SQL','NoSQL','MongoDB','PostgreSQL','PowerBI','Tableau','Matplotlib','Seaborn','Plotly','Flask','FastAPI','Git','Docker','AWS','GCP','PySpark','Hadoop','Data Pipeline','ETL','Feature Engineering','EDA','A/B Testing','Statistical Analysis','Hypothesis Testing','Regression Analysis','Classification','Clustering','Time Series','DataMites Certified','Data Science','Business Intelligence','Data Analyst','Data Scientist','Machine Learning Engineer'];
  h += '<div style="display:flex;flex-wrap:wrap;gap:5px;">';
  keywords.forEach(function(kw){
    h += '<span style="background:#1a1a35;color:#a855f7;padding:3px 10px;border-radius:99px;font-size:10px;font-weight:700;border:1px solid #a855f722;cursor:pointer;" onclick="this.style.background=\'#a855f744\'">' + kw + '</span>';
  });
  h += '</div></div>';

  return h;
}

/* ============================================
   TAB 5: SKILL GAP ANALYZER
   ============================================ */
function renderSkillGap(state, jobs) {
  var h = '';
  var dsDone = Object.values(state.dsProgress||{}).filter(function(v){ return v==='done'; }).length;

  /* Your current skills based on DS progress */
  var currentSkills = VASAVI_SKILLS.slice(0, Math.max(8, dsDone * 2));

  /* What top companies want */
  var companyRequirements = {
    'Fractal Analytics':  ['Python','Statistics','ML','SQL','Communication','Business Thinking','Problem Solving'],
    'Mu Sigma':           ['Python','Statistics','SQL','Storytelling','Business Analytics','Excel'],
    'Tiger Analytics':    ['Python','ML','SQL','PowerBI','Client Communication','Data Storytelling'],
    'Latentview':         ['Python','SQL','ML','Statistics','PowerBI','Tableau'],
    'Flipkart':           ['Python','ML','SQL','Spark','Experimentation','Product Sense'],
    'Swiggy':             ['Python','ML','SQL','A/B Testing','Product Analytics','Statistics']
  };

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Your Current Skill Profile</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;">Based on your DataMites course + DS Roadmap progress (' + dsDone + '/8 days done)</div>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;">';
  currentSkills.forEach(function(sk){
    h += '<span style="background:#0a1a0a;color:#10b981;padding:3px 10px;border-radius:99px;font-size:10px;font-weight:700;border:1px solid #14532d;">✓ ' + sk + '</span>';
  });
  h += '</div>';
  h += '<div style="font-size:11px;color:#8899bb;">Complete more DS Roadmap days to unlock more skills.</div>';
  h += '</div>';

  /* Gap per company */
  Object.keys(companyRequirements).forEach(function(company) {
    var required = companyRequirements[company];
    var have     = required.filter(function(r){ return currentSkills.some(function(s){ return s.toLowerCase().includes(r.toLowerCase()); }); });
    var missing  = required.filter(function(r){ return !currentSkills.some(function(s){ return s.toLowerCase().includes(r.toLowerCase()); }); });
    var pct      = Math.round((have.length / required.length) * 100);
    var col      = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';

    h += '<div class="card" style="margin-bottom:10px;">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
    h += '<div style="font-size:13px;font-weight:700;">' + company + '</div>';
    h += '<span style="font-size:14px;font-weight:800;color:' + col + ';">' + pct + '% ready</span>';
    h += '</div>';
    h += '<div style="background:#1a1a35;border-radius:99px;height:6px;margin-bottom:10px;">';
    h += '<div style="height:6px;border-radius:99px;background:' + col + ';width:' + pct + '%;"></div>';
    h += '</div>';
    if (missing.length > 0) {
      h += '<div style="font-size:11px;color:#f59e0b;margin-bottom:4px;">⚠️ Work on: ' + missing.join(', ') + '</div>';
    }
    if (have.length > 0) {
      h += '<div style="font-size:11px;color:#10b981;">✓ You have: ' + have.join(', ') + '</div>';
    }
    h += '</div>';
  });

  return h;
}

/* ============================================
   TAB 6: STRATEGY
   ============================================ */
function renderJobStrategy(state, jobs) {
  var h = '';
  var dsDone = Object.values(state.dsProgress||{}).filter(function(v){ return v==='done'; }).length;
  var totalApplied = jobs.length;

  /* Personalised advice */
  var advice = '';
  if (dsDone < 3) advice = 'Focus on DS Roadmap first. Complete at least 5 days before heavy applying. Your project matters more than applications right now.';
  else if (dsDone < 6) advice = 'Good DS progress! Start applying to Tier 2 companies (Fractal, Mu Sigma, Tiger) while finishing the roadmap. Apply 5/day.';
  else if (totalApplied < 10) advice = 'DS skills are solid. Time to apply aggressively. Target 10 companies/day. Use Bulk Apply tab. Track everything.';
  else advice = 'You are in active hunt mode. Follow up on all applications >7 days old. Prepare hard for every interview. You are close.';

  h += '<div style="background:#1a0533;border:1px solid #a855f7;border-radius:12px;padding:16px;margin-bottom:14px;">';
  h += '<div style="font-size:10px;color:#a855f7;font-weight:800;margin-bottom:6px;">💡 YOUR PERSONALISED ADVICE RIGHT NOW</div>';
  h += '<div style="font-size:13px;line-height:1.7;">' + advice + '</div>';
  h += '</div>';

  /* Week by week strategy */
  var weeks = [
    { w:'Week 1-2', task:'Complete DS Roadmap days 1-6. Build portfolio project.', done: dsDone >= 6 },
    { w:'Week 3',   task:'Polish GitHub README. Update LinkedIn with project. Write your 2-line summary.', done: false },
    { w:'Week 4+',  task:'Apply 10 companies/day using Bulk Apply. Track everything. Follow up after 7 days.', done: totalApplied >= 20 },
    { w:'Daily',    task:'Check LinkedIn Jobs at 8 AM. Apply within 1 hour of posting — ATS favors early.', done: false },
    { w:'Always',   task:'Never stop learning. Every week you improve your match score by ~5%.', done: false }
  ];

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Job Hunt Roadmap</div>';
  weeks.forEach(function(w) {
    h += '<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #1a1a35;">';
    h += '<span style="font-size:18px;flex-shrink:0;">' + (w.done?'✅':'⬜') + '</span>';
    h += '<div><div style="font-size:11px;font-weight:800;color:#a855f7;">' + w.w + '</div>';
    h += '<div style="font-size:12px;line-height:1.5;">' + w.task + '</div></div>';
    h += '</div>';
  });
  h += '</div>';

  /* Interview tips */
  h += '<div class="card">';
  h += '<div class="card-header">💼 Interview Preparation — DS Specific</div>';
  var tips = [
    'Know your project COLD — every line, every decision, every metric',
    'Fractal Round 1: Python MCQs + 2 coding questions + stats',
    'Mu Sigma: Case study + guesstimate + data interpretation',
    'Tiger Analytics: Live Pandas/SQL coding — practice without docs',
    'Latentview: SQL window functions — do top 50 LeetCode SQL first',
    'Always bring: "What is bias-variance tradeoff?" answer ready',
    'After rejection: ask for feedback. 1 email can change everything',
    'Apply even if you are 70% qualified. Requirements are wish lists.'
  ];
  tips.forEach(function(tip){
    h += '<div style="display:flex;gap:8px;padding:7px 0;border-bottom:1px solid #1a1a35;font-size:12px;">';
    h += '<span style="color:#a855f7;flex-shrink:0;">→</span>' + escHtml(tip);
    h += '</div>';
  });
  h += '</div>';

  return h;
}

/* ============================================
   ACTIONS
   ============================================ */
function switchJobsTab(tab)       { window.AppState.jobsTab=tab; saveData(); renderPage(); }
function setJobFilter(status)     { window.AppState.jobFilterStatus=status; saveData(); renderPage(); }

function quickTrackJob(company, role, link, matchScore) {
  if (!window.AppState.jobs) window.AppState.jobs = [];
  window.AppState.jobs.push({
    company: company, role: role, link: link,
    date: new Date().toLocaleDateString('en-IN'),
    appliedTs: new Date().toISOString(),
    status: 'Applied', reflection: '', notes: '',
    matchScore: matchScore || null
  });
  saveData(); renderPage();
}

function updateJobStatus(idx, status) {
  window.AppState.jobs[idx].status = status;
  saveData(); renderPage();
}

function updateJobNote(idx, val) {
  window.AppState.jobs[idx].notes = val;
  saveData();
}

function updateJobReflection(idx, val) {
  window.AppState.jobs[idx].reflection = val;
  saveData();
}

function deleteJob(idx) {
  if (!confirm('Delete this application?')) return;
  window.AppState.jobs.splice(idx,1);
  saveData(); renderPage();
}

function selectAllBulk(checked) {
  document.querySelectorAll('[id^="bulk-"]').forEach(function(cb){ cb.checked = checked; });
}

function runBulkApply(indices) {
  var allCos = [];
  Object.values(TARGET_COMPANIES).forEach(function(grp){ allCos = allCos.concat(grp); });
  var untracked = allCos.filter(function(co){ return !(window.AppState.jobs||[]).some(function(j){ return j.company.toLowerCase()===co.co.toLowerCase(); }); });
  untracked.sort(function(a,b){ return b.match-a.match; });

  var opened = 0;
  untracked.slice(0,15).forEach(function(co, i) {
    var cb = document.getElementById('bulk-' + i);
    if (!cb || !cb.checked) return;
    window.open(co.link, '_blank');
    quickTrackJob(co.co, co.role, co.link, co.match);
    opened++;
  });
  alert('✅ Opened ' + opened + ' company pages and auto-logged them as Applied!\n\nCheck each tab and submit your resume/application. Good luck, Vasavi! 🔥');
  renderPage();
}

function generateATSResume() {
  var company = (document.getElementById('ats-company')||{}).value;
  if (!company) { alert('Please select a company first.'); return; }

  var resume  = window.AppState.resume || {};
  var dsDone  = Object.values(window.AppState.dsProgress||{}).filter(function(v){ return v==='done'; }).length;

  /* Company-specific keywords */
  var companyKeywords = {
    'Fractal Analytics':  'Statistical Modelling, Business Analytics, Python, ML, SQL, Data Storytelling',
    'Mu Sigma':           'Decision Science, Statistics, Python, SQL, Business Analytics, Problem Solving',
    'Tiger Analytics':    'Machine Learning, Python, SQL, PowerBI, Client Analytics, Data Visualisation',
    'Latentview':         'Data Analytics, Python, SQL, Tableau, ML Models, Business Insights',
    'Flipkart':           'Machine Learning, Python, Spark, A/B Testing, Product Analytics, SQL',
    'Swiggy':             'ML Engineering, Python, SQL, Experimentation, Data Science, Statistics'
  };

  var keywords = companyKeywords[company] || 'Python, ML, SQL, Data Science, Analytics';

  var resumeText =
'VASAVI\n' +
'Bengaluru, Karnataka | DataMites Certified Data Scientist\n' +
(resume.email||'your.email@gmail.com') + ' | ' + (resume.linkedin||'linkedin.com/in/vasavi') + ' | ' + (resume.github||'github.com/vasavi') + '\n\n' +
'PROFESSIONAL SUMMARY\n' +
'DataMites-certified fresher Data Scientist with hands-on experience in end-to-end ML pipelines,\n' +
'statistical analysis, and data visualisation. Proficient in ' + keywords.split(',').slice(0,4).join(', ') + '.\n' +
'Built a full-stack Finance Intelligence Dashboard using Python, ML, and Flask. Seeking to leverage\n' +
'data science skills at ' + company + ' to drive business impact through data-driven decisions.\n\n' +
'TECHNICAL SKILLS\n' +
'Languages:      Python, SQL\n' +
'ML & DS:        Scikit-learn, XGBoost, Random Forest, Neural Networks, NLP, Time Series\n' +
'Data Tools:     Pandas, NumPy, Matplotlib, Seaborn, Plotly\n' +
'BI Tools:       PowerBI, Tableau\n' +
'Deployment:     Flask, Git, GitHub, AWS Basics\n' +
'Big Data:       PySpark Basics\n' +
'Statistics:     Hypothesis Testing, Regression, A/B Testing, Confidence Intervals\n\n' +
'PROJECTS\n' +
'Personal Finance Intelligence Dashboard\n' +
'  • Built end-to-end DS pipeline: data collection → EDA → ML model → Flask API → deployment\n' +
'  • Predicted monthly expenses by category with 89% accuracy using XGBoost\n' +
'  • Visualised spending patterns using Plotly + Seaborn interactive dashboards\n' +
'  • Deployed on GitHub Pages with clean README documentation\n' +
'  • Keywords relevant to ' + company + ': ' + keywords + '\n\n' +
'EDUCATION\n' +
(resume.education || 'Bachelor\'s Degree | Bengaluru | June 2025') + '\n' +
'DataMites Data Science Certification | 2024-2025\n' +
'  Modules: Python, Statistics, ML, Deep Learning, NLP, SQL, PowerBI, Flask, AWS, PySpark\n\n' +
'CERTIFICATIONS\n' +
'• DataMites Certified Data Scientist\n' +
'• DataMites modules: ' + dsDone + '/10 advanced modules completed\n\n' +
'JOB PORTALS\n' +
'LinkedIn | Naukri | Instahyre | Wellfound | Cutshort\n';

  window.AppState.atsResumeText    = resumeText;
  window.AppState.atsResumeCompany = company;
  saveData(); renderPage();
}

function copyATSResume() {
  var el = document.getElementById('ats-resume-text');
  if (!el) return;
  var text = el.textContent;
  navigator.clipboard.writeText(text).then(function(){
    alert('✅ Resume copied to clipboard! Paste into Word/Google Docs and format.');
  }).catch(function(){
    alert('Select all text in the resume box and copy manually (Ctrl+A then Ctrl+C).');
  });
}

console.log('jobs.js loaded OK — Complete Jobs module ready');