<#
  Build the Windows installers for Cosmossi Atlas.   Run from the project root:   powershell -ExecutionPolicy Bypass -File tools\build-windows.ps1
  Options:  -SkipTests   skip the test suites (not recommended for a release)
            -Msi/-Nsis   build only that installer (default: both)
  Output:   dist\  (installers + SHA256SUMS.txt).  Needs: Rust (MSVC toolchain), Node.js, `cargo install tauri-cli --version "^2"`,
            and internet access the first time (Tauri downloads the NSIS and WiX tools).
  Signing:  see docs\WINDOWS-PACKAGING.md (unsigned installers show a SmartScreen warning).
#>
param([switch]$SkipTests, [switch]$Msi, [switch]$Nsis)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)

function Step($t) { Write-Host "`n== $t" -ForegroundColor Cyan }
function Need($cmd, $hint) { if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) { throw "$cmd not found. $hint" } }
function Run($exe, [string[]]$argv) { & $exe @argv; if ($LASTEXITCODE -ne 0) { throw "$exe $($argv -join ' ') failed with exit code $LASTEXITCODE" } }

Step 'Checking tools'
Need cargo 'Install Rust from https://rustup.rs and choose the MSVC toolchain.'
Need node  'Install Node.js 18 or newer from https://nodejs.org.'
& cargo tauri --version 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'cargo-tauri not found. Run: cargo install tauri-cli --version "^2"' }
$host_triple = (& rustc -vV | Select-String '^host:').ToString()
if ($host_triple -notmatch 'msvc') { throw "Rust host is not MSVC ($host_triple). Run: rustup default stable-x86_64-pc-windows-msvc" }

Step 'Release configuration'
Run node @('tools/check_release_config.mjs')

if (-not $SkipTests) {
  Step 'JavaScript tests'
  foreach ($t in 'test_geometry','test_projections','test_calendar','test_timeline','test_project_file','test_measure','test_measure_area_ui','test_perf','test_camera','test_polish','test_refimage') { Run node @("tools/$t.mjs") }
  Step 'Rust tests'
  Run cargo @('test','--workspace','--release')
}

Step 'Building installers'
$bundles = @(); if ($Nsis) { $bundles += 'nsis' }; if ($Msi) { $bundles += 'msi' }
if ($bundles.Count -eq 0) { $bundles = @('nsis','msi') }
Run cargo @('tauri','build','--bundles',($bundles -join ','))

Step 'Collecting output'
$out = Join-Path (Get-Location) 'dist'
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory $out | Out-Null
$found = Get-ChildItem -Path 'target\release\bundle' -Recurse -Include '*.exe','*.msi' -ErrorAction SilentlyContinue | Where-Object { $_.FullName -match '\\(nsis|msi)\\' }
if (-not $found) { throw 'No installer found under target\release\bundle.' }
$found | Copy-Item -Destination $out
Get-ChildItem $out -File | Where-Object { $_.Name -ne 'SHA256SUMS.txt' } | ForEach-Object {
  $h = (Get-FileHash $_.FullName -Algorithm SHA256).Hash.ToLower(); "$h *$($_.Name)"
} | Set-Content (Join-Path $out 'SHA256SUMS.txt') -Encoding ascii
Get-ChildItem $out | Format-Table Name, @{n='MB';e={[math]::Round($_.Length/1MB,1)}} -AutoSize
Write-Host "`nDone. Installers are in $out" -ForegroundColor Green
