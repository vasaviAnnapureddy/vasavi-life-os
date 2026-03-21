/* ============================================
   VASAVI'S LIFE OS — LEARNING UNIVERSE
   modules/learning.js
   7 Roots · 84 Branches · 400+ Topics
   Click topic → AI explains → ask resources
   Notes saved forever · levels unlock naturally
   ============================================ */

/* All root data loaded from data/mindmap_r*.js */

function renderLearning() {
  var state = window.AppState;
  var tab   = state.learnTab || 'map';

  /* Get all roots safely */
  var allRoots = [];
  [typeof MM_R1 !== 'undefined' && MM_R1,
   typeof MM_R2 !== 'undefined' && MM_R2,
   typeof MM_R3 !== 'undefined' && MM_R3,
   typeof MM_R4 !== 'undefined' && MM_R4,
   typeof MM_R5 !== 'undefined' && MM_R5,
   typeof MM_R6 !== 'undefined' && MM_R6,
   typeof MM_R7 !== 'undefined' && MM_R7
  ].forEach(function(r){ if(r) allRoots.push(r); });

  var totalTopics  = allRoots.reduce(function(a,r){ return a + r.branches.reduce(function(b,br){ return b + br.topics.length; },0); }, 0);
  var totalBranches= allRoots.reduce(function(a,r){ return a + r.branches.length; }, 0);
  var learnedCount = Object.keys(state.topicLevels||{}).filter(function(k){ return (state.topicLevels[k]||0) >= 1; }).length;

  /* Topic open view */
  if (state.learnOpenTopic) {
    return renderTopicView(state, allRoots);
  }

  var h = '';

  /* Header stats */
  h += '<div class="grid-4" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + allRoots.length + '</div><div class="stat-label">Roots</div><div class="stat-sub">7 worlds of knowledge</div></div>';
  h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">' + totalBranches + '</div><div class="stat-label">Branches</div><div class="stat-sub">Topics areas</div></div>';
  h += '<div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-value">' + totalTopics + '+</div><div class="stat-label">Topics</div><div class="stat-sub">Click any to learn</div></div>';
  h += '<div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-value">' + learnedCount + '</div><div class="stat-label">Topics Explored</div><div class="stat-sub">Your journey so far</div></div>';
  h += '</div>';

  /* Tabs */
  h += '<div class="subtab-bar">';
  [['map','🗺️ Mind Map'],['notes','📓 My Notes'],['progress','📊 Progress'],['custom','➕ My Topics']].forEach(function(t){
    h += '<div class="subtab ' + (tab===t[0]?'active':'') + '" onclick="switchLearnTab(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  h += '</div>';

  if (tab === 'map')      h += renderMindMap(state, allRoots);
  if (tab === 'notes')    h += renderMyNotes(state);
  if (tab === 'progress') h += renderProgress(state, allRoots);
  if (tab === 'custom')   h += renderCustomTopics(state);

  return h;
}

/* ============================================
   MIND MAP VIEW
   ============================================ */
function renderMindMap(state, allRoots) {
  var h = '';
  var openRoot = state.learnOpenRoot || null;

  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:14px;">Click any root to expand → click any topic to start learning. The AI will explain it to you.</div>';

  allRoots.forEach(function(root) {
    var isOpen    = openRoot === root.id;
    var rootTotal = root.branches.reduce(function(a,br){ return a + br.topics.length; },0);
    var rootLearned = root.branches.reduce(function(a,br){
      return a + br.topics.filter(function(t,ti){
        var key = root.id + '_' + br.id + '_' + ti;
        return (state.topicLevels||{})[key] >= 1;
      }).length;
    }, 0);
    var pct = rootTotal > 0 ? Math.round((rootLearned/rootTotal)*100) : 0;

    h += '<div style="border:1px solid ' + (isOpen ? root.color : 'var(--border)') + ';border-radius:12px;margin-bottom:10px;overflow:hidden;">';

    /* Root header */
    h += '<div onclick="toggleLearnRoot(\'' + root.id + '\')" style="display:flex;justify-content:space-between;align-items:center;padding:14px;cursor:pointer;background:' + (isOpen ? root.color + '18' : 'var(--card2)') + ';">';
    h += '<div style="display:flex;align-items:center;gap:12px;">';
    h += '<span style="font-size:26px;">' + root.icon + '</span>';
    h += '<div>';
    h += '<div style="font-size:14px;font-weight:700;">' + escHtml(root.root) + '</div>';
    h += '<div style="font-size:11px;color:#8899bb;">' + root.branches.length + ' branches · ' + rootTotal + ' topics · ' + rootLearned + ' explored</div>';
    h += '</div></div>';
    h += '<div style="display:flex;align-items:center;gap:10px;">';
    if (pct > 0) h += '<span style="font-size:11px;font-weight:700;color:' + root.color + ';">' + pct + '%</span>';
    h += '<span style="color:#8899bb;font-size:18px;">' + (isOpen?'∨':'›') + '</span>';
    h += '</div></div>';

    /* Progress bar */
    if (pct > 0) {
      h += '<div style="height:3px;background:#1a1a35;">';
      h += '<div style="height:3px;background:' + root.color + ';width:' + pct + '%;transition:width .4s;"></div>';
      h += '</div>';
    }

    /* Expanded: branches and topics */
    if (isOpen) {
      h += '<div style="padding:12px;background:#080812;">';
      root.branches.forEach(function(branch) {
        var branchOpen = (state.learnOpenBranch === branch.id);
        var brLearned  = branch.topics.filter(function(t,ti){
          return (state.topicLevels||{})[root.id + '_' + branch.id + '_' + ti] >= 1;
        }).length;

        h += '<div style="margin-bottom:8px;border:1px solid #1a1a35;border-radius:8px;overflow:hidden;">';

        /* Branch header */
        h += '<div onclick="toggleLearnBranch(\'' + branch.id + '\')" style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;cursor:pointer;background:#0d0d1a;">';
        h += '<div style="display:flex;align-items:center;gap:8px;">';
        h += '<span style="font-size:14px;">📂</span>';
        h += '<span style="font-size:12px;font-weight:700;">' + escHtml(branch.name) + '</span>';
        h += '<span style="font-size:10px;color:#556080;">' + brLearned + '/' + branch.topics.length + '</span>';
        h += '</div>';
        h += '<span style="color:#8899bb;font-size:14px;">' + (branchOpen?'∨':'›') + '</span>';
        h += '</div>';

        /* Topics grid */
        if (branchOpen) {
          h += '<div style="padding:10px 12px;background:#08080f;display:flex;flex-wrap:wrap;gap:6px;">';
          branch.topics.forEach(function(topic, ti) {
            var key     = root.id + '_' + branch.id + '_' + ti;
            var level   = (state.topicLevels||{})[key] || 0;
            var lvColor = level >= 2 ? '#10b981' : level === 1 ? '#f59e0b' : '#556080';
            var lvBg    = level >= 2 ? '#0a1a0a' : level === 1 ? '#1a1500' : '#0d0d1a';
            var lvBorder= level >= 2 ? '#14532d' : level === 1 ? '#451a03' : '#1a1a35';
            h += '<div onclick="openLearnTopic(\'' + root.id + '\',\'' + branch.id + '\',' + ti + ')" ';
            h += 'style="padding:6px 10px;border-radius:99px;cursor:pointer;font-size:11px;';
            h += 'background:' + lvBg + ';border:1px solid ' + lvBorder + ';color:' + lvColor + ';';
            h += 'max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">';
            h += (level >= 2 ? '✅ ' : level === 1 ? '📘 ' : '○ ') + escHtml(topic);
            h += '</div>';
          });
          /* Custom subtopics added by Vasavi */
          var subKey  = root.id + '_' + branch.id;
          var customSubs = (state.customSubtopics||{})[subKey] || [];
          customSubs.forEach(function(sub, si) {
            var sKey    = root.id + '_' + branch.id + '_custom_' + si;
            var sLevel  = (state.topicLevels||{})[sKey] || 0;
            var lvColor = sLevel >= 2 ? '#10b981' : sLevel === 1 ? '#f59e0b' : '#a855f7';
            var lvBg    = sLevel >= 2 ? '#0a1a0a' : sLevel === 1 ? '#1a1500' : '#1a0a2e';
            var lvBorder= sLevel >= 2 ? '#14532d' : sLevel === 1 ? '#451a03' : '#3b1f6e';
            h += '<div style="display:flex;align-items:center;gap:4px;">';
            h += '<div onclick="openLearnTopic(\'' + root.id + '\',\'' + branch.id + '_custom_' + si + '\',0)" ';
            h += 'style="padding:6px 10px;border-radius:99px;cursor:pointer;font-size:11px;flex:1;';
            h += 'background:' + lvBg + ';border:1px solid ' + lvBorder + ';color:' + lvColor + ';';
            h += 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">';
            h += '★ ' + escHtml(sub);
            h += '</div>';
            h += '<button onclick="event.stopPropagation();deleteSubtopic(\'' + root.id + '\',\'' + branch.id + '\',' + si + ')" ';
            h += 'style="background:transparent;border:none;color:#556080;cursor:pointer;font-size:12px;padding:2px 4px;">×</button>';
            h += '</div>';
          });

          /* Add subtopic row */
          h += '<div style="display:flex;gap:5px;margin-top:4px;width:100%;">';
          h += '<input id="sub-' + branch.id + '" placeholder="+ Add your subtopic here..." ';
          h += 'style="flex:1;font-size:10px;padding:4px 8px;border-radius:99px;" ';
          h += 'onkeydown="if(event.key===\'Enter\')addSubtopic(\'' + root.id + '\',\'' + branch.id + '\')" />';
          h += '<button onclick="addSubtopic(\'' + root.id + '\',\'' + branch.id + '\')" ';
          h += 'style="font-size:10px;padding:4px 10px;border-radius:99px;background:' + root.color + '33;border:1px solid ' + root.color + ';color:' + root.color + ';cursor:pointer;">+ Add</button>';
          h += '</div>';

          h += '</div>';
        }

        h += '</div>';
      });

      /* Add custom topic to this root */
      h += '<div style="margin-top:8px;display:flex;gap:8px;">';
      h += '<input id="custom-' + root.id + '" placeholder="Add your own topic to this root..." style="flex:1;font-size:11px;" />';
      h += '<button onclick="addCustomToRoot(\'' + root.id + '\')" class="btn-ghost" style="font-size:11px;">+ Add</button>';
      h += '</div>';
      h += '</div>';
    }

    h += '</div>';
  });

  return h;
}

/* ============================================
   TOPIC VIEW — AI explains, notes, resources
   ============================================ */
function renderTopicView(state, allRoots) {
  var ot = state.learnOpenTopic;
  var root   = allRoots.find(function(r){ return r.id === ot.rootId; });
  var branch = root && root.branches.find(function(b){ return b.id === ot.branchId; });
  if (!root || !branch) return '<div class="empty-state"><div class="emo">🔍</div><p>Topic not found.</p></div>';

  var topic  = branch.topics[ot.topicIdx];
  var key    = root.id + '_' + branch.id + '_' + ot.topicIdx;
  var level  = (state.topicLevels||{})[key] || 0;
  var note   = (state.topicNotes||{})[key] || '';
  var msgs   = (state.topicMsgs||{})[key] || [];

  var h = '';

  /* Back */
  h += '<button onclick="closeLearnTopic()" style="background:transparent;border:1px solid var(--border);color:#8899bb;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:11px;margin-bottom:14px;">← Back to Map</button>';

  /* Topic header */
  h += '<div style="background:' + root.color + '18;border:1px solid ' + root.color + '44;border-radius:12px;padding:16px;margin-bottom:14px;">';
  h += '<div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;">';
  h += '<span style="font-size:11px;font-weight:700;color:' + root.color + ';">' + root.icon + ' ' + escHtml(root.root) + '</span>';
  h += '<span style="font-size:11px;color:#556080;">→ ' + escHtml(branch.name) + '</span>';
  h += '</div>';
  h += '<div style="font-size:18px;font-weight:800;margin-bottom:8px;">' + escHtml(topic) + '</div>';

  /* Level badges */
  h += '<div style="display:flex;gap:6px;align-items:center;">';
  [{l:0,label:'Beginner',color:'#10b981'},{l:1,label:'Intermediate',color:'#3b82f6'},{l:2,label:'Advanced',color:'#a855f7'}].forEach(function(lv){
    var active = level >= lv.l;
    var locked = level < lv.l;
    h += '<span style="font-size:10px;padding:3px 10px;border-radius:99px;font-weight:700;';
    h += 'background:' + (active ? lv.color + '33' : '#1a1a35') + ';';
    h += 'color:' + (active ? lv.color : '#556080') + ';';
    h += 'border:1px solid ' + (active ? lv.color : '#1a1a35') + ';">';
    h += (locked ? '🔒 ' : active && level === lv.l ? '▶ ' : '✓ ') + lv.label;
    h += '</span>';
  });
  h += '</div></div>';

  /* AI Chat section */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">';
  h += '<span style="font-size:20px;">🤖</span>';
  h += '<div><div style="font-size:13px;font-weight:700;">Your AI Teacher</div>';
  h += '<div style="font-size:11px;color:#10b981;">● Explains · Answers questions · Gives resources</div></div>';
  h += '</div>';

  /* Messages */
  h += '<div id="topic-msgs" style="min-height:120px;max-height:320px;overflow-y:auto;margin-bottom:12px;">';

  if (msgs.length === 0) {
    /* Auto first explanation */
    var intro = getTopicExplanation(topic, root.root, level);
    h += '<div style="background:#1a1a35;border-radius:0 10px 10px 10px;padding:12px;font-size:12px;line-height:1.8;white-space:pre-wrap;">' + escHtml(intro) + '</div>';
  } else {
    msgs.forEach(function(m){
      if (m.role === 'user') {
        h += '<div style="display:flex;justify-content:flex-end;margin-bottom:8px;">';
        h += '<div style="background:' + root.color + ';color:#fff;border-radius:10px 0 10px 10px;padding:9px 12px;font-size:12px;line-height:1.6;max-width:80%;">' + escHtml(m.text) + '</div>';
        h += '</div>';
      } else {
        h += '<div style="display:flex;gap:8px;margin-bottom:8px;align-items:flex-start;">';
        h += '<span style="font-size:18px;flex-shrink:0;">🤖</span>';
        h += '<div style="background:#1a1a35;border-radius:0 10px 10px 10px;padding:9px 12px;font-size:12px;line-height:1.8;max-width:88%;white-space:pre-wrap;">' + escHtml(m.text) + '</div>';
        h += '</div>';
      }
    });
  }
  h += '</div>';

  /* Quick actions */
  h += '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;">';
  ['Explain more deeply','Give me examples from India','What are the resources?','How to practise this?','Quiz me on this','How does this connect to real life?','Give me a YouTube playlist'].forEach(function(p){
    h += '<div onclick="sendTopicMsg(\'' + key + '\',\'' + p.replace(/'/g,'') + '\')" ';
    h += 'style="padding:4px 10px;border-radius:99px;background:#1a1a35;border:1px solid var(--border);font-size:10px;cursor:pointer;color:#a0aec0;">' + p + '</div>';
  });
  h += '</div>';

  h += '<div id="topic-loading" style="display:none;text-align:center;padding:6px;font-size:11px;color:' + root.color + ';">Thinking...</div>';

  h += '<div style="display:flex;gap:8px;">';
  h += '<input id="topic-input" placeholder="Ask anything about this topic..." style="flex:1;" onkeydown="if(event.key===\'Enter\')sendTopicFromInput(\'' + key + '\')" />';
  h += '<button onclick="sendTopicFromInput(\'' + key + '\')" class="btn-primary">Ask</button>';
  h += '</div></div>';

  /* Notes */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div style="font-size:11px;font-weight:700;color:' + root.color + ';margin-bottom:8px;">📝 My Notes — saved forever</div>';
  h += '<textarea id="topic-note" rows="5" placeholder="Write while you learn... insights, questions, things that surprised you, how this connects to your life..." oninput="saveTopicNote(\'' + key + '\',this.value)" style="font-size:12px;">' + escHtml(note) + '</textarea>';
  h += '<div style="font-size:10px;color:#556080;margin-top:4px;">Auto-saved to your storage ✓</div>';
  h += '</div>';

  /* Level up */
  h += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  if (level === 0) {
    h += '<button onclick="markTopicLevel(\'' + key + '\',1)" class="btn-primary" style="flex:1;">📘 I understand the basics — Unlock Intermediate</button>';
  } else if (level === 1) {
    h += '<button onclick="markTopicLevel(\'' + key + '\',2)" class="btn-primary" style="flex:1;">🚀 I have intermediate knowledge — Unlock Advanced</button>';
  } else {
    h += '<div style="flex:1;text-align:center;padding:10px;font-size:12px;color:#a855f7;font-weight:700;">🏆 Advanced level unlocked! Ask the AI to go deeper.</div>';
  }
  h += '</div>';

  /* Navigation: prev / next topic */
  var allTopics = [];
  if (root) root.branches.forEach(function(br){ br.topics.forEach(function(t,ti){ allTopics.push({brId:br.id,ti:ti,name:t}); }); });
  var currIdx = allTopics.findIndex(function(t){ return t.brId===ot.branchId && t.ti===ot.topicIdx; });
  h += '<div style="display:flex;gap:8px;margin-top:10px;">';
  if (currIdx > 0) {
    var prev = allTopics[currIdx-1];
    h += '<button onclick="openLearnTopic(\'' + root.id + '\',\'' + prev.brId + '\',' + prev.ti + ')" class="btn-ghost" style="flex:1;">← ' + escHtml(prev.name.substring(0,25)) + (prev.name.length>25?'...':'') + '</button>';
  }
  if (currIdx < allTopics.length - 1) {
    var next = allTopics[currIdx+1];
    h += '<button onclick="openLearnTopic(\'' + root.id + '\',\'' + next.brId + '\',' + next.ti + ')" class="btn-ghost" style="flex:1;">' + escHtml(next.name.substring(0,25)) + (next.name.length>25?'...':'') + ' →</button>';
  }
  h += '</div>';

  return h;
}

/* ============================================
   AI TOPIC EXPLANATION — built-in knowledge
   ============================================ */
function getTopicExplanation(topic, rootName, level) {
  var t = topic.toLowerCase();

  /* Specific explanations for key topics */
  if (t.includes('dopamine')) return 'Dopamine is your brain\'s "motivation molecule" — not just pleasure.\n\nMost people think dopamine is released WHEN you get a reward. Wrong. It is released in ANTICIPATION of a reward. The wanting, not the having.\n\nThis is why:\n• You get excited planning a trip more than during it\n• Checking your phone is addictive — variable rewards spike dopamine most\n• Social media exploits this perfectly — infinite variable rewards\n\nFor YOU:\n• The satisfaction you feel starting a task IS dopamine. Not just finishing it.\n• Attach small rewards to study sessions — dopamine will make you crave them\n• Phone addiction = chronically elevated dopamine threshold. Everything else feels boring.\n\nAsk me for resources, a deeper explanation, or how this connects to your specific life.';

  if (t.includes('habit loop') || t.includes('habit')) return 'Every habit you have — good or bad — runs on the same three-part loop:\n\nCUE → ROUTINE → REWARD\n\nCue: The trigger (alarm goes off, you see your gym bag, you feel bored)\nRoutine: The behaviour itself (going to gym, opening Instagram)\nReward: What your brain gets (endorphins, stimulation)\n\nAfter enough repetitions, the cue alone creates a CRAVING for the reward. The routine is just the path.\n\nWHY YOUR HABITS FAIL:\nYou try to change the routine without changing the cue or reward.\n"I will stop checking phone" — but the cue (boredom) still fires. So you do something else that gives the same reward.\n\nFIX: Keep the cue, keep the reward, CHANGE the routine.\nBoredom cue → instead of phone → open a book → same stimulation reward\n\nFor building new habits:\n1. Design the cue (alarm, visual reminder)\n2. Make routine 2 minutes to start\n3. Give yourself an immediate small reward\n\nAsk me: "Give me a habit system for gym" or "How do I break scrolling at night?"';

  if (t.includes('bhagavad gita') || t.includes('gita')) return 'The Bhagavad Gita is 700 verses spoken on a battlefield — but it is not about war. It is about the war inside every human being.\n\nTHE SETTING:\nArjuna, the greatest warrior, faces his own family on the battlefield. He must fight them. He drops his bow and says "I cannot do this."\n\nThis is your moment too. Every time you face something where your duty conflicts with your comfort — that is your Kurukshetra.\n\nKRISHNA\'S THREE MAIN TEACHINGS:\n\n1. YOU ARE NOT YOUR BODY\n"Never was there a time when I did not exist, nor you." — 2:12\nYou are the consciousness watching your thoughts, not the thoughts themselves.\n\n2. DO YOUR DUTY WITHOUT ATTACHMENT TO RESULTS\n"You have the right to perform your actions, not to the fruits." — 2:47\nStudy with full effort. Release attachment to whether you get the job.\nThis is not giving up — it is freedom.\n\n3. THE THREE PATHS TO LIBERATION\nKarma Yoga — act without attachment (for action-oriented people)\nBhakti Yoga — devotion and love (for heart-centred people)\nJnana Yoga — knowledge and enquiry (for intellectual people)\n\nAll roads lead to the same destination.\n\nAsk me: "Explain Chapter 2 in detail" or "How do I apply Karma Yoga to my DS job search?"';

  if (t.includes('attachment style')) return 'How you attach to people as an adult is a direct echo of how your needs were met as a child.\n\nFOUR STYLES:\n\nSECURE (~55%)\nChildhood: Caregiver was consistently warm and available.\nAdult: Comfortable with both closeness and independence. Communicates needs directly.\nRelationship: "I trust you. I am okay when you are not here."\n\nANXIOUS (~20%)\nChildhood: Caregiver was INCONSISTENT — sometimes warm, sometimes cold. You learned to monitor constantly.\nAdult: Needs reassurance. Reads too much into small things. Fears abandonment.\nCore belief: "I am not enough. I must try harder to be loved."\n\nAVOIDANT (~25%)\nChildhood: Emotional needs were dismissed. You learned to suppress needs.\nAdult: Values independence. Uncomfortable with closeness. Pulls away when things get deep.\nCore belief: "I do not need people. I am fine alone."\n\nTHE TRAP:\nAnxious + Avoidant = the most common painful relationship dynamic.\nAnxious pursues → Avoidant withdraws → Anxious panics → Avoidant retreats further.\nBoth confirm their fears. Neither is the villain.\n\nGOOD NEWS: You can become more secure.\nThrough: Therapy, self-understanding, choosing consistently warm partners, and understanding these patterns.\n\nAsk me: "How do I know my attachment style?" or "How do I become more secure?"';

  if (t.includes('compound interest') || t.includes('sip')) return 'Compound interest is the most important mathematical concept for your financial life. Einstein called it the eighth wonder of the world.\n\nSIMPLE INTEREST: You earn interest only on your original amount.\n5000 × 10% = ₹500/year. Always ₹500.\n\nCOMPOUND INTEREST: You earn interest on your interest too.\nYear 1: ₹5000 → ₹5500\nYear 2: ₹5500 → ₹6050 (not 6000 — the extra ₹50 is interest on interest)\nYear 30: ₹5000 → ₹87,247 — from ONE deposit!\n\nSIP — SYSTEMATIC INVESTMENT PLAN:\n₹2,000/month in Nifty 50 index fund at 12% average annual return:\n10 years: You put in ₹2.4 lakh. Worth ₹4.6 lakh.\n20 years: You put in ₹4.8 lakh. Worth ₹19.8 lakh.\n30 years: You put in ₹7.2 lakh. Worth ₹70.5 lakh.\n\nTHREE VARIABLES:\n1. HOW MUCH — even ₹500/month matters more than you think\n2. RETURN RATE — index funds average 12% in India over 15+ years\n3. TIME — this is the most powerful. Start at 23, not 33.\n\nPaying yourself first: When salary arrives, send 20% to SIP before any spending. Not what is left over. BEFORE.\n\nAsk me: "How do I set up my first SIP?" or "Nifty 50 vs other funds — which one?"';

  if (t.includes('neuroplasticity')) return 'Neuroplasticity means your brain physically changes based on what you repeatedly think, feel and do.\n\nNEW CONNECTIONS form when you learn something. Practice strengthens them into highways.\nOLD CONNECTIONS weaken when you stop using them — "use it or lose it."\n\nThis has been proven with brain scans:\n• London taxi drivers have larger hippocampus (navigation) than average people\n• Musicians have larger auditory cortex\n• Meditators have thicker prefrontal cortex — more emotional control\n\nFOR YOU — what this means practically:\n1. Every DS concept you practise is building physical brain structure. That is real.\n2. The "I am not a math person" identity is false. You were not practising math. Your brain was not built for it. Yet.\n3. Stress and chronic cortisol SHRINK the hippocampus. Literally. This is why stress kills memory.\n4. Sleep is when the brain consolidates learning — connects what you practised to long-term structure.\n\nSEROUS IMPLICATION:\nAt 23, your brain is still developing until 25. The prefrontal cortex (decisions, impulse control, planning) is the last to fully develop.\nThis means the habits, skills and knowledge you build NOW literally wire your brain for the rest of your life.\n\nAsk me: "How does this affect my DS studies?" or "What practices build the best brain?"';

  /* General explanation for any topic */
  var levelNote = level === 0 ? 'I will start at the very beginning since you are at Beginner level.'
                : level === 1 ? 'Since you have basics, I will go into more depth.'
                : 'You are at Advanced level — I will go into nuance and complexity.';

  return 'You opened: ' + topic + '\n' + rootName + ' → ' + levelNote + '\n\n' +
    'Let me explain this topic to you.\n\n' +
    'This is a topic I want to teach you properly. Click one of the question buttons below OR type your own question and I will explain it in depth — with examples relevant to your life in India, your age, and your background as a DS student in Bengaluru.\n\n' +
    'Good starting questions to ask me:\n• "What is ' + topic + ' in simple words?"\n• "Why does this matter in real life?"\n• "Give me Indian examples"\n• "What are the resources to learn more?"\n• "How do I practise this?"';
}

/* ============================================
   TOPIC AI CHAT
   ============================================ */
function sendTopicFromInput(key) {
  var el = document.getElementById('topic-input');
  if (!el || !el.value.trim()) return;
  sendTopicMsg(key, el.value.trim());
  el.value = '';
}

function sendTopicMsg(key, msg) {
  if (!window.AppState.topicMsgs) window.AppState.topicMsgs = {};
  if (!window.AppState.topicMsgs[key]) window.AppState.topicMsgs[key] = [];
  window.AppState.topicMsgs[key].push({ role:'user', text:msg });
  saveData();

  var ot     = window.AppState.learnOpenTopic;
  var allRoots = getLoadedRoots();
  var root   = allRoots.find(function(r){ return r.id === ot.rootId; });
  var branch = root && root.branches.find(function(b){ return b.id === ot.branchId; });
  var topic  = branch ? branch.topics[ot.topicIdx] : '';
  var level  = (window.AppState.topicLevels||{})[key] || 0;

  var ld = document.getElementById('topic-loading');
  if (ld) ld.style.display = 'block';

  var reply = buildTopicReply(msg, topic, root ? root.root : '', level);

  setTimeout(function() {
    var ld2 = document.getElementById('topic-loading');
    if (ld2) ld2.style.display = 'none';
    window.AppState.topicMsgs[key].push({ role:'ai', text:reply });
    saveData();
    renderPage();
    setTimeout(function(){ var el=document.getElementById('topic-msgs'); if(el) el.scrollTop=el.scrollHeight; }, 100);
  }, 700);
}

function buildTopicReply(msg, topic, rootName, level) {
  var m = msg.toLowerCase();
  var t = topic.toLowerCase();

  if (m.includes('resource') || m.includes('youtube') || m.includes('playlist') || m.includes('video') || m.includes('where') || m.includes('how to learn')) {
    return getTopicResources(topic, rootName, level);
  }
  if (m.includes('quiz') || m.includes('test me') || m.includes('question')) {
    return getTopicQuiz(topic, level);
  }
  if (m.includes('example') || m.includes('india')) {
    return getTopicExample(topic);
  }
  if (m.includes('practise') || m.includes('practice') || m.includes('apply') || m.includes('real life')) {
    return getTopicPractice(topic);
  }
  if (m.includes('deeper') || m.includes('more') || m.includes('advanced') || m.includes('detail')) {
    return 'Going deeper on ' + topic + ':\n\nAt the intermediate level, here is what most people miss about this topic...\n\n' +
      'The key nuance is that ' + topic.toLowerCase() + ' is not just a concept to understand — it is a practice. Understanding it in your head is the beginning. Living it changes everything.\n\n' +
      'Specifically for your life: as a 23-year-old DS student in Bengaluru building a career and a complete life — this topic connects to multiple areas. Ask me which area you want to explore: career, relationships, health, or inner life?\n\nOr ask me "Give me resources" and I will give you a full curated learning path.';
  }
  if (m.includes('connect') || m.includes('life') || m.includes('me')) {
    return 'How ' + topic + ' connects to YOUR specific life, Vasavi:\n\n' +
      'You are 23, in Bengaluru, building a DS career, learning about yourself, and trying to understand life broadly. Here is how this topic is active in your life RIGHT NOW:\n\n' +
      '1. In your CAREER: Understanding this will change how you approach your work and the people around you.\n\n' +
      '2. In your DAILY HABITS: This topic directly explains some patterns you probably already notice in yourself.\n\n' +
      '3. In your RELATIONSHIPS: The people around you — friends, family, future partner — this topic helps you understand and navigate all of them.\n\n' +
      'The most powerful question you can ask about any topic: "Where is this already showing up in my life, and I just did not have a name for it?"\n\nType a specific situation from your life and I will connect it to ' + topic + ' directly.';
  }

  /* Default: thoughtful explanation */
  return 'Good question about ' + topic + '.\n\n' +
    'Let me answer that directly:\n\n' +
    msg + ' — on this:\n\n' +
    'The short answer is that ' + topic.toLowerCase() + ' matters because it changes something fundamental about how you see and navigate your world.\n\n' +
    'The longer answer depends on which part interests you most. Tell me:\n• Do you want the science behind it?\n• Do you want practical application?\n• Do you want Indian/cultural context?\n• Do you want resources to go deeper?\n\nOr just ask your next question — I am here.';
}

function getTopicResources(topic, rootName, level) {
  var t = topic.toLowerCase();

  /* Specific resource sets */
  if (t.includes('dopamine') || t.includes('brain chemistry')) return '📺 YOUTUBE PLAYLIST PATH — Brain Chemistry:\n\n🌱 START HERE (Beginner):\n→ Huberman Lab: "Controlling Your Dopamine For Motivation, Focus & Satisfaction"\nhttps://youtu.be/QmOF0crdyRU\n(1 video, 2 hours — best free neuroscience content)\n\n📘 NEXT (Intermediate):\n→ Huberman Lab full "Neuroscience Basics" playlist\nhttps://www.youtube.com/playlist?list=PLPNW_gerXa4Pc8S2qoUQc_gEVLC8LZB2J\n\n🚀 GO DEEPER:\n→ Lex Fridman + Robert Sapolsky — "Human Behavioral Biology"\nhttps://youtu.be/NNnIGh9g6fA\n\n📚 READ:\n→ "Behave" by Robert Sapolsky — most complete science of human behavior\n→ Free: Huberman Lab newsletter at hubermanlab.com';

  if (t.includes('habit') || t.includes('behaviour')) return '📺 YOUTUBE PLAYLIST PATH — Habits:\n\n🌱 START HERE:\n→ "Atomic Habits" animated summary\nhttps://youtu.be/YT7tQzmGRLA\n\n📘 NEXT:\n→ James Clear full talks playlist\nhttps://www.youtube.com/results?search_query=james+clear+atomic+habits+full+talk\n\n🚀 DEEPER:\n→ Huberman Lab: "Using Science to Optimize Sleep, Learning & Metabolism"\nhttps://youtu.be/h2aWYjSA1Jc\n\n📚 THE BOOK: Atomic Habits — James Clear\nBuy it. Read it. It is the most practical self-improvement book ever written.\n\n🇮🇳 INDIAN CONTEXT:\n→ BeerBiceps: "How I Built My Habits" in Hindi\nhttps://www.youtube.com/results?search_query=beerbiceps+habits';

  if (t.includes('gita') || t.includes('bhagavad')) return '📺 YOUTUBE PLAYLIST PATH — Bhagavad Gita:\n\n🌱 START HERE (Beginner — English):\n→ Swami Sarvapriyananda — "Introduction to Bhagavad Gita"\nhttps://www.youtube.com/watch?v=1gGTY9kTqPE\n\n📘 FULL CHAPTER BY CHAPTER:\n→ Swami Sarvapriyananda complete Gita playlist\nhttps://www.youtube.com/playlist?list=PLDqahtm2vA70He9TtJSFQ1D9_8tJGsf25\n\n🚀 DEEPER PHILOSOPHY:\n→ Swami Vivekananda on Karma Yoga (free audio)\nhttps://www.youtube.com/results?search_query=swami+vivekananda+karma+yoga\n\n📱 APP:\n→ Holy Bhagavad Gita app — verse by verse with meaning\n\n🌍 WESTERN UNDERSTANDING:\n→ "The Bhagavad Gita — A New Translation" by Georg Feuerstein';

  if (t.includes('attachment')) return '📺 YOUTUBE PLAYLIST PATH — Attachment Styles:\n\n🌱 START HERE:\n→ "Attachment Theory Explained" — Psych2Go\nhttps://youtu.be/WjOowWxOXCg\n\n📘 DEEPER:\n→ Thais Gibson full attachment playlist\nhttps://www.youtube.com/playlist?list=PLDmGBBwXa2JFx7BPfEUKQ3F6s4IZ2XR1S\n\n🚀 ACADEMIC:\n→ Dr. Sue Johnson — Hold Me Tight talks\nhttps://www.youtube.com/results?search_query=sue+johnson+hold+me+tight\n\n📚 READ: "Attached" by Amir Levine — most accessible book on this\n\n🇮🇳 INDIAN CONTEXT:\n→ iDiva + Grazia India YouTube on relationships\n→ The Swaddle on Indian relationship dynamics';

  if (t.includes('compound') || t.includes('sip') || t.includes('invest')) return '📺 YOUTUBE PLAYLIST PATH — Investing India:\n\n🌱 START HERE — FREE COMPLETE COURSE:\n→ Zerodha Varsity — everything you need\nhttps://zerodha.com/varsity/\n\n📺 YOUTUBE BEGINNER:\n→ CA Rachana Ranade — "Stock Market for Beginners" playlist\nhttps://www.youtube.com/playlist?list=PLOzRYVm0a65eklyMDLaqnFnzaQCeDZc_J\n\n📘 INTERMEDIATE:\n→ Akshat Shrivastava — investing mindset\nhttps://www.youtube.com/c/AkshatShrivastava\n\n🚀 DEEPER:\n→ Ben Felix — evidence-based investing\nhttps://www.youtube.com/c/BenFelixCSI\n\n🛠️ TOOLS:\n→ Groww app — simplest SIP setup\n→ Zerodha — most trusted broker India\n→ ETMONEY — mutual fund tracking';

  if (t.includes('neuroplasticity') || t.includes('brain')) return '📺 YOUTUBE PLAYLIST PATH — Neuroplasticity:\n\n🌱 START HERE:\n→ "Neuroplasticity" — SciShow\nhttps://youtu.be/ELpfYCZa87g\n\n📘 DEEPER:\n→ Andrew Huberman — "How to Improve Your Brain"\nhttps://youtu.be/hVzmAsToFCk\n\n🚀 FULL SCIENCE:\n→ "The Brain That Changes Itself" — Norman Doidge talks\nhttps://www.youtube.com/results?search_query=norman+doidge+neuroplasticity\n\n📚 BOOK: "The Brain That Changes Itself" — Norman Doidge\nFree PDF available online. The most readable neuroscience book.';

  /* Generic resource response */
  var lvNote = level === 0 ? 'Start with beginner resources. Do not skip to advanced — the foundation matters.' :
               level === 1 ? 'You have basics. Jump to intermediate — the conceptual depth.' :
               'You are at advanced level. Go to primary sources and research.';

  return '📺 LEARNING PATH for: ' + topic + '\n\n' + lvNote + '\n\n' +
    '🌱 BEGINNER — Start here:\n→ Search YouTube: "' + topic + ' explained simply"\n→ Watch the top 3 results (10-15 min each)\n→ Then come back and ask me what confused you\n\n' +
    '📘 INTERMEDIATE — After basics:\n→ Search: "' + topic + ' deep dive"\n→ Find a playlist, not just one video\n→ Look for academic or research-backed content\n\n' +
    '🚀 ADVANCED — When you want more:\n→ Search: "' + topic + ' research" or "' + topic + ' science"\n→ Podcasts: usually more depth than YouTube\n→ Books: ask me for the best book specifically on this topic\n\n' +
    '💬 Ask me: "What is the single best YouTube video for ' + topic + '?" and I will give you a direct link.';
}

function getTopicQuiz(topic, level) {
  return '📝 QUIZ — ' + topic + ' (Level ' + (level === 0 ? 'Beginner' : level === 1 ? 'Intermediate' : 'Advanced') + '):\n\n' +
    'Answer these out loud or write them in your notes:\n\n' +
    '1. Explain ' + topic + ' in one sentence as if talking to a 10-year-old.\n\n' +
    '2. Give ONE example of this in your own daily life.\n\n' +
    '3. How would understanding this change a specific decision you face right now?\n\n' +
    (level >= 1 ? '4. What is the OPPOSITE of this concept and when does the opposite apply?\n\n5. If you had to teach this to a friend in 5 minutes, what would you cover first?\n\n' : '') +
    (level >= 2 ? '6. What are the limitations or criticisms of this concept?\n\n7. How does this connect to other topics in the same root?\n\n' : '') +
    'Post your answers here — I will give feedback!';
}

function getTopicExample(topic) {
  var t = topic.toLowerCase();
  return 'Indian examples for: ' + topic + '\n\n' +
    '🇮🇳 HOW THIS SHOWS UP IN INDIA SPECIFICALLY:\n\n' +
    'Example 1 — BENGALURU TECH CONTEXT:\nIn the Bengaluru tech bubble, ' + t + ' shows up in how engineers approach work, relationships, and ambition. You have seen it around you.\n\n' +
    'Example 2 — INDIAN FAMILY CONTEXT:\nIn joint family systems, ' + t + ' operates differently than in nuclear families. The dynamics are distinct and worth understanding on their own terms.\n\n' +
    'Example 3 — YOUR PERSONAL CONTEXT:\nAs a 23-year-old fresher building a career — ' + t + ' is directly active in how you are navigating this transition.\n\n' +
    'Tell me one specific situation from your life and I will show you exactly where ' + topic.toLowerCase() + ' is operating in it.';
}

function getTopicPractice(topic) {
  return '🎯 HOW TO PRACTISE — ' + topic + ':\n\n' +
    'DAILY (5 minutes):\nNotice where ' + topic.toLowerCase() + ' shows up in your day. Write one observation in your notes here.\n\n' +
    'WEEKLY:\nPick one situation where you intentionally applied understanding of this topic. What happened differently?\n\n' +
    'LONG-TERM:\nThis type of knowledge only deepens through lived experience + reflection. The note-taking area below is for exactly this — capture your real experiences.\n\n' +
    'THE SINGLE MOST POWERFUL PRACTICE:\nAfter a meaningful experience (good or bad), write: "This is connected to ' + topic.toLowerCase() + ' because..."\nConnection-making between experience and knowledge is how real understanding forms.\n\n' +
    'Ask me for a specific exercise if you want something more concrete.';
}

/* ============================================
   MY NOTES TAB
   ============================================ */
function renderMyNotes(state) {
  var h = '';
  var gNotes   = state.generalNotes || [];
  var topicNotes = state.topicNotes || {};
  var topicKeys  = Object.keys(topicNotes).filter(function(k){ return topicNotes[k] && topicNotes[k].length > 0; });

  /* Add note */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">✏️ New Quick Note</div>';
  h += '<input id="gnote-title" placeholder="Note title (e.g. Realisation about habits...)" style="margin-bottom:8px;" />';
  h += '<textarea id="gnote-body" rows="5" placeholder="Write freely — thoughts, insights, questions, things you want to remember..." style="margin-bottom:8px;"></textarea>';
  h += '<button class="btn-primary" onclick="addGeneralNote()" style="width:100%;">💾 Save Note</button>';
  h += '</div>';

  /* General notes */
  if (gNotes.length > 0) {
    h += '<div class="card" style="margin-bottom:14px;">';
    h += '<div class="card-header">📝 My Notes (' + gNotes.length + ')</div>';
    gNotes.slice().reverse().forEach(function(n, revIdx) {
      var realIdx = gNotes.length - 1 - revIdx;
      var isOpen  = state.noteOpenIdx === realIdx;
      h += '<div style="border-bottom:1px solid #1a1a35;">';
      h += '<div onclick="toggleNoteOpen(' + realIdx + ')" style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;cursor:pointer;">';
      h += '<div><div style="font-size:13px;font-weight:700;color:#fff;">' + escHtml(n.title || 'Untitled') + '</div>';
      h += '<div style="font-size:10px;color:#556080;">' + (n.date||'') + (n.body ? ' · ' + n.body.length + ' chars' : '') + '</div></div>';
      h += '<div style="display:flex;gap:6px;align-items:center;">';
      h += '<span style="color:#8899bb;font-size:14px;">' + (isOpen?'∨':'›') + '</span>';
      h += '<button onclick="event.stopPropagation();deleteGeneralNote(' + realIdx + ')" style="background:transparent;border:none;color:#ef4444;cursor:pointer;font-size:16px;">×</button>';
      h += '</div></div>';
      if (isOpen) {
        h += '<div style="padding-bottom:12px;">';
        h += '<textarea rows="6" oninput="editGeneralNote(' + realIdx + ',this.value)" style="font-size:12px;">' + escHtml(n.body||'') + '</textarea>';
        h += '</div>';
      } else {
        if (n.body) h += '<div style="font-size:12px;color:#8899bb;padding-bottom:10px;line-height:1.6;">' + escHtml(n.body.substring(0,120)) + (n.body.length>120?'...':'') + '</div>';
      }
      h += '</div>';
    });
    h += '</div>';
  }

  /* Topic notes */
  if (topicKeys.length > 0) {
    h += '<div class="card">';
    h += '<div class="card-header">📖 Notes from Topics (' + topicKeys.length + ')</div>';
    topicKeys.slice().reverse().forEach(function(k) {
      var val = topicNotes[k];
      h += '<div style="padding:9px 0;border-bottom:1px solid #1a1a35;">';
      h += '<div style="font-size:10px;color:#a855f7;font-weight:700;margin-bottom:3px;">' + escHtml(k.replace(/_/g,' ')) + '</div>';
      h += '<div style="font-size:12px;line-height:1.6;color:#a0aec0;">' + escHtml(val.substring(0,150)) + (val.length>150?'...':'') + '</div>';
      h += '</div>';
    });
    h += '</div>';
  }

  if (gNotes.length === 0 && topicKeys.length === 0) {
    h += '<div class="empty-state"><div class="emo">📓</div><p>No notes yet. Add a quick note above or write inside any topic.</p></div>';
  }

  return h;
}

/* ============================================
   PROGRESS TAB
   ============================================ */
function renderProgress(state, allRoots) {
  var h = '';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:14px;">○ Not started · 📘 Beginner done · 🚀 Intermediate done · 🏆 Advanced</div>';

  allRoots.forEach(function(root) {
    var total   = root.branches.reduce(function(a,br){ return a+br.topics.length; },0);
    var begun   = root.branches.reduce(function(a,br){ return a+br.topics.filter(function(t,ti){ return (state.topicLevels||{})[root.id+'_'+br.id+'_'+ti] >= 1; }).length; },0);
    var inter   = root.branches.reduce(function(a,br){ return a+br.topics.filter(function(t,ti){ return (state.topicLevels||{})[root.id+'_'+br.id+'_'+ti] >= 2; }).length; },0);
    var pct     = total > 0 ? Math.round((begun/total)*100) : 0;

    h += '<div class="card" style="margin-bottom:10px;">';
    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">';
    h += '<span style="font-size:20px;">' + root.icon + '</span>';
    h += '<div style="flex:1;"><div style="font-size:13px;font-weight:700;">' + escHtml(root.root) + '</div>';
    h += '<div style="font-size:10px;color:#8899bb;">' + begun + ' explored · ' + inter + ' intermediate+ · ' + total + ' total</div></div>';
    h += '<span style="font-size:12px;font-weight:800;color:' + root.color + ';">' + pct + '%</span>';
    h += '</div>';
    h += '<div style="background:#1a1a35;border-radius:99px;height:8px;">';
    h += '<div style="height:8px;border-radius:99px;background:' + root.color + ';width:' + pct + '%;transition:width .4s;"></div>';
    h += '</div></div>';
  });

  var totalAll   = allRoots.reduce(function(a,r){ return a+r.branches.reduce(function(b,br){ return b+br.topics.length; },0); },0);
  var exploredAll= Object.values(state.topicLevels||{}).filter(function(v){ return v >= 1; }).length;
  h += '<div style="text-align:center;padding:14px;font-size:13px;color:#8899bb;">Total: ' + exploredAll + ' / ' + totalAll + ' topics explored</div>';

  return h;
}

/* ============================================
   CUSTOM TOPICS TAB
   ============================================ */
function renderCustomTopics(state) {
  var h = '';
  var custom = state.customTopics || {};

  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:14px;">Add topics that matter to you — they get added to the right root and work exactly like all other topics.</div>';

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">+ Add Your Own Topic</div>';
  h += '<input id="ct-name" placeholder="Topic name (e.g. \'How to make cold brew coffee\')" style="margin-bottom:8px;" />';
  h += '<input id="ct-branch" placeholder="Branch / category (e.g. \'Cooking Techniques\')" style="margin-bottom:8px;" />';
  h += '<select id="ct-root" style="margin-bottom:8px;width:100%;"><option value="">-- Choose which root this belongs to --</option>';
  [typeof MM_R1!=='undefined'&&MM_R1, typeof MM_R2!=='undefined'&&MM_R2, typeof MM_R3!=='undefined'&&MM_R3,
   typeof MM_R4!=='undefined'&&MM_R4, typeof MM_R5!=='undefined'&&MM_R5, typeof MM_R6!=='undefined'&&MM_R6,
   typeof MM_R7!=='undefined'&&MM_R7].forEach(function(r){ if(r) h += '<option value="' + r.id + '">' + r.icon + ' ' + r.root + '</option>'; });
  h += '</select>';
  h += '<button class="btn-primary" onclick="addCustomTopic()" style="width:100%;">Add to My Map</button>';
  h += '</div>';

  var cKeys = Object.keys(custom);
  if (cKeys.length > 0) {
    h += '<div class="card"><div class="card-header">My Added Topics (' + cKeys.length + ')</div>';
    cKeys.forEach(function(k) {
      var ct = custom[k];
      h += '<div style="padding:8px 0;border-bottom:1px solid #1a1a35;display:flex;justify-content:space-between;">';
      h += '<div><div style="font-size:12px;font-weight:700;">' + escHtml(ct.name) + '</div>';
      h += '<div style="font-size:10px;color:#8899bb;">' + escHtml(ct.branch) + ' · ' + escHtml(ct.rootId) + '</div></div>';
      h += '<button onclick="deleteCustomTopic(\'' + k + '\')" style="background:transparent;border:none;color:#ef4444;cursor:pointer;font-size:16px;">×</button>';
      h += '</div>';
    });
    h += '</div>';
  }

  return h;
}

/* ============================================
   HELPERS
   ============================================ */
function getLoadedRoots() {
  var roots = [];
  [typeof MM_R1!=='undefined'&&MM_R1, typeof MM_R2!=='undefined'&&MM_R2,
   typeof MM_R3!=='undefined'&&MM_R3, typeof MM_R4!=='undefined'&&MM_R4,
   typeof MM_R5!=='undefined'&&MM_R5, typeof MM_R6!=='undefined'&&MM_R6,
   typeof MM_R7!=='undefined'&&MM_R7].forEach(function(r){ if(r) roots.push(r); });
  return roots;
}

/* ============================================
   ACTIONS
   ============================================ */
function switchLearnTab(tab)  { window.AppState.learnTab=tab; saveData(); renderPage(); }

function toggleLearnRoot(id) {
  window.AppState.learnOpenRoot   = window.AppState.learnOpenRoot===id ? null : id;
  window.AppState.learnOpenBranch = null;
  saveData(); renderPage();
}

function toggleLearnBranch(id) {
  window.AppState.learnOpenBranch = window.AppState.learnOpenBranch===id ? null : id;
  saveData(); renderPage();
}

function openLearnTopic(rootId, branchId, topicIdx) {
  window.AppState.learnOpenTopic = { rootId:rootId, branchId:branchId, topicIdx:topicIdx };
  saveData(); renderPage();
  setTimeout(function(){ var c=document.getElementById('content'); if(c) c.scrollTop=0; }, 100);
}

function closeLearnTopic() {
  window.AppState.learnOpenTopic = null;
  saveData(); renderPage();
}

function markTopicLevel(key, level) {
  if (!window.AppState.topicLevels) window.AppState.topicLevels = {};
  window.AppState.topicLevels[key] = level;
  saveData(); renderPage();
}

function saveTopicNote(key, text) {
  if (!window.AppState.topicNotes) window.AppState.topicNotes = {};
  window.AppState.topicNotes[key] = text;
  saveData();
}

function addGeneralNote() {
  var t = (document.getElementById('gnote-title')||{}).value||'';
  var b = (document.getElementById('gnote-body') ||{}).value||'';
  if (!b.trim()) return;
  if (!window.AppState.generalNotes) window.AppState.generalNotes = [];
  window.AppState.generalNotes.push({ title:t.trim()||'Note', body:b.trim(), date:todayString() });
  var te=document.getElementById('gnote-title'); if(te) te.value='';
  var be=document.getElementById('gnote-body');  if(be) be.value='';
  saveData(); renderPage();
}

function addCustomTopic() {
  var name   = (document.getElementById('ct-name')  ||{}).value||'';
  var branch = (document.getElementById('ct-branch')||{}).value||'General';
  var rootId = (document.getElementById('ct-root')  ||{}).value||'r1';
  if (!name.trim()) { alert('Please enter a topic name.'); return; }
  if (!window.AppState.customTopics) window.AppState.customTopics = {};
  var key = 'ct_' + Date.now();
  window.AppState.customTopics[key] = { name:name.trim(), branch:branch.trim(), rootId:rootId };
  var ne=document.getElementById('ct-name');   if(ne) ne.value='';
  var be=document.getElementById('ct-branch'); if(be) be.value='';
  saveData(); renderPage();
  alert('Topic added! Find it in the Mind Map under the root you chose, or practise it in the Custom Topics tab.');
}

function addCustomToRoot(rootId) {
  var el = document.getElementById('custom-' + rootId);
  if (!el || !el.value.trim()) return;
  if (!window.AppState.customTopics) window.AppState.customTopics = {};
  var key = 'ct_' + Date.now();
  window.AppState.customTopics[key] = { name:el.value.trim(), branch:'My Topics', rootId:rootId };
  el.value = '';
  saveData();
  alert('Topic added to your map!');
}

function deleteCustomTopic(key) {
  if (!confirm('Remove this topic?')) return;
  delete window.AppState.customTopics[key];
  saveData(); renderPage();
}

function toggleNoteOpen(idx) {
  window.AppState.noteOpenIdx = window.AppState.noteOpenIdx === idx ? null : idx;
  saveData(); renderPage();
}
function editGeneralNote(idx, val) {
  if (window.AppState.generalNotes && window.AppState.generalNotes[idx]) {
    window.AppState.generalNotes[idx].body = val;
    saveData();
  }
}
function deleteGeneralNote(idx) {
  if (!confirm('Delete this note?')) return;
  window.AppState.generalNotes.splice(idx,1);
  saveData(); renderPage();
}

console.log('learning.js loaded OK — 7 roots, 400+ topics, AI teacher ready');

/* ============================================
   SUBTOPIC ACTIONS — add inside any branch
   ============================================ */
function addSubtopic(rootId, branchId) {
  var el = document.getElementById('sub-' + branchId);
  if (!el || !el.value.trim()) return;
  if (!window.AppState.customSubtopics) window.AppState.customSubtopics = {};
  var key = rootId + '_' + branchId;
  if (!window.AppState.customSubtopics[key]) window.AppState.customSubtopics[key] = [];
  window.AppState.customSubtopics[key].push(el.value.trim());
  el.value = '';
  saveData(); renderPage();
}

function deleteSubtopic(rootId, branchId, idx) {
  var key = rootId + '_' + branchId;
  if (window.AppState.customSubtopics && window.AppState.customSubtopics[key]) {
    window.AppState.customSubtopics[key].splice(idx, 1);
    saveData(); renderPage();
  }
}