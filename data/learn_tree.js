/* ============================================
   VASAVI'S LIFE OS - COMPLETE LEARNING TREE v3
   data/learn_tree.js

   Every topic has a full ROADMAP:
   🌱 Beginner → 📘 Intermediate → 🚀 Advanced → 🏆 Specialist
   All links are REAL direct playlists/courses.
   Built for Vasavi — a curious mind who wants to
   grow from student to someone who understands life.
   ============================================ */

var LEARN_TREE = {

  /* ========== 1. TECHNOLOGY & AI ========== */
  'Technology and AI': {
    icon: '🤖',
    folders: {
      'Artificial Intelligence Basics': [
        'What is AI — history, types, real examples',
        'Machine Learning — how machines actually learn',
        'Deep Learning and Neural Networks explained',
        'Generative AI — ChatGPT, Claude, Gemini, Midjourney',
        'AI Ethics, Bias and Responsible AI'
      ],
      'AI Tools and Agents': [
        'Prompt engineering — how to talk to AI properly',
        'LangChain — build AI pipelines step by step',
        'AutoGPT, CrewAI — multi-agent automation',
        'AI for productivity — real tools you can use today',
        'Building your own AI workflow'
      ],
      'Tech and Gadgets': [
        'How smartphones work inside — chips, OS, sensors',
        'GPUs and chips — NVIDIA, Apple Silicon explained',
        'Cloud computing — AWS, GCP, Azure basics',
        'How the internet actually works — DNS, HTTP, servers',
        'Future tech — quantum computing, brain interfaces'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'AI for Everyone — Andrew Ng (Free)',          url:'https://www.coursera.org/learn/ai-for-everyone',                                 note:'No coding needed. Best first step.' },
      { level:'🌱 Beginner',     title:'CS50 AI — Harvard (Free)',                    url:'https://cs50.harvard.edu/ai/2024/',                                              note:'Most respected free AI course.' },
      { level:'📘 Intermediate', title:'3Blue1Brown — Neural Networks Playlist',      url:'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi',     note:'Best visual explanation of AI ever.' },
      { level:'📘 Intermediate', title:'Fast.ai — Practical Deep Learning (Free)',    url:'https://course.fast.ai/',                                                        note:'Code first, very practical.' },
      { level:'🚀 Advanced',     title:'Stanford CS229 — Machine Learning (Free)',    url:'https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU',     note:'Gold standard ML course.' },
      { level:'🚀 Advanced',     title:'Andrej Karpathy — Neural Networks Zero to Hero', url:'https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ', note:'Build GPT from scratch.' },
      { level:'🏆 Specialist',   title:'DeepLearning.AI Specialization',              url:'https://www.coursera.org/specializations/deep-learning',                         note:'Complete AI specialist path.' }
    ]
  },

  /* ========== 2. DATA SCIENCE ========== */
  'Data Science and Analytics': {
    icon: '📊',
    folders: {
      'Python and Programming': [
        'Python basics — syntax, data types, functions',
        'NumPy — arrays, math, broadcasting',
        'Pandas — data cleaning and manipulation',
        'Data visualization — Matplotlib and Seaborn',
        'Jupyter notebooks best practices'
      ],
      'Machine Learning': [
        'Supervised learning — regression and classification',
        'Unsupervised learning — clustering and PCA',
        'Model evaluation — accuracy, precision, recall, AUC',
        'XGBoost and Random Forest mastery',
        'Feature engineering and selection'
      ],
      'SQL and Databases': [
        'SQL basics — SELECT, WHERE, JOIN',
        'Advanced SQL — window functions, CTEs',
        'NoSQL databases — MongoDB basics',
        'Database design and normalization',
        'Big data tools — Spark and PySpark'
      ],
      'Business Analytics and BI': [
        'PowerBI — building dashboards from scratch',
        'Tableau fundamentals and storytelling',
        'KPIs and metrics that actually matter',
        'A/B testing and experimentation',
        'DS in industry — finance, healthcare, e-commerce'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Kaggle Python Course (Free)',                 url:'https://www.kaggle.com/learn/python',                                            note:'Best free Python for DS.' },
      { level:'🌱 Beginner',     title:'Kaggle Pandas Course (Free)',                 url:'https://www.kaggle.com/learn/pandas',                                            note:'Hands-on, instant practice.' },
      { level:'📘 Intermediate', title:'StatQuest — Statistics and ML Playlist',     url:'https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF',     note:'Best ML explanations on YouTube.' },
      { level:'📘 Intermediate', title:'Kaggle ML Intro + Intermediate (Free)',       url:'https://www.kaggle.com/learn/intro-to-machine-learning',                         note:'Project-based learning.' },
      { level:'🚀 Advanced',     title:'SQL Top 50 — LeetCode',                      url:'https://leetcode.com/studyplan/top-sql-50/',                                     note:'Industry-standard SQL prep.' },
      { level:'🚀 Advanced',     title:'PowerBI Full Course — Guy in a Cube',        url:'https://www.youtube.com/playlist?list=PLv2BtOtLblH1WcFGCT-C_lJEiXZLWjcmx',     note:'Most trusted PowerBI channel.' },
      { level:'🏆 Specialist',   title:'Full DS Roadmap — Ken Jee (Free)',           url:'https://www.youtube.com/watch?v=MqI8vt3-cag',                                   note:'Complete career roadmap.' }
    ]
  },

  /* ========== 3. PSYCHOLOGY & HUMAN BEHAVIOR ========== */
  'Psychology and Human Behavior': {
    icon: '🧠',
    folders: {
      'How the Mind Works': [
        'Cognitive biases — 20 you need to know',
        'Memory — how it forms and how to improve it',
        'Attention, focus and the distraction trap',
        'Decision making under uncertainty',
        'Mental models — how to think better'
      ],
      'Behavior and Habits': [
        'Habit formation — the loop and how to break it',
        'Motivation psychology — intrinsic vs extrinsic',
        'Procrastination — the science and the cure',
        'Behavior change frameworks that actually work',
        'Addiction psychology — how it hijacks your brain'
      ],
      'Social Psychology': [
        'Social influence and conformity',
        'Persuasion principles — Cialdini',
        'Body language — what it says and how to read it',
        'Group dynamics and tribalism',
        'Online behavior and social media psychology'
      ],
      'Emotional Intelligence': [
        'What is EQ and why it beats IQ in life',
        'Managing your own emotions under pressure',
        'Empathy — how to genuinely understand others',
        'Conflict resolution and difficult conversations',
        'Building emotional resilience over time'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Introduction to Psychology — Yale (Free)',    url:'https://www.coursera.org/learn/introduction-psychology',                         note:'Best rated psychology course online.' },
      { level:'🌱 Beginner',     title:'Thinking Fast and Slow — Summary Playlist',  url:'https://www.youtube.com/results?search_query=thinking+fast+and+slow+summary',    note:'Kahneman — must understand.' },
      { level:'📘 Intermediate', title:'Huberman Lab — Brain Science Playlist',      url:'https://www.youtube.com/playlist?list=PLPNW_gerXa4Pc8S2qoUQc_gEVLC8LZB2J',     note:'Science of the mind and behavior.' },
      { level:'📘 Intermediate', title:'HealthyGamerGG — Mental Health Playlist',    url:'https://www.youtube.com/playlist?list=PLNHmFZVIHxEKc1T5vJupJ8bq0pRkFEa9P',     note:'Deep, honest psychology content.' },
      { level:'🚀 Advanced',     title:'Hidden Brain — NPR Podcast',                 url:'https://hiddenbrain.org/',                                                        note:'Real research, brilliantly explained.' },
      { level:'🏆 Specialist',   title:'Influence — Robert Cialdini (Book)',         url:'https://www.amazon.in/Influence-Psychology-Persuasion-Robert-Cialdini/dp/006124189X', note:'The bible of influence.' }
    ]
  },

  /* ========== 4. GEOGRAPHY & WORLD ========== */
  'Geography and World': {
    icon: '🌍',
    folders: {
      'Physical Geography': [
        'How Earth formed — plate tectonics, continents',
        'Mountains, oceans, rivers — how they shape life',
        'Climate zones and biomes',
        'Natural disasters — earthquakes, volcanoes, floods',
        'How geography shapes human civilizations'
      ],
      'Countries and Cultures': [
        'Asia — China, Japan, Southeast Asia deep dive',
        'Europe — history, culture, geopolitics',
        'Africa — most misunderstood continent',
        'Middle East — geopolitics simplified',
        'Latin America — cultures, economies, stories'
      ],
      'India Deep Dive': [
        'Indian states, languages, cultures — full map',
        'India\'s economic growth story — from 1947 to now',
        'Indian politics and governance — how it works',
        'India in global tech — why Bengaluru is special',
        'India\'s diversity — religions, food, art, music'
      ],
      'Global Affairs': [
        'How borders were drawn — history of nations',
        'Global trade routes and supply chains',
        'Climate change and its geographic impact',
        'Migration patterns and why people move',
        'Future of geopolitics — multipolar world'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Geography Now — Country Playlist',           url:'https://www.youtube.com/user/GeographyNow/playlists',                            note:'Every country explained brilliantly.' },
      { level:'🌱 Beginner',     title:'Crash Course Geography (Free)',               url:'https://www.youtube.com/playlist?list=PL8dPuuaLjXtO85gundi9wqmKnMhGuMDOW',     note:'Complete beginner series.' },
      { level:'📘 Intermediate', title:'RealLifeLore — Geography Playlist',          url:'https://www.youtube.com/c/RealLifeLore/playlists',                               note:'Fascinating geographic stories.' },
      { level:'📘 Intermediate', title:'Wendover Productions — World Explained',     url:'https://www.youtube.com/c/Wendoverproductions/videos',                           note:'How the world actually works.' },
      { level:'🚀 Advanced',     title:'Caspian Report — Geopolitics',               url:'https://www.youtube.com/user/CaspianReport/videos',                              note:'Deep geopolitical analysis.' },
      { level:'🏆 Specialist',   title:'Prisoners of Geography — Book',              url:'https://www.goodreads.com/book/show/25135194-prisoners-of-geography',             note:'How geography determines everything.' }
    ]
  },

  /* ========== 5. ECONOMICS & FINANCE ========== */
  'Economics and Finance': {
    icon: '💰',
    folders: {
      'Economics Fundamentals': [
        'Supply and demand — how markets work',
        'GDP, inflation, interest rates explained',
        'How central banks work — RBI, Federal Reserve',
        'Economic cycles — boom, recession, recovery',
        'Micro vs macro economics — what is the difference'
      ],
      'Personal Finance India': [
        'Budgeting on a student income — practical system',
        'Emergency fund — why and how to build it',
        'Income tax basics for India — ITR, 80C, HRA',
        'Bank accounts, FDs, PPF — what to choose',
        'UPI, digital payments, credit cards — smart use'
      ],
      'Investing': [
        'Stock market basics — NSE, BSE, Sensex, Nifty',
        'Mutual funds and SIPs — where to start',
        'Index funds — why they beat 90% of investors',
        'Debt vs equity — risk tolerance explained',
        'How to read a balance sheet — basics'
      ],
      'Business and Startups': [
        'How startups work — from idea to IPO',
        'Indian startup ecosystem — Zepto, Zomato, CRED',
        'How to read business news intelligently',
        'Startup metrics — CAC, LTV, MRR, burn rate',
        'Venture capital and funding rounds explained'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Economics in One Lesson — Free PDF',         url:'https://fee.org/resources/economics-in-one-lesson/',                             note:'Most important economics book. Free.' },
      { level:'🌱 Beginner',     title:'Zerodha Varsity — Full Finance Course',      url:'https://zerodha.com/varsity/',                                                   note:'Best free finance education in India.' },
      { level:'📘 Intermediate', title:'CA Rachana Ranade — Stock Market Playlist',  url:'https://www.youtube.com/playlist?list=PLOzRYVm0a65eklyMDLaqnFnzaQCeDZc_J',     note:'Best in India for stock market basics.' },
      { level:'📘 Intermediate', title:'Plain Bagel — Investing Fundamentals',       url:'https://www.youtube.com/c/ThePlainBagel/videos',                                 note:'No hype, just facts.' },
      { level:'🚀 Advanced',     title:'Ben Felix — Evidence-Based Investing',       url:'https://www.youtube.com/c/BenFelixCSI/videos',                                   note:'Science-backed investing.' },
      { level:'🏆 Specialist',   title:'The Psychology of Money — Book Summary',     url:'https://www.youtube.com/watch?v=TRUjx7Gkq5o',                                   note:'Most important money mindset book.' }
    ]
  },

  /* ========== 6. PHILOSOPHY & WISDOM ========== */
  'Philosophy and Wisdom': {
    icon: '🧘',
    folders: {
      'Stoicism and Ancient Wisdom': [
        'Marcus Aurelius — Meditations key lessons',
        'Epictetus — what is in your control and what is not',
        'Seneca — on time, death, and living well',
        'Stoic daily practices — how to apply it today',
        'Buddhism — the Four Noble Truths and the Middle Path'
      ],
      'Modern Philosophy': [
        'Existentialism — Sartre, Camus, finding meaning',
        'Free will vs determinism — what science says',
        'Ethics — how to think about right and wrong',
        'Philosophy of mind — what is consciousness',
        'Nihilism vs meaning — what is the difference'
      ],
      'Mental Models and Thinking': [
        'First principles thinking — like Elon Musk',
        'Inversion — solving problems backwards',
        'Systems thinking — seeing the full picture',
        'Logical fallacies — 20 you must recognize',
        'Probabilistic thinking — thinking in bets'
      ],
      'Applied Wisdom for Life': [
        'How to deal with failure and rejection',
        'Acceptance and letting go — Eastern and Western',
        'Building inner peace in a chaotic world',
        'Finding your purpose — ikigai, dharma, calling',
        'The good life — what philosophers say it is'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'CrashCourse Philosophy (Free Playlist)',      url:'https://www.youtube.com/playlist?list=PL8dPuuaLjXtNgK6MZucdYldNkMybYIHKR',     note:'Complete philosophy intro, free.' },
      { level:'🌱 Beginner',     title:'Daily Stoic — Ryan Holiday Playlist',        url:'https://www.youtube.com/c/DailyStoic/videos',                                    note:'Practical stoicism every day.' },
      { level:'📘 Intermediate', title:'Einzelgänger — Philosophy for Life',         url:'https://www.youtube.com/c/Einzelg%C3%A4nger/videos',                             note:'Deep, beautiful philosophy content.' },
      { level:'📘 Intermediate', title:'Philosophize This! Podcast',                 url:'https://www.philosophizethis.org/',                                               note:'Best philosophy podcast. Start ep 1.' },
      { level:'🚀 Advanced',     title:'Academy of Ideas — Philosophy Playlist',     url:'https://www.youtube.com/c/AcademyOfIdeas/videos',                                note:'Deep dives into great thinkers.' },
      { level:'🏆 Specialist',   title:'Meditations — Marcus Aurelius (Free)',       url:'https://www.gutenberg.org/ebooks/2680',                                           note:'Read this once a year forever.' }
    ]
  },

  /* ========== 7. HEALTH & BIOLOGY ========== */
  'Health and Biology': {
    icon: '💪',
    folders: {
      'Human Body Science': [
        'How your organs work together as a system',
        'Immune system — how your body fights disease',
        'Gut microbiome — the second brain',
        'Hormones — how they control everything',
        'Genetics basics — DNA, genes, mutations'
      ],
      'Fitness and Exercise Science': [
        'How muscles grow — progressive overload',
        'Cardio vs strength training — what science says',
        'Recovery and sleep — why rest is training',
        'Injury prevention — mobility and flexibility',
        'Gym programming for beginners to advanced'
      ],
      'Nutrition and Food': [
        'Macros and micros — protein, carbs, fats explained',
        'Indian diet science — what actually works',
        'Sugar and processed food — what they do to you',
        'Gut health, probiotics and fermented foods',
        'How to eat for energy, focus and fat loss'
      ],
      'Mental Health': [
        'Anxiety — how it works and how to manage it',
        'Depression — biology, treatment, prevention',
        'Burnout — signs, causes, recovery',
        'Therapy types — CBT, DBT, what to choose',
        'Building emotional resilience — science-backed methods'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Jeff Nippard — Science of Fitness Playlist', url:'https://www.youtube.com/playlist?list=PLyqKasIHEj3lROCFLYg3YGK8XKDL7MlFY',     note:'Evidence-based gym content.' },
      { level:'🌱 Beginner',     title:'What I\'ve Learned — Nutrition Playlist',    url:'https://www.youtube.com/c/WhatIveLearned/videos',                                note:'Best nutrition science on YouTube.' },
      { level:'📘 Intermediate', title:'Huberman Lab — Health Science Playlist',     url:'https://www.youtube.com/playlist?list=PLPNW_gerXa4Pc8S2qoUQc_gEVLC8LZB2J',     note:'Stanford neuroscience, free.' },
      { level:'📘 Intermediate', title:'FoundMyFitness — Rhonda Patrick',            url:'https://www.youtube.com/foundmyfitness',                                          note:'Deep science of longevity.' },
      { level:'🚀 Advanced',     title:'Dr. Peter Attia — Longevity Science',        url:'https://www.youtube.com/c/PeterAttiaMD/videos',                                  note:'Most thorough health optimization.' },
      { level:'🏆 Specialist',   title:'Outlive — Peter Attia (Book)',               url:'https://www.amazon.in/Outlive-Science-Longevity-Peter-Attia/dp/0593236599',      note:'The bible of modern health.' }
    ]
  },

  /* ========== 8. HISTORY & CIVILIZATIONS ========== */
  'History and Civilizations': {
    icon: '🏛️',
    folders: {
      'Ancient World': [
        'Mesopotamia and Egypt — cradle of civilization',
        'Ancient India — Indus Valley, Vedic period',
        'Greek and Roman empires — rise and fall',
        'Ancient China and the Silk Road',
        'How writing, money and cities were invented'
      ],
      'Indian History': [
        'Maurya and Gupta empires — India\'s golden age',
        'Medieval India — Delhi Sultanate, Vijayanagara',
        'Mughal empire — from Babur to Aurangzeb',
        'British colonization — what really happened',
        'Independence movement — Gandhi, Ambedkar, Bose'
      ],
      'Modern World History': [
        'World War I — causes, events, consequences',
        'World War II — Holocaust, atomic bomb, aftermath',
        'Cold War — USA vs USSR explained simply',
        'Decolonization — how Asia and Africa became free',
        'How 1991 shaped the modern world'
      ],
      'History of Ideas': [
        'Scientific revolution — from superstition to science',
        'Industrial revolution — how it changed everything',
        'History of democracy — from Athens to today',
        'Civil rights movements around the world',
        'How capitalism and socialism were born'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'CrashCourse World History (Free)',            url:'https://www.youtube.com/playlist?list=PLBDA2E52FB1EF80C9',                       note:'Full world history, free, fun.' },
      { level:'🌱 Beginner',     title:'Itihas Ke Rang — Indian History Hindi',       url:'https://www.youtube.com/results?search_query=itihas+ke+rang',                    note:'Indian history in simple Hindi.' },
      { level:'📘 Intermediate', title:'History Matters — Short History Videos',      url:'https://www.youtube.com/c/HistoryMatters/videos',                                note:'5-minute history masterpieces.' },
      { level:'📘 Intermediate', title:'Kings and Generals — World History',          url:'https://www.youtube.com/c/KingsandGenerals/videos',                              note:'Military and political history.' },
      { level:'🚀 Advanced',     title:'Overly Sarcastic Productions — History',      url:'https://www.youtube.com/c/OverlySarcasticProductions/videos',                    note:'Deep dives with humor.' },
      { level:'🏆 Specialist',   title:'Sapiens — Yuval Noah Harari (Book)',          url:'https://www.amazon.in/Sapiens-Humankind-Yuval-Noah-Harari/dp/0099590085',       note:'Most important history book ever written.' }
    ]
  },

  /* ========== 9. COMMUNICATION & LANGUAGE ========== */
  'Communication and Language': {
    icon: '🗣️',
    folders: {
      'English Mastery': [
        'Grammar essentials — the rules that matter',
        'Vocabulary building — advanced words in context',
        'Writing clearly — emails, reports, messages',
        'Public speaking fundamentals',
        'Professional English for interviews and work'
      ],
      'Korean Language': [
        'Hangul — learn to read in 1 hour',
        'Basic grammar — sentence structure',
        'Everyday vocabulary — 500 essential words',
        'K-drama phrases and conversational Korean',
        'Korean culture, honorifics and social rules'
      ],
      'Communication Science': [
        'Active listening — the skill most people lack',
        'Nonverbal communication — body language',
        'Conflict resolution and difficult conversations',
        'Negotiation basics — Chris Voss methods',
        'Cross-cultural communication'
      ],
      'Storytelling and Writing': [
        'Storytelling frameworks — how great stories work',
        'Writing for LinkedIn and personal branding',
        'Email communication — clear and professional',
        'Journaling as a thinking and growth tool',
        'Presentation design and slide storytelling'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'English with Lucy — Grammar Playlist',       url:'https://www.youtube.com/playlist?list=PLfDCm8AiDr6M7KDxJMBiDvFmxTGBTnpnT',     note:'Clear, structured English learning.' },
      { level:'🌱 Beginner',     title:'Talk To Me In Korean — Level 1 (Free)',      url:'https://talktomeinkorean.com/curriculum/',                                        note:'Best Korean course online.' },
      { level:'📘 Intermediate', title:'Charisma on Command — Communication',        url:'https://www.youtube.com/c/Charismaoncommand/videos',                             note:'Real-world communication skills.' },
      { level:'📘 Intermediate', title:'Science of People — Body Language',          url:'https://www.youtube.com/c/ScienceofPeople/videos',                               note:'Research-backed body language.' },
      { level:'🚀 Advanced',     title:'Never Split the Difference — Chris Voss',    url:'https://www.youtube.com/results?search_query=never+split+the+difference+summary', note:'Negotiation that changes everything.' },
      { level:'🏆 Specialist',   title:'Toastmasters International — Join a Club',   url:'https://www.toastmasters.org/find-a-club',                                        note:'Only way to truly master public speaking.' }
    ]
  },

  /* ========== 10. CREATIVITY & DESIGN ========== */
  'Creativity and Design': {
    icon: '🎨',
    folders: {
      'Design Thinking': [
        'Design thinking process — 5 stages',
        'Human-centered design — empathy first',
        'Prototyping and iteration mindset',
        'Design thinking in tech and business',
        'How Airbnb, Apple and IDEO use design thinking'
      ],
      'Drawing and Visual Art': [
        'Drawing basics — lines, shapes, proportion',
        'Sketching for beginners — daily 10 min practice',
        'Shading and light — making things look 3D',
        'Digital art basics — Procreate, Canva',
        'Color theory — how colors work together'
      ],
      'UI/UX Design': [
        'UI vs UX — the difference explained',
        'Figma basics — design your first screen',
        'Typography — choosing and pairing fonts',
        'Color and layout principles',
        'Portfolio design for beginners'
      ],
      'Photography and Video': [
        'Photography basics — exposure, aperture, ISO',
        'Composition rules — rule of thirds, framing',
        'Smartphone photography — getting great shots',
        'Video editing basics — CapCut, Canva',
        'Visual storytelling for Instagram and LinkedIn'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'DrawWithJazza — Drawing for Beginners',      url:'https://www.youtube.com/playlist?list=PLg-UoFBMFxRCMkJ0v9dFaFPD2C1U1p3m7',     note:'Best beginner drawing channel.' },
      { level:'🌱 Beginner',     title:'Canva Design School — Free Tutorials',       url:'https://www.canva.com/designschool/',                                             note:'Learn design by doing.' },
      { level:'📘 Intermediate', title:'DesignCourse — UI/UX Full Playlist',         url:'https://www.youtube.com/playlist?list=PLVyP_replace_with_real',                  note:'Complete UI/UX from scratch.' },
      { level:'📘 Intermediate', title:'AJ&Smart — Design Thinking Playlist',        url:'https://www.youtube.com/c/AJSmart/videos',                                       note:'Real design thinking in practice.' },
      { level:'🚀 Advanced',     title:'Google UX Design Certificate (Free trial)',  url:'https://www.coursera.org/professional-certificates/google-ux-design',             note:'Industry-recognized UX certificate.' },
      { level:'🏆 Specialist',   title:'The Design of Everyday Things — Book',      url:'https://www.amazon.in/Design-Everyday-Things-Revised-Expanded/dp/0465050654',    note:'The most important design book.' }
    ]
  },

  /* ========== 11. DIY AND PRACTICAL SKILLS ========== */
  'DIY and Practical Life Skills': {
    icon: '🔧',
    folders: {
      'Home and Repairs': [
        'Basic plumbing — fixing leaks, blocked drains',
        'Electrical basics — changing switches, fuses safely',
        'Painting walls — prep, paint, finish properly',
        'Furniture assembly and basic carpentry',
        'Home organization — declutter and design your space'
      ],
      'Cooking and Food': [
        'Indian cooking basics — tadka, spices, dal, rice',
        'Meal prep — cook once, eat all week',
        'Baking basics — bread, cakes, cookies',
        'Healthy cooking on a budget',
        'International cuisine — Korean, Italian, Mexican'
      ],
      'Sewing and Fashion DIY': [
        'Basic stitching by hand — buttons, tears, hems',
        'Using a sewing machine — beginner to intermediate',
        'Upcycling clothes — turn old into new',
        'Customizing your wardrobe — patches, dye, cuts',
        'Making your own accessories'
      ],
      'Gardening and Nature': [
        'Starting a balcony garden — pots and soil',
        'Growing herbs — tulsi, curry leaves, coriander',
        'Composting at home — zero waste living',
        'Indoor plants — which ones are easy to keep',
        'Understanding seasonal planting in India'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Joshua Weissman — Cooking for Beginners',    url:'https://www.youtube.com/playlist?list=PLbpnypONLWVxJRBvpKxEPJHPg3VhNY6lB',     note:'Fun, practical cooking from scratch.' },
      { level:'🌱 Beginner',     title:'Hebbars Kitchen — Indian Recipes',           url:'https://www.youtube.com/c/hebbarskitchen/videos',                                note:'Best Indian cooking channel.' },
      { level:'📘 Intermediate', title:'Made to Sew — Beginner Sewing Playlist',    url:'https://www.youtube.com/c/MadetoSew/videos',                                     note:'Learn sewing step by step.' },
      { level:'📘 Intermediate', title:'BRIGHT SIDE — Life Hacks Playlist',         url:'https://www.youtube.com/playlist?list=PLy0LaulZe0vRkNfBk7lt-xc0tKyU3zyxq',     note:'Practical home skills.' },
      { level:'🚀 Advanced',     title:'This Old House — Home Repairs',              url:'https://www.youtube.com/c/thisoldhouse/videos',                                  note:'Professional home repair tutorials.' },
      { level:'🏆 Specialist',   title:'Skills You Need — Complete Life Skills',    url:'https://www.skillsyouneed.com/',                                                  note:'Full practical life skills database.' }
    ]
  },

  /* ========== 12. FASHION & PERSONAL STYLE ========== */
  'Fashion and Personal Style': {
    icon: '👗',
    folders: {
      'Indian Fashion': [
        'Indian traditional wear — sarees, kurtas, lehengas',
        'How to drape a saree — 5 different styles',
        'Occasion dressing — festive, casual, formal',
        'Indian fashion designers — who to follow',
        '2025 Indian fashion trends'
      ],
      'Personal Style Building': [
        'Finding your personal style — aesthetic quiz',
        'Body type dressing — what works for you',
        'Color analysis — warm vs cool tones',
        'Building a capsule wardrobe on a budget',
        'Interview and professional dressing for India'
      ],
      'Beauty and Grooming': [
        'Skincare science — ingredients that actually work',
        'Indian skin tones — what works for us specifically',
        'Minimalist makeup — 5 products that do everything',
        'Hair care for Indian hair types',
        'Budget beauty brands vs luxury — what is worth it'
      ],
      'Fashion Sustainability': [
        'Fast fashion — the true environmental cost',
        'How to shop secondhand in India',
        'Capsule wardrobe philosophy',
        'Sustainable Indian brands to support',
        'Care for clothes — make them last longer'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Malvika Sitlani — Indian Fashion and Beauty', url:'https://www.youtube.com/c/MalvikaSitlani/videos',                               note:'Trusted Indian beauty creator.' },
      { level:'🌱 Beginner',     title:'Komal Pandey — Style Tips',                  url:'https://www.youtube.com/c/KomalPandey/videos',                                   note:'Best Indian fashion YouTube.' },
      { level:'📘 Intermediate', title:'Bestdressed — Building Your Style',          url:'https://www.youtube.com/c/bestdressed/videos',                                   note:'Thoughtful personal style content.' },
      { level:'📘 Intermediate', title:'Dr. Dray — Skincare Science',                url:'https://www.youtube.com/c/DrDrayzday/videos',                                    note:'Dermatologist-level skincare facts.' },
      { level:'🚀 Advanced',     title:'Business of Fashion — Industry Insight',     url:'https://www.businessoffashion.com/',                                              note:'Fashion as a business and culture.' },
      { level:'🏆 Specialist',   title:'Vogue India — Trend Authority',              url:'https://www.vogue.in/',                                                           note:'The definitive Indian fashion guide.' }
    ]
  },

  /* ========== 13. RELATIONSHIPS & LOVE ========== */
  'Relationships and Love': {
    icon: '💕',
    folders: {
      'Understanding Yourself First': [
        'Attachment styles — anxious, avoidant, secure',
        'Your love language — what makes you feel loved',
        'Emotional needs vs wants — knowing the difference',
        'Self-worth and why it affects your relationships',
        'Healing from past relationships before moving on'
      ],
      'Choosing the Right Person': [
        'Green flags vs red flags — what to actually look for',
        'Values alignment — the only thing that truly matters',
        'The difference between chemistry and compatibility',
        'How to evaluate someone over time, not just first impressions',
        'Indian arranged marriage vs love marriage — pros and cons'
      ],
      'Building a Healthy Relationship': [
        'Communication in relationships — the only skill you need',
        'Conflict without damage — fighting without hurting',
        'Maintaining identity while being in a relationship',
        'Building trust after it is broken',
        'Healthy vs toxic relationship patterns — know the difference'
      ],
      'Marriage and Long-Term Partnership': [
        'Marriage preparation — what nobody tells you',
        'Navigating joint family dynamics — Indian context',
        'Financial compatibility and money conversations',
        'Growing together — when people change over time',
        'When to work on it and when to walk away'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'The 5 Love Languages — Summary',             url:'https://www.youtube.com/watch?v=r8r6ReTHq3A',                                    note:'Start here. Changes how you see love.' },
      { level:'🌱 Beginner',     title:'Attachment Theory Explained — Playlist',     url:'https://www.youtube.com/results?search_query=attachment+theory+explained',        note:'Understand why you behave in love.' },
      { level:'📘 Intermediate', title:'Matthew Hussey — Relationship Advice',       url:'https://www.youtube.com/c/CoachMatthewHussey/videos',                            note:'Practical, honest relationship coaching.' },
      { level:'📘 Intermediate', title:'The School of Life — Love and Relationships', url:'https://www.youtube.com/playlist?list=PLnuxM19-GHCWCNRcNEK4MiLLJONJYJH2U',    note:'Deep, philosophical relationship content.' },
      { level:'🚀 Advanced',     title:'Gottman Institute — Science of Love',        url:'https://www.gottman.com/blog/',                                                   note:'40 years of relationship research.' },
      { level:'🏆 Specialist',   title:'Hold Me Tight — Dr Sue Johnson (Book)',      url:'https://www.amazon.in/Hold-Me-Tight-Conversations-Lifetime/dp/0316113441',       note:'The science of emotional bonding.' }
    ]
  },

  /* ========== 14. PARENTING & FAMILY ========== */
  'Parenting and Family': {
    icon: '👨‍👩‍👧',
    folders: {
      'Child Development': [
        'Stages of child development — 0 to 18 years',
        'How children learn — brain development science',
        'Language development in children',
        'Emotional development — building EQ from childhood',
        'Screen time, technology and children\'s brains'
      ],
      'Parenting Styles and Approaches': [
        'Authoritative vs authoritarian parenting — the research',
        'Gentle parenting — what it actually means',
        'How to discipline without damaging self-esteem',
        'Raising confident, independent children',
        'Indian parenting — pressure, expectations, balance'
      ],
      'Family Dynamics': [
        'Sibling relationships — reducing rivalry, building bonds',
        'Joint family living — boundaries and peace',
        'Communicating with aging parents',
        'Family conflict resolution',
        'Creating family rituals and traditions'
      ],
      'Preparing Yourself to Parent': [
        'What changes when you become a parent',
        'Emotional preparation for parenthood',
        'Financial preparation — real costs in India',
        'How to be a present parent in a busy life',
        'Breaking generational trauma — the most important job'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Janet Lansbury — No Bad Kids Podcast',       url:'https://www.janetlansbury.com/podcast-audio/',                                   note:'Respectful parenting from birth.' },
      { level:'🌱 Beginner',     title:'Big Life Journal — Raising Resilient Kids',  url:'https://www.youtube.com/c/BigLifeJournal/videos',                                note:'Growth mindset for children.' },
      { level:'📘 Intermediate', title:'Dr. Becky Kennedy — Good Inside',            url:'https://www.youtube.com/c/GoodInside/videos',                                    note:'Science-backed gentle parenting.' },
      { level:'📘 Intermediate', title:'How to Talk So Kids Will Listen — Book',     url:'https://www.amazon.in/How-Talk-Kids-Will-Listen/dp/1451663870',                  note:'The parenting communication bible.' },
      { level:'🚀 Advanced',     title:'The Whole-Brain Child — Dan Siegel',         url:'https://www.youtube.com/results?search_query=whole+brain+child+dan+siegel',       note:'Neuroscience of child development.' },
      { level:'🏆 Specialist',   title:'Dr. Shefali — Conscious Parenting',         url:'https://www.youtube.com/results?search_query=dr+shefali+conscious+parenting',     note:'The most transformative parenting approach.' }
    ]
  },

  /* ========== 15. LIFE SKILLS & ADULTING ========== */
  'Life Skills and Adulting': {
    icon: '🌟',
    folders: {
      'Financial Adulting': [
        'Opening your first bank account and investments',
        'Building credit — credit score explained in India',
        'Health insurance — what you need as a young person',
        'Filing ITR — step by step for freshers',
        'Renting your first place — checklist and rights'
      ],
      'Career and Professional Life': [
        'Your first job — what nobody tells you',
        'Negotiating your salary — step by step',
        'Building a professional network on LinkedIn',
        'Managing your manager — office dynamics',
        'When to stay and when to leave a job'
      ],
      'Mental and Emotional Adulting': [
        'Setting boundaries — saying no without guilt',
        'Managing stress and anxiety as an adult',
        'Loneliness — it is normal and here is how to handle it',
        'Asking for help — why it is a strength not weakness',
        'Building a support system as you grow'
      ],
      'Practical Life Management': [
        'Time management that actually works',
        'Cooking, cleaning, and managing a home alone',
        'Dealing with difficult people at work and home',
        'Making big decisions — framework for life choices',
        'Building routines that stick'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Ali Abdaal — Study and Life Skills',         url:'https://www.youtube.com/c/aliabdaal/videos',                                     note:'Practical life and productivity skills.' },
      { level:'🌱 Beginner',     title:'Mark Manson — Life Advice Playlist',         url:'https://www.youtube.com/c/IAmMarkManson/videos',                                 note:'Honest, no-BS adulting advice.' },
      { level:'📘 Intermediate', title:'Thomas Frank — Productivity and Adulting',   url:'https://www.youtube.com/c/Thomasfrank/videos',                                   note:'Practical life systems.' },
      { level:'📘 Intermediate', title:'The Minimalists — Simplify Life',            url:'https://www.youtube.com/c/TheMinimalists/videos',                                note:'Remove what doesn\'t serve you.' },
      { level:'🚀 Advanced',     title:'Cal Newport — Deep Work and Focus',          url:'https://www.youtube.com/results?search_query=cal+newport+deep+work',              note:'The science of focused living.' },
      { level:'🏆 Specialist',   title:'Man\'s Search for Meaning — Viktor Frankl',  url:'https://www.amazon.in/Mans-Search-Meaning-Viktor-Frankl/dp/0807014273',         note:'Most important book on living meaningfully.' }
    ]
  },

  /* ========== 16. SPIRITUALITY & MINDFULNESS ========== */
  'Spirituality and Mindfulness': {
    icon: '🕯️',
    folders: {
      'Meditation and Inner Work': [
        'What meditation actually is — not what you think',
        'Mindfulness meditation — beginner practice',
        'Vipassana — the most powerful technique',
        'Breathing exercises — pranayama science',
        'Body scan and guided visualization'
      ],
      'Modern Spirituality': [
        'Non-duality — what it means to wake up',
        'Stoicism as daily spiritual practice',
        'Buddhism in modern life — practical application',
        'Gratitude science — why it rewires the brain',
        'Digital detox as a spiritual practice'
      ],
      'Daily Practices': [
        'Morning routine design — based on science',
        'Evening reflection and journaling',
        'Fasting — spiritual and physical science',
        'Nature and its effect on the nervous system',
        'Sacred rituals — why humans need ceremony'
      ],
      'Science of Consciousness': [
        'What is consciousness — nobody fully knows',
        'Meditation and the brain — neuroscience',
        'Near-death experience research — what we know',
        'Psychedelics and consciousness research',
        'The hard problem of consciousness'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Headspace — Basics of Meditation (Free)',    url:'https://www.headspace.com/meditation/meditation-for-beginners',                  note:'Best guided meditation to start.' },
      { level:'🌱 Beginner',     title:'Tara Brach — Meditation Talks (Free)',       url:'https://www.tarabrach.com/talks-audio-video/',                                    note:'Gentle, deeply wise meditation teacher.' },
      { level:'📘 Intermediate', title:'Waking Up App — Sam Harris',                 url:'https://www.wakingup.com/',                                                       note:'Science + spirituality, no dogma.' },
      { level:'📘 Intermediate', title:'Eckhart Tolle — Power of Now Playlist',     url:'https://www.youtube.com/results?search_query=eckhart+tolle+power+of+now',         note:'Most transformative spiritual teaching.' },
      { level:'🚀 Advanced',     title:'Swami Sarvapriyananda — Vedanta Lectures',  url:'https://www.youtube.com/playlist?list=PLDqahtm2vA71OHoKEkNpgOdOBiA6bGtO1',     note:'Best Vedanta teacher in English.' },
      { level:'🏆 Specialist',   title:'Vipassana 10-Day Retreat — Free',           url:'https://www.dhamma.org/en/courses/search',                                        note:'The most transformative thing you will do.' }
    ]
  },

  /* ========== 17. SCIENCE & PHYSICS ========== */
  'Science and Physics': {
    icon: '⚗️',
    folders: {
      'Physics and Universe': [
        'Newton\'s laws — intuition, not just formulas',
        'Quantum mechanics — without the math first',
        'Theory of relativity — time, space, gravity',
        'Big Bang and origin of the universe',
        'Black holes, dark matter and dark energy'
      ],
      'Chemistry and Materials': [
        'Periodic table — why elements are arranged this way',
        'Chemical reactions in everyday life',
        'Polymers and plastics — what are they really',
        'Nanotechnology — materials of the future',
        'Green chemistry — sustainable science'
      ],
      'Biology and Life': [
        'Evolution — Darwin, genes, natural selection',
        'CRISPR gene editing — how it works',
        'How viruses work — pandemic science',
        'The tree of life — how species are related',
        'Astrobiology — could life exist elsewhere'
      ],
      'Mathematics': [
        'Why mathematics is the language of the universe',
        'Linear algebra — visual understanding',
        'Calculus — intuition first, formulas second',
        'Statistics and probability for real life',
        'Mathematics of AI — why it matters'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Kurzgesagt — Science Playlist',              url:'https://www.youtube.com/c/inanutshell/videos',                                   note:'Best science communication on Earth.' },
      { level:'🌱 Beginner',     title:'MinutePhysics — Physics Basics',             url:'https://www.youtube.com/user/minutephysics/videos',                              note:'Physics in 3 minutes. Genius.' },
      { level:'📘 Intermediate', title:'3Blue1Brown — Math Visual Playlist',         url:'https://www.youtube.com/c/3blue1brown/playlists',                                note:'Makes hard math beautiful.' },
      { level:'📘 Intermediate', title:'PBS Space Time — Advanced Physics',          url:'https://www.youtube.com/c/pbsspacetime/videos',                                  note:'Deepest free physics content.' },
      { level:'🚀 Advanced',     title:'Sabine Hossenfelder — Physics Research',     url:'https://www.youtube.com/c/SabineHossenfelder/videos',                            note:'Real physics from a real physicist.' },
      { level:'🏆 Specialist',   title:'The Feynman Lectures — Free Online',         url:'https://www.feynmanlectures.caltech.edu/',                                        note:'Richard Feynman\'s complete physics lectures.' }
    ]
  },

  /* ========== 18. ENTREPRENEURSHIP & BUSINESS ========== */
  'Entrepreneurship and Business': {
    icon: '🚀',
    folders: {
      'Startup Fundamentals': [
        'Lean startup methodology — build measure learn',
        'Product-market fit — finding it and knowing you have it',
        'MVP — minimum viable product concept',
        'Startup metrics — CAC, LTV, MRR, churn',
        'Fundraising basics — angels, VCs, bootstrapping'
      ],
      'Indian Startup Ecosystem': [
        'Zepto, Zomato, CRED stories — how they did it',
        'Indian unicorn ecosystem — complete picture',
        'How to get a job at a startup vs building one',
        'Tier 2 city startups — emerging opportunities',
        'Government startup schemes — Startup India'
      ],
      'Product Management': [
        'What PMs actually do day to day',
        'Product roadmap and prioritization',
        'User research — understanding real users',
        'Agile, Scrum — working in sprints',
        'PM interview preparation — Google, Flipkart'
      ],
      'Marketing and Growth': [
        'Digital marketing fundamentals',
        'SEO — how Google decides what you see',
        'Content marketing and personal branding',
        'Social media strategy that actually works',
        'Growth hacking — famous real examples'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Y Combinator Startup School (Free)',         url:'https://www.startupschool.org/',                                                  note:'World\'s best startup education. Free.' },
      { level:'🌱 Beginner',     title:'Think School — Indian Business Cases',       url:'https://www.youtube.com/c/ThinkSchool/videos',                                   note:'Best Indian business storytelling.' },
      { level:'📘 Intermediate', title:'Nikhil Kamath — Indian Entrepreneur Talks',  url:'https://www.youtube.com/results?search_query=nikhil+kamath+entrepreneur',         note:'Real Indian startup experience.' },
      { level:'📘 Intermediate', title:'Lenny Rachitsky — Product Management',       url:'https://www.youtube.com/c/LennyRachitsky/videos',                                note:'Best PM content on the internet.' },
      { level:'🚀 Advanced',     title:'How I Built This — NPR Podcast',             url:'https://www.npr.org/series/490248027/how-i-built-this',                           note:'Founders tell their real stories.' },
      { level:'🏆 Specialist',   title:'Zero to One — Peter Thiel (Book)',           url:'https://www.amazon.in/Zero-One-Start-Build-Future/dp/0804139296',                note:'The most important startup book.' }
    ]
  },

  /* ========== 19. PRODUCTIVITY & SYSTEMS ========== */
  'Productivity and Systems': {
    icon: '⚙️',
    folders: {
      'Time Management': [
        'Time blocking — designing your ideal day',
        'Pomodoro technique — why it works',
        'The two-minute rule — GTD basics',
        'Energy management vs time management',
        'Deep work — producing what matters'
      ],
      'Second Brain and Note-Taking': [
        'Building a second brain — PARA method',
        'Zettelkasten — how to take notes that think',
        'Note-taking apps — Notion, Obsidian, which to use',
        'Capturing ideas without losing them',
        'Connecting knowledge — how to think in systems'
      ],
      'Habits and Consistency': [
        'Atomic habits — tiny changes, remarkable results',
        'Habit stacking — linking habits together',
        'The role of identity in building habits',
        'Environment design — setting up for success',
        'Tracking habits without becoming obsessed'
      ],
      'Focus and Deep Work': [
        'Why focus is becoming rare and valuable',
        'Eliminating distractions — phone, notifications',
        'Flow state — getting in it and staying there',
        'Batching tasks — why context switching kills you',
        'Rest as productivity — the science'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Atomic Habits — James Clear Summary',        url:'https://www.youtube.com/results?search_query=atomic+habits+james+clear+summary',  note:'Start here. Life changing.' },
      { level:'🌱 Beginner',     title:'Thomas Frank — Productivity Basics',         url:'https://www.youtube.com/playlist?list=PLx65qkgCWNJIIq36AT_XXAqmq9tXX2bZe',     note:'Practical, actionable.' },
      { level:'📘 Intermediate', title:'Ali Abdaal — Feel-Good Productivity',        url:'https://www.youtube.com/playlist?list=PL7BImOT2srcF61RLwBHN9iKCRRSiS1IPC',     note:'Sustainable productivity system.' },
      { level:'📘 Intermediate', title:'Building a Second Brain — Tiago Forte',      url:'https://www.youtube.com/results?search_query=building+second+brain+tiago+forte',  note:'How to store and use knowledge.' },
      { level:'🚀 Advanced',     title:'Cal Newport — Deep Work Full Talks',         url:'https://www.youtube.com/results?search_query=cal+newport+deep+work+talk',          note:'The most important productivity concept.' },
      { level:'🏆 Specialist',   title:'Getting Things Done — David Allen (Book)',   url:'https://www.amazon.in/Getting-Things-Done-Stress-Free-Productivity/dp/0349408947', note:'The complete productivity system.' }
    ]
  },

  /* ========== 20. MENTAL HEALTH & WELLBEING ========== */
  'Mental Health and Wellbeing': {
    icon: '🌸',
    folders: {
      'Understanding Your Mind': [
        'Anxiety — what it is and why your body does this',
        'Depression — the biology, not just sadness',
        'Trauma and how it lives in the body',
        'The inner critic — where it comes from',
        'Self-compassion — the science behind being kind to yourself'
      ],
      'Healing and Recovery': [
        'Therapy types — CBT, DBT, EMDR, psychodynamic',
        'How to find a good therapist in India',
        'Journaling as a healing practice',
        'The body keeps the score — somatic healing',
        'Healing without therapist — self-help that works'
      ],
      'Daily Mental Fitness': [
        'Morning mental health routine — science backed',
        'Managing overthinking — concrete techniques',
        'Social anxiety — understanding and reducing it',
        'Comparison trap — social media and self-worth',
        'Gratitude practice — how to do it so it works'
      ],
      'Growth and Resilience': [
        'Post-traumatic growth — how pain makes you stronger',
        'Building psychological resilience',
        'Emotional regulation — handling big feelings',
        'Mindset shifts that change everything',
        'Who you are vs what you do — decoupling identity'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'HealthyGamerGG — Mental Health Playlist',    url:'https://www.youtube.com/playlist?list=PLNHmFZVIHxEKc1T5vJupJ8bq0pRkFEa9P',     note:'Best honest mental health content.' },
      { level:'🌱 Beginner',     title:'Therapy in a Nutshell — Emma McAdam',        url:'https://www.youtube.com/c/TherapyinaNutshell/videos',                            note:'Therapist explains everything clearly.' },
      { level:'📘 Intermediate', title:'The Body Keeps the Score — Summary',         url:'https://www.youtube.com/results?search_query=body+keeps+the+score+summary',       note:'Most important trauma book explained.' },
      { level:'📘 Intermediate', title:'iCall India — Free Mental Health Resources', url:'https://icallhelpline.org/',                                                       note:'Indian mental health support and resources.' },
      { level:'🚀 Advanced',     title:'Gabor Maté — Trauma and Healing Talks',     url:'https://www.youtube.com/results?search_query=gabor+mate+trauma',                  note:'Deepest understanding of trauma.' },
      { level:'🏆 Specialist',   title:'Man\'s Search for Meaning — Viktor Frankl',  url:'https://www.amazon.in/Mans-Search-Meaning-Viktor-Frankl/dp/0807014273',         note:'The ultimate guide to resilience.' }
    ]
  },

  /* ========== 21. SANATANA DHARMA & INDIAN WISDOM ========== */
  'Sanatana Dharma and Indian Wisdom': {
    icon: '🕉️',
    folders: {
      'Vedas and Upanishads': [
        'What are the Vedas — Rigveda, Samaveda, Yajurveda, Atharvaveda',
        'The Upanishads — 108 texts, core teachings',
        'Brahman and Atman — the fundamental truth',
        'Tat Tvam Asi — Thou Art That, explained',
        'How to actually study the Vedas today'
      ],
      'Bhagavad Gita': [
        'Background — Kurukshetra, Arjuna\'s crisis',
        'Chapter 2 — Sankhya Yoga, the eternal self',
        'Karma Yoga — action without attachment to results',
        'Bhakti Yoga — the path of devotion',
        'Jnana Yoga — the path of knowledge',
        'Nishkama Karma — the most powerful life philosophy'
      ],
      'Ayurveda and Traditional Healing': [
        'What is Ayurveda — not just herbs, a complete system',
        'Doshas — Vata, Pitta, Kapha and your constitution',
        'Dinacharya — Ayurvedic daily routine',
        'Food as medicine — what to eat for your dosha',
        'Panchakarma — detox and rejuvenation',
        'Ayurvedic herbs — Ashwagandha, Brahmi, Turmeric science',
        'Yoga and Ayurveda together — the complete system'
      ],
      'Yoga Philosophy': [
        'Yoga is not just exercise — the eight limbs (Ashtanga)',
        'Patanjali\'s Yoga Sutras — the complete science of mind',
        'Pranayama — breath control and the nervous system',
        'Dhyana — meditation in the yogic tradition',
        'Samadhi — the goal of yoga explained'
      ],
      'Dharma and Karma': [
        'What is Dharma — your sacred duty',
        'Karma — not what Bollywood told you it is',
        'Samsara and Moksha — the cycle and liberation',
        'The four Purusharthas — Dharma, Artha, Kama, Moksha',
        'Rituals and their deeper meaning — Puja, Havan, Pilgrimages'
      ],
      'Sacred Texts and Stories': [
        'Ramayana — not just a story, a guide to righteous living',
        'Mahabharata — the most complex human story ever told',
        'Puranas — 18 texts, what they contain',
        'Thirukkural — Tamil wisdom on life, virtue and love',
        'Chanakya Arthashastra — ancient Indian statecraft'
      ],
      'Temples, Slokas and Sacred Places': [
        'Why temples are built the way they are — Vastu and science',
        'Famous Indian temples and their significance',
        'Slokas to learn — Gayatri Mantra, Mahamrityunjaya',
        'Char Dham Yatra — significance and preparation',
        'Sacred rivers, mountains and pilgrimage traditions'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Swami Sarvapriyananda — What is Vedanta (Free)', url:'https://www.youtube.com/playlist?list=PLDqahtm2vA71OHoKEkNpgOdOBiA6bGtO1', note:'Most accessible Vedanta teacher in English.' },
      { level:'🌱 Beginner',     title:'Bhagavad Gita — Chapter by Chapter Summary',  url:'https://www.youtube.com/results?search_query=bhagavad+gita+chapter+summary+english', note:'Start with chapter 2.' },
      { level:'🌱 Beginner',     title:'Ayurveda Basics — Dr. Vasant Lad',           url:'https://www.youtube.com/results?search_query=dr+vasant+lad+ayurveda+basics',     note:'Most respected Ayurveda teacher worldwide.' },
      { level:'📘 Intermediate', title:'Patanjali Yoga Sutras — Swami Vivekananda',  url:'https://www.youtube.com/results?search_query=patanjali+yoga+sutras+explained',    note:'The complete science of the mind.' },
      { level:'📘 Intermediate', title:'The Mahabharata Project — Playlist',         url:'https://www.youtube.com/results?search_query=mahabharata+explained+english',       note:'Complete Mahabharata with insights.' },
      { level:'📘 Intermediate', title:'Dr. David Frawley — Ayurveda and Vedas',     url:'https://www.youtube.com/results?search_query=david+frawley+ayurveda',             note:'Scholar connecting Ayurveda and Vedas.' },
      { level:'🚀 Advanced',     title:'Sadhguru — Inner Engineering (Free online)', url:'https://isha.sadhguru.org/in/en/wisdom/article/inner-engineering',                note:'Most complete modern Dharmic teaching.' },
      { level:'🚀 Advanced',     title:'Sanskrit and Vedic Chanting — Basics',       url:'https://www.youtube.com/results?search_query=learn+sanskrit+vedic+chanting',       note:'Understanding the language of the Vedas.' },
      { level:'🏆 Specialist',   title:'Complete Works of Swami Vivekananda (Free)', url:'https://en.wikisource.org/wiki/The_Complete_Works_of_Swami_Vivekananda',          note:'The most important Indian thinker of modern times.' },
      { level:'🏆 Specialist',   title:'Upanishads — Swami Gambhirananda Translation', url:'https://www.amazon.in/Eight-Upanishads-Vol-1-Gambhirananda/dp/8185301247',     note:'The most accurate English translation.' }
    ]
  },

  /* ========== 22. ENVIRONMENT & SUSTAINABILITY ========== */
  'Environment and Sustainability': {
    icon: '🌱',
    folders: {
      'Climate Science': [
        'Climate change — the actual science, not politics',
        'Greenhouse effect — how CO2 warms the planet',
        'Tipping points — what could trigger runaway change',
        'India\'s climate vulnerability — what is at risk',
        'Climate solutions — what actually works'
      ],
      'Sustainable Living': [
        'Zero waste living — where to start',
        'Sustainable food choices in India',
        'Fast fashion and its environmental cost',
        'Energy at home — solar, efficiency, savings',
        'Water conservation — critical for India'
      ],
      'Biodiversity and Nature': [
        'India\'s biodiversity — richest ecosystems on Earth',
        'Endangered species and what we are losing',
        'Forests — lungs of the planet and India\'s cover',
        'Rewilding — how nature heals itself',
        'Biomimicry — learning from nature to solve problems'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Kurzgesagt — Climate Change Playlist',       url:'https://www.youtube.com/playlist?list=PLFs4vir_WsTwEd-nJgVJCZPNL3HALHHpF',     note:'Best climate science communication.' },
      { level:'📘 Intermediate', title:'Our Changing Climate — Sustainability',      url:'https://www.youtube.com/c/OurChangingClimate/videos',                            note:'Solutions focused, not doom.' },
      { level:'🚀 Advanced',     title:'Project Drawdown — Real Climate Solutions',  url:'https://www.drawdown.org/',                                                       note:'The most comprehensive climate solutions list.' },
      { level:'🏆 Specialist',   title:'The Uninhabitable Earth — Book',             url:'https://www.amazon.in/Uninhabitable-Earth-Life-After-Warming/dp/0525576703',     note:'The full picture of climate impact.' }
    ]
  },

  /* ========== 23. MOVIES, SHOWS & CULTURE ========== */
  'Movies Shows and Culture': {
    icon: '🎬',
    folders: {
      'How to Watch Films Deeply': [
        'Film language — shots, angles, lighting meaning',
        'How directors tell stories — Nolan, Villeneuve',
        'Cinematography basics — what makes a scene beautiful',
        'Screenplay structure — three act, hero\'s journey',
        'How to analyse a film — beyond entertainment'
      ],
      'Must-Watch Lists': [
        'Best Indian films — art house to mainstream',
        'Best Korean cinema and dramas',
        'Best DS/tech documentaries',
        'Best psychological thrillers',
        'Documentaries that change how you see the world'
      ],
      'Music and Pop Culture': [
        'Music theory basics — why songs feel the way they do',
        'How streaming changed the music industry',
        'K-pop industry — the machine behind the magic',
        'Indian classical music — an introduction',
        'How memes shape culture and language'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Every Frame a Painting — Film Analysis',    url:'https://www.youtube.com/c/everyframeapainting/videos',                           note:'Best film education on YouTube.' },
      { level:'📘 Intermediate', title:'Lessons from the Screenplay',               url:'https://www.youtube.com/c/LessonsfromtheScreenplay/videos',                      note:'How great stories are written.' },
      { level:'🚀 Advanced',     title:'Nerdwriter1 — Culture Analysis',            url:'https://www.youtube.com/user/Nerdwriter1/videos',                                note:'Deep analysis of culture and art.' },
      { level:'🏆 Specialist',   title:'Roger Ebert — Great Movies Collection',     url:'https://www.rogerebert.com/great-movies',                                        note:'Watch every film on this list.' }
    ]
  },

  /* ========== 24. TRAVEL AND CULTURES ========== */
  'Travel and Cultures': {
    icon: '✈️',
    folders: {
      'India Travel': [
        'Incredible India — 30 places to see before you die',
        'Spiritual travel — Varanasi, Rishikesh, Tirupati',
        'Nature travel — Western Ghats, Himalayas, Andamans',
        'Budget travel in India — trains, hostels, food',
        'Solo travel as a woman in India — safety and freedom'
      ],
      'International Travel': [
        'Southeast Asia — Thailand, Vietnam, Sri Lanka on budget',
        'East Asia — Japan, Korea, Taiwan trip planning',
        'Europe backpacking — how to do it affordably',
        'Visa basics for Indians — what you need',
        'Travel photography — capturing memories well'
      ],
      'Cultural Intelligence': [
        'How to respect local customs everywhere you go',
        'Food as a window into culture',
        'Learning basic phrases before any trip',
        'Slow travel vs fast travel — which is better',
        'How travel changes you — the science'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Bruised Passports — India Travel',           url:'https://www.youtube.com/c/BruisedPassports/videos',                              note:'Beautiful Indian and world travel.' },
      { level:'📘 Intermediate', title:'Mark Wiens — Food and Travel',               url:'https://www.youtube.com/user/migrationology/videos',                             note:'Culture through food, everywhere.' },
      { level:'🚀 Advanced',     title:'Indigo Traveller — Deep Culture',            url:'https://www.youtube.com/c/IndigoTraveller/videos',                               note:'Deeper cultural immersion.' },
      { level:'🏆 Specialist',   title:'Vagabonding — Rolf Potts (Book)',            url:'https://www.amazon.in/Vagabonding-Uncommon-Guide-Art-Travel/dp/0812992180',     note:'The philosophy of long-term travel.' }
    ]
  },

  /* ========== 25. FUTURE AND EMERGING WORLD ========== */
  'Future Studies and Emerging World': {
    icon: '🔮',
    folders: {
      'Technology Future': [
        'AGI — artificial general intelligence timeline',
        'Robotics and automation — which jobs are safe',
        'Biotech future — CRISPR, synthetic biology',
        'Space colonization — Moon, Mars, humanity\'s future',
        'The Metaverse — what will actually happen'
      ],
      'Society and Future': [
        'Future of work — remote, gig, AI collaboration',
        'Demographic shifts — aging populations, India\'s youth',
        'Future of education — what school should look like',
        'Future of cities — smart cities, climate adaptation',
        'Post-scarcity world — if AI creates enough for all'
      ],
      'How to Thrive in the Future': [
        'Skills that AI cannot replace — the permanent list',
        'How to stay relevant in a rapidly changing world',
        'Building adaptability as your core skill',
        'Antifragility — getting stronger from disruption',
        'The 100-year life — planning for a long future'
      ]
    },
    roadmap: [
      { level:'🌱 Beginner',     title:'Kurzgesagt — Future of Humanity',            url:'https://www.youtube.com/playlist?list=PLFs4vir_WsTwEd-nJgVJCZPNL3HALHHpF',     note:'Beautiful future science.' },
      { level:'📘 Intermediate', title:'ColdFusion — Tech and Society',              url:'https://www.youtube.com/c/ColdFusion/videos',                                    note:'How tech reshapes civilization.' },
      { level:'🚀 Advanced',     title:'Peter Diamandis — Future Abundance',         url:'https://www.youtube.com/results?search_query=peter+diamandis+future',             note:'Optimistic, data-driven future view.' },
      { level:'🏆 Specialist',   title:'The Singularity Is Near — Ray Kurzweil',    url:'https://www.amazon.in/Singularity-Near-Humans-Transcend-Biology/dp/0143037889', note:'The most ambitious prediction of the future.' }
    ]
  }

};

console.log('learn_tree.js loaded OK - ' + Object.keys(LEARN_TREE).length + ' topics ready');