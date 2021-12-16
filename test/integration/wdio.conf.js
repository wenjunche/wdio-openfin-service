import { ChromeDriverLauncher } from '../../lib/launcher';

exports.config = {
    port: 9515,
    path: '/',
    specs: [
        './build/test/integration/*.spec.js'
    ],

    logLevel: 'verbose',
    coloredLogs: true,

    waitforTimeout: 10000,
    connectionRetryTimeout: 900000,
    connectionRetryCount: 1,

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd'
    },

    services: [
        [ChromeDriverLauncher, {
            logFileName: 'wdio-chromedriver.log',
            outputDir: '.',
            args: ['--silent']
        }]
    ],
    openfin: {
        manifest: 'https://demoappdirectory.openf.in/desktop/config/apps/OpenFin/HelloOpenFin/selenium.json',
        debuggerPort: 9090
    }
}
