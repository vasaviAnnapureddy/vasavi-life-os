/* ============================================
   VASAVI'S LIFE OS - AI ASSISTANT MODULE
   modules/ai.js
   Uses Claude API — reads ALL app data
   ============================================ */

function renderAI() {
  var state = window.AppState;
  var tab   = state.aiTab || 'chat';
  var h     = '';

  h += '<div class="subtab-bar">';
  [['chat','🤖 AI Chat'],['insights','📊 Smart Insights'],['coach','💪 Daily Coach']].forEach(function(t) {
    h += '<div class="subtab ' + (tab === t[0] ? 'active' : '') + '" onclick="switchAITab(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  h += '</div>';

  if (tab === 'chat')     h += renderAIChat(state);
  if (tab === 'insights') h += renderAIInsights(state);
  if (tab === 'coach')    h += renderAICoach(state);

  return h;
}

/* ---- AI CHAT ---- */
function renderAIChat(state) {
  var h = '';
  var msgs = state.aiMessages || [];

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">';
  h += '<div style="width:36px;height:36px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:16px;">🤖</div>';
  h += '<div><div style="font-size:13px;font-weight:800;">Vasavi\'s AI Mentor</div>';
  h += '<div style="font-size:11px;color:#10b981;">● Powered by Claude · Knows your full data</div></div>';
  h += '</div>';

  /* Messages */
  h += '<div id="ai-chat-msgs" style="min-height:180px;max-height:400px;overflow-y:auto;margin-bottom:12px;">';
  if (msgs.length === 0) {
    h += '<div style="background:#1a1a35;border-radius:0 10px 10px 10px;padding:12px;font-size:12px;line-height:1.7;max-width:90%;">';
    h += 'Hi Vasavi! 👋 I\'m your AI mentor. I can see all your data — DS progress, habits, finance, goals. Ask me anything.<br><br>';
    h += '<b>Try:</b> "How am I doing this week?" or "What should I focus on today?" or "Review my DS progress" or "Give me interview tips"';
    h += '</div>';
  } else {
    msgs.forEach(function(m) {
      if (m.role === 'user') {
        h += '<div style="display:flex;justify-content:flex-end;margin-bottom:10px;">';
        h += '<div style="background:var(--accent);border-radius:10px 0 10px 10px;padding:10px 12px;font-size:12px;line-height:1.6;max-width:80%;color:#fff;">' + escHtml(m.content) + '</div>';
        h += '</div>';
      } else {
        h += '<div style="display:flex;gap:8px;margin-bottom:10px;align-items:flex-start;">';
        h += '<div style="width:28px;height:28px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;">🤖</div>';
        h += '<div style="background:#1a1a35;border-radius:0 10px 10px 10px;padding:10px 12px;font-size:12px;line-height:1.7;max-width:88%;white-space:pre-wrap;">' + escHtml(m.content) + '</div>';
        h += '</div>';
      }
    });
  }
  h += '</div>';

  /* Loading indicator */
  h += '<div id="ai-loading" style="display:none;text-align:center;padding:10px;font-size:12px;color:#a855f7;">🤖 Thinking...</div>';

  /* Quick prompts */
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">';
  ['How am I doing?','DS progress review','What to focus today?','Interview tips','Week summary','Motivate me!'].forEach(function(p) {
    h += '<div onclick="sendAIMessage(\'' + p + '\')" style="padding:5px 10px;border-radius:99px;background:#1a1a35;border:1px solid var(--border);font-size:10px;cursor:pointer;color:#a0aec0;">' + p + '</div>';
  });
  h += '</div>';

  /* Input */
  h += '<div style="display:flex;gap:8px;">';
  h += '<input id="ai-input" placeholder="Ask your AI mentor anything..." style="flex:1;" onkeydown="if(event.key===\'Enter\')sendAIFromInput()" />';
  h += '<button class="btn-primary" id="ai-send-btn" onclick="sendAIFromInput()">Send</button>';
  h += '</div>';
  if (msgs.length > 0) {
    h += '<div style="text-align:right;margin-top:6px;"><span onclick="clearAIChat()" style="font-size:10px;color:#556080;cursor:pointer;">Clear chat</span></div>';
  }
  h += '</div>';

  return h;
}

/* ---- SMART INSIGHTS ---- */
function renderAIInsights(state) {
  var h = '';
  var ls = typeof calcLifeScore === 'function' ? calcLifeScore() : 0;

  /* Auto-generated insights from data */
  var insights = generateInsights(state);

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📊 AI-Generated Insights from Your Data</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:12px;">Based on your actual usage. Updated each time you open this page.</div>';

  insights.forEach(function(insight) {
    h += '<div style="display:flex;gap:10px;align-items:flex-start;padding:10px;border-radius:8px;margin-bottom:8px;background:#0d0d1a;border-left:3px solid ' + insight.color + ';">';
    h += '<span style="font-size:18px;flex-shrink:0;">' + insight.icon + '</span>';
    h += '<div>';
    h += '<div style="font-size:12px;font-weight:700;color:' + insight.color + ';margin-bottom:3px;">' + insight.title + '</div>';
    h += '<div style="font-size:12px;line-height:1.6;color:#a0aec0;">' + insight.text + '</div>';
    h += '</div></div>';
  });

  h += '</div>';

  /* AI full analysis button */
  h += '<button class="btn-primary" onclick="generateAIFullInsight()" style="width:100%;margin-bottom:8px;">🤖 Get Full AI Analysis</button>';
  h += '<div id="ai-insight-result" style="display:none;"></div>';

  return h;
}

function generateInsights(state) {
  var insights = [];
  var ls = typeof calcLifeScore === 'function' ? calcLifeScore() : 0;
  var habits = state.habits || [];
  var dsDone = Object.values(state.dsProgress || {}).filter(function(v){ return v === 'done'; }).length;
  var todayIdx = todayIndex();
  var habitsDoneToday = habits.filter(function(h){ return (h.week||[])[todayIdx]; }).length;
  var expenses = state.expenses || [];
  var jobs = state.jobs || [];
  var sessions = state.sessions || [];
  var focusToday = sessions.filter(function(s){ return new Date(s.start).toDateString() === todayString(); }).reduce(function(a,s){ return a+s.duration; }, 0);

  /* Life score insight */
  insights.push({
    icon: ls >= 70 ? '🔥' : ls >= 40 ? '📈' : '⚠️',
    color: ls >= 70 ? '#10b981' : ls >= 40 ? '#f59e0b' : '#ef4444',
    title: 'Life Score: ' + ls + '/100',
    text: ls >= 70 ? 'Excellent day! You are in the top performance zone. Maintain this momentum.' : ls >= 40 ? 'Solid progress. Check which habits are missing to push above 70.' : 'Score is low today. Pick just 1 task. Progress > perfection.'
  });

  /* DS progress */
  insights.push({
    icon: '💻',
    color: '#3b82f6',
    title: 'DS Roadmap: ' + dsDone + '/8 days done',
    text: dsDone === 0 ? 'You have not started the DS Roadmap yet. Day 1 is Python basics. Start today — it takes just 2 hours.' :
          dsDone < 4 ? 'Good start! ' + (8-dsDone) + ' more days to interview-ready. Stay consistent.' :
          dsDone < 8 ? 'More than halfway! You are building something real.' :
          'DS Roadmap complete! Time to apply. Apply to 10 companies today.'
  });

  /* Focus time */
  insights.push({
    icon: focusToday >= 120 ? '✅' : focusToday > 0 ? '⏱' : '💤',
    color: focusToday >= 120 ? '#10b981' : focusToday > 0 ? '#f59e0b' : '#ef4444',
    title: 'Focus Today: ' + focusToday + ' mins',
    text: focusToday >= 120 ? 'Great focus! 2+ hours logged. This is what builds skills.' :
          focusToday > 0 ? 'Good start. Push to 2 hours for a full score. Open Focus Timer.' :
          'No focus session logged yet. Start with 25 mins — just one Pomodoro.'
  });

  /* Jobs */
  if (jobs.length > 0) {
    var pending = jobs.filter(function(j){ return j.status === 'Applied'; }).length;
    var interviews = jobs.filter(function(j){ return j.status === 'Interview'; }).length;
    insights.push({
      icon: '💼',
      color: '#a855f7',
      title: 'Job Applications: ' + jobs.length + ' total',
      text: 'Applied: ' + pending + ' · Interviews: ' + interviews + '. ' + (interviews > 0 ? 'You have interviews — prepare hard!' : 'Keep applying. 10/day is the target.')
    });
  }

  /* Finance */
  var now = new Date();
  var monthExpenses = expenses.filter(function(e){ var d=new Date(e.date); return d.getMonth()===now.getMonth(); });
  var monthSpend = monthExpenses.reduce(function(a,e){ return a+(e.amount||0); }, 0);
  if (monthExpenses.length > 0) {
    insights.push({
      icon: '💰',
      color: '#f59e0b',
      title: 'Month Spend: ₹' + formatRupees(monthSpend),
      text: 'You have logged ' + monthExpenses.length + ' expenses this month. ' + (monthSpend > 5000 ? 'Spending is high. Review top categories.' : 'Good discipline with money.')
    });
  }

  return insights;
}

/* ---- DAILY COACH ---- */
function renderAICoach(state) {
  var h = '';
  var day = new Date().getDay();
  var isSunday = day === 0;

  if (isSunday) {
    h += '<div style="background:#1a1533;border:1px solid #a855f7;border-radius:12px;padding:20px;text-align:center;margin-bottom:14px;">';
    h += '<div style="font-size:36px;margin-bottom:8px;">🙏</div>';
    h += '<div style="font-size:16px;font-weight:800;margin-bottom:8px;">Sunday Rest Day</div>';
    h += '<div style="font-size:12px;color:#8899bb;line-height:1.7;">No tasks. No guilt. You\'ve earned today.<br>System is quiet. Come back strong tomorrow.<br>Sleep well. Your brain is consolidating this week\'s learning.</div>';
    h += '</div>';
    return h;
  }

  /* Daily schedule reminders based on time */
  var hr = new Date().getHours();
  var schedule = [
    { start:5,  end:7,   msg:'🧠 Morning Study Block. Best time for theory — your memory consolidation is peak now.', action:'Open DS Roadmap → Theory section' },
    { start:7,  end:9,   msg:'🏋️ GYM TIME! Per your schedule 7:00–9:10 AM. Body needs you today.', action:'Log your gym session after' },
    { start:10, end:13,  msg:'💻 DEEP WORK BLOCK 1. Peak cognitive performance window. No distractions.', action:'Open Focus Timer → 25-min Pomodoro' },
    { start:13, end:14,  msg:'🍽️ Lunch break. Eat fully and enjoy. Non-negotiable rest.', action:'Log calories after lunch' },
    { start:14, end:16,  msg:'💻 DEEP WORK BLOCK 2. Assignments, projects, coding practice.', action:'Pick the hardest task first' },
    { start:16, end:17,  msg:'😌 Brain recharge. Rest, nap, or walk. Psychology says this is essential.', action:'No screens for 30 mins' },
    { start:17, end:18,  msg:'🌍 Daily Learning Hour. Pick today\'s curiosity topic.', action:'Open Learning OS → 30-Day Curriculum' },
    { start:18, end:19,  msg:'🎬 ENJOY LIFE. Family, watch something, free time. Non-negotiable joy.', action:'Put the phone down. Be present.' },
    { start:19, end:20,  msg:'📚 Revision + Weak Area Review. What did you struggle with today?', action:'Open DS Roadmap → Notes tab' },
    { start:20, end:21,  msg:'🗣️ Language Practice. 10 mins English + 10 mins Korean.', action:'Open Language OS → Start Session' },
    { start:21, end:22,  msg:'🎤 Interview Prep Time. 9:30–10:30 PM is your best interview practice window.', action:'Open Interview Prep → Mock Mode' },
    { start:22, end:23,  msg:'📔 Journal + Log expenses + Tomorrow plan.', action:'Open Journal → Reflection tab' }
  ];

  var current = schedule.find(function(s){ return hr >= s.start && hr < s.end; });

  if (current) {
    h += '<div style="background:linear-gradient(135deg,#1a0533,#0a1020);border-radius:12px;padding:16px;margin-bottom:14px;">';
    h += '<div style="font-size:10px;color:#a855f7;font-weight:800;margin-bottom:6px;">RIGHT NOW — ' + new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }) + '</div>';
    h += '<div style="font-size:14px;font-weight:700;line-height:1.6;margin-bottom:10px;">' + current.msg + '</div>';
    h += '<div style="background:#1a1a35;border-radius:8px;padding:10px;font-size:12px;color:#10b981;font-weight:700;">▶ ' + current.action + '</div>';
    h += '</div>';
  }

  /* Full schedule for today */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📅 Today\'s Schedule</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;">Built from your psychology-based schedule. Sleep by 11 PM. 🌙</div>';
  var scheduleItems = [
    ['5:30–7:00 AM',  '🧠 Morning Study (theory)', hr < 7],
    ['7:00–9:10 AM',  '🏋️ GYM', hr >= 7 && hr < 10],
    ['10:30 AM–1 PM', '💻 Deep Work Block 1', hr >= 10 && hr < 13],
    ['1:00–2:00 PM',  '🍽️ Lunch', hr >= 13 && hr < 14],
    ['2:00–4:00 PM',  '💻 Deep Work Block 2', hr >= 14 && hr < 16],
    ['4:00–5:00 PM',  '😌 Rest / Recharge', hr >= 16 && hr < 17],
    ['5:00–6:00 PM',  '🌍 Daily Learning', hr >= 17 && hr < 18],
    ['6:00–7:00 PM',  '🎬 Enjoy Life (non-negotiable!)', hr >= 18 && hr < 19],
    ['7:00–8:00 PM',  '📚 Revision + Weak Areas', hr >= 19 && hr < 20],
    ['8:00–8:30 PM',  '🗣️ Language Practice', hr >= 20 && hr < 20.5],
    ['9:30–10:30 PM', '🎤 Interview Prep', hr >= 21 && hr < 22],
    ['10:30–11 PM',   '📔 Journal + Log + Plan', hr >= 22 && hr < 23],
    ['11:00 PM',      '😴 SLEEP (non-negotiable)', false]
  ];
  scheduleItems.forEach(function(item) {
    var isNow = item[2];
    h += '<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #1a1a35;' + (isNow ? 'background:#1a1a35;border-radius:6px;padding:8px 10px;' : '') + '">';
    h += '<span style="font-size:10px;color:' + (isNow ? '#a855f7' : '#556080') + ';font-weight:' + (isNow ? '800' : '400') + ';min-width:80px;flex-shrink:0;">' + item[0] + '</span>';
    h += '<span style="font-size:12px;' + (isNow ? 'color:#fff;font-weight:700;' : 'color:#a0aec0;') + '">' + item[1] + '</span>';
    if (isNow) h += '<span style="margin-left:auto;font-size:10px;color:#a855f7;font-weight:800;">NOW</span>';
    h += '</div>';
  });
  h += '</div>';

  return h;
}

/* ============================================
   AI API ACTIONS
   ============================================ */
function switchAITab(tab) { window.AppState.aiTab = tab; saveData(); renderPage(); }
function clearAIChat()    { window.AppState.aiMessages = []; saveData(); renderPage(); }

function sendAIFromInput() {
  var el = document.getElementById('ai-input');
  if (!el || !el.value.trim()) return;
  sendAIMessage(el.value.trim());
  el.value = '';
}

function sendAIMessage(userMsg) {
  if (!window.AppState.aiMessages) window.AppState.aiMessages = [];
  window.AppState.aiMessages.push({ role: 'user', content: userMsg });
  saveData(); renderPage();

  var loadEl = document.getElementById('ai-loading');
  if (loadEl) loadEl.style.display = 'block';
  var sendBtn = document.getElementById('ai-send-btn');
  if (sendBtn) sendBtn.disabled = true;

  var context = buildAIContext();
  callClaudeAPI(context, userMsg, function(reply) {
    if (loadEl) loadEl.style.display = 'none';
    if (sendBtn) sendBtn.disabled = false;
    window.AppState.aiMessages.push({ role: 'assistant', content: reply });
    saveData(); renderPage();
    setTimeout(function(){ var el=document.getElementById('ai-chat-msgs'); if(el) el.scrollTop=el.scrollHeight; }, 100);
  });
}

function generateAIFullInsight() {
  var btn = event.target;
  btn.disabled = true;
  btn.textContent = '🤖 Analyzing your data...';

  var context = buildAIContext();
  callClaudeAPI(context, 'Give me a comprehensive analysis of my current progress. Include: Life Score breakdown, what I am doing well, what needs improvement, top 3 priorities for the next 7 days, and one honest insight I might not want to hear but need to.', function(reply) {
    btn.disabled = false;
    btn.textContent = '🤖 Get Full AI Analysis';
    var resultEl = document.getElementById('ai-insight-result');
    if (resultEl) {
      resultEl.style.display = 'block';
      resultEl.innerHTML = '<div class="card" style="margin-top:14px;"><div class="card-header">🤖 Full AI Analysis</div><div style="font-size:12px;line-height:1.8;white-space:pre-wrap;color:#a0aec0;">' + escHtml(reply) + '</div></div>';
    }
  });
}

function buildAIContext() {
  var state = window.AppState;
  var ls = typeof calcLifeScore === 'function' ? calcLifeScore() : 0;
  var dsDone = Object.values(state.dsProgress || {}).filter(function(v){ return v === 'done'; }).length;
  var habits = state.habits || [];
  var todayIdx = todayIndex();
  var habitsDone = habits.filter(function(h){ return (h.week||[])[todayIdx]; }).length;
  var sessions = state.sessions || [];
  var focusToday = sessions.filter(function(s){ return new Date(s.start).toDateString() === todayString(); }).reduce(function(a,s){ return a+s.duration; }, 0);
  var jobs = state.jobs || [];
  var monthExpenses = (state.expenses || []).filter(function(e){ var d=new Date(e.date); return d.getMonth()===new Date().getMonth(); });
  var monthSpend = monthExpenses.reduce(function(a,e){ return a+(e.amount||0); }, 0);

  return 'You are Vasavi\'s personal AI mentor inside her Life OS. You know her personally.\n\n' +
    'ABOUT VASAVI:\n' +
    '- Name: Vasavi | Location: Bengaluru, India\n' +
    '- Goal: Get a DS/AI job as a fresher | Graduated June 2025\n' +
    '- Course: DataMites (Python, Stats, ML, DL, SQL, PowerBI, Flask, AWS, PySpark)\n' +
    '- Gym: Daily 7-9 AM | Food weakness: sweets before 6 PM\n' +
    '- Learning: English + Korean (10 mins each daily)\n' +
    '- Biggest strength: Creative thinking, systems thinker\n' +
    '- Biggest challenge: Starts things but needs help finishing\n\n' +
    'CURRENT DATA:\n' +
    '- Life Score today: ' + ls + '/100\n' +
    '- DS Roadmap: ' + dsDone + '/8 study days done\n' +
    '- Habits today: ' + habitsDone + '/' + habits.length + ' done\n' +
    '- Focus today: ' + focusToday + ' minutes\n' +
    '- Jobs applied total: ' + jobs.length + '\n' +
    '- Month spend: ₹' + monthSpend + '\n' +
    '- Day number: ' + (state.dayNumber || 1) + '\n\n' +
    'TONE RULES:\n' +
    '- Use her name "Vasavi" naturally\n' +
    '- Be warm but direct — mentor-friend who knows her\n' +
    '- Give specific actionable advice based on her actual data\n' +
    '- When score is low: gentle, one question only\n' +
    '- When doing well: celebrate with DATA not empty words\n' +
    '- Never say "Great question!" or use filler phrases\n' +
    '- Keep responses under 200 words unless deep analysis requested\n' +
    '- Currency: Indian Rupees (₹)';
}

function callClaudeAPI(systemPrompt, userMsg, callback) {
  if (typeof callAI === 'function') {
    callAI(systemPrompt, userMsg, callback);
    return;
  }
  /* Fallback to built-in smart responses if no API */
  var state = window.AppState;
  var ls = typeof calcLifeScore === 'function' ? calcLifeScore() : 50;
  var dsDone = Object.values(state.dsProgress || {}).filter(function(v){ return v === 'done'; }).length;
  var t = userMsg.toLowerCase();
  var reply = '';

  if (t.includes('how am i') || t.includes('progress') || t.includes('doing')) {
    reply = 'Vasavi, here\'s your honest data:\n\nLife Score: ' + ls + '/100\nDS days done: ' + dsDone + '/8\nJobs applied: ' + (state.jobs||[]).length + '\n\n' + (ls >= 70 ? '🔥 You\'re in a strong zone. Keep this exact energy.' : ls >= 40 ? 'Solid progress. Focus on completing today\'s habits to push above 70.' : 'Low score today — that\'s data, not failure. What ONE thing can you do in the next 30 mins?');
  } else if (t.includes('focus') || t.includes('today') || t.includes('priority')) {
    reply = 'Your top 3 for today, Vasavi:\n\n1. DS Roadmap Day ' + (dsDone + 1) + ' — this is your interview preparation\n2. Log expenses and habits — keeps your score up\n3. Language practice — 10 mins English + 10 mins Korean\n\nOpen Focus Timer. Set 25 mins. Start with DS.';
  } else if (t.includes('interview') || t.includes('job')) {
    reply = 'Vasavi, DS interview strategy:\n\n✅ ' + dsDone + '/8 roadmap days done\n\nNext steps:\n1. Complete remaining DS days\n2. Build your Finance Intelligence Dashboard project\n3. Push to GitHub with a clean README\n4. Apply to 10 companies: Fractal, Tiger Analytics, Mu Sigma first\n\nYou have the knowledge. You need proof of execution. The project IS the proof.';
  } else if (t.includes('motivat') || t.includes('tired') || t.includes('stuck')) {
    reply = 'Vasavi, motivation comes AFTER action, not before.\n\nYou built a full Life OS. You completed ' + dsDone + ' DS days. You\'re tracking habits, finance, everything.\n\nMost people just talk about wanting a DS job. You\'re building systems for it.\n\nOpen the Focus Timer. 25 minutes. Just start.';
  } else if (t.includes('week') || t.includes('summary')) {
    reply = 'This week snapshot:\n\n• DS days done: ' + dsDone + '/8\n• Life Score today: ' + ls + '\n• Jobs applied: ' + (state.jobs||[]).length + '\n\nCheck the Analytics tab → Weekly for full breakdown with charts.';
  } else {
    reply = 'Vasavi, I see you. Score today: ' + ls + '. DS progress: ' + dsDone + '/8.\n\n' + (ls >= 70 ? 'You\'re doing great. Keep that momentum.' : 'One step at a time. What do you need help with right now?');
  }

  setTimeout(function(){ callback(reply); }, 800);
}

console.log('ai.js loaded OK');