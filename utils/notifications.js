/* ============================================
   VASAVI'S LIFE OS — NOTIFICATIONS + GOOGLE CALENDAR
   utils/notifications.js

   Daily reminders at exact times
   Google Calendar event creation
   All notifications Vasavi asked for
   ============================================ */

/* ============================================
   DAILY SCHEDULE — ALL REMINDERS
   ============================================ */
var DAILY_REMINDERS = [
  { time: '05:25', title: '🌅 Wake Up!',           body: 'Good morning Vasavi! 5:30 AM start. Brush, water, 5 min silence.' },
  { time: '05:55', title: '🧘 Morning Ritual',      body: 'Pranayama + gratitude + set intention for the day.' },
  { time: '06:25', title: '💪 Gym Time',            body: 'Time to move your body. 30 min is enough. Go!' },
  { time: '09:55', title: '☕ Deep Work Prep',      body: 'DS study starts in 5 minutes. Close all distractions.' },
  { time: '10:00', title: '📊 Deep Work Begins',    body: 'Focus block starts NOW. Phone away. DS study time.' },
  { time: '12:25', title: '🍽️ Lunch Break',         body: 'Deep work done! Eat properly. Rest 20 min.' },
  { time: '14:55', title: '📚 Study Block 2',       body: 'Afternoon DS session in 5 min. Projects + practice.' },
  { time: '17:25', title: '🌍 Learning Time',       body: 'Learning OS time in 5 min. One topic. Expand your world.' },
  { time: '19:25', title: '🇰🇷 Language Practice',  body: 'Korean + English practice. 30 min. Consistency wins.' },
  { time: '20:55', title: '💰 Log Expenses',        body: 'Take 5 min to log today\'s expenses before you forget.' },
  { time: '21:25', title: '📓 Journal Time',        body: 'Write 5 things. Reflect on today. What went well?' },
  { time: '21:55', title: '📱 Phone Down',          body: 'Wind down. No screens after 10 PM. Sleep is priority.' },
  { time: '22:25', title: '😴 Sleep Time',          body: 'Lights out. 7-8 hours = better DS, better mood, better everything.' }
];

var reminderIntervals = [];
var notificationsGranted = false;

/* ============================================
   REQUEST NOTIFICATION PERMISSION
   ============================================ */
function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return;
  }
  Notification.requestPermission().then(function(permission) {
    notificationsGranted = permission === 'granted';
    if (notificationsGranted) {
      startDailyReminders();
      showToast('Notifications enabled! You will get reminders throughout the day.');
    } else {
      showToast('Notifications blocked. Enable in browser settings.', 'error');
    }
  });
}

/* ============================================
   START DAILY REMINDERS
   Checks every minute if it is reminder time
   ============================================ */
function startDailyReminders() {
  /* Clear existing */
  reminderIntervals.forEach(function(id){ clearInterval(id); });
  reminderIntervals = [];

  var id = setInterval(function() {
    var now     = new Date();
    var hh      = String(now.getHours()).padStart(2,'0');
    var mm      = String(now.getMinutes()).padStart(2,'0');
    var timeStr = hh + ':' + mm;

    DAILY_REMINDERS.forEach(function(reminder) {
      if (reminder.time === timeStr) {
        fireNotification(reminder.title, reminder.body);
      }
    });

    /* Check custom calendar events */
    checkCalendarNotifications(now);

  }, 60000); /* check every minute */

  reminderIntervals.push(id);
  console.log('Daily reminders started — checking every minute');
}

/* ============================================
   FIRE A NOTIFICATION
   ============================================ */
function fireNotification(title, body, icon) {
  if (!notificationsGranted) return;
  try {
    var n = new Notification(title, {
      body:  body,
      icon:  icon || '/icon-192.png',
      badge: '/icon-192.png',
      tag:   title,
      requireInteraction: false
    });
    n.onclick = function() { window.focus(); n.close(); };
    /* Also show in-app toast */
    showToast(title + ' — ' + body.substring(0,40) + '...');
  } catch(e) {
    console.warn('Notification error:', e);
  }
}

/* ============================================
   GOOGLE CALENDAR INTEGRATION
   ============================================ */
var GCAL_CLIENT_ID = ''; /* Fill after Google Cloud setup */
var GCAL_API_KEY   = ''; /* Fill after Google Cloud setup */
var GCAL_SCOPE     = 'https://www.googleapis.com/auth/calendar.events';
var gCalReady      = false;
var gCalToken      = null;

function initGoogleCalendar(clientId, apiKey) {
  GCAL_CLIENT_ID = clientId;
  GCAL_API_KEY   = apiKey;

  /* Load Google Identity Services */
  var script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.onload = function() {
    gCalReady = true;
    console.log('Google Calendar SDK ready');
  };
  document.head.appendChild(script);
}

function authorizeGoogleCalendar(callback) {
  if (!GCAL_CLIENT_ID) {
    showToast('Google Calendar not configured yet.', 'error');
    return;
  }
  var client = google.accounts.oauth2.initTokenClient({
    client_id: GCAL_CLIENT_ID,
    scope:     GCAL_SCOPE,
    callback:  function(tokenResponse) {
      gCalToken = tokenResponse.access_token;
      if (callback) callback();
    }
  });
  client.requestAccessToken();
}

/* ============================================
   ADD EVENT TO GOOGLE CALENDAR
   Called from Planner when you add an event
   ============================================ */
function addToGoogleCalendar(event) {
  /* event = { title, date, time, description, reminderMinutes } */
  if (!gCalToken) {
    authorizeGoogleCalendar(function() { addToGoogleCalendar(event); });
    return;
  }

  var startDateTime = event.date + 'T' + (event.time || '09:00') + ':00';
  var endDateTime   = event.date + 'T' + (event.endTime || addHour(event.time || '09:00')) + ':00';

  var calEvent = {
    summary:     event.title,
    description: event.description || 'Added from Vasavi\'s Life OS',
    start:       { dateTime: startDateTime, timeZone: 'Asia/Kolkata' },
    end:         { dateTime: endDateTime,   timeZone: 'Asia/Kolkata' },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup',  minutes: event.reminderMinutes || 5 },
        { method: 'popup',  minutes: 60 }
      ]
    }
  };

  fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method:  'POST',
    headers: {
      'Authorization': 'Bearer ' + gCalToken,
      'Content-Type':  'application/json'
    },
    body: JSON.stringify(calEvent)
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.id) {
      showToast('Added to Google Calendar with reminder!');
      /* Save gcal event id locally */
      if (!window.AppState.calendarEvents) window.AppState.calendarEvents = [];
      window.AppState.calendarEvents.push({ localId: event.id, gcalId: data.id, title: event.title });
      saveData();
    } else {
      showToast('Calendar error: ' + (data.error&&data.error.message||'unknown'), 'error');
    }
  })
  .catch(function(e) { showToast('Calendar sync failed: ' + e.message, 'error'); });
}

/* ============================================
   QUICK ADD — from anywhere in the app
   ============================================ */
function quickAddToCalendar(title, date, time, description) {
  addToGoogleCalendar({
    title:           title,
    date:            date,
    time:            time || '09:00',
    description:     description || '',
    reminderMinutes: 5
  });
}

/* ============================================
   BULK ADD — daily schedule to calendar
   Adds all of Vasavi's daily blocks at once
   ============================================ */
function addDailyScheduleToCalendar(date) {
  if (!date) date = new Date().toISOString().split('T')[0];

  var schedule = [
    { title:'🌅 Wake Up + Morning Ritual', time:'05:30', endTime:'06:00', desc:'Pranayama, gratitude, set intention' },
    { title:'💪 Gym',                       time:'06:00', endTime:'07:00', desc:'Workout' },
    { title:'📊 Deep Work — DS Study',      time:'10:00', endTime:'12:30', desc:'Focused DS learning and practice' },
    { title:'🌍 Learning OS',               time:'17:30', endTime:'18:00', desc:'One learning topic' },
    { title:'🇰🇷 Korean + English',         time:'19:30', endTime:'20:00', desc:'Language practice' },
    { title:'💰 Log Expenses',              time:'21:00', endTime:'21:15', desc:'Finance tracking' },
    { title:'📓 Journal',                   time:'21:30', endTime:'21:45', desc:'Reflection and notes' }
  ];

  var delay = 0;
  schedule.forEach(function(ev) {
    setTimeout(function() {
      addToGoogleCalendar({ title:ev.title, date:date, time:ev.time, endTime:ev.endTime, description:ev.desc, reminderMinutes:5 });
    }, delay);
    delay += 500; /* stagger API calls */
  });

  showToast('Adding your full daily schedule to Google Calendar...');
}

/* ============================================
   CHECK CALENDAR NOTIFICATIONS
   Fires reminder 5 min before any saved event
   ============================================ */
function checkCalendarNotifications(now) {
  var events = window.AppState.calendarEvents || [];
  var appEvents = window.AppState.events || [];

  appEvents.forEach(function(ev) {
    if (!ev.date || !ev.time) return;
    var evTime  = new Date(ev.date + 'T' + ev.time);
    var diff    = Math.round((evTime - now) / 60000); /* minutes until event */
    if (diff === 5) {
      fireNotification('⏰ ' + ev.title + ' in 5 minutes!', ev.description || 'Starting soon');
    }
    if (diff === 0) {
      fireNotification('🔔 ' + ev.title + ' — NOW!', 'It\'s time!');
    }
  });
}

/* ============================================
   HELPER — add 1 hour to time string
   ============================================ */
function addHour(timeStr) {
  var parts = timeStr.split(':');
  var h = parseInt(parts[0]) + 1;
  return (h < 24 ? h : 23) + ':' + parts[1];
}

/* ============================================
   INIT — called from app.js on load
   ============================================ */
function initNotifications() {
  /* Auto-request permission if not already granted */
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      notificationsGranted = true;
      startDailyReminders();
    } else if (Notification.permission !== 'denied') {
      /* Will request on first user interaction */
      document.addEventListener('click', function onFirstClick() {
        requestNotificationPermission();
        document.removeEventListener('click', onFirstClick);
      }, { once: true });
    }
  }
}

console.log('notifications.js loaded — daily reminders + Google Calendar ready');