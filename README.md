WDIO OpenFIn Service
================================

----

This service helps you to run ChromeDriver seamlessly when running tests with the [WDIO testrunner](http://webdriver.io/guide/testrunner/gettingstarted.html) and OpenFin Runtime. It uses the [chromedriver](https://www.npmjs.com/package/chromedriver) NPM package that wraps the ChromeDriver for you.  Major version number of this serivce matches that of chromedriver.  A branch is created for each majnor ugrade of chromedriver with 'v[major#]' as the name.

Note - this service does not require a Selenium server, but uses ChromeDriver to communicate with the browser directly.
It only supports:

```js
capabilities: [{
        browserName: 'openfin'
    }]
```

## Installation

The easiest way is to keep `wdio-openfin-service` as a devDependency in your `package.json`.

```json
{
  "devDependencies": {
    "wdio-openfin-service": "~8.0.1"
  }
}
```

You can simple do it by:

```bash
npm install wdio-openfin-service --save-dev
```

Instructions on how to install `WebdriverIO` can be found [here.](http://webdriver.io/guide/getstarted/install.html)

## Configuration

The following example configuration shows how to start OpenFin Runtime with app manifest of Hello OpenFin demo app.

```js
// wdio.conf.js
export.config = {
    port: '9515',  // port for ChromeDriver
    path: '/',     // URL path for ChromeDriver

    reporters: ['spec'],
    logLevel: 'warn',
    coloredLogs: true,

    waitforTimeout: 10000,
    connectionRetryTimeout: 900000,
    connectionRetryCount: 1,

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd'
    },

  services: [
    ['openfin', {
        logFileName: 'wdio-chromedriver.log',
        outputDir: '.',
        args: ['--verbose']  // arguments for launching Chrome Driver
    }]
  ],
  openfin: {
     manifest: 'https://demoappdirectory.openf.in/desktop/config/apps/OpenFin/HelloOpenFin/selenium.json'
  }
};
```

For more information on WebdriverIO see the [homepage](http://webdriver.io).
