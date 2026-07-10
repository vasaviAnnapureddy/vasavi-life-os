/* ============================================
   VASAVI'S LIFE OS — REMINDER / ALERT ENGINE
   utils/reminder_engine.js

   Watches your focus minutes during the day.
   At each checkpoint time (e.g. 11:00), if you
   are at 0 mins or below target, it sends:
   - Browser notification + loud alarm
   - WhatsApp message (free, via CallMeBot)
   - Email (free, via EmailJS)
   - Auto-adds a catch-up task to Google Calendar

   NOTE: the browser tab (or installed PWA) must
   be open for checks to run — a webpage cannot
   run when it is fully closed.
   ============================================ */

var ALERT_DEFAULTS = {
  enabled:        false,
  targetMins:     120,
  times:          ['11:00','14:00','17:00','20:00','21:30'],
  useBrowser:     true,
  useWhatsApp:    false,
  useEmail:       false,
  useCalendar:    false,
  whatsappPhone:  '',   /* e.g. +919876543210 */
  callmebotKey:   '',   /* from CallMeBot activation message */
  emailTo:        'AnnapuVasavi4014@gmail.com',
  emailjsService: '',   /* EmailJS service ID */
  emailjsTemplate:'',   /* EmailJS template ID */
  emailjsPublic:  ''    /* EmailJS public key */
};

function getAlertConfig() {
  var s = window.AppState || {};
  return Object.assign({}, ALERT_DEFAULTS, s.alertConfig || {});
}

/* ============================================
   MAIN TICK — runs every minute
   ============================================ */
var _reminderTimer = null;

function initReminderEngine() {
  if (_reminderTimer) clearInterval(_reminderTimer);
  _reminderTimer = setInterval(reminderTick, 60000);
  reminderTick();
  console.log('Reminder engine running — checks every minute');
}

function reminderTick() {
  var state = window.AppState;
  if (!state) return;
  var cfg = getAlertConfig();
  if (!cfg.enabled) return;

  var now   = new Date();
  var hhmm  = pad(now.getHours()) + ':' + pad(now.getMinutes());
  if (cfg.times.indexOf(hhmm) === -1) return;

  var todayIso = aeIso(now);
  if (!state.alertsSent) state.alertsSent = {};
  if (!state.alertsSent[todayIso]) state.alertsSent[todayIso] = [];
  if (state.alertsSent[todayIso].indexOf(hhmm) !== -1) return; /* already sent */

  var mins = todayFocusMins();
  if (mins >= cfg.targetMins) return; /* target hit — nothing to nag about */

  var remaining = cfg.targetMins - mins;
  var msg;
  if (mins === 0) {
    msg = '🚨 Life OS Alert (' + hhmm + '): Vasavi, you have logged 0 focus minutes today! ' +
          'Target is ' + cfg.targetMins + ' mins. Open the Focus Timer and start one 25-min Pomodoro RIGHT NOW.';
  } else {
    msg = '⏰ Life OS Alert (' + hhmm + '): You are at ' + mins + '/' + cfg.targetMins +
          ' focus mins today. ' + remaining + ' mins remaining — one ' +
          (remaining >= 90 ? 'Deep Work 90m' : 'Pomodoro 25m') + ' session gets you moving.';
  }

  state.alertsSent[todayIso].push(hhmm);
  saveData();

  if (cfg.useBrowser) {
    if (typeof fireNotification === 'function') fireNotification('⏰ Focus Alert', msg);
    if (typeof playAlarm === 'function') playAlarm();
    showToast(msg, 'error');
  }
  if (cfg.useWhatsApp) sendWhatsAppAlert(msg);
  if (cfg.useEmail)    sendEmailAlert('⏰ Life OS Focus Alert — ' + mins + '/' + cfg.targetMins + ' mins', msg);
  if (cfg.useCalendar) addCatchupCalendarTask(remaining);
}

function todayFocusMins() {
  var state = window.AppState;
  var todayStr = new Date().toDateString();
  return (state.sessions || state.focusSessions || [])
    .filter(function(s){ return s.start && new Date(s.start).toDateString() === todayStr; })
    .reduce(function(a,s){ return a+(s.duration||0); }, 0);
}

/* ============================================
   WHATSAPP — via CallMeBot (free)
   Setup (one time):
   1. Save +34 644 71 81 99 in your phone contacts
   2. Send it this WhatsApp message: "I allow callmebot to send me messages"
   3. It replies with your personal API key — paste it below
   ============================================ */
function sendWhatsAppAlert(text, isTest) {
  var cfg = getAlertConfig();
  if (!cfg.whatsappPhone || !cfg.callmebotKey) {
    if (isTest) showToast('Fill your WhatsApp number and CallMeBot API key first.', 'error');
    return;
  }
  var url = 'https://api.callmebot.com/whatsapp.php' +
    '?phone='  + encodeURIComponent(cfg.whatsappPhone) +
    '&apikey=' + encodeURIComponent(cfg.callmebotKey) +
    '&text='   + encodeURIComponent(text);
  fetch(url, { mode: 'no-cors' })
    .then(function() { if (isTest) showToast('WhatsApp test sent! Check your phone in ~30 sec.'); })
    .catch(function(e) { if (isTest) showToast('WhatsApp send failed: ' + e.message, 'error'); });
}

/* ============================================
   EMAIL — via EmailJS (free 200/month)
   Setup (one time) at emailjs.com:
   1. Create account → Add Gmail service → copy Service ID
   2. Create a template with variables {{subject}} and {{message}}, set "To email" to your Gmail
   3. Copy Template ID + Public Key from Account page
   ============================================ */
function sendEmailAlert(subject, text, isTest) {
  var cfg = getAlertConfig();
  if (!cfg.emailjsService || !cfg.emailjsTemplate || !cfg.emailjsPublic) {
    if (isTest) showToast('Fill your EmailJS Service ID, Template ID and Public Key first.', 'error');
    return;
  }
  fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id:  cfg.emailjsService,
      template_id: cfg.emailjsTemplate,
      user_id:     cfg.emailjsPublic,
      template_params: {
        subject:  subject,
        message:  text,
        to_email: cfg.emailTo
      }
    })
  })
  .then(function(r) {
    if (r.ok) { if (isTest) showToast('Email test sent! Check ' + cfg.emailTo); }
    else r.text().then(function(t){ if (isTest) showToast('Email failed: ' + t, 'error'); });
  })
  .catch(function(e) { if (isTest) showToast('Email failed: ' + e.message, 'error'); });
}

/* ============================================
   GOOGLE CALENDAR — auto catch-up task
   Adds "Catch-up focus block" starting next hour.
   Needs Google Calendar connected once (button in
   Alerts settings). Skips silently if not connected.
   ============================================ */
function addCatchupCalendarTask(remainingMins) {
  if (typeof gCalToken === 'undefined' || !gCalToken) return;
  var now  = new Date();
  var next = new Date(now.getTime() + 10*60000); /* 10 mins from now */
  var hh   = pad(next.getHours()) + ':' + pad(next.getMinutes());
  if (typeof addToGoogleCalendar === 'function') {
    addToGoogleCalendar({
      title:           '🚨 Catch-up Focus Block (' + remainingMins + ' mins left)',
      date:            aeIso(now),
      time:            hh,
      description:     'Auto-added by Life OS — you were behind your daily focus target.',
      reminderMinutes: 5
    });
  }
}

/* ============================================
   SETTINGS UI (rendered inside Focus Timer page)
   ============================================ */
function renderAlertSettings(state) {
  var cfg = getAlertConfig();
  var h = '';

  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header">🔔 Automatic Focus Alerts</div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:12px;line-height:1.7;">' +
    'At each check time, if you are behind your daily focus target, Life OS alerts you. ' +
    '<b style="color:#f59e0b;">Important:</b> this page (or the installed app) must be open in the background — ' +
    'a closed browser cannot send messages.</div>';

  h += '<label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;margin-bottom:12px;cursor:pointer;">' +
    '<input type="checkbox" id="al-enabled" ' + (cfg.enabled?'checked':'') + ' style="width:18px;height:18px;" /> Enable alerts</label>';

  h += '<div class="grid-2" style="gap:10px;">';
  h += '<div class="form-row"><label>Daily target (mins)</label><input type="number" id="al-target" value="' + cfg.targetMins + '" /></div>';
  h += '<div class="form-row"><label>Check times (comma separated, 24h)</label><input id="al-times" value="' + escHtml(cfg.times.join(', ')) + '" /></div>';
  h += '</div>';

  h += '<label style="display:flex;align-items:center;gap:8px;font-size:12px;margin:4px 0;cursor:pointer;">' +
    '<input type="checkbox" id="al-browser" ' + (cfg.useBrowser?'checked':'') + ' /> 🔔 Browser notification + alarm sound</label>';
  h += '</div>';

  /* WhatsApp */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header"><label style="display:flex;align-items:center;gap:8px;cursor:pointer;">' +
    '<input type="checkbox" id="al-whatsapp" ' + (cfg.useWhatsApp?'checked':'') + ' /> 💬 WhatsApp alerts (free — CallMeBot)</label></div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;line-height:1.7;">One-time setup: ' +
    '1) Save <b>+34 644 71 81 99</b> in your contacts. ' +
    '2) WhatsApp it: <i>"I allow callmebot to send me messages"</i>. ' +
    '3) It replies with your API key — paste below.</div>';
  h += '<div class="grid-2" style="gap:10px;">';
  h += '<div class="form-row"><label>Your WhatsApp number</label><input id="al-wa-phone" placeholder="+919876543210" value="' + escHtml(cfg.whatsappPhone) + '" /></div>';
  h += '<div class="form-row"><label>CallMeBot API key</label><input id="al-wa-key" placeholder="123456" value="' + escHtml(cfg.callmebotKey) + '" /></div>';
  h += '</div>';
  h += '<button class="btn-ghost" onclick="saveAlertConfig();sendWhatsAppAlert(\'✅ Test from Vasavi Life OS — WhatsApp alerts working!\', true)">Send WhatsApp Test</button>';
  h += '</div>';

  /* Email */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header"><label style="display:flex;align-items:center;gap:8px;cursor:pointer;">' +
    '<input type="checkbox" id="al-email" ' + (cfg.useEmail?'checked':'') + ' /> 📧 Email alerts (free — EmailJS)</label></div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;line-height:1.7;">One-time setup at ' +
    '<a href="https://www.emailjs.com" target="_blank" style="color:#a855f7;">emailjs.com</a>: ' +
    'create free account → Add Gmail service → create template using {{subject}} and {{message}} → paste the 3 IDs below.</div>';
  h += '<div class="grid-2" style="gap:10px;">';
  h += '<div class="form-row"><label>Send to email</label><input id="al-em-to" value="' + escHtml(cfg.emailTo) + '" /></div>';
  h += '<div class="form-row"><label>Service ID</label><input id="al-em-service" placeholder="service_xxxx" value="' + escHtml(cfg.emailjsService) + '" /></div>';
  h += '<div class="form-row"><label>Template ID</label><input id="al-em-template" placeholder="template_xxxx" value="' + escHtml(cfg.emailjsTemplate) + '" /></div>';
  h += '<div class="form-row"><label>Public key</label><input id="al-em-public" placeholder="XxXxXx..." value="' + escHtml(cfg.emailjsPublic) + '" /></div>';
  h += '</div>';
  h += '<button class="btn-ghost" onclick="saveAlertConfig();sendEmailAlert(\'✅ Life OS test email\',\'Email alerts are working, Vasavi!\', true)">Send Email Test</button>';
  h += '</div>';

  /* Google Calendar */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div class="card-header"><label style="display:flex;align-items:center;gap:8px;cursor:pointer;">' +
    '<input type="checkbox" id="al-cal" ' + (cfg.useCalendar?'checked':'') + ' /> 📅 Auto-add catch-up task to Google Calendar</label></div>';
  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;">When behind target, a "Catch-up Focus Block" event is added 10 minutes from the check time. Connect Google Calendar once per session:</div>';
  h += '<button class="btn-ghost" onclick="authorizeGoogleCalendar(function(){showToast(\'Google Calendar connected!\')})">Connect Google Calendar</button>';
  h += '</div>';

  h += '<button class="btn-primary" style="width:100%;margin-bottom:14px;" onclick="saveAlertConfig(true)">💾 Save Alert Settings</button>';

  /* Today's log */
  var sent = (state.alertsSent||{})[aeTodayIso()] || [];
  h += '<div class="card">';
  h += '<div class="card-header">Alerts sent today</div>';
  if (sent.length) {
    sent.forEach(function(t){ h += '<div style="font-size:11px;color:#8899bb;padding:3px 0;">✅ Alert fired at ' + t + '</div>'; });
  } else {
    h += '<div style="font-size:11px;color:#556080;">None yet today. ' + (cfg.enabled ? 'Watching your checkpoints: ' + cfg.times.join(', ') : 'Alerts are OFF.') + '</div>';
  }
  h += '</div>';

  return h;
}

function saveAlertConfig(showMsg) {
  var g = function(id){ var el=document.getElementById(id); return el?el.value.trim():''; };
  var c = function(id){ var el=document.getElementById(id); return el?el.checked:false; };
  var times = g('al-times').split(',').map(function(t){ return t.trim(); }).filter(function(t){ return /^\d{1,2}:\d{2}$/.test(t); })
    .map(function(t){ var p=t.split(':'); return pad(parseInt(p[0])) + ':' + p[1]; });

  window.AppState.alertConfig = {
    enabled:         c('al-enabled'),
    targetMins:      parseInt(g('al-target')) || 120,
    times:           times.length ? times : ALERT_DEFAULTS.times,
    useBrowser:      c('al-browser'),
    useWhatsApp:     c('al-whatsapp'),
    useEmail:        c('al-email'),
    useCalendar:     c('al-cal'),
    whatsappPhone:   g('al-wa-phone'),
    callmebotKey:    g('al-wa-key'),
    emailTo:         g('al-em-to') || ALERT_DEFAULTS.emailTo,
    emailjsService:  g('al-em-service'),
    emailjsTemplate: g('al-em-template'),
    emailjsPublic:   g('al-em-public')
  };
  saveData();
  if (showMsg === true) { showToast('Alert settings saved! ✅'); renderPage(); }
}

/* Self-init once the app is ready */
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initReminderEngine, 3000);
});

console.log('reminder_engine.js loaded OK');
