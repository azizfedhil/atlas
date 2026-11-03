' Double-click to start the Cosmossi Atlas in its own window with no console window at all.
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
sh.CurrentDirectory = fso.GetParentFolderName(WScript.ScriptFullName)
If sh.Run("cmd /c where node >nul 2>nul", 0, True) <> 0 Then
  MsgBox "Node.js is not installed. Install the LTS version from https://nodejs.org and double-click this file again.", 48, "Cosmossi Atlas"
  WScript.Quit 1
End If
sh.Run "cmd /c node tools\serve.mjs", 0, False
