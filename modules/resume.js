/* ============================================
   VASAVI'S LIFE OS - RESUME BUILDER MODULE
   modules/resume.js
   ============================================ */

function renderResume() {
  var state = window.AppState;
  var r     = state.resume || {};
  var tab   = state.resumeTab || 'profile';

  var h = '';

  /* ---- TAB BAR ---- */
  h += '<div class="subtab-bar">';
  ['profile','skills','projects','preview','linkedin','cover'].forEach(function(t) {
    h += '<div class="subtab ' + (tab === t ? 'active' : '') + '" ' +
      'onclick="switchResumeTab(\'' + t + '\')">' +
      (t === 'profile'  ? '👤 Profile'   :
       t === 'skills'   ? '🛠️ Skills'    :
       t === 'projects' ? '🚀 Projects'  :
       t === 'preview'  ? '👁️ Preview'   :
       t === 'linkedin' ? '💼 LinkedIn'  : '✉️ Cover Letter') +
    '</div>';
  });
  h += '</div>';

  if (tab === 'profile')  h += renderResumeProfile(r);
  if (tab === 'skills')   h += renderResumeSkills(r);
  if (tab === 'projects') h += renderResumeProjects(r);
  if (tab === 'preview')  h += renderResumePreview(r);
  if (tab === 'linkedin') h += renderLinkedinChecklist(state);
  if (tab === 'cover')    h += renderCoverLetter(r);

  return h;
}

/* ---- PROFILE TAB ---- */
function renderResumeProfile(r) {
  var h = '<div class="card">';
  h += '<div class="card-header">Personal Information</div>';

  var fields = [
    ['name',      'Full Name',    'Vasavi',                       'text'],
    ['email',     'Email',        'your@email.com',               'email'],
    ['phone',     'Phone',        '+91 XXXXX XXXXX',              'text'],
    ['linkedin',  'LinkedIn URL', 'linkedin.com/in/vasavi',       'text'],
    ['github',    'GitHub URL',   'github.com/vasavi',            'text'],
    ['location',  'Location',     'Bengaluru, Karnataka, India',  'text']
  ];

  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
  fields.forEach(function(f) {
    h += '<div class="form-row">' +
      '<label>' + f[1] + '</label>' +
      '<input type="' + f[3] + '" id="res-' + f[0] + '" ' +
        'placeholder="' + f[2] + '" ' +
        'value="' + escHtml(r[f[0]] || '') + '" ' +
        'oninput="saveResumeField(\'' + f[0] + '\',this.value)" />' +
    '</div>';
  });
  h += '</div>';

  h += '<div class="form-row" style="margin-top:4px;">';
  h += '<label>Professional Summary (2 lines - ATS optimized)</label>';
  h += '<textarea id="res-summary" rows="3" ' +
    'placeholder="DataMites-certified Data Science fresher with expertise in Python, Machine Learning, SQL, and PowerBI. Built end-to-end Finance Intelligence Dashboard. Seeking DS/AI role in Bengaluru." ' +
    'oninput="saveResumeField(\'summary\',this.value)">' +
    escHtml(r.summary || '') +
  '</textarea>';
  h += '</div>';

  h += '<div class="form-row">';
  h += '<label>Education</label>';
  h += '<textarea id="res-education" rows="3" ' +
    'placeholder="B.Tech/B.E. in [Branch]&#10;[College Name], [City]&#10;Year of Graduation: 2025 | CGPA: X.X" ' +
    'oninput="saveResumeField(\'education\',this.value)">' +
    escHtml(r.education || '') +
  '</textarea>';
  h += '</div>';

  h += '<div class="form-row">';
  h += '<label>Certifications</label>';
  h += '<input id="res-certs" ' +
    'placeholder="DataMites Data Science Certification - 2025" ' +
    'value="' + escHtml(r.certs || '') + '" ' +
    'oninput="saveResumeField(\'certs\',this.value)" />';
  h += '</div>';

  h += '<button class="btn-primary" onclick="saveAllResume()" ' +
    'style="width:100%;margin-top:8px;">Save Profile</button>';

  h += '</div>';
  return h;
}

/* ---- SKILLS TAB ---- */
function renderResumeSkills(r) {
  var h = '<div class="card">';
  h += '<div class="card-header">Technical Skills - ATS Optimized for DS/AI Jobs</div>';
  h += '<div style="background:#1a1a35;border-radius:8px;padding:10px;' +
           'font-size:11px;color:#8899bb;margin-bottom:12px;">';
  h += '✅ These skills are pre-filled from your DataMites course. ' +
    'Edit if needed. These exact keywords help pass ATS scanners!';
  h += '</div>';

  var skillGroups = [
    {
      label: 'Programming Languages',
      key:   'skills_prog',
      def:   'Python, SQL, MySQL'
    },
    {
      label: 'ML/DL Libraries',
      key:   'skills_ml',
      def:   'Scikit-learn, TensorFlow, Keras, XGBoost, Random Forest, Pandas, NumPy'
    },
    {
      label: 'Data Visualization',
      key:   'skills_viz',
      def:   'Matplotlib, Seaborn, Plotly, PowerBI, Tableau, MS Excel Advanced'
    },
    {
      label: 'NLP and Deep Learning',
      key:   'skills_nlp',
      def:   'NLTK, TF-IDF, Sentiment Analysis, ANN, CNN, RegEx, Time Series'
    },
    {
      label: 'Big Data and Cloud',
      key:   'skills_cloud',
      def:   'PySpark, Apache Spark, MLlib, AWS S3, AWS EC2, SageMaker basics'
    },
    {
      label: 'Tools and DevOps',
      key:   'skills_tools',
      def:   'Git, GitHub, Flask, REST API, Jupyter Notebook, VS Code'
    },
    {
      label: 'Soft Skills',
      key:   'skills_soft',
      def:   'Problem Solving, Data Storytelling, Analytical Thinking, Communication'
    }
  ];

  skillGroups.forEach(function(sg) {
    h += '<div class="form-row">';
    h += '<label>' + sg.label + '</label>';
    h += '<input id="res-' + sg.key + '" ' +
      'value="' + escHtml(r[sg.key] || sg.def) + '" ' +
      'oninput="saveResumeField(\'' + sg.key + '\',this.value)" />';
    h += '</div>';
  });

  h += '<button class="btn-primary" onclick="saveAllResume()" ' +
    'style="width:100%;margin-top:8px;">Save Skills</button>';
  h += '</div>';
  return h;
}

/* ---- PROJECTS TAB ---- */
function renderResumeProjects(r) {
  var h = '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Portfolio Project 1 - Main Project</div>';

  h += '<div style="background:linear-gradient(135deg,#1a0533,#0a1020);' +
           'border-radius:9px;padding:14px;margin-bottom:12px;">';
  h += '<div style="font-size:12px;font-weight:800;color:#a855f7;margin-bottom:6px;">' +
    'Personal Finance Intelligence Dashboard' +
  '</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:6px;">' +
    'Tech Stack: Python · Pandas · Scikit-learn · Flask · Matplotlib · GitHub' +
  '</div>';
  h += '<div style="font-size:11px;color:#8899bb;">' +
    '• Performed EDA on personal expense data to identify spending patterns and anomalies<br>' +
    '• Built ML model to predict next month category-wise spend (Random Forest)<br>' +
    '• Deployed as Flask web app with interactive visualizations<br>' +
    '• <a href="' + escHtml(r.github || '#') + '" ' +
      'target="_blank" style="color:#a855f7;">GitHub Link</a>' +
  '</div>';
  h += '</div>';

  h += '<div class="form-row">';
  h += '<label>GitHub Link for Project</label>';
  h += '<input id="res-project-link" ' +
    'placeholder="https://github.com/vasavi/finance-dashboard" ' +
    'value="' + escHtml(r.projectLink || '') + '" ' +
    'oninput="saveResumeField(\'projectLink\',this.value)" />';
  h += '</div>';

  h += '</div>';

  h += '<div class="card">';
  h += '<div class="card-header">Additional Projects</div>';
  h += '<div class="form-row">';
  h += '<label>Add more projects (one per section)</label>';
  h += '<textarea id="res-projects" rows="8" ' +
    'placeholder="Project 2: [Name] | Tech Stack&#10;• What you built&#10;• Impact/Results&#10;• GitHub link&#10;&#10;Project 3: [Name] | Tech Stack&#10;• ..." ' +
    'oninput="saveResumeField(\'projects\',this.value)">' +
    escHtml(r.projects || '') +
  '</textarea>';
  h += '</div>';
  h += '<button class="btn-primary" onclick="saveAllResume()" ' +
    'style="width:100%;margin-top:8px;">Save Projects</button>';
  h += '</div>';
  return h;
}

/* ---- PREVIEW TAB ---- */
function renderResumePreview(r) {
  var h = '';

  /* White resume preview */
  h += '<div style="background:#fff;color:#000;border-radius:10px;' +
       'padding:30px;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;">';

  /* Header */
  h += '<div style="border-bottom:3px solid #7c3aed;padding-bottom:12px;margin-bottom:16px;">';
  h += '<div style="font-size:24px;font-weight:900;color:#7c3aed;">' +
    escHtml(r.name || 'Vasavi') +
  '</div>';
  h += '<div style="font-size:11px;color:#555;margin-top:4px;">';
  var contact = [r.email, r.phone, r.linkedin, r.github, r.location || 'Bengaluru, India']
    .filter(Boolean).join(' · ');
  h += escHtml(contact);
  h += '</div></div>';

  /* Summary */
  h += '<div style="margin-bottom:14px;">';
  h += '<div style="font-weight:800;font-size:13px;border-bottom:1px solid #eee;' +
           'margin-bottom:6px;padding-bottom:3px;">PROFESSIONAL SUMMARY</div>';
  h += '<div style="font-size:11px;">' +
    escHtml(r.summary ||
      'DataMites-certified Data Science fresher with expertise in Python, ' +
      'Machine Learning, SQL, and PowerBI. Seeking DS/AI role in Bengaluru.'
    ) +
  '</div></div>';

  /* Skills */
  h += '<div style="margin-bottom:14px;">';
  h += '<div style="font-weight:800;font-size:13px;border-bottom:1px solid #eee;' +
           'margin-bottom:6px;padding-bottom:3px;">TECHNICAL SKILLS</div>';
  var skillDefs = {
    'Languages':      r.skills_prog   || 'Python, SQL, MySQL',
    'ML/DL':          r.skills_ml     || 'Scikit-learn, TensorFlow, Keras, XGBoost, Random Forest',
    'Visualization':  r.skills_viz    || 'Matplotlib, Seaborn, PowerBI, Tableau',
    'NLP/DL':         r.skills_nlp    || 'NLTK, TF-IDF, ANN, CNN',
    'Big Data/Cloud': r.skills_cloud  || 'PySpark, AWS basics',
    'Tools':          r.skills_tools  || 'Git, GitHub, Flask, Jupyter'
  };
  Object.keys(skillDefs).forEach(function(k) {
    h += '<div style="font-size:11px;margin-bottom:3px;">' +
      '<strong>' + k + ':</strong> ' + escHtml(skillDefs[k]) +
    '</div>';
  });
  h += '</div>';

  /* Projects */
  h += '<div style="margin-bottom:14px;">';
  h += '<div style="font-weight:800;font-size:13px;border-bottom:1px solid #eee;' +
           'margin-bottom:6px;padding-bottom:3px;">PROJECTS</div>';
  h += '<div style="font-size:11px;margin-bottom:8px;">';
  h += '<strong>Personal Finance Intelligence Dashboard</strong>';
  h += ' | Python · ML · Flask · GitHub<br>';
  h += '• EDA on expense data → spending patterns identified<br>';
  h += '• ML model predicts next month spend by category (Random Forest)<br>';
  h += '• Deployed as Flask web app with interactive charts';
  if (r.projectLink) {
    h += '<br>• <a href="' + escHtml(r.projectLink) + '" style="color:#7c3aed;">' +
      escHtml(r.projectLink) + '</a>';
  }
  h += '</div>';
  if (r.projects) {
    h += '<div style="font-size:11px;white-space:pre-line;">' +
      escHtml(r.projects) +
    '</div>';
  }
  h += '</div>';

  /* Education */
  h += '<div style="margin-bottom:14px;">';
  h += '<div style="font-weight:800;font-size:13px;border-bottom:1px solid #eee;' +
           'margin-bottom:6px;padding-bottom:3px;">EDUCATION</div>';
  h += '<div style="font-size:11px;white-space:pre-line;">' +
    escHtml(r.education || 'Your degree details here') +
  '</div></div>';

  /* Certifications */
  h += '<div>';
  h += '<div style="font-weight:800;font-size:13px;border-bottom:1px solid #eee;' +
           'margin-bottom:6px;padding-bottom:3px;">CERTIFICATIONS</div>';
  h += '<div style="font-size:11px;">' +
    escHtml(r.certs || 'DataMites Data Science Certification - 2025') +
  '</div></div>';

  h += '</div>';

  h += '<button class="btn-primary" onclick="window.print()" ' +
    'style="width:100%;margin-top:12px;">🖨️ Print / Save as PDF</button>';

  return h;
}

/* ---- LINKEDIN CHECKLIST ---- */
function renderLinkedinChecklist(state) {
  var h = '<div class="card">';
  h += '<div class="card-header">LinkedIn Profile Checklist - Do This Today!</div>';

  var items = [
    { key:'li_photo',    text:'Professional headshot (not a casual selfie)' },
    { key:'li_headline', text:'Headline: "Data Scientist | Python | ML | DataMites Certified | Bengaluru"' },
    { key:'li_about',    text:'About section: 3 paragraphs - who you are, your skills, what you seek' },
    { key:'li_edu',      text:'Education: degree + DataMites certification added' },
    { key:'li_skills',   text:'Skills: Python, SQL, Machine Learning, Pandas, PowerBI - minimum 10 skills' },
    { key:'li_featured', text:'Featured section: pin your GitHub project link' },
    { key:'li_500',      text:'500+ connections - connect with DS people daily' },
    { key:'li_post',     text:'Post once a week about your DS learning journey' },
    { key:'li_url',      text:'Custom URL: linkedin.com/in/vasavi-[something]' },
    { key:'li_open',     text:'Open to Work: turned on for Data Scientist roles in Bengaluru' }
  ];

  var notes = state.notes || {};
  var done  = items.filter(function(item) { return notes[item.key]; }).length;

  h += '<div class="progress-wrap" style="margin-bottom:14px;">';
  h += '<div class="progress-label">';
  h += '<span>Profile Strength</span>';
  h += '<span>' + pct(done, items.length) + '%</span>';
  h += '</div>';
  h += '<div class="progress-bar" style="height:8px;">';
  h += '<div class="progress-fill" style="width:' + pct(done, items.length) + '%"></div>';
  h += '</div></div>';

  items.forEach(function(item) {
    h += '<div class="check-item" onclick="toggleLinkedIn(\'' + item.key + '\')">';
    h += '<input type="checkbox" ' + (notes[item.key] ? 'checked' : '') + ' />';
    h += '<span class="' + (notes[item.key] ? 'checked-text' : '') + '">' +
      item.text + '</span>';
    h += '</div>';
  });

  h += '</div>';
  return h;
}

/* ---- COVER LETTER ---- */
function renderCoverLetter(r) {
  var h = '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">Cover Letter Generator</div>';

  h += '<div class="form-row">';
  h += '<label>Company Name</label>';
  h += '<input id="cl-company" placeholder="e.g. Fractal Analytics" />';
  h += '</div>';

  h += '<div class="form-row">';
  h += '<label>Role</label>';
  h += '<input id="cl-role" placeholder="e.g. Data Scientist" />';
  h += '</div>';

  h += '<div class="form-row">';
  h += '<label>Why this company?</label>';
  h += '<input id="cl-why" placeholder="e.g. I love how you use DS to solve real problems" />';
  h += '</div>';

  h += '<button class="btn-primary" onclick="generateCoverLetter()" ' +
    'style="margin-bottom:14px;">Generate Cover Letter</button>';

  h += '</div>';

  h += '<div class="card" id="cl-output-card" style="' +
    (r.coverLetter ? '' : 'display:none;') + '">';
  h += '<div class="card-header">Your Cover Letter ' +
    '<button class="btn-ghost btn-small" onclick="copyCoverLetter()">Copy</button>' +
  '</div>';
  h += '<div id="cl-output" style="font-size:12px;line-height:1.8;white-space:pre-wrap;">' +
    escHtml(r.coverLetter || '') +
  '</div>';
  h += '</div>';

  return h;
}

/* ============================================
   RESUME ACTIONS
   ============================================ */
function switchResumeTab(tab) {
  window.AppState.resumeTab = tab;
  saveData();
  renderPage();
}

function saveResumeField(field, value) {
  if (!window.AppState.resume) window.AppState.resume = {};
  window.AppState.resume[field] = value;
  saveData();
}

function saveAllResume() {
  var fields = [
    'name','email','phone','linkedin','github','location',
    'summary','education','certs','project-link','projects',
    'skills_prog','skills_ml','skills_viz','skills_nlp',
    'skills_cloud','skills_tools','skills_soft'
  ];
  fields.forEach(function(f) {
    var el = document.getElementById('res-' + f);
    if (el) saveResumeField(f.replace('-',''), el.value);
  });
  alert('Resume saved! 💜');
}

function toggleLinkedIn(key) {
  if (!window.AppState.notes) window.AppState.notes = {};
  window.AppState.notes[key] = !window.AppState.notes[key];
  saveData();
  renderPage();
}

function generateCoverLetter() {
  var company = document.getElementById('cl-company');
  var role    = document.getElementById('cl-role');
  var why     = document.getElementById('cl-why');
  var r       = window.AppState.resume || {};

  var letter = [
    'Dear Hiring Manager,',
    '',
    'I am writing to express my strong interest in the ' +
      (role ? role.value : 'Data Scientist') +
      ' position at ' +
      (company ? company.value : '[Company]') + '.',
    '',
    'I am a DataMites-certified Data Science fresher based in Bengaluru with ' +
      'hands-on expertise in Python, Machine Learning, SQL, PowerBI, and Flask. ' +
      'I recently built a Personal Finance Intelligence Dashboard - an end-to-end ' +
      'DS project that performs EDA on expense data and uses a Random Forest model ' +
      'to predict next month\'s spending by category, deployed as a Flask web application.',
    '',
    'What excites me about ' +
      (company ? company.value : 'your company') + ' is that ' +
      (why ? why.value : 'you solve real-world problems with data-driven solutions') + '.',
    '',
    'I am confident that my DataMites training, project experience, and passion ' +
      'for Data Science make me a strong candidate. I am eager to contribute to ' +
      'your team and grow as a DS professional.',
    '',
    'I have attached my resume and GitHub portfolio for your review. ' +
      'I would love the opportunity to discuss how I can contribute to your team.',
    '',
    'Thank you for your time and consideration.',
    '',
    'Warm regards,',
    (r.name || 'Vasavi'),
    (r.email || ''),
    (r.phone || ''),
    (r.linkedin || '')
  ].join('\n');

  if (!window.AppState.resume) window.AppState.resume = {};
  window.AppState.resume.coverLetter = letter;
  saveData();

  var output = document.getElementById('cl-output');
  var card   = document.getElementById('cl-output-card');
  if (output) output.textContent = letter;
  if (card)   card.style.display = '';
}

function copyCoverLetter() {
  var letter = (window.AppState.resume || {}).coverLetter || '';
  navigator.clipboard.writeText(letter).then(function() {
    alert('Cover letter copied! Paste it anywhere.');
  }).catch(function() {
    alert('Please select the text manually and copy.');
  });
}

console.log('resume.js loaded OK');