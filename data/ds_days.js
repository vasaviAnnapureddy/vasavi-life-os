/* ============================================
   VASAVI'S LIFE OS - 10-DAY DS ROADMAP DATA
   data/ds_days.js
   INTERVIEW-READY VERSION
   Think like Vasavi's mentor who wants her
   to get the job FOR SURE.
   ============================================ */

var DS_DAYS = [

  /* ========== DAY 1 ========== */
  {
    day:  1,
    date: 'Fri Mar 21',
    topic: 'Python Foundations + DS Basics',
    file:  'Python Essentials I / II / III.ipynb',
    goal:  'Be able to write clean Python from scratch. No googling basics in interviews.',

    theory: [
      'Data types: int, float, str, bool, list, tuple, dict, set - differences and when to use each',
      'List vs Tuple vs Set vs Dict: mutability, ordering, duplicates, use cases',
      'Functions: args, *args, **kwargs, default params, lambda, map, filter, zip',
      'OOP: class, object, __init__, inheritance, encapsulation, polymorphism',
      'List comprehensions, dict comprehensions, generator expressions',
      'Exception handling: try/except/finally, custom exceptions',
      'File handling, modules, imports',
      'DS lifecycle: Business problem -> Data -> EDA -> Feature Eng -> Model -> Evaluate -> Deploy',
      'Difference between AI, ML, DL, DS - with real examples',
      'Python memory management: mutable vs immutable, shallow vs deep copy'
    ],

    exercises: [
      '1. Write a function that takes a list of numbers and returns mean, median, mode WITHOUT using statistics library',
      '2. Given a list [1,2,2,3,3,3,4], write a function to find the most frequent element',
      '3. Write a class BankAccount with deposit, withdraw, balance methods. Add validation (no negative balance)',
      '4. Given a string, count frequency of each character using dict comprehension',
      '5. Write a function to check if a string is palindrome (ignore case and spaces)',
      '6. Flatten a nested list [[1,2],[3,[4,5]],6] into [1,2,3,4,5,6] using recursion',
      '7. Write a lambda function to sort a list of tuples by second element',
      '8. Given a list of dicts [{name:A,age:20},{name:B,age:18}], sort by age using lambda',
      '9. Implement a stack using a list with push, pop, peek, is_empty methods',
      '10. Write a function using *args to find sum, min, max of any number of arguments',
      '11. Create a decorator that prints function execution time',
      '12. Given two lists, write a function to return common elements (set intersection)',
      '13. Write a generator function that yields Fibonacci numbers up to n',
      '14. Deep copy vs shallow copy: write code showing the difference with a list of lists',
      '15. Write try/except to handle division by zero, value error, and a custom exception',
      '16. List comprehension: from [1-20] get squares of even numbers greater than 5',
      '17. Write a function to find second largest number in a list without sorting',
      '18. Given a sentence, return word frequency dict sorted by frequency (desc)',
      '19. Implement binary search on a sorted list. Return index or -1',
      '20. Write a class Student with GPA calculation. Raise ValueError if marks < 0 or > 100'
    ],

    test: [
      '1. What is the difference between list and tuple? Give 2 use cases for each.',
      '2. What does *args and **kwargs do? Write example code.',
      '3. What is the output? x=[1,2,3]; y=x; y.append(4); print(x) - explain why.',
      '4. What is a lambda function? Convert this to lambda: def sq(x): return x**2',
      '5. What is the difference between deep copy and shallow copy?',
      '6. What is a generator? How is it different from a list?',
      '7. What are decorators? Write a simple decorator that logs function calls.',
      '8. What is the time complexity of list.append() vs list.insert(0,x)?',
      '9. What is the output? print(type(lambda x:x)) - what type is it?',
      '10. Explain OOP inheritance with a real DS example (Model -> LinearRegression)'
    ],

    practice_links: [
      { label: 'LeetCode Python Easy Set',         url: 'https://leetcode.com/problemset/?difficulty=EASY&topicSlugs=array&languageTags=python3' },
      { label: 'Striver Python Basics Sheet',       url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/' },
      { label: 'HackerRank Python Track',           url: 'https://www.hackerrank.com/domains/python' },
      { label: 'W3Schools Python Quiz',             url: 'https://www.w3schools.com/python/python_quiz.asp' }
    ],

    youtube: [
      { label: 'Python Full Revision - freeCodeCamp',     url: 'https://youtu.be/rfscVS0vtbw' },
      { label: 'OOP in Python - Corey Schafer',           url: 'https://youtu.be/ZDa-Z5JzLYM' },
      { label: 'DS Lifecycle Explained',                   url: 'https://youtu.be/ua-CiDNNj30' }
    ],

    interview_tip: 'Fractal Analytics Round 1 includes Python MCQs + 2 coding questions. They love asking about mutability and OOP. Practice writing classes confidently!'
  },

  /* ========== DAY 2 ========== */
  {
    day:  2,
    date: 'Sat Mar 22',
    topic: 'NumPy + Statistics Essentials',
    file:  'Numpy_Practice_Questions_and_Solution.ipynb',
    goal:  'Understand the math behind DS. Stats is asked in EVERY DS interview.',

    theory: [
      'NumPy arrays vs Python lists: speed, memory, vectorization, broadcasting rules',
      'Array operations: indexing, slicing, boolean masking, fancy indexing',
      'Broadcasting: how shapes align, when it fails, real examples',
      'Statistical measures: mean, median, mode, variance, std dev - formulas + when to use each',
      'Normal distribution: 68-95-99.7 rule, Z-score, standardization vs normalization',
      'Probability basics: conditional probability, Bayes theorem, independence',
      'Hypothesis testing: null/alternate hypothesis, p-value, significance level, Type I/II errors',
      'Central Limit Theorem: what it says, why it matters for DS',
      'Correlation vs covariance: formulas, interpretation, when correlation is misleading',
      'Confidence intervals: what 95% CI means, how to calculate, interpretation'
    ],

    exercises: [
      '1. Create a 4x4 matrix of random integers 1-100. Find row means, column means, overall mean',
      '2. Normalize an array to range [0,1] and also standardize to Z-scores manually',
      '3. Given array [2,4,4,4,5,5,7,9], calculate variance and std dev manually then verify with numpy',
      '4. Broadcasting: add a 1D array [1,2,3] to each row of a 3x3 matrix without loops',
      '5. Boolean masking: from a 20-element array, extract elements > mean and < mean+std',
      '6. Calculate Z-scores for [60,70,80,90,100] - which is most extreme?',
      '7. Simulate 10000 coin flips using numpy. Verify probability of heads is close to 0.5',
      '8. Given heights of 50 people, find what % fall within 1 std dev of mean',
      '9. Calculate correlation between two arrays manually then verify with np.corrcoef',
      '10. Reshape a 1D array of 24 elements into 2x3x4 shape. Explain the shape',
      '11. Stack two 3x3 arrays vertically and horizontally using vstack and hstack',
      '12. Find top 5 elements and bottom 5 elements of an array using np.argsort',
      '13. Simulate rolling a dice 10000 times. Plot frequency of each number',
      '14. Given exam scores, find percentile rank of score 75',
      '15. Calculate 95% confidence interval for a sample mean manually',
      '16. Bayes theorem: P(Disease|Test+) given P(Test+|Disease)=0.99, P(Disease)=0.001, P(Test+)=0.02',
      '17. Two arrays: sales before and after campaign. Do t-test to check if campaign worked',
      '18. Generate 1000 samples from normal distribution. Verify CLT by taking 100 sample means',
      '19. Find eigenvalues and eigenvectors of a 2x2 matrix - relate to PCA concept',
      '20. numpy.where() - replace all values below 0 with 0 in an array (ReLU implementation!)'
    ],

    test: [
      '1. What is broadcasting? When does it fail? Give example.',
      '2. What is the difference between var() with ddof=0 and ddof=1?',
      '3. p-value is 0.03 with significance level 0.05. Do you reject null hypothesis? Why?',
      '4. What is Type I and Type II error? Which is worse for cancer detection?',
      '5. What does it mean if two variables have correlation of -0.95?',
      '6. What is Central Limit Theorem? Why does it matter in DS?',
      '7. Explain Bayes theorem with a medical test example',
      '8. What is the difference between standardization and normalization? When to use each?',
      '9. 95% confidence interval is [45, 55]. What does this mean?',
      '10. What is skewness? How does it affect mean vs median?'
    ],

    practice_links: [
      { label: 'NumPy 100 Exercises (GitHub)',      url: 'https://github.com/rougier/numpy-100' },
      { label: 'Statistics for DS - Khan Academy',  url: 'https://www.khanacademy.org/math/statistics-probability' },
      { label: 'HackerRank Statistics',             url: 'https://www.hackerrank.com/domains/tutorials/10-days-of-statistics' },
      { label: 'StatQuest - All Stats Videos',      url: 'https://www.youtube.com/c/joshstarmer' }
    ],

    youtube: [
      { label: 'NumPy Full Tutorial',               url: 'https://youtu.be/QUT1VHiLmmI' },
      { label: 'Statistics for DS - StatQuest',     url: 'https://youtu.be/xxpc-HPKN28' },
      { label: 'Hypothesis Testing Explained',      url: 'https://youtu.be/0oc49DyA3hU' }
    ],

    interview_tip: 'Stats questions are asked by EVERY company. Fractal specifically asks A/B testing and hypothesis testing. Know p-value cold - interviewers test this!'
  },

  /* ========== DAY 3 ========== */
  {
    day:  3,
    date: 'Sun Mar 23',
    topic: 'REST DAY',
    file:  '',
    goal:  'Rest. Recovery is part of learning. Sleep consolidates everything.',
    theory: [
      'No study today - rest is productive',
      'Sleep consolidates memory - your brain processes Day 1 and Day 2',
      'Optional (10 mins only): re-read your notes from Day 1 and 2',
      'Walk, eat well, spend time with family',
      'Come back strong on Day 4!'
    ],
    exercises: [],
    test: [],
    practice_links: [],
    youtube: [],
    interview_tip: ''
  },

  /* ========== DAY 4 ========== */
  {
    day:  4,
    date: 'Mon Mar 24',
    topic: 'Pandas - Make it Perfect',
    file:  'Pandas assignment.docx + MLA-2 Pandas folder',
    goal:  'Pandas is asked in EVERY DS interview. Be the person who can clean any dataset fast.',

    theory: [
      'Series vs DataFrame: creation, attributes (shape, dtype, index, columns)',
      'Indexing: loc (label), iloc (integer), boolean indexing, .at, .iat',
      'GroupBy: split-apply-combine, agg with multiple functions, transform, filter',
      'Merging: merge (inner/left/right/outer/cross), join, concat with axis and keys',
      'Missing data: isnull, notnull, fillna (value/method/dict), dropna (axis/how/thresh)',
      'Apply/map/applymap: differences, when to use each, lambda with apply',
      'Pivot tables: pivot_table, pivot, melt, stack, unstack',
      'String operations: str.contains, str.split, str.replace, str.extract with regex',
      'Time series: to_datetime, dt accessor, resample, rolling, shift',
      'Performance: vectorization over loops, categorical dtype, chunking large files'
    ],

    exercises: [
      '1. Load Titanic dataset (seaborn.load_dataset). Find % missing per column. Fill Age with median by Pclass',
      '2. GroupBy Pclass: find mean Age, mean Fare, survival rate for each class',
      '3. Merge two DataFrames on common column with all 4 join types. Show difference in row counts',
      '4. Given sales CSV: find top 5 products by revenue for each region using groupby',
      '5. Create pivot table: rows=Month, cols=Category, values=Sales, aggfunc=sum',
      '6. Apply lambda to create new column: classify age as Child/Teen/Adult/Senior',
      '7. String operations: extract domain from email column (split on @)',
      '8. Convert date column to datetime. Extract year, month, day as separate columns',
      '9. Find duplicate rows based on subset of columns. Remove keeping last occurrence',
      '10. Melt a wide dataframe (each month as column) into long format',
      '11. Rolling average: 7-day rolling mean of daily sales. Handle NaN at start',
      '12. MultiIndex: create DataFrame with 2-level index. Access data with xs()',
      '13. Apply custom function row-wise: calculate BMI from height and weight columns',
      '14. Merge DataFrames with different column names using left_on and right_on',
      '15. GroupBy + transform: add column showing each sale as % of that customer total',
      '16. Detect outliers in a column using IQR method. Replace with median',
      '17. Read 1 million row CSV in chunks of 10000. Calculate running total',
      '18. String contains: filter rows where description contains any of [urgent, asap, critical]',
      '19. Correlation matrix: find top 3 most correlated pairs in a dataset',
      '20. Resample daily sales data to weekly and monthly. Compare trends'
    ],

    test: [
      '1. What is difference between loc and iloc? Show with example.',
      '2. How is merge different from join? When would you use concat?',
      '3. What does groupby().transform() do vs groupby().agg()? Show example.',
      '4. How do you handle missing values in Pandas? List all methods and when to use each.',
      '5. What is the difference between apply() and map()? Which is faster?',
      '6. How do you detect and remove duplicate rows?',
      '7. What is a pivot table? Write code to create one.',
      '8. How do you convert a column to datetime? What if formats are mixed?',
      '9. What is the chained assignment warning? How do you avoid it?',
      '10. How would you process a file too large to fit in memory?'
    ],

    practice_links: [
      { label: 'Pandas 100 Exercises (GitHub)',     url: 'https://github.com/ajcr/100-pandas-puzzles' },
      { label: 'Kaggle Pandas Course (Free)',       url: 'https://www.kaggle.com/learn/pandas' },
      { label: 'Real Pandas Interview Questions',   url: 'https://www.interviewquery.com/p/pandas-interview-questions' },
      { label: 'LeetCode SQL+Pandas Problems',      url: 'https://leetcode.com/problemset/?topicSlugs=pandas' }
    ],

    youtube: [
      { label: 'Pandas Full Tutorial - Keith Galli',      url: 'https://youtu.be/vmEHCJofslg' },
      { label: 'Pandas Advanced - Real World Data',       url: 'https://youtu.be/e60ItwlZTKM' },
      { label: 'Pandas GroupBy Masterclass',              url: 'https://youtu.be/txMdrV1Ut64' }
    ],

    interview_tip: 'Tiger Analytics asks you to write Pandas code live. Practice without looking at docs. Know groupby().agg() cold - asked in 80% of DS interviews!'
  },

  /* ========== DAY 5 ========== */
  {
    day:  5,
    date: 'Tue Mar 25',
    topic: 'Data Visualization + EDA + PowerBI',
    file:  'Visualisation Assignment.docx + MLA-3 Data Visualization folder',
    goal:  'EDA is your first job in every DS role. Tell a story with data.',

    theory: [
      'EDA process: shape/dtypes -> missing -> duplicates -> distributions -> correlations -> outliers -> insights',
      'Matplotlib hierarchy: Figure, Axes, plot elements. Subplots, gridspec',
      'Seaborn: statistical plots, hue/size/style parameters, FacetGrid',
      'Chart selection: when to use bar/line/scatter/histogram/boxplot/heatmap/violin',
      'Outlier detection: IQR method, Z-score method, visual methods',
      'Distribution analysis: skewness, kurtosis, normal vs uniform vs bimodal',
      'Correlation: heatmap, pairplot, scatter matrix, Pearson vs Spearman',
      'Time series visualization: trend, seasonality, cyclic, irregular components',
      'PowerBI: loading data, relationships, DAX basics, creating dashboards',
      'Storytelling with data: title-driven chart design, color psychology, chart junk'
    ],

    exercises: [
      '1. Full EDA on Titanic: shape, missing, distributions, survival analysis with 8 charts',
      '2. Full EDA on any sales dataset: monthly trends, top products, regional analysis',
      '3. Create subplot grid 2x3 with: histogram, boxplot, scatter, bar, pie, heatmap',
      '4. Seaborn FacetGrid: show salary distribution by job category and gender',
      '5. Correlation heatmap on Boston Housing: find top 3 features correlated with price',
      '6. Before/after comparison: plot distribution before and after outlier removal',
      '7. Time series plot: plot 2 years of monthly sales with trend line (rolling mean)',
      '8. Boxplot comparison: compare distribution of 5 different features side by side',
      '9. Scatter plot with regression line: matplotlib and seaborn method',
      '10. Animated bar chart: show top 5 products changing over months (optional)',
      '11. Violin plot: compare age distribution by survival in Titanic',
      '12. Heatmap of missing values: use missingno or seaborn to visualize missing patterns',
      '13. Pair plot with hue: Iris dataset - show class separation clearly',
      '14. Detect outliers visually: boxplot + Z-score method + IQR method on same data',
      '15. Dashboard: create a 4-chart summary of any dataset on one figure'
    ],

    test: [
      '1. When would you use a box plot vs histogram? What information does each give?',
      '2. What is EDA and why is it the most important step in DS?',
      '3. How do you detect outliers? Describe both visual and statistical methods.',
      '4. What does a correlation of -0.9 between two variables mean?',
      '5. You see right skewed distribution in your target variable. What do you do?',
      '6. What is a pairplot? When is it useful and when does it fail?',
      '7. How do you handle outliers? Remove, cap, or transform? When to do each?',
      '8. What is the difference between Pearson and Spearman correlation?',
      '9. You find 60% of a feature is missing. What are your options?',
      '10. How would you present EDA findings to a non-technical manager?'
    ],

    practice_links: [
      { label: 'Kaggle EDA Notebooks (Best Examples)',  url: 'https://www.kaggle.com/code?searchQuery=eda+tutorial' },
      { label: 'Matplotlib Cheat Sheet',                url: 'https://matplotlib.org/cheatsheets/' },
      { label: 'Seaborn Gallery',                       url: 'https://seaborn.pydata.org/examples/index.html' },
      { label: 'PowerBI Guided Learning',               url: 'https://learn.microsoft.com/en-us/power-bi/guided-learning/' }
    ],

    youtube: [
      { label: 'EDA Complete Tutorial - Python',        url: 'https://youtu.be/xi0vhXFPegw' },
      { label: 'Matplotlib Full Course',                url: 'https://youtu.be/a9UrKTVEeZA' },
      { label: 'PowerBI Full Course - Chandoo',         url: 'https://youtu.be/AGrl-H87pRU' }
    ],

    interview_tip: 'Latentview and Mu Sigma give case studies: "Here is a dataset, tell me insights in 30 mins." EDA speed matters. Practice on at least 5 different datasets!'
  },

  /* ========== DAY 6 ========== */
  {
    day:  6,
    date: 'Wed Mar 26',
    topic: 'SQL + Database Management',
    file:  'orders.csv + SQl_content.pdf + Document_DB.pdf',
    goal:  'SQL is tested in 95% of DS interviews. Be faster than the interviewer expects.',

    theory: [
      'SQL execution order: FROM -> JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT',
      'JOINs: INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF - with Venn diagrams mentally',
      'Aggregations: COUNT, SUM, AVG, MIN, MAX with GROUP BY, HAVING vs WHERE',
      'Subqueries: correlated vs non-correlated, scalar vs table subqueries',
      'CTEs: WITH clause, recursive CTEs, when to use vs subquery',
      'Window functions: RANK, DENSE_RANK, ROW_NUMBER, NTILE, LAG, LEAD, FIRST_VALUE, LAST_VALUE',
      'PARTITION BY vs GROUP BY: key difference with examples',
      'String functions: CONCAT, SUBSTRING, LIKE, REGEXP, TRIM, UPPER, LOWER',
      'Date functions: DATEPART, DATEDIFF, DATE_FORMAT, NOW, TIMESTAMPDIFF',
      'Query optimization: indexes, EXPLAIN plan, avoiding SELECT *, avoiding functions on indexed cols'
    ],

    exercises: [
      '1. Find second highest salary without using LIMIT (use subquery)',
      '2. Find employees who earn more than their manager (self join)',
      '3. Find departments with more than 5 employees and avg salary > 50000',
      '4. Find customers who placed orders in BOTH Jan and Feb 2025',
      '5. Find customers who placed orders in Jan but NOT in Feb (use EXCEPT or NOT IN)',
      '6. Running total of sales by date using window function SUM() OVER (ORDER BY date)',
      '7. Rank employees by salary within each department (RANK vs DENSE_RANK vs ROW_NUMBER)',
      '8. Find the 3rd order for each customer using ROW_NUMBER()',
      '9. Previous month sales comparison: use LAG() to show MoM change',
      '10. Find duplicate emails in users table - multiple approaches',
      '11. Find all employees who have never placed an order (LEFT JOIN + IS NULL)',
      '12. Monthly cohort retention: users who signed up in Jan, how many still active in Feb, Mar?',
      '13. Find products never ordered (NOT EXISTS vs NOT IN - explain difference)',
      '14. Rolling 7-day average of daily sales using window function',
      '15. Pivot: convert rows (Jan, Feb, Mar) to columns using CASE WHEN',
      '16. Find customers whose every order is above average order value (ALL operator)',
      '17. Find top 3 selling products per category (ROW_NUMBER with PARTITION BY)',
      '18. Gap analysis: find dates with no sales from a calendar table',
      '19. Calculate customer lifetime value: total spend per customer, avg order, first/last order date',
      '20. Slow query: rewrite this query to use index efficiently (EXPLAIN before/after)'
    ],

    test: [
      '1. What is the difference between WHERE and HAVING? Write example showing both.',
      '2. Explain all types of JOINs. Which is most commonly used in analytics?',
      '3. What is a CTE? When would you use it instead of a subquery?',
      '4. What is RANK vs DENSE_RANK vs ROW_NUMBER? Give example where they differ.',
      '5. Write SQL to find Nth highest salary.',
      '6. What is a correlated subquery? How is it different from a regular subquery?',
      '7. How do you optimize a slow SQL query? List 5 techniques.',
      '8. What is PARTITION BY? How is it different from GROUP BY?',
      '9. Write SQL to find customers with more than 3 orders in last 30 days.',
      '10. What is the difference between DELETE, TRUNCATE, and DROP?'
    ],

    practice_links: [
      { label: 'LeetCode SQL Problems (Must Do!)',   url: 'https://leetcode.com/problemset/?topicSlugs=database' },
      { label: 'SQLZoo Interactive Practice',        url: 'https://sqlzoo.net/wiki/SQL_Tutorial' },
      { label: 'Mode Analytics SQL Tutorial',        url: 'https://mode.com/sql-tutorial/' },
      { label: 'StrataScratch SQL Interview Qs',     url: 'https://www.stratascratch.com/blog/sql-interview-questions/' }
    ],

    youtube: [
      { label: 'SQL Full Course - Mosh',            url: 'https://youtu.be/7S_tz1z_5bA' },
      { label: 'Window Functions Masterclass',       url: 'https://youtu.be/H6OTMoXjNEs' },
      { label: 'SQL Interview Questions - Alex',     url: 'https://youtu.be/HXV3zeQKqGY' }
    ],

    interview_tip: 'Latentview SQL round has 5 questions in 30 mins. LeetCode SQL problems are EXACTLY what they ask. Do the top 50 SQL problems on LeetCode before your interview!'
  },

  /* ========== DAY 7 ========== */
  {
    day:  7,
    date: 'Thu Mar 27',
    topic: 'ML - Regression + Classification',
    file:  'MLA-4 Linear Regression + MLA-5 Logistic Regression + MLE-1 KNN + MLE-5 Naive Bayes',
    goal:  'Understand the math, code the models, interpret the results. Interviewers test all 3.',

    theory: [
      'Linear Regression: OLS derivation, cost function, gradient descent, R2, MSE, RMSE, MAE, assumptions (LINE)',
      'Regularization: L1 (Lasso - feature selection), L2 (Ridge - shrinks coefs), ElasticNet, when to use each',
      'Logistic Regression: sigmoid function, log loss, decision boundary, why not linear regression for classification',
      'Confusion matrix: TP/FP/TN/FN, precision, recall, F1, F-beta, accuracy - when each matters',
      'ROC-AUC: what it measures, how to interpret, AUC=0.5 means random, AUC=1 means perfect',
      'Threshold selection: default 0.5 vs optimal threshold, precision-recall tradeoff',
      'KNN: distance metrics (Euclidean, Manhattan, Minkowski), K selection, curse of dimensionality',
      'Naive Bayes: Bayes theorem application, conditional independence assumption, types (Gaussian/Multinomial/Bernoulli)',
      'SVM: hyperplane, margin maximization, support vectors, kernel trick (linear/poly/RBF)',
      'Bias-variance tradeoff: underfitting vs overfitting, learning curves, validation curves'
    ],

    exercises: [
      '1. Linear regression from scratch: implement using numpy (no sklearn). Compare with sklearn.',
      '2. Boston housing: train linear regression, check all assumptions, fix violations',
      '3. Polynomial regression: overfit degree 15, then regularize with Ridge and Lasso. Compare R2',
      '4. Logistic regression on Titanic: full pipeline from EDA to model to metrics',
      '5. Plot precision-recall curve and ROC curve for Titanic model. Find optimal threshold',
      '6. KNN from scratch: implement predict function using euclidean distance. Compare sklearn',
      '7. KNN: try K from 1 to 20, plot train vs test accuracy. Find optimal K',
      '8. Naive Bayes: text classification - classify emails as spam/not spam using MultinomialNB',
      '9. Compare all 5 classifiers (LR, KNN, NB, SVM, DT) on same dataset. Plot comparison',
      '10. Handle class imbalance: try SMOTE, class_weight, threshold tuning. Compare F1 scores',
      '11. Feature scaling: show effect of NOT scaling on KNN vs Logistic Regression',
      '12. Confusion matrix visualization: plot with seaborn heatmap, label all 4 quadrants',
      '13. Learning curve: plot train vs validation score as training size increases',
      '14. Cross-validation: compare k-fold vs stratified k-fold on imbalanced dataset',
      '15. Ridge vs Lasso: show which features get zeroed out with Lasso (feature selection)',
      '16. SVM with different kernels: linear, poly, RBF on non-linearly separable data',
      '17. Multiclass classification: One-vs-Rest vs Softmax. Use iris dataset',
      '18. Calibration curve: check if model probabilities are well-calibrated',
      '19. Feature importance from logistic regression: use coefficients to rank features',
      '20. Build end-to-end pipeline: Pipeline([scaler, pca, model]) with GridSearchCV'
    ],

    test: [
      '1. Explain bias-variance tradeoff. Draw the curve. Where is underfitting and overfitting?',
      '2. What is the difference between L1 and L2 regularization? When to use each?',
      '3. Your model has 95% accuracy on imbalanced data (5% positive class). Is this good?',
      '4. Precision=0.9, Recall=0.3. What does this mean? How would you improve recall?',
      '5. When would you use AUC-ROC vs F1 score as your evaluation metric?',
      '6. Why can you not use linear regression for classification?',
      '7. What is the kernel trick in SVM? Why is it needed?',
      '8. What is the curse of dimensionality? How does it affect KNN?',
      '9. Your logistic regression is overfitting. List 5 ways to fix it.',
      '10. What is cross-validation? Why do we need it? Explain k-fold.'
    ],

    practice_links: [
      { label: 'Kaggle ML Course (Free)',            url: 'https://www.kaggle.com/learn/intro-to-machine-learning' },
      { label: 'StatQuest ML Playlist',              url: 'https://youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF' },
      { label: 'ML Interview Questions - Exponent',  url: 'https://www.tryexponent.com/practice/prepare/ml-interview-questions' },
      { label: 'Scikit-learn User Guide',            url: 'https://scikit-learn.org/stable/user_guide.html' }
    ],

    youtube: [
      { label: 'Linear Regression Math - StatQuest', url: 'https://youtu.be/PaFPbb66DxQ' },
      { label: 'Logistic Regression - StatQuest',    url: 'https://youtu.be/yIYKR4sgzI8' },
      { label: 'ROC and AUC - StatQuest',            url: 'https://youtu.be/4jRBRDbJemM' }
    ],

    interview_tip: 'Fractal asks: "Set up an A/B test for this feature." Know hypothesis testing AND ML evaluation metrics. IBM asks precision vs recall for medical diagnosis - know the answer cold!'
  },

  /* ========== DAY 8 ========== */
  {
    day:  8,
    date: 'Fri Mar 28',
    topic: 'Advanced ML - Trees + Clustering + Feature Engineering',
    file:  'MLE-3 Feature Engineering + MLE-4 Dimensionality Reduction + MLE-6 Tree algorithms + MLA-6 KMeans + DBSCAN',
    goal:  'Tree models are in 70% of winning Kaggle solutions. Master them.',

    theory: [
      'Decision Tree: Gini impurity vs entropy, information gain, max_depth, min_samples, pruning',
      'Random Forest: bagging concept, how it reduces variance, OOB score, feature importance',
      'Gradient Boosting: boosting concept, learning rate, n_estimators, additive model',
      'XGBoost: improvements over GBM, regularization (lambda/alpha), tree pruning, parallel processing',
      'LightGBM vs XGBoost: leaf-wise vs level-wise, speed differences, when to use each',
      'KMeans: algorithm steps, inertia, elbow method, silhouette score, limitations, initialization',
      'DBSCAN: density-based, epsilon and min_samples, noise points, shape-independent clustering',
      'Feature Engineering: polynomial features, binning, target encoding, frequency encoding',
      'Feature Selection: correlation filter, mutual information, RFE, L1 regularization',
      'PCA: variance explained, choosing n_components, when NOT to use PCA, vs LDA'
    ],

    exercises: [
      '1. Decision tree on Titanic: visualize the tree, explain each split decision',
      '2. Show overfitting in DT: max_depth=None vs max_depth=3. Compare train/test accuracy',
      '3. Random Forest: feature importance plot for Boston Housing. Top 5 features?',
      '4. XGBoost on customer churn: tune n_estimators, learning_rate, max_depth with GridSearch',
      '5. Compare RF vs XGBoost vs LightGBM on same dataset. Speed and accuracy comparison',
      '6. KMeans on customer spending data: elbow method, silhouette score, interpret clusters',
      '7. DBSCAN on 2D data with irregular shapes: compare with KMeans. Which is better?',
      '8. Feature engineering: create 5 new features for Titanic that improve model accuracy',
      '9. Target encoding vs one-hot encoding: compare effect on tree model performance',
      '10. PCA: reduce 10-feature dataset to 2D, plot with class labels, check explained variance',
      '11. RFE (Recursive Feature Elimination): find optimal number of features for logistic regression',
      '12. SHAP values: explain individual predictions of your XGBoost model',
      '13. Bagging from scratch: implement using bootstrap sampling + aggregation',
      '14. Hyperparameter tuning: RandomSearchCV vs GridSearchCV - compare speed and results',
      '15. Early stopping in XGBoost: implement with eval_set to prevent overfitting',
      '16. Handle imbalanced data in Random Forest: class_weight vs SMOTE',
      '17. Clustering evaluation: silhouette plot for KMeans with different K values',
      '18. t-SNE visualization: plot high-dimensional data in 2D. Compare with PCA',
      '19. Feature importance comparison: MDI, permutation importance, SHAP - are they consistent?',
      '20. Stacking ensemble: combine RF + XGBoost + LR as base models with meta-learner'
    ],

    test: [
      '1. What is the difference between bagging and boosting? Give example of each.',
      '2. Why does Random Forest reduce variance compared to a single decision tree?',
      '3. XGBoost vs Random Forest: when would you choose one over the other?',
      '4. How do you select the optimal number of clusters in KMeans?',
      '5. What is the curse of dimensionality? How does PCA help?',
      '6. What is feature importance in Random Forest? How is it calculated?',
      '7. What is Gini impurity? How is it used in decision trees?',
      '8. DBSCAN vs KMeans: what are the advantages of DBSCAN?',
      '9. What is regularization in XGBoost? What parameters control it?',
      '10. How do you handle categorical variables in tree-based models?'
    ],

    practice_links: [
      { label: 'Kaggle ML Intermediate Course',     url: 'https://www.kaggle.com/learn/intermediate-machine-learning' },
      { label: 'XGBoost Documentation',             url: 'https://xgboost.readthedocs.io/en/stable/' },
      { label: 'Striver ML Sheet',                  url: 'https://takeuforward.org/' },
      { label: 'SHAP Documentation',                url: 'https://shap.readthedocs.io/en/latest/' }
    ],

    youtube: [
      { label: 'Random Forest Explained - StatQuest', url: 'https://youtu.be/J4Wdy0Wc_xQ' },
      { label: 'XGBoost Explained - StatQuest',      url: 'https://youtu.be/OtD8wVaFm6E' },
      { label: 'KMeans Clustering - StatQuest',      url: 'https://youtu.be/4b5d3muPQmA' }
    ],

    interview_tip: 'Fractal asks: "You have XGBoost and RF on same data. XGBoost scores better on train, worse on test. What is happening?" Know overfitting in ensemble models!'
  },

  /* ========== DAY 9 ========== */
  {
    day:  9,
    date: 'Sat Mar 29',
    topic: 'Deep Learning + NLP + Time Series',
    file:  'Churn_Modelling.csv + ADS-2 ANN + ADS-3 CNN + ADS-5 Sentiment Analysis + ADS-1 Time Series',
    goal:  'Basic DL/NLP knowledge separates you from most freshers. Know the concepts deeply.',

    theory: [
      'ANN: forward propagation, activation functions (ReLU/sigmoid/tanh/softmax), backpropagation derivation',
      'Optimizers: SGD, Adam, RMSprop - how they work, when to use each',
      'Regularization in DL: dropout, batch normalization, early stopping, L1/L2',
      'CNN: convolution operation, padding, stride, pooling, receptive field, feature maps',
      'Transfer learning: pretrained models (VGG, ResNet, BERT), fine-tuning vs feature extraction',
      'NLP preprocessing: tokenization, stopwords, stemming vs lemmatization, TF-IDF, word embeddings',
      'Word2Vec: CBOW vs Skip-gram, why embeddings capture semantic meaning',
      'Transformer basics: attention mechanism intuition, BERT for classification tasks',
      'Time Series: trend, seasonality, cyclic, irregular; stationarity test (ADF test)',
      'ARIMA: AR (autoregression), I (differencing), MA (moving average), ACF/PACF plots'
    ],

    exercises: [
      '1. ANN on Churn_Modelling.csv: build, compile, train. Get >82% accuracy',
      '2. Visualize training history: plot train vs validation loss and accuracy',
      '3. Tune ANN: try different architectures (neurons, layers). Which performs best?',
      '4. Dropout experiment: add dropout 0.2, 0.5 - effect on overfitting?',
      '5. CNN on MNIST: build LeNet-like architecture. Visualize filters and feature maps',
      '6. Transfer learning: use pretrained MobileNet for binary image classification',
      '7. NLP preprocessing pipeline: tokenize, remove stopwords, stem, vectorize with TF-IDF',
      '8. Sentiment analysis: train on IMDB reviews. Compare TF-IDF+LR vs LSTM',
      '9. Word2Vec: train on your corpus. Find 5 words similar to "data"',
      '10. Time series: decompose monthly airline data into trend+seasonal+residual',
      '11. Stationarity test: ADF test on stock prices. Make stationary by differencing',
      '12. ARIMA on your expense data from this OS: forecast next 3 months',
      '13. Batch normalization: add to ANN and compare training speed',
      '14. BERT fine-tuning: sentiment classification on small dataset using HuggingFace',
      '15. Regularization comparison: L1 vs L2 vs Dropout on same ANN task'
    ],

    test: [
      '1. What is backpropagation? Explain in simple words, no math jargon.',
      '2. Why ReLU instead of sigmoid in hidden layers? What is vanishing gradient?',
      '3. What is the difference between CNN and regular ANN? Why is CNN better for images?',
      '4. What is TF-IDF? How is it calculated? What are its limitations?',
      '5. What is transfer learning? Why is it useful for freshers with limited data?',
      '6. What is stationarity in time series? How do you test for it?',
      '7. What is attention mechanism? Explain intuitively why it works.',
      '8. Dropout is 0.5 during training. What happens during inference?',
      '9. What is the difference between ARIMA and LSTM for time series?',
      '10. You have 100 training samples for image classification. What approach would you use?'
    ],

    practice_links: [
      { label: 'Fast.ai Deep Learning Course (Free)',  url: 'https://course.fast.ai/' },
      { label: 'Kaggle NLP Course (Free)',             url: 'https://www.kaggle.com/learn/natural-language-processing' },
      { label: 'HuggingFace NLP Course',               url: 'https://huggingface.co/course/chapter1' },
      { label: 'Time Series Forecasting - Kaggle',     url: 'https://www.kaggle.com/learn/time-series' }
    ],

    youtube: [
      { label: 'Neural Networks from Scratch - 3B1B', url: 'https://youtu.be/aircAruvnKk' },
      { label: 'NLP Zero to Hero - TensorFlow',       url: 'https://youtu.be/fNxaJsNG3-s' },
      { label: 'Time Series with Python - Rob Mulla',  url: 'https://youtu.be/e8Yw4alG16Q' }
    ],

    interview_tip: 'Most fresher DS interviews ask basic DL questions, not advanced ones. Know: backprop in simple words, ReLU vs sigmoid, why CNN for images. Practice explaining to a 10-year-old!'
  },

  /* ========== DAY 10 ========== */
  {
    day:  10,
    date: 'Mon Mar 31',
    topic: 'Deployment + BigData + Git + FULL MOCK INTERVIEW',
    file:  'ADS-4 Flask + ADS-4b AWS + Big Data PySpark files + Version_Control.pdf',
    goal:  'This is your last day. After this you apply with confidence. No more preparing, start applying!',

    theory: [
      'Flask: routes, HTTP methods, request/response, jsonify, model serialization with pickle/joblib',
      'Model deployment pipeline: train -> save -> load -> API -> predict -> return JSON',
      'Docker basics: container, image, Dockerfile, why containerize ML models',
      'AWS for DS: S3 (data storage), EC2 (compute), SageMaker (managed ML), Lambda (serverless)',
      'PySpark: RDD vs DataFrame, transformations vs actions, lazy evaluation, DAG',
      'PySpark MLlib: VectorAssembler, Pipeline, CrossValidator, same API as sklearn',
      'Git workflow: init, add, commit, push, pull, branch, merge, pull request, .gitignore',
      'GitHub for DS: good README structure, Jupyter notebooks on GitHub, GitHub Pages',
      'MLOps basics: model versioning, data versioning (DVC), model monitoring, drift detection',
      'REST API design: endpoints, status codes, authentication basics, Postman testing'
    ],

    exercises: [
      '1. Wrap your best model in Flask API: /predict endpoint, POST request, return JSON',
      '2. Test your API with Postman or requests library. Handle edge cases',
      '3. Serialize model with pickle AND joblib. Load and predict. Compare file sizes',
      '4. Create a simple web interface (HTML form) that calls your Flask API',
      '5. Write a Dockerfile for your Flask app. Build and run the container',
      '6. Push complete project to GitHub with professional README (problem, data, method, results)',
      '7. PySpark: load bank.csv, run basic transformations, groupby, filter operations',
      '8. PySpark MLlib: train Random Forest classifier, evaluate with CrossValidator',
      '9. Git workflow: create branch, make changes, merge back to main, resolve conflict',
      '10. AWS S3: upload your dataset to S3, load from S3 into Pandas (using boto3)',
      '11. Lambda function: create a simple serverless prediction endpoint on AWS',
      '12. Model monitoring: detect data drift in input features over time',
      '13. Requirements.txt: create for your project with pinned versions',
      '14. Environment setup: create conda/venv environment, document setup instructions',
      '15. Do your FULL MOCK INTERVIEW: 10 random questions, 20 mins, answer out loud'
    ],

    test: [
      '1. What is a REST API? Explain GET vs POST vs PUT vs DELETE.',
      '2. How do you save and load a trained ML model? What formats can you use?',
      '3. What is Docker? Why would you containerize a DS application?',
      '4. What is the difference between git commit and git push?',
      '5. What is lazy evaluation in PySpark? Why is it beneficial?',
      '6. What AWS services would you use for a DS project? Explain each.',
      '7. What is model drift? How would you detect it in production?',
      '8. Difference between RDD and DataFrame in PySpark?',
      '9. How would you deploy a model that needs to handle 1000 requests per second?',
      '10. Walk me through deploying your project end-to-end from laptop to production.'
    ],

    practice_links: [
      { label: 'Flask Mega Tutorial - Miguel Grinberg', url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world' },
      { label: 'Deploy ML Model - Towards DS',          url: 'https://towardsdatascience.com/deploy-machine-learning-model-using-flask-134951399ae3' },
      { label: 'Git Tutorial - Atlassian',              url: 'https://www.atlassian.com/git/tutorials' },
      { label: 'PySpark Tutorial - Databricks',         url: 'https://spark.apache.org/docs/latest/api/python/getting_started/index.html' }
    ],

    youtube: [
      { label: 'Flask ML Deployment Complete',          url: 'https://youtu.be/UbCWoMf80PY' },
      { label: 'Git and GitHub Full Course',            url: 'https://youtu.be/RGOj5yH7evk' },
      { label: 'PySpark Tutorial - Frank Kane',         url: 'https://youtu.be/IQfG0faDrzE' }
    ],

    interview_tip: 'After Day 10: STOP preparing, START applying. Your project + 10 days of this = better than 90% of applicants. Apply to 10 companies TODAY. The job comes from applying, not more studying!'
  }
];

console.log('ds_days.js loaded OK - ' + DS_DAYS.length + ' days ready - INTERVIEW VERSION');