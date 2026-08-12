/* ============================================
   VASAVI'S LIFE OS — SETTINGS & DATA SAFETY
   modules/settings.js

   Everything about protecting your data:
   - Google sign-in (locks the cloud to you)
   - Storage health + what's taking space
   - Backup: download OR share straight to
     WhatsApp / Telegram (no Google Drive needed)
   - Restore
   ============================================ */

function renderSettings() {
  var state = window.AppState;
  var tab = state.settingsTab || 'data';
  var h = '';

  h += '<div class="subtab-bar">';
  [['data','💾 Backup & Data'],['account','🔐 Account & Security'],['about','ℹ️ About']].forEach(function(t) {
    h += '<div class="subtab ' + (tab===t[0]?'active':'') + '" onclick="switchSettingsTab(\'' + t[0] + '\')">' + t[1] + '</div>';
  });
  h += '</div>';

  if (tab === 'data')    h += renderSettingsData(state);
  if (tab === 'account') h += renderSettingsAccount(state);
  if (tab === 'about')   h += renderSettingsAbout(state);
  return h;
}

function switchSettingsTab(t) { window.AppState.settingsTab = t; saveData(); renderPage(); }

/* ============================================
   💾 BACKUP & DATA
   ============================================ */
function renderSettingsData(state) {
  var h = '';
  var health = (typeof storageHealth === 'function') ? storageHealth() : { kb:0, pct:0, level:'healthy' };
  var days = (typeof daysSinceBackup === 'function') ? daysSinceBackup() : 999;
  var healthColor = health.level === 'critical' ? '#ef4444' : health.level === 'warning' ? '#f59e0b' : '#10b981';

  /* The 3-2-1 status */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">🛡️ Your 3 Copies (the 3-2-1 rule)</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;line-height:1.7;">Data survives when it lives in 3 places. Here is your status right now:</div>';

  var copies = [
    ['📱 This device', 'Saved instantly, works offline', true, 'localStorage on your phone/laptop'],
    ['☁️ Cloud (Firebase)', window.FB_READY ? 'Connected & syncing' : 'Not connected right now', !!window.FB_READY, 'Follows you to any new phone automatically'],
    ['💾 A file you own', days === 999 ? 'Never backed up yet!' : (days === 0 ? 'Backed up today ✓' : 'Last backup ' + days + ' days ago'), days < 30, 'Survives even if Firebase ever disappears']
  ];
  copies.forEach(function(c) {
    h += '<div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid #1a1a35;">';
    h += '<span style="font-size:16px;">' + (c[2] ? '✅' : '⚠️') + '</span>';
    h += '<div style="flex:1;"><div style="font-size:12px;font-weight:700;">' + c[0] + '</div>';
    h += '<div style="font-size:11px;color:' + (c[2] ? '#10b981' : '#f59e0b') + ';">' + c[1] + '</div>';
    h += '<div style="font-size:10px;color:#556080;margin-top:2px;">' + c[3] + '</div></div></div>';
  });
  h += '</div>';

  /* Backup actions */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">💾 Make a Backup Now</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;line-height:1.7;">' +
    'Your whole life in one small file (currently about <b style="color:#a855f7;">' + health.kb + ' KB</b> — smaller than one photo). ' +
    'Google storage full? No problem — send it to yourself on <b>WhatsApp</b> or <b>Telegram</b> instead. Those keep it free, forever.</div>';
  h += '<button class="btn-primary" style="width:100%;margin-bottom:8px;" onclick="shareBackupFile()">📤 Backup &amp; Send to WhatsApp / Telegram</button>';
  h += '<button class="btn-ghost" style="width:100%;margin-bottom:8px;" onclick="backupData()">⬇️ Download to This Device</button>';
  h += '<div style="font-size:10px;color:#556080;line-height:1.7;">💡 <b>Best free trick:</b> in WhatsApp, message <i>yourself</i> (your own number) or use Telegram\'s "Saved Messages" — unlimited free file storage that never touches Google Drive.</div>';
  h += '</div>';

  /* Restore */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">♻️ Restore From a Backup</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;">Pick a backup file to bring everything back. It also re-uploads to the cloud so all your devices match.</div>';
  h += '<button class="btn-ghost" style="width:100%;" onclick="document.getElementById(\'restore-file-input\').click()">📂 Choose Backup File</button>';
  h += '</div>';

  /* Storage health */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📦 Device Storage Health</div>';
  h += '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">' +
    '<span>Used on this device</span><span style="color:' + healthColor + ';font-weight:800;">' + health.kb + ' KB (' + health.pct + '%)</span></div>';
  h += '<div class="progress-bar"><div class="progress-fill" style="width:' + Math.max(2, health.pct) + '%;background:' + healthColor + ';"></div></div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-top:8px;line-height:1.7;">' +
    (health.level === 'critical' ? '🚨 Almost full! Back up now and delete old photos/voice notes in Rich Notes.' :
     health.level === 'warning'  ? '⚠️ Filling up. Photos and voice notes take the most space.' :
     '✅ Plenty of room. Text entries are tiny — you could write daily for years.') + '</div>';

  if (typeof storageBreakdown === 'function') {
    var bd = storageBreakdown();
    if (bd.length) {
      h += '<div style="margin-top:12px;padding-top:10px;border-top:1px solid #1a1a35;">';
      h += '<div style="font-size:11px;font-weight:700;color:#8899bb;margin-bottom:6px;">What is taking the most space</div>';
      bd.forEach(function(b) {
        h += '<div style="display:flex;justify-content:space-between;font-size:11px;padding:3px 0;">' +
          '<span style="color:#a0aec0;">' + escHtml(b.key) + '</span><span style="color:#f59e0b;">' + b.kb + ' KB</span></div>';
      });
      h += '</div>';
    }
  }
  h += '</div>';

  return h;
}

/* Share the backup file directly to any app (WhatsApp, Telegram, Files…) */
function shareBackupFile() {
  try {
    var data = JSON.stringify(window.AppState, null, 2);
    var name = 'life-os-backup-' + new Date().toISOString().split('T')[0] + '.json';
    var file = new File([data], name, { type: 'application/json' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: 'Vasavi Life OS Backup',
        text: 'My Life OS backup — ' + new Date().toLocaleDateString('en-IN')
      }).then(function() {
        window.AppState.lastBackupIso = new Date().toISOString().split('T')[0];
        saveData(); renderPage();
        showToast('✅ Backup shared! Keep it safe.');
      }).catch(function(){ /* user cancelled — no noise */ });
    } else {
      /* Desktop or unsupported browser — download instead */
      backupData();
      showToast('Sharing not supported here — downloaded instead. On your phone it will offer WhatsApp/Telegram.');
    }
  } catch(e) {
    backupData();
  }
}

/* ============================================
   🔐 ACCOUNT & SECURITY
   ============================================ */
function renderSettingsAccount(state) {
  var h = '';
  var user = window.AUTH_USER || null;

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">🔐 Google Sign-In</div>';

  if (user) {
    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">';
    h += '<div style="width:38px;height:38px;border-radius:50%;background:#10b981;display:flex;align-items:center;justify-content:center;font-size:18px;">✓</div>';
    h += '<div><div style="font-size:13px;font-weight:800;">Signed in</div>';
    h += '<div style="font-size:11px;color:#10b981;">' + escHtml(user.email || 'your Google account') + '</div></div></div>';

    h += '<div style="font-size:11px;color:#8899bb;margin-bottom:6px;">Your account ID (needed for the security rules below):</div>';
    h += '<div style="background:var(--card2);border:1px solid var(--border);border-radius:8px;padding:9px;font-size:11px;font-family:monospace;word-break:break-all;color:#a855f7;">' + escHtml(user.uid) + '</div>';
    h += '<button class="btn-ghost" style="width:100%;margin-top:8px;" onclick="copyUid(\'' + escHtml(user.uid) + '\')">📋 Copy My Account ID</button>';
    h += '<button class="btn-ghost" style="width:100%;margin-top:6px;" onclick="signOutGoogle()">Sign Out</button>';
  } else {
    h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;line-height:1.7;">' +
      'Right now your app link is public — anyone who finds it could read your cloud data. ' +
      'Signing in lets you lock the database to <b>only your Google account</b>.<br><br>' +
      '<b style="color:#10b981;">Your data will not move or change.</b> It stays exactly where it is — sign-in only adds a lock.</div>';
    h += '<button class="btn-primary" style="width:100%;" onclick="signInWithGoogle()">🔐 Sign in with Google</button>';
  }
  h += '</div>';

  /* Security rules helper */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">🛡️ Lock Your Database (one-time, 2 minutes)</div>';
  h += '<div style="font-size:11px;color:#8899bb;line-height:1.8;margin-bottom:10px;">' +
    '<b>Step 1.</b> Sign in above and copy your Account ID.<br>' +
    '<b>Step 2.</b> Open <a href="https://console.firebase.google.com/project/vasavi-life-os/firestore/rules" target="_blank" style="color:#a855f7;">Firebase Console → Firestore → Rules</a>.<br>' +
    '<b>Step 3.</b> Replace everything there with the rules below (paste your ID where shown), then press <b>Publish</b>.</div>';

  var uid = user ? user.uid : 'PASTE_YOUR_ACCOUNT_ID_HERE';
  var rules =
    'rules_version = \'2\';\n' +
    'service cloud.firestore {\n' +
    '  match /databases/{database}/documents {\n' +
    '    match /{document=**} {\n' +
    '      allow read, write: if request.auth != null\n' +
    '        && request.auth.uid == "' + uid + '";\n' +
    '    }\n' +
    '  }\n' +
    '}';
  h += '<div style="background:#0d0d1a;border:1px solid var(--border);border-radius:8px;padding:10px;font-size:10px;font-family:monospace;white-space:pre;overflow-x:auto;color:#a0aec0;">' + escHtml(rules) + '</div>';
  h += '<button class="btn-ghost" style="width:100%;margin-top:8px;" onclick="copyRules()">📋 Copy These Rules</button>';
  h += '<textarea id="rules-hidden" style="position:absolute;left:-9999px;">' + escHtml(rules) + '</textarea>';
  h += '<div style="font-size:10px;color:#f59e0b;margin-top:8px;line-height:1.7;">⚠️ Do this only AFTER signing in on the device you use most. If sync ever stops working, just sign in again.</div>';
  h += '</div>';

  /* Honest privacy note */
  h += '<div class="card">';
  h += '<div class="card-header">🤍 What is already private</div>';
  h += '<div style="font-size:11px;color:#a0aec0;line-height:1.8;">' +
    '• Your <b>Vault diary</b> is encrypted on your device with your passphrase — even if someone got into the database, they would see only scrambled text.<br>' +
    '• Everything else (habits, money, goals) is stored normally — that is what the sign-in lock above protects.<br>' +
    '• Your passphrase is never stored anywhere. Nobody can reset it, including me.</div>';
  h += '</div>';

  return h;
}

function copyUid(uid) {
  navigator.clipboard.writeText(uid).then(function(){ showToast('📋 Account ID copied!'); })
    .catch(function(){ showToast('Select and copy it manually.', 'error'); });
}

function copyRules() {
  var el = document.getElementById('rules-hidden');
  if (!el) return;
  navigator.clipboard.writeText(el.value).then(function(){ showToast('📋 Rules copied — paste into Firebase Console!'); })
    .catch(function(){ el.style.position='static'; el.select(); showToast('Select the text and copy it.'); });
}

/* ============================================
   ℹ️ ABOUT
   ============================================ */
function renderSettingsAbout(state) {
  var h = '';
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">📱 Is this a real app?</div>';
  h += '<div style="font-size:12px;color:#a0aec0;line-height:1.9;">' +
    'Yes — and no. It is a <b>PWA (Progressive Web App)</b>. When you added it to your home screen, your phone installed it like an app: ' +
    'it has its own icon, opens fullscreen with no browser bar, and works offline.<br><br>' +
    'The difference from a Play Store app is only <i>how it was delivered</i> — it runs on web technology instead of being downloaded from a store. ' +
    'For you, day to day, there is no difference.<br><br>' +
    '<b style="color:#10b981;">What this means for you:</b><br>' +
    '• New phone? Just open your link and add to home screen again — everything comes back from the cloud.<br>' +
    '• It updates itself. No Play Store updates needed.<br>' +
    '• It works with no internet (your data is on the device).<br>' +
    '• Uninstalling it does <b>not</b> delete your cloud data.</div>';
  h += '</div>';

  h += '<div class="card">';
  h += '<div class="card-header">💜 Vasavi Life OS</div>';
  h += '<div style="font-size:11px;color:#8899bb;line-height:1.8;">' +
    'Built by you, for you. Every module here exists because you needed it.<br><br>' +
    '<b>Data sections tracked:</b> ' + Object.keys(state).length + '<br>' +
    '<b>Day number:</b> ' + (state.dayNumber || 1) + '</div>';
  h += '</div>';
  return h;
}

console.log('settings.js loaded OK');
