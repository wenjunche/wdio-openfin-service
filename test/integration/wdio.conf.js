exports.config = {
    port: '9515',
    path: '/',
    specs: [
        './test/integration/*.spec.js'
    ],

    capabilities: [{
        browserName: 'openfin'
    }],

    sync: true,
    logLevel: 'verbose',
    coloredLogs: true,

    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd'
    },

    services: [
        require('../../launcher')
    ],
    openfin: {
        manifest: 'https://demoappdirectory.openf.in/desktop/config/apps/OpenFin/HelloOpenFin/selenium.json'
    },
    chromeDriverLogs: './'
}
