# Windows packaging

## Build
Prerequisites: Windows 10/11, Rust with the **MSVC** toolchain, Node.js 18+, `cargo install tauri-cli --version "^2"`, and the Microsoft C++ Build Tools (see <https://v2.tauri.app/start/prerequisites/>). The first build downloads the NSIS and WiX tools, so it needs internet.

    powershell -ExecutionPolicy Bypass -File tools\build-windows.ps1

It checks the tools, runs `tools/check_release_config.mjs`, all JS tests and `cargo test --workspace`, builds the installers and copies them with `SHA256SUMS.txt` to `dist\`. Flags: `-SkipTests`, `-Nsis`, `-Msi`.
The same script runs in CI: `.github/workflows/windows.yml` (manual trigger or a `v*` tag); the installers are uploaded as a build artifact.

## What gets built
| File | Notes |
|---|---|
| `Cosmossi Atlas_<version>_x64-setup.exe` (NSIS) | Per-user install (no admin prompt), English, start-menu entry, uninstaller, registers `.cosmap`. |
| `Cosmossi Atlas_<version>_x64_en-US.msi` (WiX) | For managed deployment (Group Policy / Intune); registers `.cosmap`. |

- **WebView2**: the installers download the Evergreen bootstrapper silently if the runtime is missing (Windows 11 and current Windows 10 already have it). This needs internet only on machines without WebView2. For fully offline installs change `bundle.windows.webviewInstallMode.type` to `"offlineInstaller"` (adds ~130 MB) or `"embedBootstrapper"`.
- **File association**: double-clicking a `.cosmap` file starts the app with the path as an argument; the app validates it in Rust (`startup_file` + `load_project`) and opens it, replacing the restored session. Each double-click starts a new app window/process (no single-instance plugin, to avoid a new dependency); use *Open* (Ctrl+O) to load a map into a running window.
- **Content-Security-Policy** is now set (it was `null`): only the app's own files, its IPC channel, images from `data:`/`blob:`, and inline *styles*; no inline scripts, no `eval`, nothing from the network. If a feature ever fails with a "Refused to ..." message in the DevTools console, that is the CSP: widen only the named directive in `src-tauri/tauri.conf.json`.
- **Version**: one number in three places, which `tools/check_release_config.mjs` verifies: `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, `crates/cosmossi-core/Cargo.toml`. It must stay plain `x.y.z` for the MSI.

## Signing (optional, manual)
Unsigned installers work but Windows SmartScreen shows "Windows protected your PC" until the file builds reputation. To sign, get a code-signing certificate, install it in the Windows certificate store and add to `bundle.windows` in `tauri.conf.json`:

    "certificateThumbprint": "<SHA-1 thumbprint>", "timestampUrl": "http://timestamp.digicert.com"

Never commit the certificate or its password. Verify with `Get-AuthenticodeSignature "<installer>"`.

## Verifying an installer
1. Install on a clean Windows VM; the app starts, the map renders, no console window appears.
2. Save a map, close, double-click the `.cosmap` file: it opens.
3. Compare `Get-FileHash <installer> -Algorithm SHA256` with `SHA256SUMS.txt`.
4. Uninstall from *Settings > Apps*; the install folder is removed (your `.cosmap` files are untouched).
