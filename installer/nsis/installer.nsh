; Custom NSIS include for electron-builder NSIS target
; Important: Do NOT define MUI_ICON / MUI_UNICON here because electron-builder
; passes them on the command line when configured via package.json (build.win.icon
; and build.nsis.installerIcon/uninstallerIcon).

; Keep a modern-ish wizard look
!ifndef MUI_WELCOMEFINISHPAGE_BITMAP
!define MUI_WELCOMEFINISHPAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Wizard\nsis3-metro.bmp"
!endif
!ifndef MUI_UNWELCOMEFINISHPAGE_BITMAP
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Wizard\nsis3-metro.bmp"
!endif

!ifndef MUI_HEADERIMAGE
!define MUI_HEADERIMAGE
!endif
!ifndef MUI_HEADERIMAGE_BITMAP
!define MUI_HEADERIMAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Header\nsis3-metro.bmp"
!endif
!ifndef MUI_HEADERIMAGE_UNBITMAP
!define MUI_HEADERIMAGE_UNBITMAP "${NSISDIR}\Contrib\Graphics\Header\nsis3-metro.bmp"
!endif

; Wizard text
!ifndef MUI_WELCOMEPAGE_TITLE
!define MUI_WELCOMEPAGE_TITLE "Welcome to REMPO Setup"
!endif
!ifndef MUI_WELCOMEPAGE_TEXT
!define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through the installation of REMPO.$\r$\n$\r$\nREMPO helps you remember what you were building by tracking your Git repositories.$\r$\n$\r$\n$_CLICK"
!endif

!ifndef MUI_DIRECTORYPAGE_TEXT_TOP
!define MUI_DIRECTORYPAGE_TEXT_TOP "Setup will install REMPO in the following folder. To install in a different folder, click Browse and select another folder.$\r$\n$\r$\nClick Install to start the installation."
!endif

!ifndef MUI_FINISHPAGE_TITLE
!define MUI_FINISHPAGE_TITLE "Installation Complete"
!endif
!ifndef MUI_FINISHPAGE_TEXT
!define MUI_FINISHPAGE_TEXT "REMPO has been installed on your computer.$\r$\n$\r$\nClick Finish to close Setup."
!endif

; Optional link on finish page
!ifndef MUI_FINISHPAGE_LINK
!define MUI_FINISHPAGE_LINK "Visit REMPO Website"
!endif
!ifndef MUI_FINISHPAGE_LINK_LOCATION
!define MUI_FINISHPAGE_LINK_LOCATION "https://rempo.vercel.app"
!endif

; Note: electron-builder defines .onInit and un.onInit internally.
; Defining them here would conflict and break builds.
