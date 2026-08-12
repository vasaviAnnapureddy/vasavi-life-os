# 💾 Backups

Your Life OS backups live here.

- `*.json` — plain backup. **Readable by anyone.** Never commit or share.
- `*.vault` — encrypted backup (AES-256, your passphrase). Safe to copy anywhere:
  USB, another laptop, Telegram, even cloud storage. Useless without your passphrase.

Both types are git-ignored, so they never reach GitHub.

## Restoring
Open the app → **Settings & Backup → Restore** → choose the file.
For `.vault` files you'll be asked for the passphrase you used.

## Moving to a new laptop
Copy this whole `backups/` folder to the new machine (USB or Telegram),
then restore from the newest file.
