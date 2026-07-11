/* ============================================
   VASAVI'S LIFE OS — BRAIN GYM DATA
   data/brain_data.js
   AI bytes, word rescue pairs, fluency categories
   ============================================ */

/* One AI/tech concept per day — rotates by date */
var AI_BYTES = [
  { t:'What is an LLM really doing?', b:'A Large Language Model predicts the next word, billions of times. It never "looks up" answers — it generates them from patterns learned during training. That is why it can be brilliant AND confidently wrong.', q:'If it only predicts words, why does it feel like it reasons?' },
  { t:'Tokens', b:'AI models don\'t read words — they read tokens (word pieces). "Hyderabad" might be 3 tokens. Pricing, context limits and speed are all measured in tokens. Roughly: 1 token ≈ ¾ of an English word.', q:'How many tokens is your average WhatsApp message?' },
  { t:'Context window', b:'An LLM\'s context window is its short-term memory — everything you paste plus its reply must fit inside. Nothing outside the window exists for the model. Your Life OS "reminds" the AI of your data on every single message for exactly this reason.', q:'What happens to a chat when it gets longer than the window?' },
  { t:'Temperature', b:'A setting from 0 to 1 that controls randomness. Temperature 0 = same answer every time (good for data extraction). Higher = more creative but less predictable (good for brainstorming).', q:'What temperature would you use for an ATS resume parser?' },
  { t:'Fine-tuning vs RAG', b:'Fine-tuning changes the model\'s weights with your examples — expensive, permanent. RAG (Retrieval Augmented Generation) just fetches relevant documents and pastes them into the prompt — cheap, always up to date. 90% of company "custom AI" is RAG.', q:'Which one is your Life OS money advisor using?' },
  { t:'Embeddings', b:'An embedding turns text into a list of numbers where similar meanings land close together. "biryani" and "pulao" end up near each other; "biryani" and "laptop" far apart. This is how semantic search and RAG find relevant text.', q:'How would you use embeddings to search your journal by feeling, not keywords?' },
  { t:'Hallucination', b:'When an LLM states false things fluently. It is not lying — it is completing a pattern with no fact-checker inside. Fix: give it the facts in the prompt (like your app does), ask for sources, or use temperature 0.', q:'Why do hallucinations increase when the question is about rare topics?' },
  { t:'Prompt engineering is context engineering', b:'The biggest quality jump never comes from magic words — it comes from giving the model the right data, examples, and constraints. "You are an expert" helps 2%. Pasting your actual spending data helps 200%.', q:'What context would make your gym AI 10x better?' },
  { t:'What is an AI agent?', b:'An agent is an LLM in a loop with tools: it thinks, calls a tool (search, code, calendar), reads the result, and repeats until the job is done. ChatGPT answering is a model; something booking your ticket end-to-end is an agent.', q:'Which module of your Life OS could become a true agent?' },
  { t:'Overfitting', b:'A model that memorized the training data instead of learning the pattern. Perfect on practice questions, fails the real exam. Detected when training accuracy is high but test accuracy is low. Fix: more data, regularization, simpler model.', q:'How is overfitting like a student who mugs up answers?' },
  { t:'Train / validation / test split', b:'Train = learn. Validation = tune choices. Test = touch ONCE at the end for the honest score. If you tune on test data, your score is a lie you told yourself.', q:'Why is 60/20/20 more honest than 80/20?' },
  { t:'Precision vs Recall', b:'Precision: of everything I flagged, how much was right? Recall: of everything real, how much did I catch? A spam filter with high precision rarely flags good mail; high recall rarely misses spam. You almost never get both — you choose.', q:'For cancer screening, which one must be high?' },
  { t:'Gradient descent', b:'The learning algorithm behind almost all of ML: measure the error, find which direction reduces it (the gradient), take a small step, repeat a million times. Like walking downhill in fog, feeling the slope with your feet.', q:'What goes wrong if the step size (learning rate) is too big?' },
  { t:'Neural network in one line', b:'Layers of simple number-multiplications with a squish function between them — stacked deep enough, they can approximate any pattern: images, speech, language. The magic is not the neuron; it is the depth and the data.', q:'Why does adding layers help more than adding neurons to one layer?' },
  { t:'Transformer attention', b:'The 2017 idea behind GPT: every word looks at every other word and decides what matters ("bank" attends to "river" vs "money"). This parallel attention replaced reading word-by-word and made modern LLMs possible.', q:'Why is it called "attention"?' },
  { t:'Feature engineering', b:'Turning raw data into signals a model can use: "date of transaction" becomes "is_weekend", "days_since_salary". In classic ML, better features beat better algorithms almost every time. It is where domain knowledge earns money.', q:'What features would you build from your own expense data?' },
  { t:'SQL is not going anywhere', b:'Every AI product still sits on a database. Data scientists spend more hours in SQL than in ML libraries. GROUP BY, JOIN and window functions solve 80% of business questions without any model at all.', q:'Can you write your month\'s spending-by-category as one SQL query?' },
  { t:'The baseline rule', b:'Before any fancy model, compute the dumbest possible prediction (average, majority class, yesterday\'s value). If your neural network cannot beat it, you built nothing. Interviewers love hearing this.', q:'What is the baseline for predicting tomorrow\'s Bengaluru temperature?' },
  { t:'A/B testing', b:'Show version A to half the users, B to the other half, measure which wins with statistics. Every button color at Swiggy and every feed change at Instagram went through this. It is the bridge between data science and business.', q:'Why must users be assigned randomly?' },
  { t:'p-value in plain words', b:'If there were truly no effect, how surprising is my result? p = 0.03 means: only 3% chance of seeing this by pure luck. It is NOT the probability your idea is right — a subtle difference interviewers test.', q:'Why is p < 0.05 an arbitrary line?' },
  { t:'Correlation is not causation', b:'Ice cream sales and drownings rise together — summer causes both. Models find correlations; humans must ask what actually causes what, or the business decision fails. This question appears in almost every DS interview.', q:'Find one correlation-not-causation trap in your own app data.' },
  { t:'Bias in AI', b:'Models learn from human data, including its unfairness. A hiring model trained on past hires can learn to prefer men. Bias is a data problem first, model problem second — fixing it starts with asking who is missing from the data.', q:'Where could bias hide in a loan-approval model for India?' },
  { t:'Open weights vs closed models', b:'Llama and Mistral publish their weights — you can run them on your own machine, free, private. GPT and Claude are closed APIs — stronger, but you rent them. Your app can switch between both worlds with one key.', q:'When does privacy justify a weaker open model?' },
  { t:'GPU: why AI needs it', b:'Training AI is millions of matrix multiplications. CPUs do a few at a time; GPUs do thousands in parallel — they were built to paint game pixels, which is also matrix math. That accident made NVIDIA an AI empire.', q:'Why are gaming cards and AI cards cousins?' },
  { t:'Quantization', b:'Storing model weights with fewer decimal places (32-bit → 4-bit) makes models 8x smaller and faster with tiny quality loss. This is why a phone can now run a model that needed a server in 2022.', q:'What could a fully-offline phone LLM do for your Life OS?' },
  { t:'MLOps in one breath', b:'Getting a model from notebook to production and keeping it alive: versioning, deployment, monitoring, retraining when the world drifts. Companies fail here more than at modeling — which is why MLOps skills pay.', q:'What would "model drift" look like for a food-delivery time predictor?' },
  { t:'Data drift', b:'The world changes, your training data does not. A demand model trained pre-IPL fails during IPL. Production ML monitors input distributions and retrains on schedule. Models are milk, not wine.', q:'What drift would hit a Bengaluru traffic model?' },
  { t:'Vector databases', b:'Databases built to search embeddings — "find the 10 most similar meanings" in milliseconds across millions of texts. Pinecone, Chroma, pgvector. They are the memory layer of almost every RAG system.', q:'What would you store as vectors in your Life OS?' },
  { t:'Zero-shot vs few-shot', b:'Zero-shot: just ask. Few-shot: show 2-3 examples of input → output in the prompt, and quality jumps dramatically. The cheapest upgrade in all of AI is adding good examples.', q:'Write a few-shot prompt that formats expenses from messy text.' },
  { t:'Chain of thought', b:'Asking a model to "think step by step" before answering measurably improves math and logic. Newer models do this internally ("reasoning models"). Lesson: the path to the answer matters, for AI and for you in interviews.', q:'Why does writing steps reduce your own errors too?' },
  { t:'The 80/20 of data science', b:'80% of the job: getting, cleaning and understanding data. 20%: models. Juniors resent this; seniors embrace it, because whoever understands the data owns the insight.', q:'Does your own Life OS data need cleaning anywhere?' },
  { t:'APIs — how apps talk', b:'An API is a waiter: your app sends a structured request, the kitchen (server) returns a structured response, usually JSON. Your Life OS calls Groq\'s API for AI and CallMeBot\'s API for WhatsApp — same pattern, different kitchens.', q:'What API would you build FOR your Life OS?' },
  { t:'JSON', b:'The language of data exchange: {"name": "Vasavi", "goal": "DS job"}. Every API you will ever use speaks it. Your entire Life OS state is one big JSON saved to localStorage and Firebase.', q:'Open your backup file — can you read your life as JSON?' },
  { t:'Latency vs throughput', b:'Latency: how fast ONE request finishes. Throughput: how many finish per second. A chatbot needs low latency; overnight batch scoring needs high throughput. Systems are designed around which one matters.', q:'Which matters for your focus-alert engine?' },
  { t:'Caching', b:'Store the answer once, reuse it instead of recomputing. It is why the second load of a page is instant. From CPU chips to CDNs to your service worker, computing is caches all the way down.', q:'Where does your PWA cache things?' },
  { t:'Streamlit and Gradio', b:'Python libraries that turn a script into a web app in 20 lines — file upload, sliders, charts. The fastest way for a data scientist to demo a model to non-coders. A deployed demo beats a notebook in every interview.', q:'Which of your projects deserves a Streamlit demo this week?' },
  { t:'Git in 4 verbs', b:'add (stage changes), commit (save a snapshot), push (upload), pull (download). Everything else is variations. Your Life OS ships to GitHub with exactly these four.', q:'What does a commit message like "fix stuff" cost the future you?' },
  { t:'Docker in one idea', b:'Package the app WITH its environment so "works on my machine" becomes "works on every machine". A Dockerfile is a recipe; an image is the frozen meal; a container is the meal being eaten.', q:'Why do ML deployments love containers?' },
  { t:'Edge AI', b:'Running models on the device (phone, camera, watch) instead of the cloud: private, instant, works offline. Your phone\'s face unlock is edge AI. The frontier: full LLMs on phones.', q:'Which Life OS feature would benefit from offline AI?' },
  { t:'Synthetic data', b:'AI-generated training data — fake but realistic patient records, transactions, images. Used when real data is scarce, private, or dangerous. Increasingly, models are partly trained on the output of other models.', q:'What are the risks of models learning from models?' }
];

/* Word Rescue — tip-of-the-tongue trainer.
   Definition shown → she recalls the word. */
var WORD_RESCUE = [
  { w:'procrastinate', d:'To keep delaying something you know you should do now' },
  { w:'meticulous', d:'Extremely careful about every small detail' },
  { w:'ambiguous', d:'Having more than one possible meaning; unclear' },
  { w:'articulate', d:'Able to express thoughts clearly and effectively (also: to express clearly)' },
  { w:'resilient', d:'Able to recover quickly from difficulties and bounce back' },
  { w:'redundant', d:'Not needed anymore because it repeats something; superfluous' },
  { w:'feasible', d:'Possible and practical to actually do' },
  { w:'leverage', d:'To use something you have to gain maximum advantage' },
  { w:'nuance', d:'A very small, subtle difference in meaning or tone' },
  { w:'coherent', d:'Logical and well-organized; easy to follow' },
  { w:'skeptical', d:'Doubting; not easily convinced without proof' },
  { w:'pragmatic', d:'Dealing with things practically rather than idealistically' },
  { w:'consensus', d:'A general agreement among a group of people' },
  { w:'anomaly', d:'Something that deviates from what is normal or expected' },
  { w:'criteria', d:'The standards by which something is judged or decided' },
  { w:'delegate', d:'To give part of your work or authority to someone else' },
  { w:'eloquent', d:'Fluent and persuasive in speaking or writing' },
  { w:'inevitable', d:'Certain to happen; unavoidable' },
  { w:'compromise', d:'An agreement where each side gives up part of what they want' },
  { w:'hypothesis', d:'A proposed explanation you can test with data' },
  { w:'intuitive', d:'Easy to understand or use without instructions; known by feeling' },
  { w:'obsolete', d:'No longer used because something better replaced it' },
  { w:'versatile', d:'Able to adapt to many different functions or situations' },
  { w:'transparent', d:'Open and honest; easy to see through (also literally)' },
  { w:'prioritize', d:'To decide which things are most important and do them first' },
  { w:'benchmark', d:'A standard reference point you compare performance against' },
  { w:'streamline', d:'To make a process simpler and more efficient' },
  { w:'facilitate', d:'To make a process easier or help it happen' },
  { w:'comprehensive', d:'Complete; including everything that is needed' },
  { w:'spontaneous', d:'Done naturally in the moment, without planning' },
  { w:'diligent', d:'Showing steady, careful, persistent effort in work' },
  { w:'concise', d:'Saying a lot in few words; brief but complete' },
  { w:'empathy', d:'The ability to feel and understand what another person feels' },
  { w:'incentive', d:'Something that motivates you to do something (often a reward)' },
  { w:'milestone', d:'An important point of progress in a project or life' },
  { w:'bottleneck', d:'The one slow point that limits the speed of the whole process' },
  { w:'iterate', d:'To repeat a process again and again, improving each round' },
  { w:'scalable', d:'Able to grow and handle more load without breaking' },
  { w:'trade-off', d:'Giving up one benefit to gain another; a balancing choice' },
  { w:'stakeholder', d:'Anyone who is affected by or has interest in a project' }
];

/* Fluency Sprint categories — say/type as many as possible in 45s.
   This trains word RETRIEVAL — the exact skill behind
   "I know the word but can't find it right now". */
var FLUENCY_CATS = [
  'Fruits', 'Animals', 'Things in a kitchen', 'Cities of India',
  'Things at a gym', 'Emotions a person can feel', 'Jobs / professions',
  'Things you can buy for under ₹100', 'Python functions or keywords',
  'ML algorithms or concepts', 'Telugu or Hindi movies', 'Things in a hospital',
  'Words connected to money', 'Things that are round', 'Vegetables',
  'Ways to describe a person (adjectives)', 'Things in a school bag',
  'Festivals of India', 'Things that need electricity', 'Verbs of cooking (cut, boil...)',
  'Words connected to travel', 'Things smaller than your hand'
];

console.log('brain_data.js loaded OK — ' + AI_BYTES.length + ' bytes, ' + WORD_RESCUE.length + ' words, ' + FLUENCY_CATS.length + ' categories');
