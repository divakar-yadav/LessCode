require('dotenv').config();
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context;
    if (electronPlatformName !== 'darwin') {
        return;
    }

    const appName = context.packager.appInfo.productFilename;
    console.log(context,"---context---")
    console.log(appOutDir,"---appOutDir---")

    await notarize({
        appBundleId: 'com.uwm.sync', // Use your app's bundle ID
        appPath: `${appOutDir}/${appName}.app`,
        appleId: process.env.APPLE_ID,  // Your Apple Developer email
        appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD  // App-specific password
    });
};