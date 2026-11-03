# How to start the atlas

## Easiest: its own window (no building)
1. Install **Node.js (LTS)** from <https://nodejs.org> once. (Skip if you already have it.)
2. Unzip the atlas anywhere.
3. Double-click **`Launch Atlas.bat`** (Windows) or run `./launch-atlas.sh` (macOS/Linux).
4. The atlas opens in **its own window**: no tabs, no address bar, its own taskbar entry. It uses Microsoft Edge (already on Windows 10/11) or Chrome / Brave / Chromium in "app mode". A small minimised window holds the server; **it stops by itself when you close the atlas window.**

Nicer still: run `powershell -ExecutionPolicy Bypass -File tools\make-shortcut.ps1` once. It puts a **Cosmossi Atlas** shortcut with the atlas icon on your Desktop and Start menu, and starts with no console window at all (it uses `Launch Atlas (no console).vbs`).

Notes
- The window keeps its own settings folder (`%LOCALAPPDATA%\CosmossiAtlas\profile`), so the atlas remembers its preferences between runs and never mixes with your everyday browser. Maps you saved in the *old* browser tab are not in it: use Save / Open (`.cosmap`) to move them.
- Want a normal browser tab instead? `node tools/serve.mjs --browser`. Only serve, open nothing: `--no-open`. Never stop by itself: `--keep`.
- If no Edge/Chrome is found, it falls back to your default browser. Firefox cannot do app windows.
- Opening `web/index.html` directly (double-click) does **not** work: browsers block ES modules from `file://`. Use the launcher.
- This mode does everything except what needs the Rust core: Save/Open through the system file dialogs and the `.cosmap` file association. (Saving still works, as a download.)

## The real desktop app (Windows installer)
Either build it yourself (`docs/WINDOWS-PACKAGING.md`), or let GitHub build it: push the atlas to a GitHub repo, open **Actions > windows > Run workflow**, and download the `cosmossi-atlas-windows` artifact (a setup `.exe` and an `.msi`). It contains the 3D globe too: the installer packs the whole `web/` folder.
For development: `cargo install tauri-cli --version "^2" --locked`, then `cargo tauri dev` in this folder.
