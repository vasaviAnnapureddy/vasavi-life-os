/* ============================================
   VASAVI'S LIFE OS — RICH NOTES
   modules/notes.js

   7 pre-built documents + unlimited custom docs
   Each doc: rich text, voice notes, images
   All saved to localStorage → Firebase later
   Like Google Docs but yours forever
   ============================================ */

/* 7 default document categories */
var DEFAULT_DOCS = [
  { id:'doc_life',      icon:'🌟', title:'Life Thoughts',        desc:'Reflections, realisations, things you want to remember about life' },
  { id:'doc_ds',        icon:'💻', title:'DS and Tech Notes',     desc:'Things you learned, code snippets, concepts explained in your words' },
  { id:'doc_india',     icon:'🕉️', title:'Indian Wisdom',         desc:'Gita verses, Vedanta insights, Ayurveda notes, slokas with meaning' },
  { id:'doc_self',      icon:'🧠', title:'Know Yourself',         desc:'Patterns you noticed, emotions you processed, who you are becoming' },
  { id:'doc_people',    icon:'💕', title:'Relationships',         desc:'What you learned about love, family, friendships, and people' },
  { id:'doc_goals',     icon:'🎯', title:'Dreams and Goals',      desc:'Things you want to achieve, milestones, the life you are building' },
  { id:'doc_gratitude', icon:'🙏', title:'Gratitude Journal',     desc:'What you are thankful for, small wins, moments of beauty' }
];

function renderNotes() {
  var state   = window.AppState;
  var openDoc = state.notesOpenDoc || null;

  /* If a doc is open, show doc editor */
  if (openDoc) {
    return renderDocEditor(state, openDoc);
  }

  /* Show doc list */
  return renderDocList(state);
}

/* ============================================
   DOCUMENT LIST
   ============================================ */
function renderDocList(state) {
  var h = '';
  var allDocs  = getAllDocs(state);

  /* Stats */
  var totalEntries = allDocs.reduce(function(a, doc) {
    return a + ((state.notesData||{})[doc.id]||[]).length;
  }, 0);

  h += '<div class="grid-3" style="margin-bottom:14px;">';
  h += '<div class="stat-card" style="--stat-color:#a855f7"><div class="stat-value">' + allDocs.length + '</div><div class="stat-label">Documents</div><div class="stat-sub">Your knowledge base</div></div>';
  h += '<div class="stat-card" style="--stat-color:#10b981"><div class="stat-value">' + totalEntries + '</div><div class="stat-label">Total Entries</div><div class="stat-sub">Saved forever</div></div>';
  h += '<div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-value">' + allDocs.filter(function(d){ return ((state.notesData||{})[d.id]||[]).length > 0; }).length + '</div><div class="stat-label">Active Docs</div><div class="stat-sub">Written in</div></div>';
  h += '</div>';

  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:14px;">Each document is yours forever. Add text, record voice thoughts, attach images. Nothing is lost.</div>';

  /* Document grid */
  h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;margin-bottom:18px;">';
  allDocs.forEach(function(doc) {
    var entries = ((state.notesData||{})[doc.id]||[]);
    var lastEntry = entries.length > 0 ? entries[entries.length-1] : null;
    var isCustom  = !DEFAULT_DOCS.find(function(d){ return d.id === doc.id; });

    h += '<div onclick="openNotesDoc(\'' + doc.id + '\')" style="background:var(--card2);border:1px solid var(--border);border-radius:12px;padding:16px;cursor:pointer;transition:border-color .2s;" onmouseover="this.style.borderColor=\'#a855f7\'" onmouseout="this.style.borderColor=\'var(--border)\'">';
    h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">';
    h += '<span style="font-size:28px;">' + doc.icon + '</span>';
    h += '<div style="text-align:right;">';
    if (isCustom) h += '<button onclick="event.stopPropagation();deleteNotesDoc(\'' + doc.id + '\')" style="background:transparent;border:none;color:#556080;cursor:pointer;font-size:14px;">×</button>';
    h += '<div style="font-size:10px;color:#556080;">' + entries.length + ' entries</div>';
    h += '</div></div>';
    h += '<div style="font-size:14px;font-weight:700;margin-bottom:4px;">' + escHtml(doc.title) + '</div>';
    h += '<div style="font-size:11px;color:#8899bb;line-height:1.5;">' + escHtml(doc.desc) + '</div>';
    if (lastEntry) {
      h += '<div style="margin-top:10px;padding-top:10px;border-top:1px solid #1a1a35;font-size:11px;color:#556080;">';
      h += 'Last: ' + (lastEntry.date||'') + ' · ';
      if (lastEntry.type === 'text') h += escHtml((lastEntry.content||'').substring(0,40)) + (lastEntry.content&&lastEntry.content.length>40?'...':'');
      else if (lastEntry.type === 'voice') h += '🎤 Voice note';
      else if (lastEntry.type === 'image') h += '📷 Image';
      h += '</div>';
    }
    h += '</div>';
  });
  h += '</div>';

  /* Create new document */
  h += '<div class="card">';
  h += '<div class="card-header">+ Create New Document</div>';
  h += '<div style="display:flex;gap:8px;margin-bottom:8px;">';
  h += '<input id="new-doc-icon" placeholder="Icon (emoji)" style="width:60px;" value="📄" maxlength="2" />';
  h += '<input id="new-doc-title" placeholder="Document title..." style="flex:1;" />';
  h += '</div>';
  h += '<input id="new-doc-desc" placeholder="What is this document for? (description)" style="margin-bottom:8px;" />';
  h += '<button class="btn-primary" onclick="createNotesDoc()" style="width:100%;">Create Document</button>';
  h += '</div>';

  return h;
}

/* ============================================
   DOCUMENT EDITOR
   ============================================ */
function renderDocEditor(state, docId) {
  var allDocs = getAllDocs(state);
  var doc     = allDocs.find(function(d){ return d.id === docId; });
  if (!doc) return '<div class="empty-state"><div class="emo">📄</div><p>Document not found.</p></div>';

  var entries = ((state.notesData||{})[docId]||[]);
  var h       = '';

  /* Back button + title */
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">';
  h += '<button onclick="closeNotesDoc()" style="background:transparent;border:1px solid var(--border);color:#8899bb;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:11px;">← Back</button>';
  h += '<span style="font-size:22px;">' + doc.icon + '</span>';
  h += '<div><div style="font-size:16px;font-weight:800;">' + escHtml(doc.title) + '</div>';
  h += '<div style="font-size:11px;color:#8899bb;">' + escHtml(doc.desc) + ' · ' + entries.length + ' entries</div></div>';
  h += '</div>';

  /* Input area — text */
  h += '<div class="card" style="margin-bottom:14px;">';
  h += '<div style="font-size:11px;font-weight:700;color:#a855f7;margin-bottom:10px;">✍️ Add Entry</div>';
  h += '<input id="ne-title" placeholder="Entry title (optional)..." style="margin-bottom:8px;" />';
  h += '<textarea id="ne-text" rows="5" placeholder="Write anything here. Your thoughts, what you learned, how you feel, ideas that came to you..." style="margin-bottom:10px;"></textarea>';

  /* Image attach */
  h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">';
  h += '<label style="padding:7px 12px;border-radius:8px;border:1px solid var(--border);background:var(--card2);cursor:pointer;font-size:11px;color:#8899bb;">';
  h += '📷 Attach Image<input type="file" id="ne-image" accept="image/*" style="display:none;" onchange="previewNoteImage(this)" />';
  h += '</label>';
  h += '<button id="ne-voice-btn" onclick="toggleVoiceNote()" style="padding:7px 12px;border-radius:8px;border:1px solid var(--border);background:var(--card2);cursor:pointer;font-size:11px;color:#8899bb;">🎤 Record Voice</button>';
  h += '<div id="ne-voice-status" style="font-size:11px;color:#8899bb;padding:7px 0;"></div>';
  h += '</div>';
  h += '<div id="ne-image-preview" style="margin-bottom:10px;"></div>';
  h += '<button class="btn-primary" onclick="addNoteEntry(\'' + docId + '\')" style="width:100%;">💾 Save Entry</button>';
  h += '</div>';

  /* Entries list */
  if (entries.length === 0) {
    h += '<div class="empty-state"><div class="emo">📝</div><p>This document is empty. Write your first entry above!</p></div>';
    return h;
  }

  h += '<div style="font-size:11px;color:#8899bb;margin-bottom:10px;">' + entries.length + ' entries — newest first</div>';

  entries.slice().reverse().forEach(function(entry, revIdx) {
    var realIdx = entries.length - 1 - revIdx;
    var isOpen  = state.notesEntryOpen === (docId + '_' + realIdx);

    h += '<div style="background:var(--card2);border:1px solid var(--border);border-radius:10px;margin-bottom:10px;overflow:hidden;">';

    /* Entry header */
    h += '<div onclick="toggleEntryOpen(\'' + docId + '\',' + realIdx + ')" style="display:flex;justify-content:space-between;align-items:center;padding:12px 14px;cursor:pointer;">';
    h += '<div style="display:flex;align-items:center;gap:8px;">';
    if (entry.type === 'voice') h += '<span style="font-size:16px;">🎤</span>';
    else if (entry.type === 'image') h += '<span style="font-size:16px;">📷</span>';
    else h += '<span style="font-size:16px;">📝</span>';
    h += '<div>';
    h += '<div style="font-size:13px;font-weight:700;">' + escHtml(entry.title || (entry.type==='voice' ? 'Voice note' : entry.type==='image' ? 'Image entry' : ((entry.content||'').substring(0,40) + ((entry.content||'').length>40?'...':'')))) + '</div>';
    h += '<div style="font-size:10px;color:#556080;">' + (entry.date||'') + (entry.time?' · '+entry.time:'') + '</div>';
    h += '</div></div>';
    h += '<div style="display:flex;align-items:center;gap:6px;">';
    h += '<span style="color:#8899bb;font-size:14px;">' + (isOpen?'∨':'›') + '</span>';
    h += '<button onclick="event.stopPropagation();deleteNoteEntry(\'' + docId + '\',' + realIdx + ')" style="background:transparent;border:none;color:#ef4444;cursor:pointer;font-size:16px;">×</button>';
    h += '</div></div>';

    /* Entry content (when open) */
    if (isOpen) {
      h += '<div style="padding:0 14px 14px;">';
      if (entry.content) {
        h += '<div style="font-size:13px;line-height:1.8;color:#c4c4d4;white-space:pre-wrap;margin-bottom:10px;">' + escHtml(entry.content) + '</div>';
      }
      if (entry.imageData) {
        h += '<img src="' + entry.imageData + '" style="max-width:100%;border-radius:8px;margin-bottom:10px;" />';
      }
      if (entry.voiceData) {
        h += '<audio controls style="width:100%;margin-bottom:10px;"><source src="' + entry.voiceData + '" /></audio>';
      }
      /* Edit text area */
      h += '<textarea rows="4" onchange="editNoteEntry(\'' + docId + '\',' + realIdx + ',this.value)" style="font-size:12px;">' + escHtml(entry.content||'') + '</textarea>';
      h += '</div>';
    }

    h += '</div>';
  });

  return h;
}

/* ============================================
   HELPERS
   ============================================ */
function getAllDocs(state) {
  var custom = state.customDocs || [];
  return DEFAULT_DOCS.concat(custom);
}

/* ============================================
   VOICE RECORDING
   ============================================ */
var _mediaRecorder = null;
var _audioChunks   = [];
var _voiceBlob     = null;

function toggleVoiceNote() {
  if (_mediaRecorder && _mediaRecorder.state === 'recording') {
    _mediaRecorder.stop();
    document.getElementById('ne-voice-btn').textContent  = '🎤 Record Voice';
    document.getElementById('ne-voice-btn').style.color  = '#8899bb';
    document.getElementById('ne-voice-status').textContent = 'Voice note ready ✓';
    return;
  }
  if (!navigator.mediaDevices) {
    alert('Voice recording not supported in this browser. Use Chrome.');
    return;
  }
  navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
    _audioChunks = [];
    _voiceBlob   = null;
    _mediaRecorder = new MediaRecorder(stream);
    _mediaRecorder.ondataavailable = function(e) { if(e.data.size>0) _audioChunks.push(e.data); };
    _mediaRecorder.onstop = function() {
      _voiceBlob = new Blob(_audioChunks, { type:'audio/webm' });
      stream.getTracks().forEach(function(t){ t.stop(); });
    };
    _mediaRecorder.start();
    document.getElementById('ne-voice-btn').textContent  = '⏹ Stop Recording';
    document.getElementById('ne-voice-btn').style.color  = '#ef4444';
    document.getElementById('ne-voice-status').textContent = '🔴 Recording...';
  }).catch(function(err) {
    alert('Could not access microphone: ' + err.message);
  });
}

function previewNoteImage(input) {
  var preview = document.getElementById('ne-image-preview');
  if (!input.files || !input.files[0] || !preview) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    preview.innerHTML = '<img src="' + e.target.result + '" style="max-width:200px;max-height:150px;border-radius:8px;border:1px solid var(--border);" /><div style="font-size:10px;color:#10b981;margin-top:4px;">Image ready ✓</div>';
  };
  reader.readAsDataURL(input.files[0]);
}

/* ============================================
   ACTIONS
   ============================================ */
function openNotesDoc(docId) {
  window.AppState.notesOpenDoc = docId;
  saveData(); renderPage();
  setTimeout(function(){ var c=document.getElementById('content'); if(c) c.scrollTop=0; },100);
}

function closeNotesDoc() {
  window.AppState.notesOpenDoc = null;
  saveData(); renderPage();
}

function toggleEntryOpen(docId, idx) {
  var key = docId + '_' + idx;
  window.AppState.notesEntryOpen = window.AppState.notesEntryOpen === key ? null : key;
  saveData(); renderPage();
}

function addNoteEntry(docId) {
  var title   = (document.getElementById('ne-title')||{}).value || '';
  var text    = (document.getElementById('ne-text') ||{}).value || '';
  var imgEl   = document.getElementById('ne-image');
  var imgData = null;

  /* Get image if attached */
  var preview = document.getElementById('ne-image-preview');
  if (preview) {
    var img = preview.querySelector('img');
    if (img) imgData = img.src;
  }

  /* Build entry */
  var now = new Date();
  var entry = {
    title:     title.trim(),
    content:   text.trim(),
    imageData: imgData || null,
    voiceData: null,
    date:      todayString(),
    time:      now.getHours() + ':' + (now.getMinutes()<10?'0':'') + now.getMinutes(),
    type:      imgData ? 'image' : 'text'
  };

  /* Handle voice */
  if (_voiceBlob) {
    var fr = new FileReader();
    fr.onload = function(e) {
      entry.voiceData = e.target.result;
      entry.type = 'voice';
      _saveEntry(docId, entry);
    };
    fr.readAsDataURL(_voiceBlob);
    _voiceBlob = null;
    return;
  }

  if (!entry.content && !entry.imageData) {
    alert('Please write something or attach an image/voice note.');
    return;
  }

  _saveEntry(docId, entry);
}

function _saveEntry(docId, entry) {
  if (!window.AppState.notesData) window.AppState.notesData = {};
  if (!window.AppState.notesData[docId]) window.AppState.notesData[docId] = [];
  window.AppState.notesData[docId].push(entry);

  /* Clear inputs */
  ['ne-title','ne-text'].forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; });
  var pv = document.getElementById('ne-image-preview'); if(pv) pv.innerHTML='';
  var vs = document.getElementById('ne-voice-status'); if(vs) vs.textContent='';
  _voiceBlob = null;

  saveData(); renderPage();
}

function editNoteEntry(docId, idx, val) {
  if (window.AppState.notesData && window.AppState.notesData[docId] && window.AppState.notesData[docId][idx]) {
    window.AppState.notesData[docId][idx].content = val;
    saveData();
  }
}

function deleteNoteEntry(docId, idx) {
  if (!confirm('Delete this entry?')) return;
  window.AppState.notesData[docId].splice(idx, 1);
  saveData(); renderPage();
}

function createNotesDoc() {
  var icon  = (document.getElementById('new-doc-icon') ||{}).value || '📄';
  var title = (document.getElementById('new-doc-title')||{}).value || '';
  var desc  = (document.getElementById('new-doc-desc') ||{}).value || '';
  if (!title.trim()) { alert('Please enter a document title.'); return; }
  if (!window.AppState.customDocs) window.AppState.customDocs = [];
  var id = 'doc_custom_' + Date.now();
  window.AppState.customDocs.push({ id:id, icon:icon.trim()||'📄', title:title.trim(), desc:desc.trim()||'My notes' });
  ['new-doc-icon','new-doc-title','new-doc-desc'].forEach(function(i){ var el=document.getElementById(i); if(el) el.value=''; });
  saveData(); renderPage();
}

function deleteNotesDoc(docId) {
  if (!confirm('Delete this document and all its entries?')) return;
  if (window.AppState.customDocs) {
    window.AppState.customDocs = window.AppState.customDocs.filter(function(d){ return d.id !== docId; });
  }
  if (window.AppState.notesData) delete window.AppState.notesData[docId];
  saveData(); renderPage();
}

console.log('notes.js loaded OK — Rich Notes ready');