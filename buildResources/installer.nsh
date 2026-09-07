!macro customUnInit
  ; Remove startup registry entry
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${PRODUCT_NAME}"
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run" "${PRODUCT_NAME}"

!macroend

; Hide the install-scope selection page during an update.
;
; When Podman Desktop is updated (electron-updater runs the installer with the
; --updated flag), we force the installer to reuse the scope of the existing
; installation and skip the "Install for all users / only for me" page. This
; prevents users from switching per-machine <-> per-user during an update, which
; leaves PATH and environment in an inconsistent state and breaks the Podman CLI
; / machine detection.
; See https://github.com/podman-desktop/podman-desktop/issues/17461
;
; Fresh installs and manual re-runs of the installer are left untouched, so the
; user can still choose the scope there.
;
; This hook is invoked by electron-builder's PAGE_INSTALL_MODE (multiUserUi.nsh).
; Setting $isForceMachineInstall / $isForceCurrentInstall to "1" forces the scope
; and aborts the selection page.
!macro customInstallMode
  ; ${isUpdated} is true only when the installer was launched by the updater
  ; (i.e. with the --updated command-line flag).
  ${if} ${isUpdated}
    Push $0
    Push $1

    ; electron-builder records the install location per scope under INSTALL_REGISTRY_KEY
    ; (Software\${APP_GUID}): HKLM for per-machine, HKCU for per-user installs.
    ReadRegStr $0 HKLM "${INSTALL_REGISTRY_KEY}" "InstallLocation"
    ReadRegStr $1 HKCU "${INSTALL_REGISTRY_KEY}" "InstallLocation"

    ${if} $0 != ""
      ; Existing per-machine installation (also wins if both are present, e.g. a
      ; previously broken state) -> keep it per-machine.
      StrCpy $isForceMachineInstall "1"
    ${elseif} $1 != ""
      ; Existing per-user installation -> keep it per-user.
      StrCpy $isForceCurrentInstall "1"
    ${endif}

    Pop $1
    Pop $0
  ${endif}
!macroend
