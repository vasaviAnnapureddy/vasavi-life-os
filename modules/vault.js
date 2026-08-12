/* ============================================
   VASAVI'S LIFE OS — THE VAULT 🔐
   modules/vault.js

   A private space for the things she can't
   tell anyone. Rules:
   - Everything is encrypted ON HER DEVICE with
     AES-256-GCM using a passphrase ONLY SHE
     knows (PBKDF2, 150k iterations).
   - Firebase/localStorage only ever see
     unreadable ciphertext.
   - Forget the passphrase = entries are gone
     forever. That unbreakability IS the privacy.
   - AI listener sees ONLY the current
     conversation being sent — never the archive.
   - "Just Listen" mode: nothing leaves the
     device at all.
   - True delete: gone means gone.
   ============================================ */

/* ---- crypto helpers (Web Crypto, browser built-in) ---- */
function _vB64(buf) {
  var bytes = new Uint8Array(buf), s = '';
  for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}
function _vBuf(b64) {
  var s = atob(b64), bytes = new Uint8Array(s.length);
  for (var i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
  return bytes.buffer;
}

function vaultDeriveKey(pass, saltB64) {
  var enc = new TextEncoder();
  return crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey'])
    .then(function(base) {
      return crypto.subtle.deriveKey(
        { name:'PBKDF2', salt:_vBuf(saltB64), iterations:150000, hash:'SHA-256' },
        base, { name:'AES-GCM', length:256 }, false, ['encrypt','decrypt']);
    });
}

function vaultEncrypt(key, obj) {
  var iv = crypto.getRandomValues(new Uint8Array(12));
  var data = new TextEncoder().encode(JSON.stringify(obj));
  return crypto.subtle.encrypt({ name:'AES-GCM', iv:iv }, key, data)
    .then(function(ct) { return { iv:_vB64(iv.buffer), ct:_vB64(ct) }; });
}

function vaultDecrypt(key, pack) {
  return crypto.subtle.decrypt({ name:'AES-GCM', iv:_vBuf(pack.iv) }, key, _vBuf(pack.ct))
    .then(function(plain) { return JSON.parse(new TextDecoder().decode(plain)); })
    .catch(function() { return null; });
}

/* ---- session state (never saved anywhere) ---- */
var _vaultKey   = null;   /* CryptoKey — memory only */
var _vaultOpen  = false;
var _vaultCache = { entries: [], chat: [] };  /* decrypted copies, memory only */
var _vaultBusy  = false;

function vaultLock() {
  _vaultKey = null; _vaultOpen = false;
  _vaultCache = { entries: [], chat: [] };
  renderPage();
  showToast('🔐 Vault locked.');
}

/* ============================================
   RENDER
   ============================================ */
function renderVault() {
  var state = window.AppState;
  if (!window.crypto || !crypto.subtle) {
    return '<div class="empty-state"><div class="emo">🔐</div><p>Your browser does not support encryption (needs HTTPS or localhost).</p></div>';
  }
  if (!state.vault || !state.vault.verifier) return renderVaultSetup();
  if (!_vaultOpen) return renderVaultLocked(state);
  return renderVaultOpen(state);
}

/* ---- FIRST TIME SETUP ---- */
function renderVaultSetup() {
  var h = '';
  h += '<div class="card" style="max-width:480px;margin:0 auto;border:1px solid #ec4899;">';
  h += '<div style="text-align:center;padding:10px 0;"><div style="font-size:40px;">🔐</div>';
  h += '<div style="font-size:17px;font-weight:900;margin:8px 0;">Create Your Vault</div>';
  h += '<div style="font-size:12px;color:#8899bb;line-height:1.8;">A space for what you can\'t tell anyone.<br>Everything is encrypted on YOUR device before it is saved anywhere.</div></div>';

  h += '<div style="background:#1a0a10;border:1px solid #ec4899;border-radius:8px;padding:12px;margin:12px 0;font-size:11px;line-height:1.8;color:#fda4af;">' +
    '⚠️ <b>Read this once, seriously:</b><br>' +
    '• Your passphrase is NEVER stored anywhere.<br>' +
    '• If you forget it, your vault entries are <b>gone forever</b> — no reset, no recovery, not even by me.<br>' +
    '• That impossibility is exactly what makes it private.<br>' +
    '• Pick something you will never forget but nobody could guess.</div>';

  h += '<div class="form-row"><label>Create passphrase</label><input type="password" id="vault-pass1" placeholder="A sentence works best..." /></div>';
  h += '<div class="form-row"><label>Type it again</label><input type="password" id="vault-pass2" placeholder="Same passphrase..." /></div>';
  h += '<button class="btn-primary" style="width:100%;" onclick="vaultCreate()">🔐 Create My Vault</button>';
  h += '</div>';
  return h;
}

function vaultCreate() {
  var p1 = (document.getElementById('vault-pass1')||{}).value || '';
  var p2 = (document.getElementById('vault-pass2')||{}).value || '';
  if (p1.length < 6) { alert('Use at least 6 characters — a short sentence is perfect.'); return; }
  if (p1 !== p2) { alert('The two passphrases do not match.'); return; }

  var salt = _vB64(crypto.getRandomValues(new Uint8Array(16)).buffer);
  vaultDeriveKey(p1, salt).then(function(key) {
    return vaultEncrypt(key, { ok:'vasavi-vault' }).then(function(verifier) {
      window.AppState.vault = { salt:salt, verifier:verifier, entries:[], chat:[] };
      _vaultKey = key; _vaultOpen = true;
      _vaultCache = { entries: [], chat: [] };
      saveData(); renderPage();
      showToast('🔐 Vault created. Only you can open it.');
    });
  });
}

/* ---- LOCKED SCREEN ---- */
function renderVaultLocked(state) {
  var h = '';
  h += '<div class="card" style="max-width:420px;margin:0 auto;text-align:center;border:1px solid #ec4899;">';
  h += '<div style="font-size:40px;padding-top:8px;">🔐</div>';
  h += '<div style="font-size:16px;font-weight:900;margin:8px 0;">Vault is Locked</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:14px;">' + (state.vault.entries||[]).length + ' private entries · ' + (state.vault.chat||[]).length + ' chat messages · all encrypted</div>';
  h += '<input type="password" id="vault-pass" placeholder="Your passphrase..." style="margin-bottom:10px;text-align:center;" onkeydown="if(event.key===\'Enter\')vaultUnlock()" />';
  h += '<button class="btn-primary" style="width:100%;" onclick="vaultUnlock()">Unlock</button>';
  h += '<div id="vault-unlock-msg" style="font-size:11px;color:#ef4444;margin-top:8px;"></div>';
  h += '</div>';
  return h;
}

function vaultUnlock() {
  var pass = (document.getElementById('vault-pass')||{}).value || '';
  var v = window.AppState.vault;
  var msg = document.getElementById('vault-unlock-msg');
  if (msg) msg.textContent = 'Checking...';

  vaultDeriveKey(pass, v.salt).then(function(key) {
    return vaultDecrypt(key, v.verifier).then(function(check) {
      if (!check || check.ok !== 'vasavi-vault') {
        if (msg) msg.textContent = 'Wrong passphrase. (There is no reset — think back calmly.)';
        return;
      }
      _vaultKey = key; _vaultOpen = true;
      /* Decrypt everything into memory */
      var jobs = [];
      _vaultCache = { entries: [], chat: [] };
      (v.entries||[]).forEach(function(e) {
        jobs.push(vaultDecrypt(key, e).then(function(obj){ if (obj) { obj._pack = e; _vaultCache.entries.push(obj); } }));
      });
      (v.chat||[]).forEach(function(c) {
        jobs.push(vaultDecrypt(key, c).then(function(obj){ if (obj) _vaultCache.chat.push(obj); }));
      });
      Promise.all(jobs).then(function() {
        _vaultCache.entries.sort(function(a,b){ return (a.ts||0)-(b.ts||0); });
        _vaultCache.chat.sort(function(a,b){ return (a.ts||0)-(b.ts||0); });
        renderPage();
        showToast('🔓 Vault open. This screen is for you only.');
      });
    });
  });
}

/* ---- OPEN VAULT ---- */
function renderVaultOpen(state) {
  var tab = state.vaultTab || 'talk';
  var h = '';

  h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">';
  h += '<div style="font-size:12px;color:#ec4899;font-weight:800;">🔓 Vault open — encrypted, yours alone</div>';
  h += '<button class="btn-ghost" style="font-size:11px;" onclick="vaultLock()">🔐 Lock Now</button>';
  h += '</div>';

  h += '<div class="subtab-bar">';
  [['talk','💬 Talk It Out'],['write','✍️ Diary'],['review','📅 Monthly Review'],['settings','⚙️ Control']].forEach(function(t) {
    h += '<div class="subtab ' + (tab===t[0]?'active':'') + '" onclick="switchVaultTab(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  h += '</div>';

  if (tab === 'talk')     h += renderVaultTalk(state);
  if (tab === 'write')    h += renderVaultWrite(state);
  if (tab === 'review')   h += renderVaultReview(state);
  if (tab === 'settings') h += renderVaultSettings(state);

  return h;
}

function switchVaultTab(t) { window.AppState.vaultTab = t; saveData(); renderPage(); }

/* ---- diary shared helpers ---- */
var VAULT_MOODS = [
  ['storm', '⛈️', 'Heavy day',       '#6366f1'],
  ['guilt', '💔', 'Guilt',           '#ef4444'],
  ['fear',  '😨', 'Fear',            '#f59e0b'],
  ['anger', '🔥', 'Anger',           '#f97316'],
  ['secret','🤫', 'Just for me',     '#8899bb'],
  ['light', '✨', 'Feeling lighter', '#10b981']
];
function vaultMood(key) {
  var m = VAULT_MOODS.find(function(x){ return x[0] === key; });
  return m || ['secret','🤫','Just for me','#8899bb'];
}
/* Full date with day name, e.g. "Monday, 14 July 2026" */
function vaultDateName(ts) {
  return new Date(ts).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}
function vaultTimeName(ts) {
  return new Date(ts).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
}
/* Day-map {iso:1} for streak calc */
function vaultDayMap() {
  var map = {};
  _vaultCache.entries.forEach(function(e){ map[aeIso(new Date(e.ts))] = 1; });
  return map;
}

/* ---- 💬 TALK IT OUT — the private listener ---- */
function renderVaultTalk(state) {
  var h = '';
  var justListen = !!state.vaultJustListen;
  var msgs = _vaultCache.chat;

  h += '<div class="card">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">';
  h += '<div style="width:36px;height:36px;border-radius:50%;background:#ec4899;display:flex;align-items:center;justify-content:center;font-size:16px;">🤍</div>';
  h += '<div><div style="font-size:13px;font-weight:800;">Your Private Listener</div>';
  h += '<div style="font-size:10px;color:#8899bb;">Everything here is encrypted. Nobody else will ever read this.</div></div>';
  h += '</div>';

  /* Just Listen toggle */
  h += '<label style="display:flex;align-items:center;gap:8px;font-size:11px;color:#8899bb;margin-bottom:10px;cursor:pointer;background:var(--card2);padding:8px 10px;border-radius:8px;">' +
    '<input type="checkbox" onchange="toggleJustListen(this)" ' + (justListen?'checked':'') + ' />' +
    '<span><b style="color:#ec4899;">Just Listen mode</b> — nothing is sent to any AI. Your words stay 100% on this device. (Turn off to get caring responses.)</span></label>';

  h += '<div id="vault-chat-msgs" style="min-height:160px;max-height:380px;overflow-y:auto;margin-bottom:10px;">';
  if (msgs.length === 0) {
    h += '<div style="background:#1a1a35;border-radius:0 10px 10px 10px;padding:12px;font-size:12px;line-height:1.8;">' +
      'This space is only yours, Vasavi. The fights, the guilt after shouting at amma, the fears you can\'t say out loud — write them here exactly as they are. No judgement lives in this room.<br><br>I\'ll answer with care' + (justListen ? ' — right now Just Listen is ON, so I stay silent and simply keep your words safe.' : ', and everything both of us say is sealed with your passphrase.') + '</div>';
  } else {
    msgs.forEach(function(m) {
      if (m.role === 'user') {
        h += '<div style="display:flex;justify-content:flex-end;margin-bottom:8px;"><div style="background:var(--accent);border-radius:10px 0 10px 10px;padding:9px 12px;font-size:12px;line-height:1.7;max-width:82%;color:#fff;white-space:pre-wrap;">' + escHtml(m.text) + '</div></div>';
      } else {
        h += '<div style="display:flex;gap:8px;margin-bottom:8px;"><span style="font-size:15px;flex-shrink:0;">🤍</span><div style="background:#1a1a35;border-radius:0 10px 10px 10px;padding:9px 12px;font-size:12px;line-height:1.8;max-width:88%;white-space:pre-wrap;">' + escHtml(m.text) + '</div></div>';
      }
    });
  }
  h += '</div>';
  h += '<div id="vault-loading" style="display:none;text-align:center;padding:8px;font-size:11px;color:#ec4899;">🤍 ...</div>';

  h += '<div style="display:flex;gap:8px;">' +
    '<textarea id="vault-input" rows="2" placeholder="Say it exactly how it is..." style="flex:1;margin:0;"></textarea>' +
    '<button class="btn-primary" onclick="sendVaultMsg()" style="align-self:flex-end;">Send</button></div>';
  h += '<div style="font-size:9px;color:#556080;margin-top:6px;">' + (justListen ? '🔒 Just Listen ON — this never leaves your device.' : 'Only the current conversation is sent for a response — never your archive. Responses are encrypted too.') + '</div>';
  h += '</div>';

  /* Gentle honest note */
  h += '<div style="font-size:10px;color:#556080;text-align:center;margin-top:10px;line-height:1.7;">I\'m your private listener, not a doctor. If something ever feels heavier than venting,<br>iCall (9152987821, free, Mon-Sat) has real counselors who care. You deserve real support too. 💜</div>';

  return h;
}

function toggleJustListen(el) {
  window.AppState.vaultJustListen = el.checked;
  saveData(); renderPage();
}

function sendVaultMsg() {
  var el = document.getElementById('vault-input');
  if (!el || !el.value.trim() || !_vaultKey) return;
  var text = el.value.trim();
  el.value = '';

  var state = window.AppState;
  var userMsg = { role:'user', text:text, ts:Date.now() };
  _vaultCache.chat.push(userMsg);

  /* Encrypt + persist the user message */
  vaultEncrypt(_vaultKey, userMsg).then(function(pack) {
    state.vault.chat.push(pack);
    saveData();
  });
  renderPage();

  if (state.vaultJustListen) {
    /* Nothing leaves the device. A local, warm acknowledgement. */
    var lines = [
      'I\'m here. Every word is safe with me. 🤍',
      'Written and sealed. You don\'t have to carry this alone in your head anymore.',
      'I heard you. Keeping this safe, always.',
      'That took courage to write. It\'s locked away now — breathe.'
    ];
    var reply = { role:'ai', text: lines[Math.floor(Math.random()*lines.length)], ts:Date.now() };
    _vaultCache.chat.push(reply);
    vaultEncrypt(_vaultKey, reply).then(function(pack) { state.vault.chat.push(pack); saveData(); });
    renderPage();
    return;
  }

  var ld = document.getElementById('vault-loading');
  if (ld) ld.style.display = 'block';

  var sys = 'You are Vasavi\'s completely private, warm listener inside her encrypted vault. She is 23, Bengaluru, ' +
    'lives with family, job-hunting stress. She comes here with things she cannot tell anyone — guilt after ' +
    'shouting at her mother, fears, dark thoughts, family friction. Your role: listen deeply, validate the feeling ' +
    'first, never lecture, never moralize. Offer ONE gentle, practical perspective or tiny step, like a wise caring ' +
    'friend + counselor. If she mentions self-harm or feels unsafe, gently and lovingly suggest iCall 9152987821 (free, India). ' +
    'Keep replies under 150 words. Warm, human, zero judgement.';

  var recent = _vaultCache.chat.slice(-8);
  var finish = function(replyText) {
    var ld2 = document.getElementById('vault-loading');
    if (ld2) ld2.style.display = 'none';
    var reply = { role:'ai', text:replyText, ts:Date.now() };
    _vaultCache.chat.push(reply);
    vaultEncrypt(_vaultKey, reply).then(function(pack) { window.AppState.vault.chat.push(pack); saveData(); });
    renderPage();
    setTimeout(function(){ var el=document.getElementById('vault-chat-msgs'); if(el) el.scrollTop=el.scrollHeight; },100);
  };

  if (typeof groqChat === 'function' && typeof getApiKey === 'function' && getApiKey()) {
    groqChat(sys, recent, finish);
  } else {
    finish('I\'m here and your words are sealed. (Add an API key in AI Assistant if you want me to truly respond — or keep Just Listen mode on and use me as your locked diary.)');
  }
}

/* ---- ✍️ PRIVATE DIARY ---- */
function renderVaultWrite(state) {
  var h = '';
  var entries = _vaultCache.entries;

  /* Streak + stats header */
  var dayMap = vaultDayMap();
  var streak = aeStreakFlexible(dayMap, 1);
  var daysJournaled = Object.keys(dayMap).length;
  var todayIso = aeTodayIso();
  var wroteToday = !!dayMap[todayIso];

  h += '<div class="grid-3" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#ec4899"><div class="stat-value">🔥 ' + streak + '</div><div class="stat-label">Day Streak</div><div class="stat-sub">' + (wroteToday?'written today ✓':'write today to keep it') + '</div></div>';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + daysJournaled + '</div><div class="stat-label">Days Journaled</div></div>';
  h += '<div class="stat-card" style="--stat-color:#06b6d4"><div class="stat-value">' + entries.length + '</div><div class="stat-label">Total Entries</div></div>';
  h += '</div>';

  /* Today's date banner */
  h += '<div style="text-align:center;font-size:12px;color:#8899bb;margin-bottom:12px;">📅 ' + vaultDateName(Date.now()) + '</div>';

  /* New entry */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">✍️ Write Today\'s Entry</div>';
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">';
  VAULT_MOODS.forEach(function(m) {
    var sel = (state.vaultMood||'secret') === m[0];
    h += '<div onclick="setVaultMood(\'' + m[0] + '\')" style="padding:5px 10px;border-radius:99px;cursor:pointer;font-size:10px;font-weight:700;border:1px solid ' + (sel?m[3]:'var(--border)') + ';background:' + (sel?m[3]+'22':'var(--card2)') + ';color:' + (sel?m[3]:'#8899bb') + ';">' + m[1] + ' ' + m[2] + '</div>';
  });
  h += '</div>';
  h += '<textarea id="vault-entry" rows="5" placeholder="How did today feel, really? Nobody will ever read this except you. Write it raw."></textarea>';
  h += '<button class="btn-primary" style="width:100%;margin-top:8px;" onclick="addVaultEntry()">🔐 Seal This Entry</button>';
  h += '</div>';

  /* On This Day — the magic of a lifelong diary */
  var onThis = vaultOnThisDay(Date.now());
  if (onThis.length) {
    h += '<div class="card" style="margin-bottom:14px;border-left:3px solid #a855f7;">';
    h += '<div class="card-header">🕰️ On This Day</div>';
    onThis.forEach(function(e) {
      var yearsAgo = new Date().getFullYear() - new Date(e.ts).getFullYear();
      var mo = vaultMood(e.mood);
      h += '<div style="margin-bottom:8px;">';
      h += '<div style="font-size:10px;color:#a855f7;font-weight:700;">' + mo[1] + ' ' + yearsAgo + ' year' + (yearsAgo>1?'s':'') + ' ago — ' + vaultDateName(e.ts) + '</div>';
      h += '<div style="font-size:12px;line-height:1.7;color:#c4c4d4;white-space:pre-wrap;">' + escHtml(e.text) + '</div>';
      h += '</div>';
    });
    h += '</div>';
  }

  /* Recent entries with full date + day names, grouped newest first */
  h += '<div class="card"><div class="card-header">Your Sealed Entries (' + entries.length + ')</div>';
  if (entries.length === 0) {
    h += '<div style="font-size:11px;color:#556080;text-align:center;padding:14px;">Empty so far. The first entry is the hardest — and the most freeing.</div>';
  } else {
    var lastDay = '';
    entries.slice().reverse().forEach(function(e) {
      var iso = aeIso(new Date(e.ts));
      var mo = vaultMood(e.mood);
      if (iso !== lastDay) {
        lastDay = iso;
        h += '<div style="font-size:11px;color:#ec4899;font-weight:800;margin:14px 0 6px;padding-bottom:4px;border-bottom:1px solid #1a1a35;">📅 ' + vaultDateName(e.ts) + '</div>';
      }
      h += '<div style="background:var(--card2);border:1px solid var(--border);border-left:3px solid ' + mo[3] + ';border-radius:10px;padding:12px;margin-bottom:8px;">';
      h += '<div style="display:flex;justify-content:space-between;margin-bottom:6px;">';
      h += '<span style="font-size:10px;color:' + mo[3] + ';font-weight:700;">' + mo[1] + ' ' + mo[2] + ' · ' + vaultTimeName(e.ts) + '</span>';
      h += '<span onclick="deleteVaultEntry(' + e.ts + ')" style="font-size:11px;color:#556080;cursor:pointer;">🗑️ delete forever</span>';
      h += '</div>';
      h += '<div style="font-size:12px;line-height:1.8;color:#c4c4d4;white-space:pre-wrap;">' + escHtml(e.text) + '</div>';
      h += '</div>';
    });
  }
  h += '</div>';
  return h;
}

/* Entries written on the same day-of-year in PAST years */
function vaultOnThisDay(ts) {
  var d = new Date(ts);
  var mmdd = pad(d.getMonth()+1) + '-' + pad(d.getDate());
  var thisYear = d.getFullYear();
  return _vaultCache.entries.filter(function(e) {
    var ed = new Date(e.ts);
    return ed.getFullYear() < thisYear && pad(ed.getMonth()+1)+'-'+pad(ed.getDate()) === mmdd;
  }).sort(function(a,b){ return b.ts - a.ts; });
}

function setVaultMood(m) { window.AppState.vaultMood = m; renderPage(); }

function addVaultEntry() {
  var el = document.getElementById('vault-entry');
  if (!el || !el.value.trim() || !_vaultKey) return;
  var entry = { text: el.value.trim(), mood: window.AppState.vaultMood||'secret', ts: Date.now() };
  el.value = '';
  vaultEncrypt(_vaultKey, entry).then(function(pack) {
    entry._pack = pack;
    _vaultCache.entries.push(entry);
    window.AppState.vault.entries.push(pack);
    saveData(); renderPage();
    showToast('🔐 Sealed. Only your passphrase can open it.');
  });
}

function deleteVaultEntry(ts) {
  if (!confirm('Delete this entry forever? There is no undo — gone means gone.')) return;
  var idx = _vaultCache.entries.findIndex(function(e){ return e.ts === ts; });
  if (idx === -1) return;
  var pack = _vaultCache.entries[idx]._pack;
  _vaultCache.entries.splice(idx, 1);
  window.AppState.vault.entries = window.AppState.vault.entries.filter(function(p){ return p !== pack && p.ct !== (pack&&pack.ct); });
  saveData(); renderPage();
  showToast('Gone. Forever.');
}

/* ---- 📅 MONTHLY REVIEW ---- */
function renderVaultReview(state) {
  var h = '';
  var v = aeGetView('vaultReview');
  var monthEntries = _vaultCache.entries.filter(function(e) {
    var d = new Date(e.ts);
    return d.getFullYear() === v.y && d.getMonth() === v.m;
  }).sort(function(a,b){ return a.ts - b.ts; });

  /* Month navigation */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += aeMonthNav('vaultReview');

  if (monthEntries.length === 0) {
    h += '<div class="empty-state" style="padding:20px;"><div class="emo">📅</div><p>No entries in ' + AE_MONTHS[v.m] + ' ' + v.y + '.<br>Use ◀ ▶ to look back at other months.</p></div>';
    h += '</div>';
    return h;
  }

  /* Stats */
  var dayMap = {};
  monthEntries.forEach(function(e){ dayMap[aeIso(new Date(e.ts))] = (dayMap[aeIso(new Date(e.ts))]||0) + 1; });
  var daysWritten = Object.keys(dayMap).length;
  var words = monthEntries.reduce(function(a,e){ return a + e.text.trim().split(/\s+/).length; }, 0);
  var daysInMonth = new Date(v.y, v.m+1, 0).getDate();

  h += '<div style="text-align:center;padding:6px 0 12px;">';
  h += '<div style="font-size:11px;color:#8899bb;">' + AE_MONTHS[v.m] + ' ' + v.y + '</div>';
  h += '<div style="font-size:30px;font-weight:900;color:#ec4899;">' + monthEntries.length + ' entries</div>';
  h += '<div style="font-size:11px;color:#8899bb;">across ' + daysWritten + ' of ' + daysInMonth + ' days · ' + words.toLocaleString('en-IN') + ' words written</div>';
  h += '</div>';

  /* Calendar heatmap — pink intensity by entries per day */
  h += aeCalendarHeatmap(v.y, v.m, dayMap, function(n){
    return n >= 3 ? '#9d174d' : n >= 2 ? '#be185d' : n >= 1 ? '#ec4899' : '#1a1a35';
  }, function(n){ return n > 0 ? '✍️' : ''; });
  h += '<div style="font-size:9px;color:#8899bb;margin-top:8px;text-align:center;">✍️ = a day you wrote · darker pink = more entries that day</div>';
  h += '</div>';

  /* Mood breakdown */
  var moodCounts = {};
  monthEntries.forEach(function(e){ moodCounts[e.mood] = (moodCounts[e.mood]||0) + 1; });
  h += '<div class="card" style="margin-bottom:14px;"><div class="card-header">How ' + AE_MONTHS[v.m] + ' Felt</div>';
  VAULT_MOODS.forEach(function(m) {
    var c = moodCounts[m[0]] || 0;
    if (c === 0) return;
    h += aeBarRow(m[1] + ' ' + m[2], c, monthEntries.length, m[3], c + ' day' + (c>1?'s':''));
  });
  /* One-line honest read (heavy vs light, never contradictory) */
  var heavy = (moodCounts.storm||0)+(moodCounts.guilt||0)+(moodCounts.fear||0)+(moodCounts.anger||0);
  var lightC = moodCounts.light||0;
  h += '<div style="margin-top:10px;padding:10px;background:#0d0d1a;border-radius:8px;font-size:11px;color:#a0aec0;line-height:1.7;">' +
    (lightC > heavy ? 'More ✨ light days than heavy ones this month — that\'s growth. 💜' :
     heavy > lightC ? 'This month carried more heavy days than light ones. Writing them down was the brave part. 🤍' :
     'A balanced month — real ups and downs, all of them yours.') + '</div>';
  h += '</div>';

  /* This month in past years */
  var pastYears = _vaultCache.entries.filter(function(e) {
    var d = new Date(e.ts);
    return d.getMonth() === v.m && d.getFullYear() < v.y;
  }).sort(function(a,b){ return b.ts - a.ts; });
  if (pastYears.length) {
    h += '<div class="card" style="margin-bottom:14px;border-left:3px solid #a855f7;"><div class="card-header">🕰️ ' + AE_MONTHS[v.m] + ' in Past Years</div>';
    pastYears.slice(0, 5).forEach(function(e) {
      var mo = vaultMood(e.mood);
      h += '<div style="margin-bottom:8px;"><div style="font-size:10px;color:#a855f7;font-weight:700;">' + mo[1] + ' ' + vaultDateName(e.ts) + '</div>';
      h += '<div style="font-size:12px;line-height:1.7;color:#c4c4d4;white-space:pre-wrap;">' + escHtml(e.text.substring(0, 220)) + (e.text.length>220?'…':'') + '</div></div>';
    });
    h += '</div>';
  }

  /* Optional private AI reflection */
  h += '<div class="card">';
  h += '<div class="card-header">🤖 Monthly Reflection (optional)</div>';
  if (state.vaultJustListen) {
    h += '<div style="font-size:11px;color:#8899bb;line-height:1.7;">You have <b style="color:#ec4899;">Just Listen mode</b> ON, so nothing is sent anywhere — the review above stays 100% on your device. Turn Just Listen off (in the Talk tab) if you want a caring AI reflection on this month.</div>';
  } else {
    h += '<div style="font-size:11px;color:#8899bb;line-height:1.7;margin-bottom:10px;">This sends only <b>this month\'s entries</b> to the AI (never your whole diary) to write you a gentle, private reflection. Your call.</div>';
    h += '<button class="btn-primary" style="width:100%;" onclick="vaultMonthReflect(this)">🤖 Reflect on ' + AE_MONTHS[v.m] + ' ' + v.y + '</button>';
    h += '<div id="vault-reflect-out" style="display:none;"></div>';
  }
  h += '</div>';

  return h;
}

function vaultMonthReflect(btn) {
  var state = window.AppState;
  var v = aeGetView('vaultReview');
  var monthEntries = _vaultCache.entries.filter(function(e) {
    var d = new Date(e.ts);
    return d.getFullYear() === v.y && d.getMonth() === v.m;
  }).sort(function(a,b){ return a.ts - b.ts; });
  if (!monthEntries.length) return;

  var out = document.getElementById('vault-reflect-out');
  out.style.display = 'block';
  out.innerHTML = '<div style="padding:10px;font-size:11px;color:#ec4899;">🤖 Reading your month with care...</div>';
  btn.disabled = true;

  var diary = monthEntries.map(function(e){ return vaultDateName(e.ts) + ' [' + vaultMood(e.mood)[2] + ']: ' + e.text; }).join('\n\n');
  var sys = 'You are Vasavi\'s gentle, private reflection companion. She is 23, Bengaluru. Below is her private diary ' +
    'for one month. Write her a warm, non-judgemental monthly reflection: 1) the emotional arc you notice across the month, ' +
    '2) one strength or moment of growth she may not have noticed, 3) one gentle, caring suggestion for next month. ' +
    'Never lecture. Speak like the kindest friend. Under 180 words. If there are signs she is really struggling, ' +
    'lovingly mention iCall 9152987821 (free India helpline).';

  var finish = function(reply) {
    btn.disabled = false;
    out.innerHTML = '<div style="margin-top:10px;background:#0d0d1a;border-left:3px solid #ec4899;padding:12px;border-radius:0 8px 8px 0;font-size:12px;line-height:1.9;white-space:pre-wrap;color:#a0aec0;">' + escHtml(reply) + '</div>' +
      '<button class="btn-ghost" style="width:100%;margin-top:8px;" onclick="vaultSealReflection(' + v.y + ',' + v.m + ',this)">🔐 Seal this reflection into my diary</button>';
    window._vaultLastReflection = reply;
  };

  if (typeof groqChat === 'function' && typeof getApiKey === 'function' && getApiKey()) {
    groqChat(sys, [{ role:'user', text: diary }], finish);
  } else {
    finish('Add your free Groq key in AI Assistant for an AI reflection. Even without it, look above: you wrote ' + monthEntries.length + ' times this month. That consistency is its own kind of strength.');
  }
}

function vaultSealReflection(y, m, btn) {
  if (!window._vaultLastReflection || !_vaultKey) return;
  var entry = { text: '🤖 Monthly reflection for ' + AE_MONTHS[m] + ' ' + y + ':\n\n' + window._vaultLastReflection, mood: 'light', ts: Date.now() };
  vaultEncrypt(_vaultKey, entry).then(function(pack) {
    entry._pack = pack;
    _vaultCache.entries.push(entry);
    window.AppState.vault.entries.push(pack);
    saveData();
    if (btn) { btn.disabled = true; btn.textContent = '✓ Sealed into your diary'; }
    showToast('🔐 Reflection sealed.');
  });
}

/* ---- ⚙️ CONTROL — her delete authority ---- */
function renderVaultSettings(state) {
  var h = '';
  h += '<div class="card" style="margin-bottom:14px;"><div class="card-header">Your Privacy, Explained Honestly</div>';
  h += '<div style="font-size:12px;line-height:1.9;color:#a0aec0;">' +
    '• Entries are encrypted with AES-256 on your device before saving.<br>' +
    '• Firebase and your backups only ever contain unreadable ciphertext.<br>' +
    '• Your passphrase is never stored — not in the app, not in the cloud.<br>' +
    '• "Just Listen" mode sends nothing anywhere, ever.<br>' +
    '• With responses ON, only the current conversation goes to the AI provider for a reply — never your diary, never old chats.<br>' +
    '• Anthropic/Groq do not train on API messages, but "leaves the device" is a fact — that\'s why Just Listen exists.</div></div>';

  h += '<div class="card" style="border:1px solid #ef4444;"><div class="card-header" style="color:#ef4444;">☢️ Delete Authority</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;">You asked for full authority — here it is. This wipes every entry, every chat message and the vault itself from this device AND the cloud. No recovery.</div>';
  h += '<input id="vault-nuke-confirm" placeholder=\'Type DELETE EVERYTHING to enable\' style="margin-bottom:8px;" />';
  h += '<button class="btn-red" style="width:100%;" onclick="vaultNuke()">☢️ Destroy Entire Vault Forever</button>';
  h += '</div>';
  return h;
}

function vaultNuke() {
  var el = document.getElementById('vault-nuke-confirm');
  if (!el || el.value.trim() !== 'DELETE EVERYTHING') {
    alert('Type exactly: DELETE EVERYTHING');
    return;
  }
  if (!confirm('Final check: destroy the entire vault forever?')) return;
  delete window.AppState.vault;
  _vaultKey = null; _vaultOpen = false;
  _vaultCache = { entries: [], chat: [] };
  saveData(); renderPage();
  showToast('Vault destroyed. It never existed.');
}

console.log('vault.js loaded OK');
