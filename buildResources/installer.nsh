!macro customUnInit
  ; Remove startup registry entry
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "Podman Desktop"

!macroend
