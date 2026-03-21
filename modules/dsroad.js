/* ============================================
   VASAVI'S LIFE OS - 10-DAY DS ROADMAP MODULE
   modules/dsroad.js
   ============================================ */

/* ============================================
   INTERVIEW QUESTIONS — 20-30 per day
   Most-asked in DS/AI interviews + coding rounds
   Direct links. Complete these = interview-ready.
   Resources & YouTube = bonus for free time.
   ============================================ */
var DS_INTERVIEW_QS = {

  1: { /* Python */
    title: 'Python — Most Asked in Interviews',
    note:  'These exact questions appear in Fractal, Tiger, Mu Sigma rounds.',
    qs: [
      { q: 'Two Sum',                              url: 'https://leetcode.com/problems/two-sum/',                               tag: 'Easy'   },
      { q: 'Valid Palindrome',                     url: 'https://leetcode.com/problems/valid-palindrome/',                     tag: 'Easy'   },
      { q: 'Reverse String',                       url: 'https://leetcode.com/problems/reverse-string/',                       tag: 'Easy'   },
      { q: 'Contains Duplicate',                   url: 'https://leetcode.com/problems/contains-duplicate/',                   tag: 'Easy'   },
      { q: 'FizzBuzz',                             url: 'https://leetcode.com/problems/fizz-buzz/',                            tag: 'Easy'   },
      { q: 'Maximum Subarray (Kadane)',             url: 'https://leetcode.com/problems/maximum-subarray/',                     tag: 'Medium' },
      { q: 'Find the Duplicate Number',            url: 'https://leetcode.com/problems/find-the-duplicate-number/',            tag: 'Medium' },
      { q: 'Group Anagrams',                       url: 'https://leetcode.com/problems/group-anagrams/',                       tag: 'Medium' },
      { q: 'Best Time to Buy and Sell Stock',      url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',      tag: 'Easy'   },
      { q: 'Climbing Stairs',                      url: 'https://leetcode.com/problems/climbing-stairs/',                      tag: 'Easy'   },
      { q: 'Python OOP: 4 pillars explained',      url: 'https://www.geeksforgeeks.org/python-oops-concepts/',                 tag: 'Concept'},
      { q: '*args vs **kwargs with examples',      url: 'https://realpython.com/python-kwargs-and-args/',                      tag: 'Concept'},
      { q: 'List comprehension vs generator',      url: 'https://realpython.com/list-comprehension-python/',                   tag: 'Concept'},
      { q: 'Shallow vs Deep copy examples',        url: 'https://realpython.com/copying-python-objects/',                      tag: 'Concept'},
      { q: 'Decorators explained with examples',   url: 'https://realpython.com/primer-on-python-decorators/',                 tag: 'Concept'},
      { q: 'Single Number',                        url: 'https://leetcode.com/problems/single-number/',                        tag: 'Easy'   },
      { q: 'Move Zeroes',                          url: 'https://leetcode.com/problems/move-zeroes/',                          tag: 'Easy'   },
      { q: 'Missing Number',                       url: 'https://leetcode.com/problems/missing-number/',                       tag: 'Easy'   },
      { q: 'Majority Element',                     url: 'https://leetcode.com/problems/majority-element/',                     tag: 'Easy'   },
      { q: 'Python Interview Q&A — 50 questions',  url: 'https://www.interviewbit.com/python-interview-questions/',            tag: 'Bank'   }
    ]
  },

  2: { /* NumPy + Statistics */
    title: 'Statistics + NumPy — Always Asked',
    note:  'Stats is tested by EVERY company. These are the exact question types.',
    qs: [
      { q: 'p-value explained + practice',              url: 'https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample/more-significance-testing-videos/v/p-values-and-significance-tests', tag: 'Stats'  },
      { q: 'Type I vs Type II error problems',          url: 'https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample/error-probabilities-and-power/a/introduction-to-type-i-and-type-ii-errors', tag: 'Stats'  },
      { q: 'Hypothesis testing — full practice set',   url: 'https://www.hackerrank.com/domains/tutorials/10-days-of-statistics', tag: 'Practice'},
      { q: 'Normal distribution problems',              url: 'https://www.khanacademy.org/math/statistics-probability/modeling-distributions-of-data/normal-distributions-library/e/empirical-rule', tag: 'Stats'  },
      { q: 'Bayes theorem practice problems',          url: 'https://brilliant.org/wiki/bayes-theorem/',                       tag: 'Stats'  },
      { q: 'Central Limit Theorem visual explanation', url: 'https://seeing-theory.brown.edu/probability-distributions/index.html', tag: 'Visual' },
      { q: 'Confidence intervals practice',            url: 'https://www.khanacademy.org/math/statistics-probability/confidence-intervals-one-sample', tag: 'Stats'  },
      { q: 'Correlation vs Causation examples',        url: 'https://www.tylervigen.com/spurious-correlations',                tag: 'Concept'},
      { q: 'NumPy 100 exercises (do 1–30 today)',      url: 'https://github.com/rougier/numpy-100',                            tag: 'Coding' },
      { q: 'Statistics interview questions — bank',    url: 'https://www.interviewquery.com/p/statistics-interview-questions', tag: 'Bank'   },
      { q: 'A/B Testing explained + problems',         url: 'https://www.analyticsvidhya.com/blog/2020/10/ab-testing-data-science/', tag: 'Applied'},
      { q: 'Mean vs Median vs Mode — when to use?',    url: 'https://statisticsbyjim.com/basics/measures-central-tendency/',  tag: 'Concept'},
      { q: 'Variance vs Std Dev — interview answer',   url: 'https://www.geeksforgeeks.org/difference-between-variance-and-standard-deviation/', tag: 'Concept'},
      { q: 'Z-score problems + percentile',            url: 'https://www.khanacademy.org/math/statistics-probability/modeling-distributions-of-data/z-scores/e/z_scores_1', tag: 'Practice'},
      { q: 'Skewness and kurtosis explained',          url: 'https://www.spcforexcel.com/knowledge/basic-statistics/are-skewness-and-kurtosis-useful-statistics', tag: 'Concept'},
      { q: 'T-test vs Z-test — when to use',          url: 'https://www.statisticshowto.com/probability-and-statistics/t-test/', tag: 'Concept'},
      { q: 'Chi-square test practice',                 url: 'https://www.khanacademy.org/math/statistics-probability/inference-categorical-data-chi-square-tests', tag: 'Stats'  },
      { q: 'Probability interview questions (30 Qs)',  url: 'https://www.analyticsvidhya.com/blog/2017/04/40-questions-on-probability-for-all-aspiring-data-scientists/', tag: 'Bank'   },
      { q: 'NumPy broadcasting practice',             url: 'https://numpy.org/doc/stable/user/basics.broadcasting.html',       tag: 'Coding' },
      { q: 'Statistics MCQs — Hackerrank 10 days',    url: 'https://www.hackerrank.com/domains/tutorials/10-days-of-statistics', tag: 'Practice'}
    ]
  },

  4: { /* Pandas */
    title: 'Pandas — Written in Every DS Interview',
    note:  'Tiger Analytics makes you code Pandas live. Practice without docs.',
    qs: [
      { q: 'Pandas 100 puzzles (do 1–30 today)',        url: 'https://github.com/ajcr/100-pandas-puzzles',                     tag: 'Coding' },
      { q: 'LeetCode Pandas problems — all easy',       url: 'https://leetcode.com/problemset/?topicSlugs=pandas&difficulty=EASY', tag: 'Coding' },
      { q: 'Kaggle Pandas exercise (hands-on)',         url: 'https://www.kaggle.com/learn/pandas',                            tag: 'Coding' },
      { q: 'Pandas interview questions — 50 Qs',        url: 'https://www.interviewquery.com/p/pandas-interview-questions',    tag: 'Bank'   },
      { q: 'GroupBy — all aggregation patterns',        url: 'https://realpython.com/pandas-groupby/',                         tag: 'Concept'},
      { q: 'Merge vs Join vs Concat — when to use',    url: 'https://realpython.com/pandas-merge-join-and-concatenate/',      tag: 'Concept'},
      { q: 'loc vs iloc — 10 practice problems',       url: 'https://www.geeksforgeeks.org/python-pandas-dataframe-loc/',     tag: 'Practice'},
      { q: 'Handle missing values — all methods',       url: 'https://www.analyticsvidhya.com/blog/2021/10/handling-missing-value/', tag: 'Applied'},
      { q: 'apply() vs map() vs applymap()',            url: 'https://www.geeksforgeeks.org/difference-between-map-applymap-and-apply-methods-in-pandas/', tag: 'Concept'},
      { q: 'Pivot table practice problems',             url: 'https://pbpython.com/pandas-pivot-table-explained.html',         tag: 'Practice'},
      { q: 'LeetCode: Customers Who Never Order',       url: 'https://leetcode.com/problems/customers-who-never-order/',       tag: 'Easy'   },
      { q: 'LeetCode: Employees Earning More Than Mgr', url: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/', tag: 'Easy'   },
      { q: 'LeetCode: Duplicate Emails',                url: 'https://leetcode.com/problems/duplicate-emails/',                tag: 'Easy'   },
      { q: 'LeetCode: Rising Temperature',              url: 'https://leetcode.com/problems/rising-temperature/',              tag: 'Easy'   },
      { q: 'Detect + handle outliers — IQR method',    url: 'https://www.analyticsvidhya.com/blog/2021/05/detecting-and-treating-outliers-treating-the-odd-one-out/', tag: 'Applied'},
      { q: 'Rolling and resample time series',         url: 'https://realpython.com/pandas-resample/',                        tag: 'Concept'},
      { q: 'String operations in Pandas',              url: 'https://www.geeksforgeeks.org/python-pandas-series-str-operations/', tag: 'Practice'},
      { q: 'Chained assignment warning — fix it',      url: 'https://realpython.com/pandas-settingwithcopywarning/',          tag: 'Concept'},
      { q: 'Pandas performance tips (vectorize)',       url: 'https://realpython.com/fast-flexible-pandas/',                   tag: 'Applied'},
      { q: 'StrataScratch Pandas problems (free)',      url: 'https://platform.stratascratch.com/coding?code_type=2',          tag: 'Bank'   }
    ]
  },

  5: { /* Visualization + EDA */
    title: 'EDA + Visualization — Case Study Round Prep',
    note:  'Latentview and Mu Sigma give 30-min EDA case studies. Practice speed.',
    qs: [
      { q: 'Kaggle EDA: Titanic notebook (read + replicate)', url: 'https://www.kaggle.com/code/ldfreeman3/a-data-science-framework-to-achieve-99-accuracy', tag: 'EDA'     },
      { q: 'Kaggle EDA: House Prices (top notebook)',         url: 'https://www.kaggle.com/code/pmarcelino/comprehensive-data-exploration-with-python', tag: 'EDA'     },
      { q: 'Seaborn gallery — replicate 5 charts',           url: 'https://seaborn.pydata.org/examples/index.html',              tag: 'Coding' },
      { q: 'Matplotlib cheat sheet — bookmark this',         url: 'https://matplotlib.org/cheatsheets/',                         tag: 'Reference'},
      { q: 'EDA interview questions — 30 Qs',                url: 'https://www.analyticsvidhya.com/blog/2021/06/20-questions-to-test-your-skills-on-exploratory-data-analysis/', tag: 'Bank'   },
      { q: 'Outlier detection — full guide',                 url: 'https://www.analyticsvidhya.com/blog/2021/05/detecting-and-treating-outliers-treating-the-odd-one-out/', tag: 'Applied'},
      { q: 'Correlation heatmap practice',                   url: 'https://seaborn.pydata.org/examples/many_pairwise_correlations.html', tag: 'Coding' },
      { q: 'Choosing the right chart type',                  url: 'https://www.data-to-viz.com/',                                tag: 'Reference'},
      { q: 'Skewness handling — log transform',              url: 'https://www.analyticsvidhya.com/blog/2021/05/shape-of-data-skewness-and-kurtosis/', tag: 'Concept'},
      { q: 'Missing value visualization (missingno)',        url: 'https://github.com/ResidentMario/missingno',                  tag: 'Coding' },
      { q: 'Plotly interactive charts (bonus)',              url: 'https://plotly.com/python/plotly-express/',                   tag: 'Bonus'  },
      { q: 'Storytelling with data — 5 principles',         url: 'https://www.storytellingwithdata.com/blog',                   tag: 'Concept'},
      { q: 'StrataScratch EDA problems',                    url: 'https://platform.stratascratch.com/',                         tag: 'Bank'   },
      { q: 'PowerBI EDA practice dataset',                  url: 'https://learn.microsoft.com/en-us/power-bi/create-reports/sample-datasets', tag: 'PowerBI'},
      { q: 'Kaggle: EDA challenge notebook template',       url: 'https://www.kaggle.com/competitions/titanic/code',            tag: 'Practice'},
      { q: 'Violin vs Boxplot — when to use each',          url: 'https://mode.com/blog/violin-plot-examples/',                 tag: 'Concept'},
      { q: 'Pairplot: Iris dataset practice',               url: 'https://seaborn.pydata.org/examples/scatterplot_matrix.html', tag: 'Coding' },
      { q: 'Color theory for data visualization',           url: 'https://blog.datawrapper.de/colorguide/',                    tag: 'Concept'},
      { q: 'EDA on Indian dataset (real practice)',         url: 'https://www.kaggle.com/datasets/nehaprabhavalkar/av-healthcare-analytics-ii', tag: 'Indian' },
      { q: '5-minute EDA template — memorize this',         url: 'https://www.analyticsvidhya.com/blog/2021/04/rapid-fire-eda-process-using-python-for-ml-implementation/', tag: 'Template'}
    ]
  },

  6: { /* SQL */
    title: 'SQL — 95% of DS Interviews Test This',
    note:  'Latentview SQL round: 5 questions in 30 mins. LeetCode is EXACTLY what they ask.',
    qs: [
      { q: 'Second Highest Salary',                url: 'https://leetcode.com/problems/second-highest-salary/',               tag: 'Easy'   },
      { q: 'Nth Highest Salary',                   url: 'https://leetcode.com/problems/nth-highest-salary/',                  tag: 'Medium' },
      { q: 'Rank Scores',                          url: 'https://leetcode.com/problems/rank-scores/',                         tag: 'Medium' },
      { q: 'Consecutive Numbers',                  url: 'https://leetcode.com/problems/consecutive-numbers/',                 tag: 'Medium' },
      { q: 'Employees Earning More Than Managers', url: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/', tag: 'Easy'   },
      { q: 'Customers Who Never Order',            url: 'https://leetcode.com/problems/customers-who-never-order/',           tag: 'Easy'   },
      { q: 'Department Highest Salary',            url: 'https://leetcode.com/problems/department-highest-salary/',           tag: 'Medium' },
      { q: 'Rising Temperature',                   url: 'https://leetcode.com/problems/rising-temperature/',                  tag: 'Easy'   },
      { q: 'Duplicate Emails',                     url: 'https://leetcode.com/problems/duplicate-emails/',                    tag: 'Easy'   },
      { q: 'Delete Duplicate Emails',              url: 'https://leetcode.com/problems/delete-duplicate-emails/',             tag: 'Easy'   },
      { q: '176. Second Highest Salary (MUST DO)', url: 'https://leetcode.com/problems/second-highest-salary/',               tag: 'MUST'   },
      { q: '185. Department Top 3 Salaries',       url: 'https://leetcode.com/problems/department-top-three-salaries/',       tag: 'Hard'   },
      { q: '196. Delete Duplicate Emails',         url: 'https://leetcode.com/problems/delete-duplicate-emails/',             tag: 'Easy'   },
      { q: 'Window Functions practice — SQLZoo',   url: 'https://sqlzoo.net/wiki/Window_functions',                          tag: 'Practice'},
      { q: 'RANK vs DENSE_RANK vs ROW_NUMBER',     url: 'https://www.geeksforgeeks.org/difference-between-rank-dense_rank-and-row_number-in-sql/', tag: 'Concept'},
      { q: 'LAG and LEAD functions practice',      url: 'https://mode.com/sql-tutorial/sql-window-functions/',               tag: 'Concept'},
      { q: 'CTE vs Subquery — when to use',        url: 'https://learnsql.com/blog/sql-subquery-cte-difference/',            tag: 'Concept'},
      { q: 'SQL Top 50 LeetCode — start here',     url: 'https://leetcode.com/studyplan/top-sql-50/',                        tag: 'Bank'   },
      { q: 'StrataScratch SQL problems (free)',     url: 'https://platform.stratascratch.com/coding?code_type=1',            tag: 'Bank'   },
      { q: 'Mode Analytics SQL tutorial',          url: 'https://mode.com/sql-tutorial/',                                    tag: 'Tutorial'}
    ]
  },

  7: { /* ML Regression + Classification */
    title: 'ML Fundamentals — Every Interview Asks These',
    note:  'IBM asks precision vs recall. Fractal asks about bias-variance. Know these cold.',
    qs: [
      { q: 'Bias-Variance tradeoff — visual explanation', url: 'https://scott.fortmann-roe.com/docs/BiasVariance.html',        tag: 'Concept'},
      { q: 'Precision vs Recall — visual guide',          url: 'https://developers.google.com/machine-learning/crash-course/classification/precision-and-recall', tag: 'Concept'},
      { q: 'ROC-AUC explained step by step',              url: 'https://developers.google.com/machine-learning/crash-course/classification/roc-and-auc', tag: 'Concept'},
      { q: 'L1 vs L2 regularization — intuition',        url: 'https://towardsdatascience.com/regularization-in-machine-learning-76441ddcf99a', tag: 'Concept'},
      { q: 'Cross-validation explained + code',           url: 'https://scikit-learn.org/stable/modules/cross_validation.html', tag: 'Applied'},
      { q: 'Handle imbalanced data — all methods',        url: 'https://machinelearningmastery.com/tactics-to-combat-imbalanced-classes-in-your-machine-learning-dataset/', tag: 'Applied'},
      { q: 'Logistic regression from scratch',            url: 'https://realpython.com/logistic-regression-python/',           tag: 'Coding' },
      { q: 'Linear regression assumptions — LINE',        url: 'https://www.statology.org/linear-regression-assumptions/',     tag: 'Concept'},
      { q: 'Kaggle: Titanic ML (must complete)',          url: 'https://www.kaggle.com/competitions/titanic',                  tag: 'Project'},
      { q: 'Sklearn ML workflow — full guide',            url: 'https://scikit-learn.org/stable/tutorial/statistical_inference/supervised_learning.html', tag: 'Tutorial'},
      { q: 'ML interview questions — 100 Qs',            url: 'https://www.analyticsvidhya.com/blog/2016/09/40-interview-questions-asked-at-startups-in-machine-learning/', tag: 'Bank'   },
      { q: 'KNN from scratch — code it',                 url: 'https://machinelearningmastery.com/tutorial-to-implement-k-nearest-neighbors-in-python-from-scratch/', tag: 'Coding' },
      { q: 'SVM — kernel trick visual explanation',      url: 'https://towardsdatascience.com/support-vector-machine-introduction-to-machine-learning-algorithms-934a444fca47', tag: 'Concept'},
      { q: 'Confusion matrix — all 4 metrics explained', url: 'https://www.analyticsvidhya.com/blog/2020/04/confusion-matrix-machine-learning/', tag: 'Concept'},
      { q: 'Feature scaling — when and why',             url: 'https://scikit-learn.org/stable/modules/preprocessing.html',   tag: 'Concept'},
      { q: 'GridSearchCV practice example',              url: 'https://scikit-learn.org/stable/modules/grid_search.html',     tag: 'Coding' },
      { q: 'Naive Bayes — intuition + code',             url: 'https://machinelearningmastery.com/naive-bayes-classifier-scratch-python/', tag: 'Coding' },
      { q: 'StrataScratch ML problems',                  url: 'https://platform.stratascratch.com/',                          tag: 'Bank'   },
      { q: 'Kaggle: ML Intro course (free)',             url: 'https://www.kaggle.com/learn/intro-to-machine-learning',       tag: 'Course' },
      { q: 'ML interview Q&A — Interview Query',         url: 'https://www.interviewquery.com/learning-paths/machine-learning-engineer', tag: 'Bank'   }
    ]
  },

  8: { /* Advanced ML */
    title: 'Advanced ML — What Separates Good Candidates',
    note:  'XGBoost, Random Forest, Clustering — these are asked at Fractal, Flipkart.',
    qs: [
      { q: 'XGBoost explained — StatQuest (watch)',       url: 'https://youtu.be/OtD8wVaFm6E',                                tag: 'Watch'  },
      { q: 'Random Forest explained — StatQuest (watch)', url: 'https://youtu.be/J4Wdy0Wc_xQ',                                tag: 'Watch'  },
      { q: 'Kaggle: Intermediate ML course (free)',       url: 'https://www.kaggle.com/learn/intermediate-machine-learning',  tag: 'Course' },
      { q: 'SHAP values — practical guide',               url: 'https://shap.readthedocs.io/en/latest/example_notebooks/overviews/An%20introduction%20to%20explainable%20AI%20with%20Shapley%20values.html', tag: 'Applied'},
      { q: 'XGBoost hyperparameter guide',                url: 'https://xgboost.readthedocs.io/en/stable/parameter.html',     tag: 'Reference'},
      { q: 'Bagging vs Boosting — clear explanation',     url: 'https://www.analyticsvidhya.com/blog/2015/11/quick-introduction-boosting-algorithms-machine-learning/', tag: 'Concept'},
      { q: 'KMeans clustering — elbow method code',       url: 'https://realpython.com/k-means-clustering-python/',           tag: 'Coding' },
      { q: 'DBSCAN — when to use over KMeans',           url: 'https://scikit-learn.org/stable/auto_examples/cluster/plot_dbscan.html', tag: 'Coding' },
      { q: 'PCA — visual intuition (3B1B style)',         url: 'https://setosa.io/ev/principal-component-analysis/',          tag: 'Visual' },
      { q: 'Feature importance — 3 methods compared',    url: 'https://machinelearningmastery.com/calculate-feature-importance-with-python/', tag: 'Applied'},
      { q: 'Gini impurity vs Entropy — explained',       url: 'https://towardsdatascience.com/gini-impurity-measure-dbd3878ead33', tag: 'Concept'},
      { q: 'Gradient Boosting — step by step',           url: 'https://machinelearningmastery.com/gentle-introduction-gradient-boosting-algorithm-machine-learning/', tag: 'Concept'},
      { q: 'Kaggle: House Prices (XGBoost project)',      url: 'https://www.kaggle.com/competitions/house-prices-advanced-regression-techniques', tag: 'Project'},
      { q: 'Hyperparameter tuning best practices',       url: 'https://scikit-learn.org/stable/modules/grid_search.html',     tag: 'Applied'},
      { q: 'Silhouette score for clustering',            url: 'https://scikit-learn.org/stable/modules/clustering.html#silhouette-coefficient', tag: 'Applied'},
      { q: 'RandomizedSearchCV vs GridSearchCV',         url: 'https://scikit-learn.org/stable/modules/grid_search.html#randomized-parameter-optimization', tag: 'Coding' },
      { q: 'Overfitting in ensemble models — fix it',    url: 'https://machinelearningmastery.com/overfitting-and-underfitting-with-machine-learning-algorithms/', tag: 'Concept'},
      { q: 't-SNE vs PCA for visualization',            url: 'https://distill.pub/2016/misread-tsne/',                        tag: 'Visual' },
      { q: 'Stacking ensemble — implementation guide',  url: 'https://machinelearningmastery.com/stacking-ensemble-machine-learning-with-python/', tag: 'Coding' },
      { q: 'Advanced ML interview questions — 50 Qs',   url: 'https://www.analyticsvidhya.com/blog/2020/07/35-questions-to-test-your-knowledge-of-machine-learning-algorithms-with-solutions/', tag: 'Bank'   }
    ]
  },

  9: { /* Deep Learning + NLP + Time Series */
    title: 'DL + NLP + Time Series — Fresher Edge',
    note:  'Basic DL knowledge separates you from most freshers. Know concepts, not just code.',
    qs: [
      { q: 'Neural Networks — 3Blue1Brown (WATCH THIS)', url: 'https://youtu.be/aircAruvnKk',                                  tag: 'Watch'  },
      { q: 'Backpropagation — explained simply',         url: 'https://youtu.be/Ilg3gGewQ5U',                                  tag: 'Watch'  },
      { q: 'Keras ANN churn prediction tutorial',        url: 'https://www.analyticsvidhya.com/blog/2021/11/an-introduction-to-deep-learning/',  tag: 'Tutorial'},
      { q: 'Kaggle: NLP getting started (Tweets)',       url: 'https://www.kaggle.com/competitions/nlp-getting-started',       tag: 'Project'},
      { q: 'TF-IDF explained step by step',              url: 'https://www.analyticsvidhya.com/blog/2021/11/how-sklearns-tfidfvectorizer-calculates-tf-idf-values/', tag: 'Concept'},
      { q: 'Sentiment analysis with Python — full code', url: 'https://realpython.com/sentiment-analysis-python/',             tag: 'Coding' },
      { q: 'Time series decomposition tutorial',         url: 'https://machinelearningmastery.com/decompose-time-series-data-trend-seasonality/', tag: 'Applied'},
      { q: 'ARIMA model — step by step guide',          url: 'https://machinelearningmastery.com/arima-for-time-series-forecasting-with-python/', tag: 'Coding' },
      { q: 'Stationarity test — ADF test code',         url: 'https://www.analyticsvidhya.com/blog/2018/09/non-stationary-time-series-python/', tag: 'Coding' },
      { q: 'CNN on MNIST — beginner guide',              url: 'https://www.kaggle.com/code/yassineghouzam/introduction-to-cnn-keras-0-997-top-6', tag: 'Coding' },
      { q: 'Transfer learning with MobileNet',          url: 'https://www.tensorflow.org/tutorials/images/transfer_learning', tag: 'Tutorial'},
      { q: 'Word2Vec — intuition + code',               url: 'https://realpython.com/natural-language-processing-spacy-python/', tag: 'Concept'},
      { q: 'HuggingFace — sentiment classification',   url: 'https://huggingface.co/course/chapter1',                         tag: 'Tutorial'},
      { q: 'Dropout — what happens at inference?',      url: 'https://machinelearningmastery.com/dropout-for-regularizing-deep-neural-networks/', tag: 'Concept'},
      { q: 'Vanishing gradient — why ReLU fixes it',   url: 'https://towardsdatascience.com/the-vanishing-gradient-problem-69bf08b15484', tag: 'Concept'},
      { q: 'Attention mechanism — simple explanation',  url: 'https://machinelearningmastery.com/the-attention-mechanism-from-scratch/', tag: 'Concept'},
      { q: 'Kaggle: time series forecasting course',   url: 'https://www.kaggle.com/learn/time-series',                       tag: 'Course' },
      { q: 'DL interview questions — 40 Qs',           url: 'https://www.analyticsvidhya.com/blog/2020/04/comprehensive-popular-deep-learning-interview-questions-answers/', tag: 'Bank'   },
      { q: 'NLP interview questions — 30 Qs',          url: 'https://www.analyticsvidhya.com/blog/2021/06/50-questions-to-test-your-knowledge-in-nlp/', tag: 'Bank'   },
      { q: 'Fast.ai deep learning course (free)',       url: 'https://course.fast.ai/',                                        tag: 'Course' }
    ]
  },

  10: { /* Deployment + Git */
    title: 'Deployment + Git + BigData — Your Final Edge',
    note:  'After Day 10: stop preparing, start applying. Your project is better than 90% of freshers.',
    qs: [
      { q: 'Flask ML deployment — full tutorial',      url: 'https://towardsdatascience.com/deploy-machine-learning-model-using-flask-134951399ae3', tag: 'Tutorial'},
      { q: 'Git & GitHub — complete crash course',     url: 'https://youtu.be/RGOj5yH7evk',                                  tag: 'Watch'  },
      { q: 'GitHub README template for DS projects',   url: 'https://github.com/othneildrew/Best-README-Template',            tag: 'Template'},
      { q: 'Deploy Flask on Railway (free tier)',       url: 'https://railway.app/',                                           tag: 'Deploy' },
      { q: 'Docker for beginners — full guide',        url: 'https://docker-curriculum.com/',                                 tag: 'Tutorial'},
      { q: 'AWS for DS — what you need to know',       url: 'https://towardsdatascience.com/aws-for-data-scientists-a-complete-guide-5e36a72f90e6', tag: 'Concept'},
      { q: 'REST API design basics',                   url: 'https://restfulapi.net/',                                         tag: 'Concept'},
      { q: 'Postman — test your API (download)',       url: 'https://www.postman.com/',                                       tag: 'Tool'   },
      { q: 'PySpark tutorial — getting started',       url: 'https://spark.apache.org/docs/latest/api/python/getting_started/index.html', tag: 'Tutorial'},
      { q: 'PySpark MLlib — random forest example',   url: 'https://spark.apache.org/docs/latest/ml-classification-regression.html#random-forest-classifier', tag: 'Coding' },
      { q: 'MLOps: model versioning with DVC',         url: 'https://dvc.org/doc/start',                                      tag: 'Applied'},
      { q: 'Model monitoring — drift detection',       url: 'https://evidentlyai.com/blog/tutorial-1-model-analytics-for-batch-ml-model-monitoring', tag: 'Applied'},
      { q: 'pickle vs joblib — which to use?',         url: 'https://scikit-learn.org/stable/model_persistence.html',         tag: 'Concept'},
      { q: 'GitHub Pages — host your portfolio',       url: 'https://pages.github.com/',                                      tag: 'Deploy' },
      { q: 'Data Scientist resume tips — 2025',        url: 'https://www.analyticsvidhya.com/blog/2021/09/tips-to-write-an-impressive-data-science-resume/', tag: 'Career' },
      { q: 'LinkedIn profile for DS jobs — guide',    url: 'https://towardsdatascience.com/how-to-optimize-your-linkedin-profile-as-a-data-scientist-ec1fd54e7ce7', tag: 'Career' },
      { q: 'Top DS companies India — where to apply', url: 'https://www.analyticsvidhya.com/blog/2021/09/the-top-10-companies-for-data-scientists-in-india/', tag: 'Career' },
      { q: 'DS salary guide India 2025',               url: 'https://www.ambitionbox.com/profile/data-scientist-salary',      tag: 'Career' },
      { q: 'MLOps interview questions — 20 Qs',       url: 'https://www.analyticsvidhya.com/blog/2021/09/most-asked-mlops-interview-questions/', tag: 'Bank'   },
      { q: 'Full DS interview prep checklist',         url: 'https://www.interviewquery.com/learning-paths/data-scientist',   tag: 'Bank'   }
    ]
  }
};

/* ============================================
   MAIN RENDER
   ============================================ */
function renderDSRoad() {
  var state    = window.AppState;
  var progress = state.dsProgress || {};
  var studyDays  = DS_DAYS.filter(function(d){ return d.topic !== 'REST DAY'; });
  var totalStudy = studyDays.length;
  var doneCount    = Object.values(progress).filter(function(v){ return v === 'done'; }).length;
  var inProgCount  = Object.values(progress).filter(function(v){ return v === 'inprog'; }).length;
  var revisitCount = Object.values(progress).filter(function(v){ return v === 'revisit'; }).length;
  var overallPct   = totalStudy > 0 ? Math.round((doneCount / totalStudy) * 100) : 0;
  var daysLeft     = totalStudy - doneCount;
  var tab = state.dsTab || 'roadmap';
  var h = '';

  /* STATS ROW */
  h += '<div class="grid-4" style="margin-bottom:14px;">';
  h += dsStatCard('#10b981', doneCount + '/' + totalStudy, 'Days Done', overallPct + '% complete');
  h += dsStatCard('#f59e0b', inProgCount, 'In Progress', 'Keep going!');
  h += dsStatCard('#ef4444', revisitCount, 'Need Revisit', 'Strengthen these');
  h += dsStatCard('#a855f7', daysLeft, 'Days Left', 'Interview-ready soon!');
  h += '</div>';

  /* PROGRESS BAR */
  var bc = overallPct >= 70 ? '#10b981' : overallPct >= 40 ? '#f59e0b' : '#a855f7';
  h += '<div class="card" style="margin-bottom:14px;padding:12px 16px;">';
  h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
  h += '<span style="font-size:12px;font-weight:700;">Overall Roadmap Progress</span>';
  h += '<span style="font-size:12px;font-weight:800;color:' + bc + ';">' + overallPct + '%</span>';
  h += '</div>';
  h += '<div style="background:#1a1a35;border-radius:99px;height:10px;">';
  h += '<div style="height:10px;border-radius:99px;background:' + bc + ';width:' + overallPct + '%;transition:width .4s;"></div>';
  h += '</div>';
  if (overallPct >= 100) h += '<div style="text-align:center;font-size:12px;color:#10b981;margin-top:8px;font-weight:700;">🏆 Roadmap Complete! Interview-ready, Vasavi!</div>';
  h += '</div>';

  /* TABS */
  h += '<div class="subtab-bar">';
  [['roadmap','📅 Roadmap'],['today','📖 Study Now'],['test','📝 Quick Test'],['notes','📌 Notes']].forEach(function(td) {
    h += '<div class="subtab ' + (tab === td[0] ? 'active' : '') + '" onclick="switchDSTab(\'' + td[0] + '\')">' + td[1] + '</div>';
  });
  h += '</div>';

  if (tab === 'roadmap') h += renderDSRoadmap(state, progress);
  if (tab === 'today')   h += renderDSToday(state, progress);
  if (tab === 'test')    h += renderDSTest(state);
  if (tab === 'notes')   h += renderDSNotes(state);

  return h;
}

function dsStatCard(color, val, lbl, sub) {
  return '<div class="stat-card" style="--stat-color:' + color + '">' +
    '<div class="stat-value">' + val + '</div>' +
    '<div class="stat-label">' + lbl + '</div>' +
    '<div class="stat-sub">' + sub + '</div>' +
  '</div>';
}

/* ============================================
   TAB 1: ROADMAP
   ============================================ */
function renderDSRoadmap(state, progress) {
  var h = '';
  DS_DAYS.forEach(function(day) {
    var status = (progress || {})['day' + day.day] || 'notstarted';
    var isRest = day.topic === 'REST DAY';
    var borderCol = status === 'done' ? '#16a34a' : status === 'inprog' ? '#d97706' : status === 'revisit' ? '#dc2626' : 'var(--border)';
    var bgCol     = status === 'done' ? '#0a1f0a' : status === 'inprog' ? '#1a1a0d' : status === 'revisit' ? '#1f0a0a' : 'var(--card2)';
    var txtCol    = status === 'done' ? '#10b981' : status === 'inprog' ? '#f59e0b' : status === 'revisit' ? '#ef4444' : '#556080';
    var lbl       = status === 'done' ? '✅ Done' : status === 'inprog' ? '▶ In Progress' : status === 'revisit' ? '🔁 Revisit' : 'Not Started';
    var dayScore  = (state.dsTestScores || {})['day' + day.day];

    /* Count checked exercises */
    var iqData   = DS_INTERVIEW_QS[day.day];
    var iqTotal  = iqData ? iqData.qs.length : 0;
    var iqDone   = iqData ? iqData.qs.filter(function(_, i){ return (state.dsIQDone || {})['d' + day.day + '_iq' + i]; }).length : 0;

    h += '<div style="background:' + bgCol + ';border:1.5px solid ' + borderCol + ';border-radius:10px;padding:12px 14px;margin-bottom:8px;cursor:pointer;" onclick="openDSDay(' + day.day + ')">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;">';
    /* Left */
    h += '<div style="display:flex;align-items:center;gap:10px;min-width:0;">';
    h += '<div style="width:36px;height:36px;border-radius:50%;background:' + (isRest ? '#1a1a35' : 'var(--accent)') + ';display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:#fff;flex-shrink:0;">' + (isRest ? '😴' : day.day) + '</div>';
    h += '<div style="min-width:0;">';
    h += '<div style="font-size:11px;color:#8899bb;">' + day.date + '</div>';
    h += '<div style="font-size:13px;font-weight:700;">' + escHtml(day.topic) + '</div>';
    if (!isRest && day.file) h += '<div style="font-size:10px;color:#556080;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">📁 ' + escHtml(day.file) + '</div>';
    if (!isRest && iqTotal > 0) h += '<div style="font-size:10px;color:' + (iqDone === iqTotal ? '#10b981' : '#f59e0b') + ';margin-top:2px;">🎯 ' + iqDone + '/' + iqTotal + ' interview Qs done</div>';
    h += '</div></div>';
    /* Right */
    h += '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;margin-left:8px;">';
    if (!isRest) h += '<span style="font-size:10px;font-weight:700;color:' + txtCol + ';">' + lbl + '</span>';
    if (dayScore !== undefined) h += '<span style="font-size:10px;font-weight:800;color:' + (dayScore >= 8 ? '#10b981' : dayScore >= 5 ? '#f59e0b' : '#ef4444') + ';">📝 ' + dayScore + '/10</span>';
    h += '<span style="color:#8899bb;font-size:16px;">›</span>';
    h += '</div>';
    h += '</div></div>';
  });
  return h;
}

/* ============================================
   TAB 2: STUDY NOW
   ============================================ */
function renderDSToday(state, progress) {
  var h = '';
  var selectedDay = state.dsSelectedDay || 1;
  var day = DS_DAYS.find(function(d){ return d.day === selectedDay; });

  if (!day) return '<div class="empty-state"><div class="emo">📅</div><p>Select a day from the Roadmap tab!</p></div>';

  var isRest = day.topic === 'REST DAY';
  var status = (progress || {})['day' + day.day] || 'notstarted';

  /* Day pills */
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">';
  DS_DAYS.forEach(function(d) {
    var s = (progress || {})['day' + d.day] || 'notstarted';
    var dc = s === 'done' ? '#10b981' : s === 'inprog' ? '#f59e0b' : s === 'revisit' ? '#ef4444' : '#556080';
    h += '<div onclick="selectDSDay(' + d.day + ')" style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:11px;font-weight:800;border:2px solid ' + (d.day === selectedDay ? 'var(--accent)' : dc) + ';background:' + (d.day === selectedDay ? 'var(--accent)' : 'var(--card2)') + ';color:' + (d.day === selectedDay ? '#fff' : dc) + ';">' + (d.topic === 'REST DAY' ? '😴' : d.day) + '</div>';
  });
  h += '</div>';

  /* Header */
  h += '<div style="background:linear-gradient(135deg,#1a0533,#0a1020);border-radius:12px;padding:16px;margin-bottom:14px;">';
  h += '<div style="font-size:10px;color:#a855f7;font-weight:800;margin-bottom:4px;">DAY ' + day.day + ' — ' + day.date + '</div>';
  h += '<div style="font-size:18px;font-weight:900;margin-bottom:6px;">' + escHtml(day.topic) + '</div>';
  if (day.goal) h += '<div style="font-size:12px;color:#a0aec0;font-style:italic;">🎯 ' + escHtml(day.goal) + '</div>';
  if (!isRest && day.file) h += '<div style="font-size:11px;color:#556080;margin-top:8px;">📁 ' + escHtml(day.file) + '</div>';
  h += '</div>';

  if (isRest) {
    return h + '<div class="card" style="text-align:center;padding:30px;"><div style="font-size:48px;margin-bottom:12px;">😴</div><div style="font-size:16px;font-weight:800;margin-bottom:8px;">Rest Day, Vasavi!</div><div style="font-size:12px;color:#8899bb;">Brain consolidates memory during sleep. Rest = better tomorrow. No guilt. 🙏</div></div>';
  }

  /* Status controls */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📊 Update Progress</div>';
  h += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  [['inprog','▶ In Progress','#f59e0b'],['done','✅ Done','#10b981'],['revisit','🔁 Revisit','#ef4444'],['notstarted','○ Reset','#556080']].forEach(function(o) {
    h += '<button onclick="setDSStatus(' + day.day + ',\'' + o[0] + '\')" style="padding:7px 14px;border-radius:8px;border:1.5px solid ' + (status === o[0] ? o[2] : 'var(--border)') + ';background:' + (status === o[0] ? o[2] + '22' : 'transparent') + ';color:' + o[2] + ';cursor:pointer;font-size:11px;font-weight:700;">' + o[1] + '</button>';
  });
  h += '</div></div>';

  /* ---- THEORY ---- */
  if (day.theory && day.theory.length) {
    h += '<div class="card" style="margin-bottom:14px;">';
    h += '<div class="card-header">📖 Theory — What to Know Today</div>';
    day.theory.forEach(function(point, i) {
      h += '<div style="display:flex;gap:10px;padding:9px 0;border-bottom:1px solid #1a1a35;">';
      h += '<span style="color:#a855f7;font-weight:800;font-size:11px;min-width:20px;flex-shrink:0;">' + (i+1) + '</span>';
      h += '<span style="font-size:12px;line-height:1.6;word-break:break-word;">' + escHtml(point) + '</span>';
      h += '</div>';
    });
    h += '</div>';
  }

  /* ---- INTERVIEW QUESTIONS (NEW SECTION) ---- */
  var iqData = DS_INTERVIEW_QS[day.day];
  if (iqData) {
    var iqDone  = iqData.qs.filter(function(_, i){ return (state.dsIQDone || {})['d' + day.day + '_iq' + i]; }).length;
    var tagColors = { 'Easy':'#10b981', 'Medium':'#f59e0b', 'Hard':'#ef4444', 'MUST':'#a855f7', 'Stats':'#06b6d4', 'Coding':'#3b82f6', 'Concept':'#8b5cf6', 'Bank':'#ec4899', 'Practice':'#10b981', 'Applied':'#f97316', 'Watch':'#ef4444', 'Course':'#06b6d4', 'Project':'#a855f7', 'Tutorial':'#3b82f6', 'Visual':'#10b981', 'Indian':'#f97316', 'Template':'#8b5cf6', 'Reference':'#64748b', 'Deploy':'#10b981', 'EDA':'#f59e0b', 'PowerBI':'#f97316', 'Career':'#a855f7', 'Tool':'#06b6d4', 'Bonus':'#64748b' };

    h += '<div class="card" style="margin-bottom:14px;">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">';
    h += '<div>';
    h += '<div class="card-header" style="margin-bottom:2px;">🎯 ' + escHtml(iqData.title) + '</div>';
    h += '<div style="font-size:11px;color:#8899bb;">' + escHtml(iqData.note) + '</div>';
    h += '</div>';
    h += '<div style="background:#1a1a35;border-radius:99px;padding:4px 10px;font-size:11px;font-weight:800;color:' + (iqDone === iqData.qs.length ? '#10b981' : '#f59e0b') + ';">' + iqDone + '/' + iqData.qs.length + '</div>';
    h += '</div>';

    iqData.qs.forEach(function(item, i) {
      var done = (state.dsIQDone || {})['d' + day.day + '_iq' + i] || false;
      var tagColor = tagColors[item.tag] || '#64748b';
      h += '<div style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:8px;margin-bottom:5px;background:' + (done ? '#0a1a0a' : '#0d0d1a') + ';border:1px solid ' + (done ? '#14532d' : '#1a1a35') + ';">';
      /* Checkbox */
      h += '<input type="checkbox" ' + (done ? 'checked' : '') + ' onchange="toggleDSIQ(' + day.day + ',' + i + ',this.checked)" style="cursor:pointer;flex-shrink:0;width:14px;height:14px;" />';
      /* Tag */
      h += '<span style="background:' + tagColor + '22;color:' + tagColor + ';border-radius:4px;padding:2px 6px;font-size:9px;font-weight:800;flex-shrink:0;">' + escHtml(item.tag) + '</span>';
      /* Link */
      h += '<a href="' + item.url + '" target="_blank" style="font-size:12px;color:' + (done ? '#556080' : '#c4b5fd') + ';text-decoration:' + (done ? 'line-through' : 'none') + ';flex:1;line-height:1.4;">' + escHtml(item.q) + ' ↗</a>';
      h += '</div>';
    });
    h += '</div>';
  }

  /* ---- CODING EXERCISES (from DS_DAYS) ---- */
  if (day.exercises && day.exercises.length) {
    var exDoneCount = day.exercises.filter(function(_, i){ return (state.dsExDone || {})['d' + day.day + '_e' + i]; }).length;
    h += '<div class="card" style="margin-bottom:14px;">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">';
    h += '<div>';
    h += '<div class="card-header" style="margin-bottom:2px;">💻 Coding Exercises in Jupyter</div>';
    h += '<div style="font-size:11px;color:#8899bb;">Practice these in your notebook. Open Jupyter alongside this.</div>';
    h += '</div>';
    h += '<div style="background:#1a1a35;border-radius:99px;padding:4px 10px;font-size:11px;font-weight:800;color:' + (exDoneCount === day.exercises.length ? '#10b981' : '#f59e0b') + ';">' + exDoneCount + '/' + day.exercises.length + '</div>';
    h += '</div>';

    day.exercises.forEach(function(ex, i) {
      var done = ((window.AppState.dsExDone || {})['d' + day.day + '_e' + i]) || false;
      h += '<div style="display:flex;gap:10px;align-items:flex-start;padding:9px;border-radius:8px;margin-bottom:5px;background:' + (done ? '#0a1a0a' : '#0d0d1a') + ';border:1px solid ' + (done ? '#14532d' : '#1a1a35') + ';">';
      h += '<input type="checkbox" ' + (done ? 'checked' : '') + ' onchange="toggleDSExercise(' + day.day + ',' + i + ',this.checked)" style="cursor:pointer;flex-shrink:0;width:14px;height:14px;margin-top:1px;" />';
      h += '<span style="font-size:12px;line-height:1.5;word-break:break-word;' + (done ? 'text-decoration:line-through;color:#556080;' : '') + '">' + escHtml(ex) + '</span>';
      h += '</div>';
    });
    h += '</div>';
  }

  /* ---- PRACTICE LINKS ---- */
  if (day.practice_links && day.practice_links.length) {
    h += '<div class="card" style="margin-bottom:14px;">';
    h += '<div class="card-header">🔗 Practice Links & Resources</div>';
    h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;">Use these in your free time to go deeper. 📚</div>';
    day.practice_links.forEach(function(link) {
      h += '<a href="' + link.url + '" target="_blank" style="display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid #1a1a35;text-decoration:none;">';
      h += '<span style="font-size:14px;">🔗</span>';
      h += '<span style="font-size:12px;color:#a855f7;">' + escHtml(link.label) + ' ↗</span>';
      h += '</a>';
    });
    h += '</div>';
  }

  /* ---- YOUTUBE ---- */
  if (day.youtube && day.youtube.length) {
    h += '<div class="card" style="margin-bottom:14px;">';
    h += '<div class="card-header">📺 YouTube Resources</div>';
    h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;">Watch these in free time or during lunch. Great for deep understanding. 🎬</div>';
    day.youtube.forEach(function(yt) {
      h += '<a href="' + yt.url + '" target="_blank" style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #1a1a35;text-decoration:none;">';
      h += '<span style="font-size:20px;">▶️</span>';
      h += '<span style="font-size:12px;color:#a855f7;">' + escHtml(yt.label) + '</span>';
      h += '</a>';
    });
    h += '</div>';
  }

  /* ---- INTERVIEW TIP ---- */
  if (day.interview_tip) {
    h += '<div style="background:#1a1500;border:1px solid #d97706;border-radius:10px;padding:12px;margin-bottom:14px;">';
    h += '<div style="font-size:10px;color:#f59e0b;font-weight:800;margin-bottom:6px;">💡 INTERVIEW TIP FROM VASAVI\'S MENTOR</div>';
    h += '<div style="font-size:12px;line-height:1.7;">' + escHtml(day.interview_tip) + '</div>';
    h += '</div>';
  }

  return h;
}

/* ============================================
   TAB 3: QUICK TEST
   ============================================ */
function renderDSTest(state) {
  var selectedDay = state.dsSelectedDay || 1;
  var day = DS_DAYS.find(function(d){ return d.day === selectedDay; });

  if (!day || day.topic === 'REST DAY' || !day.test || !day.test.length) {
    return '<div class="empty-state"><div class="emo">😴</div><p>No test for this day. Select a study day first!</p></div>';
  }

  var testScores  = state.dsTestScores  || {};
  var testAnswers = state.dsTestAnswers || {};
  var savedScore  = testScores['day' + day.day];
  var h = '';

  h += '<div style="background:linear-gradient(135deg,#0a1533,#1a0533);border-radius:12px;padding:14px;margin-bottom:14px;">';
  h += '<div style="font-size:10px;color:#a855f7;font-weight:800;">DAY ' + day.day + ' QUICK TEST</div>';
  h += '<div style="font-size:16px;font-weight:800;margin-top:4px;">' + escHtml(day.topic) + '</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-top:6px;">Say each answer out loud. Rate yourself honestly.</div>';
  if (savedScore !== undefined) {
    h += '<div style="margin-top:8px;font-size:14px;font-weight:800;color:' + (savedScore >= 8 ? '#10b981' : savedScore >= 5 ? '#f59e0b' : '#ef4444') + ';">Last Score: ' + savedScore + '/' + day.test.length + ' — ' + (savedScore >= 8 ? '🏆 Excellent!' : savedScore >= 5 ? '📈 Getting there!' : '🔁 Keep revising!') + '</div>';
  }
  h += '</div>';

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📝 ' + day.test.length + ' Questions — Answer Out Loud</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:12px;">1 = No idea &nbsp;|&nbsp; 2 = Partial &nbsp;|&nbsp; 3 = Confident ✅</div>';

  day.test.forEach(function(question, i) {
    var rating = testAnswers['d' + day.day + '_q' + i] || 0;
    h += '<div style="padding:10px;border-radius:8px;margin-bottom:8px;background:' + (rating >= 2 ? '#0a1a0a' : rating === 1 ? '#1a0a0a' : 'var(--card2)') + ';border:1px solid ' + (rating >= 2 ? '#14532d' : rating === 1 ? '#451a03' : '#1a1a35') + ';">';
    h += '<div style="font-size:12px;font-weight:700;margin-bottom:10px;line-height:1.5;word-break:break-word;"><span style="color:#a855f7;">' + (i+1) + '.</span> ' + escHtml(question) + '</div>';
    h += '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">';
    h += '<span style="font-size:10px;color:#8899bb;flex-shrink:0;">Rate:</span>';
    [[1,'❌ No idea','#ef4444'],[2,'⚠️ Partial','#f59e0b'],[3,'✅ Got it','#10b981']].forEach(function(o) {
      h += '<button onclick="rateDSTestQ(' + day.day + ',' + i + ',' + o[0] + ')" style="padding:5px 12px;border-radius:7px;border:1px solid ' + (rating === o[0] ? o[2] : '#1a1a35') + ';background:' + (rating === o[0] ? o[2] + '22' : 'transparent') + ';color:' + (rating === o[0] ? o[2] : '#8899bb') + ';cursor:pointer;font-size:10px;font-weight:700;">' + o[1] + '</button>';
    });
    h += '</div></div>';
  });
  h += '</div>';
  h += '<button class="btn-primary" onclick="submitDSTest(' + day.day + ')" style="width:100%;padding:12px;font-size:13px;">📊 Calculate Score</button>';

  return h;
}

/* ============================================
   TAB 4: NOTES
   ============================================ */
function renderDSNotes(state) {
  var selectedDay = state.dsSelectedDay || 1;
  var notes = (state.dsNotes || {})['day' + selectedDay] || '';
  var h = '';

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📌 My Notes — Day ' + selectedDay + '</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;">Key insights, struggles, code snippets to remember. Auto-saved. ✓</div>';
  h += '<textarea id="ds-notes-area" rows="12" placeholder="Day ' + selectedDay + ' notes...\n\nKey things I learned:\n- \n\nThings I struggled with:\n- \n\nCode to remember:\n" oninput="saveDSNotes(' + selectedDay + ',this.value)">' + escHtml(notes) + '</textarea>';
  h += '</div>';

  h += '<div class="card"><div class="card-header">Jump to Day Notes</div>';
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
  DS_DAYS.filter(function(d){ return d.topic !== 'REST DAY'; }).forEach(function(d) {
    var hasNote = ((state.dsNotes || {})['day' + d.day] || '').length > 0;
    h += '<div onclick="selectDSDay(' + d.day + ');switchDSTab(\'notes\')" style="padding:5px 12px;border-radius:7px;cursor:pointer;font-size:11px;font-weight:700;background:' + (d.day === selectedDay ? 'var(--accent)' : 'var(--card2)') + ';color:' + (d.day === selectedDay ? '#fff' : hasNote ? '#10b981' : '#8899bb') + ';border:1px solid ' + (hasNote ? '#10b981' : 'var(--border)') + ';">Day ' + d.day + (hasNote ? ' ✓' : '') + '</div>';
  });
  h += '</div></div>';
  return h;
}

/* ============================================
   ACTIONS
   ============================================ */
function switchDSTab(tab)    { window.AppState.dsTab = tab; saveData(); renderPage(); }
function openDSDay(n)        { window.AppState.dsSelectedDay = n; window.AppState.dsTab = 'today'; saveData(); renderPage(); }
function selectDSDay(n)      { window.AppState.dsSelectedDay = n; saveData(); renderPage(); }
function setDSStatus(n, st)  { if (!window.AppState.dsProgress) window.AppState.dsProgress = {}; window.AppState.dsProgress['day' + n] = st; saveData(); renderPage(); }

function toggleDSExercise(dayNum, exIdx, checked) {
  if (!window.AppState.dsExDone) window.AppState.dsExDone = {};
  window.AppState.dsExDone['d' + dayNum + '_e' + exIdx] = checked;
  saveData();
}

function toggleDSIQ(dayNum, iqIdx, checked) {
  if (!window.AppState.dsIQDone) window.AppState.dsIQDone = {};
  window.AppState.dsIQDone['d' + dayNum + '_iq' + iqIdx] = checked;
  saveData();
}

function rateDSTestQ(dayNum, qIdx, rating) {
  if (!window.AppState.dsTestAnswers) window.AppState.dsTestAnswers = {};
  window.AppState.dsTestAnswers['d' + dayNum + '_q' + qIdx] = rating;
  saveData(); renderPage();
}

function submitDSTest(dayNum) {
  var day = DS_DAYS.find(function(d){ return d.day === dayNum; });
  if (!day) return;
  var answers = window.AppState.dsTestAnswers || {};
  var score = 0;
  day.test.forEach(function(q, i) {
    var r = answers['d' + dayNum + '_q' + i] || 0;
    if (r === 3) score++; else if (r === 2) score += 0.5;
  });
  score = Math.round(score);
  if (!window.AppState.dsTestScores) window.AppState.dsTestScores = {};
  window.AppState.dsTestScores['day' + dayNum] = score;
  saveData(); renderPage();
}

function saveDSNotes(dayNum, text) {
  if (!window.AppState.dsNotes) window.AppState.dsNotes = {};
  window.AppState.dsNotes['day' + dayNum] = text;
  saveData();
}

console.log('dsroad.js loaded OK - full render module ready');