/* ============================================
   VASAVI'S LIFE OS - BANGALORE DS/AI JOBS LIST
   data/jobs_list.js
   ============================================ */

var BANGALORE_JOBS = [

  /* ---- TIER 1 - DREAM COMPANIES ---- */
  {
    company: 'Flipkart',
    role:    'Data Scientist',
    link:    'https://www.flipkartcareers.com',
    tier:    'Tier 1',
    note:    'Strong DS team. Good for freshers with projects.'
  },
  {
    company: 'Swiggy',
    role:    'Data Analyst',
    link:    'https://careers.swiggy.com',
    tier:    'Tier 1',
    note:    'Food delivery data. Great EDA and ML use cases.'
  },
  {
    company: 'Zepto',
    role:    'Data Scientist',
    link:    'https://www.zepto.com/careers',
    tier:    'Tier 1',
    note:    'Fast growing startup. Loves freshers with strong projects.'
  },
  {
    company: 'Razorpay',
    role:    'Data Analyst',
    link:    'https://razorpay.com/jobs',
    tier:    'Tier 1',
    note:    'Fintech DS roles. SQL skills very important here.'
  },
  {
    company: 'PhonePe',
    role:    'Data Scientist',
    link:    'https://www.phonepe.com/en/careers.html',
    tier:    'Tier 1',
    note:    'Payments data. Python and ML focus.'
  },
  {
    company: 'CRED',
    role:    'Data Scientist',
    link:    'https://careers.cred.club',
    tier:    'Tier 1',
    note:    'Premium fintech. Strong analytics culture.'
  },
  {
    company: 'Meesho',
    role:    'Data Analyst',
    link:    'https://meesho.io/jobs',
    tier:    'Tier 1',
    note:    'E-commerce. Good entry point for freshers.'
  },

  /* ---- TIER 2 - GREAT COMPANIES ---- */
  {
    company: 'Fractal Analytics',
    role:    'Data Scientist',
    link:    'https://fractal.ai/careers',
    tier:    'Tier 2',
    note:    'Pure DS firm. Best place to learn DS in depth.'
  },
  {
    company: 'Mu Sigma',
    role:    'Trainee Decision Scientist',
    link:    'https://www.mu-sigma.com/careers',
    tier:    'Tier 2',
    note:    'Hires freshers regularly. Good training program.'
  },
  {
    company: 'Tiger Analytics',
    role:    'Data Analyst',
    link:    'https://www.tigeranalytics.com/careers',
    tier:    'Tier 2',
    note:    'Analytics consulting. DataMites background is great fit.'
  },
  {
    company: 'Absolutdata',
    role:    'Data Scientist',
    link:    'https://absolutdata.com/careers',
    tier:    'Tier 2',
    note:    'Analytics firm. Good for freshers.'
  },
  {
    company: 'Latentview Analytics',
    role:    'Data Analyst',
    link:    'https://www.latentview.com/careers',
    tier:    'Tier 2',
    note:    'Strong analytics company in Chennai and Bangalore.'
  },
  {
    company: 'MathCo',
    role:    'Junior Data Scientist',
    link:    'https://themathcompany.com/careers',
    tier:    'Tier 2',
    note:    'Decision science focus. Fresher friendly.'
  },

  /* ---- MNCS ---- */
  {
    company: 'IBM India',
    role:    'Data Scientist',
    link:    'https://careers.ibm.com',
    tier:    'MNC',
    note:    'Large DS team. Good learning environment.'
  },
  {
    company: 'Accenture AI',
    role:    'Data and AI Analyst',
    link:    'https://www.accenture.com/in-en/careers',
    tier:    'MNC',
    note:    'Hires many DS freshers. Apply to AI and Analytics track.'
  },
  {
    company: 'Capgemini',
    role:    'Data Engineer',
    link:    'https://www.capgemini.com/in-en/careers',
    tier:    'MNC',
    note:    'Large intake. Good for entry level.'
  },
  {
    company: 'Wipro HOLMES',
    role:    'AI Engineer',
    link:    'https://careers.wipro.com',
    tier:    'MNC',
    note:    'AI division of Wipro. Growing team.'
  },
  {
    company: 'TCS iON',
    role:    'Data Analyst',
    link:    'https://ionixx.com/careers',
    tier:    'MNC',
    note:    'TCS analytics division. Stable and structured.'
  },

  /* ---- JOB PORTALS ---- */
  {
    company: 'LinkedIn Jobs',
    role:    'Search: Data Scientist Bangalore fresher',
    link:    'https://linkedin.com/jobs',
    tier:    'Portal',
    note:    'Set job alerts daily. Apply within 24 hrs of posting.'
  },
  {
    company: 'Naukri',
    role:    'Search: DS ML Bangalore 0-2 yrs',
    link:    'https://naukri.com',
    tier:    'Portal',
    note:    'Set job alert. Most Indian companies post here.'
  },
  {
    company: 'Instahyre',
    role:    'Multiple DS roles',
    link:    'https://instahyre.com',
    tier:    'Portal',
    note:    'Startup focused. Great for freshers. Apply here first.'
  },
  {
    company: 'Wellfound - AngelList',
    role:    'Startup DS roles',
    link:    'https://wellfound.com/jobs',
    tier:    'Portal',
    note:    'Best for DS roles at funded startups.'
  },
  {
    company: 'Cutshort',
    role:    'DS and ML roles',
    link:    'https://cutshort.io',
    tier:    'Portal',
    note:    'Tech focused. Startup friendly. Good matches.'
  },
  {
    company: 'IIMJobs',
    role:    'Analytics and DS roles',
    link:    'https://iimjobs.com',
    tier:    'Portal',
    note:    'Analytics specific portal. Good quality listings.'
  }

];

/* Weekly job application strategy */
var JOB_STRATEGY = {
  week1: 'Build and polish your DS project on GitHub',
  week2: 'Update LinkedIn profile and resume with project',
  week3: 'Apply to 10 startups per day via Instahyre and Wellfound',
  week4: 'Apply to Tier 2 companies + follow up on applications',
  daily: 'Check LinkedIn Jobs every morning and apply within 1 hour of posting'
};

/* Resume keywords that get past ATS scanners */
var ATS_KEYWORDS = [
  'Python', 'Pandas', 'NumPy', 'Scikit-learn',
  'Machine Learning', 'Deep Learning', 'Neural Networks',
  'Data Analysis', 'Data Visualization', 'Matplotlib', 'Seaborn',
  'SQL', 'MySQL', 'PostgreSQL',
  'PowerBI', 'Tableau',
  'Statistical Analysis', 'Hypothesis Testing',
  'Feature Engineering', 'Model Evaluation',
  'Random Forest', 'XGBoost', 'Linear Regression', 'Logistic Regression',
  'Natural Language Processing', 'NLP', 'Sentiment Analysis',
  'Flask', 'REST API', 'Model Deployment',
  'Git', 'GitHub', 'Version Control',
  'PySpark', 'Big Data',
  'AWS', 'Cloud Computing',
  'TensorFlow', 'Keras', 'CNN', 'ANN',
  'DataMites', 'Certified Data Scientist'
];

console.log('jobs_list.js loaded OK - ' + BANGALORE_JOBS.length + ' companies ready');