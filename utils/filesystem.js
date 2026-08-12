/* ============================================
   VASAVI'S LIFE OS — FOLDER AUTO-SAVE
   utils/filesystem.js

   Connect a folder ONCE (e.g. E:\vasavi-life-os\backups)
   and the app can then write backups into it
   automatically, with no file dialog each time.

   Uses the File System Access API. The folder
   permission is stored in IndexedDB, so it
   survives closing the browser.

   Works on: Chrome / Edge on laptop.
   Elsewhere it falls back to a normal download.
   ============================================ */

var FS_DB = 'lifeos_fs', FS_STORE = 'handles', FS_KEY = 'backupFolder';

function fsSupported() { return typeof window.showDirectoryPicker === 'function'; }

function fsOpenDB() {
  return new Promise(function(resolve, reject) {
    var req = indexedDB.open(FS_DB, 1);
    req.onupgradeneeded = function(){ req.result.createObjectStore(FS_STORE); };
    req.onsuccess = function(){ resolve(req.result); };
    req.onerror   = function(){ reject(req.error); };
  });
}

function fsStoreHandle(handle) {
  return fsOpenDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(FS_STORE, 'readwrite');
      tx.objectStore(FS_STORE).put(handle, FS_KEY);
      tx.oncomplete = function(){ resolve(true); };
      tx.onerror    = function(){ reject(tx.error); };
    });
  });
}

function fsLoadHandle() {
  return fsOpenDB().then(function(db) {
    return new Promise(function(resolve) {
      var tx = db.transaction(FS_STORE, 'readonly');
      var rq = tx.objectStore(FS_STORE).get(FS_KEY);
      rq.onsuccess = function(){ resolve(rq.result || null); };
      rq.onerror   = function(){ resolve(null); };
    });
  }).catch(function(){ return null; });
}

function fsClearHandle() {
  return fsOpenDB().then(function(db) {
    var tx = db.transaction(FS_STORE, 'readwrite');
    tx.objectStore(FS_STORE).delete(FS_KEY);
    window.FS_FOLDER_NAME = null;
    return true;
  }).catch(function(){ return false; });
}

/* Ask once for a folder, then remember it */
function connectBackupFolder() {
  if (!fsSupported()) {
    showToast('Your browser cannot auto-save to folders — use Save/Share instead.', 'error');
    return Promise.resolve(false);
  }
  return window.showDirectoryPicker({ mode: 'readwrite' })
    .then(function(handle) {
      return fsStoreHandle(handle).then(function() {
        window.FS_FOLDER_NAME = handle.name;
        showToast('📁 Folder connected: ' + handle.name + ' — saves are automatic now!');
        if (typeof renderPage === 'function') renderPage();
        return true;
      });
    })
    .catch(function(e) {
      if (e && e.name === 'AbortError') return false;
      showToast('Could not connect folder: ' + (e.message||''), 'error');
      return false;
    });
}

/* Make sure we still have write permission */
function fsEnsurePermission(handle) {
  if (!handle || !handle.queryPermission) return Promise.resolve(false);
  return handle.queryPermission({ mode:'readwrite' }).then(function(p) {
    if (p === 'granted') return true;
    return handle.requestPermission({ mode:'readwrite' }).then(function(p2){ return p2 === 'granted'; });
  }).catch(function(){ return false; });
}

/* Write a file into the connected folder.
   Returns true if written, false if we must fall back. */
function fsWriteFile(filename, text) {
  return fsLoadHandle().then(function(handle) {
    if (!handle) return false;
    return fsEnsurePermission(handle).then(function(ok) {
      if (!ok) return false;
      window.FS_FOLDER_NAME = handle.name;
      return handle.getFileHandle(filename, { create:true })
        .then(function(fh){ return fh.createWritable(); })
        .then(function(w){ return w.write(text).then(function(){ return w.close(); }); })
        .then(function(){ return true; });
    });
  }).catch(function(e) {
    console.warn('Folder write failed:', e.message);
    return false;
  });
}

/* Download fallback used everywhere */
function fsDownload(filename, text, mime) {
  var blob = new Blob([text], { type: mime || 'text/plain' });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* Save anywhere: connected folder first, else download */
function fsSaveSmart(filename, text, mime) {
  return fsWriteFile(filename, text).then(function(written) {
    if (written) { showToast('💾 Saved to ' + (window.FS_FOLDER_NAME||'your folder') + '/' + filename); return 'folder'; }
    fsDownload(filename, text, mime);
    showToast('⬇️ Downloaded ' + filename);
    return 'download';
  });
}

/* Remember folder name on load so the UI can show it */
document.addEventListener('DOMContentLoaded', function() {
  fsLoadHandle().then(function(h){ if (h) window.FS_FOLDER_NAME = h.name; });
});

console.log('filesystem.js loaded — folder auto-save ' + (fsSupported() ? 'available' : 'not supported here'));
