; Custom NSIS installer script for REMPO
; This enhances the default electron-builder NSIS installer with custom branding

!macro customWelcomePage
  !insertMacro MUI_PAGE_WELCOME
!macroend

!macro customLicensePage
  !insertMacro MUI_PAGE_LICENSE "$(myLicenseFile)"
!macroend

!macro customInstallDirectoryPage
  !insertMacro MUI_PAGE_DIRECTORY
!macroend

!macro customComponentsPage
  ; No components page needed for simple installer
!macroend

!macro customStartMenuPage
  !insertMacro MUI_PAGE_STARTMENU Application $STARTMENU_FOLDER
!macroend

!macro customInstallPage
  !insertMacro MUI_PAGE_INSTFILES
!macroend

!macro customFinishPage
  !define MUI_FINISHPAGE_RUN "$INSTDIR\REMPO.exe"
  !define MUI_FINISHPAGE_RUN_TEXT "Launch REMPO"
  !define MUI_FINISHPAGE_SHOWREADME ""
  !define MUI_FINISHPAGE_LINK "Visit REMPO Website"
  !define MUI_FINISHPAGE_LINK_LOCATION "https://rempo.vercel.app"
  !insertMacro MUI_PAGE_FINISH
!macroend

; Custom branding
!define MUI_WELCOMEFINISHPAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Wizard\nsis3-metro.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Wizard\nsis3-metro.bmp"

; Colors and styling
!define MUI_BGCOLOR "FFFFFF"
!define MUI_TEXTCOLOR "000000"

; Header image
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Header\nsis3-metro.bmp"
!define MUI_HEADERIMAGE_UNBITMAP "${NSISDIR}\Contrib\Graphics\Header\nsis3-metro.bmp"

; Custom welcome text
!define MUI_WELCOMEPAGE_TITLE "Welcome to REMPO Setup"
!define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through the installation of REMPO.$\r$\n$\r$\nREMPO helps you remember what you were building by tracking your Git repositories.$\r$\n$\r$\n$_CLICK"

; Custom install text
!define MUI_DIRECTORYPAGE_TEXT_TOP "Setup will install REMPO in the following folder. To install in a different folder, click Browse and select another folder.$\r$\n$\r$\nClick Install to start the installation."

; Custom finish text
!define MUI_FINISHPAGE_TITLE "Installation Complete"
!define MUI_FINISHPAGE_TEXT "REMPO has been installed on your computer.$\r$\n$\r$\nClick Finish to close Setup."

; Function to check if app is running
Function .onInit
  ; Check if REMPO is already running
  FindWindow $0 "REMPO" ""
  StrCmp $0 0 notRunning
  MessageBox MB_OK|MB_ICONEXCLAMATION "REMPO is currently running. Please close it before continuing."
  Abort
notRunning:
FunctionEnd

; Custom uninstaller
Function un.onInit
  ; Check if REMPO is running during uninstall
  FindWindow $0 "REMPO" ""
  StrCmp $0 0 unNotRunning
  MessageBox MB_OK|MB_ICONEXCLAMATION "REMPO is currently running. Please close it before uninstalling."
  Abort
unNotRunning:
FunctionEnd
