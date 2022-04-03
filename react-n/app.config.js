export default {
    name: 'Expirations Check',
    slug: 'expirations-check',
    version: '1.0.0',
    orientation: 'portrait', // lock it only to Portrait mode
    icon: './assets/images/icon.png',
    scheme: 'rnn-expire',
    userInterfaceStyle: 'automatic',
    splash: {
        image: './assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
    },
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    android: {
    // must haves
        package: 'com.magicmedia.expirations_check', // the ID of the app
        versionCode: 1, // should increment it on each release

        adaptiveIcon: {
            foregroundImage: './assets/images/adaptive-icon.png',
            backgroundColor: '#ffffff',
        },
        useNextNotificationsApi: true,

        // list all needed permissions
        permissions: ['CAMERA', 'ACCESS_FINE_LOCATION'],
        config: {
            googleMaps: {
                apiKey: 'xxxxx',
            },
        },
    },

    // not used as will build only for Android
    ios: {
        supportsTablet: true,
    },
    web: {
        favicon: './assets/images/favicon.png',
    },

//   sdkVersion: "44",
//   publish: ["android"], // build only for Android
};
