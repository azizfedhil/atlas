<#
  Puts a "Cosmossi Atlas" shortcut (with the atlas icon) on your Desktop and in the Start menu.
  Run once:   powershell -ExecutionPolicy Bypass -File tools\make-shortcut.ps1
  It starts the atlas in its own window with no console (needs Node.js).
#>
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$vbs  = Join-Path $root 'Launch Atlas (no console).vbs'
$ico  = Join-Path $root 'src-tauri\icons\icon.ico'
$sh   = New-Object -ComObject WScript.Shell
foreach ($dir in @([Environment]::GetFolderPath('Desktop'), (Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs'))) {
  $lnk = $sh.CreateShortcut((Join-Path $dir 'Cosmossi Atlas.lnk'))
  $lnk.TargetPath = 'wscript.exe'; $lnk.Arguments = '"' + $vbs + '"'
  $lnk.WorkingDirectory = $root; $lnk.IconLocation = $ico; $lnk.Description = 'Cosmossi Atlas'
  $lnk.Save(); Write-Host "Created $dir\Cosmossi Atlas.lnk"
}
