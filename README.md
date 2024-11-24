# Sync-client



To create a Windows .exe installer from your Electron project, you'll use electron-builder, which you already have configured in your package.json. Specifically, for Windows, you're using the NSIS (Nullsoft Scriptable Install System) target, as indicated in your package.json:


"win": {
  "target": "nsis",
  "icon": "build/icon.ico"
}

Here's how to create the .exe file:

Steps to Generate the .exe Installer for Windows
1. Ensure electron-builder is Set Up
You already have electron-builder set up in your package.json, so you don't need to install it again. You just need to make sure all dependencies are installed:

npm install


2. Install Windows Build Tools (if on macOS or Linux)
If you're building on macOS or Linux but want to generate a Windows .exe, you'll need to use Wine to emulate the Windows environment. You can install wine using Homebrew on macOS or your package manager on Linux.

On macOS, run:


brew install --cask wine-stable


On Linux, install Wine using your distribution's package manager, for example:

sudo apt install wine

This allows electron-builder to generate Windows executables even on non-Windows platforms.

3. Add the Windows Build Script (optional)
If you don’t already have a specific build script for Windows, you can add one in your package.json under the "scripts" section:


"scripts": {
  "build": "npm run build-react && electron-builder",
  "build:win": "npm run build-react && electron-builder --win",
  "postbuild": "node notarize.js"
}



This script ensures the electron-builder targets the Windows platform.

4. Generate the Windows .exe File
Now, to build the .exe installer for Windows, you can run:


npm run build:win




This will generate the .exe file in the dist/ folder.

5. Customize the Windows Installer (Optional)
If you want to customize the Windows installer, you can modify the nsis configuration in the package.json. For example, you can add:



"nsis": {
  "oneClick": false,
  "perMachine": true,
  "allowToChangeInstallationDirectory": true
}


This adds options like allowing the user to choose an installation directory, whether the installation should be per machine or per user, etc.

6. Locate the Generated .exe File
Once the build process is complete, you should find the generated .exe installer inside the dist/ folder in your project directory. This file can be distributed and installed on Windows machines.

Summary of Steps:




Install dependencies:


bash
Copy code
#npm install
If on macOS/Linux, install Wine to emulate the Windows environment:

bash
Copy code
brew install --cask wine-stable  # macOS
Add a Windows build script in package.json (optional):

json
Copy code
"scripts": {
  "build:win": "npm run build-react && electron-builder --win"
}
Build the Windows .exe file:

bash
Copy code
npm run build:win
Locate the .exe file in the dist/ folder.