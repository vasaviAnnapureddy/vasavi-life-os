/* ============================================
   VASAVI'S LIFE OS - INTERVIEW QUESTIONS DATA
   data/interview_qs.js
   ============================================ */

var INTERVIEW_QS = [

  /* ---- PYTHON ---- */
  { cat: 'Python', q: 'What is the difference between list, tuple, set, and dict?' },
  { cat: 'Python', q: 'Explain *args and **kwargs with a code example.' },
  { cat: 'Python', q: 'What is list comprehension? When to use it vs a for loop?' },
  { cat: 'Python', q: 'What is a lambda function? Write an example.' },
  { cat: 'Python', q: 'What is the difference between deep copy and shallow copy?' },
  { cat: 'Python', q: 'Explain OOP in Python. What are the 4 principles?' },
  { cat: 'Python', q: 'What are decorators in Python? How do they work?' },
  { cat: 'Python', q: 'What is the difference between == and is?' },
  { cat: 'Python', q: 'What is a generator? When would you use one?' },
  { cat: 'Python', q: 'How does exception handling work? Explain try, except, finally.' },

  /* ---- STATISTICS ---- */
  { cat: 'Statistics', q: 'What is p-value? What does p less than 0.05 mean?' },
  { cat: 'Statistics', q: 'What is the difference between Type I and Type II errors?' },
  { cat: 'Statistics', q: 'Explain the Central Limit Theorem in simple words.' },
  { cat: 'Statistics', q: 'What is the difference between correlation and causation?' },
  { cat: 'Statistics', q: 'What is a confidence interval? What does 95% CI mean?' },
  { cat: 'Statistics', q: 'What are the properties of a normal distribution?' },
  { cat: 'Statistics', q: 'Walk me through the steps of hypothesis testing.' },
  { cat: 'Statistics', q: 'What is the difference between standard deviation and variance?' },

  /* ---- MACHINE LEARNING ---- */
  { cat: 'ML', q: 'Explain the bias-variance tradeoff with an example.' },
  { cat: 'ML', q: 'How does Random Forest reduce overfitting vs a single Decision Tree?' },
  { cat: 'ML', q: 'What is the difference between bagging and boosting?' },
  { cat: 'ML', q: 'When would you use XGBoost over Random Forest?' },
  { cat: 'ML', q: 'What is the difference between precision and recall? When does each matter?' },
  { cat: 'ML', q: 'What is cross-validation and why do we use it?' },
  { cat: 'ML', q: 'How do you handle an imbalanced dataset? List 3 methods.' },
  { cat: 'ML', q: 'What is the difference between L1 and L2 regularization?' },
  { cat: 'ML', q: 'What is the curse of dimensionality?' },
  { cat: 'ML', q: 'How does PCA work? What does explained variance mean?' },
  { cat: 'ML', q: 'What is feature importance? How is it calculated in Random Forest?' },
  { cat: 'ML', q: 'Explain the confusion matrix. What are all 4 quadrants?' },
  { cat: 'ML', q: 'How do you detect and prevent overfitting?' },
  { cat: 'ML', q: 'Explain gradient descent intuitively.' },
  { cat: 'ML', q: 'What is the difference between supervised, unsupervised, and reinforcement learning?' },

  /* ---- PANDAS ---- */
  { cat: 'Pandas', q: 'How do you handle missing values in Pandas? List all methods.' },
  { cat: 'Pandas', q: 'What is the difference between loc and iloc? Give examples.' },
  { cat: 'Pandas', q: 'Explain groupby().agg() with a real use case.' },
  { cat: 'Pandas', q: 'How do you merge two DataFrames? What are the merge types?' },
  { cat: 'Pandas', q: 'What is broadcasting in NumPy? Give an example.' },
  { cat: 'Pandas', q: 'How do you detect and remove outliers in Pandas?' },
  { cat: 'Pandas', q: 'What is the difference between apply(), map(), and applymap()?' },

  /* ---- SQL ---- */
  { cat: 'SQL', q: 'What is the difference between WHERE and HAVING?' },
  { cat: 'SQL', q: 'Explain window functions. Give examples of RANK, ROW_NUMBER, LAG.' },
  { cat: 'SQL', q: 'Explain all types of JOINs with examples.' },
  { cat: 'SQL', q: 'What is a CTE? When do you use it instead of a subquery?' },
  { cat: 'SQL', q: 'How do you find duplicate records in SQL?' },
  { cat: 'SQL', q: 'What is the difference between RANK, DENSE_RANK, and ROW_NUMBER?' }

];

console.log('interview_qs.js loaded OK - ' + INTERVIEW_QS.length + ' questions ready');