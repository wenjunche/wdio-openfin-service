"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("source-map-support/register");

var _chromedriver = _interopRequireDefault(require("chromedriver"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _getFilePath = _interopRequireDefault(require("./utils/getFilePath"));

var _child_process = _interopRequireDefault(require("child_process"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  Launcher class for wedio OpenFin service
 */
const DEFAULT_LOG_PATH = '.';
const DEFAULT_LOG_FILENAME = 'wdio-chromedriver.log';
const DEFAULT_CONNECTION = {
  protocol: 'http',
  hostname: 'localhost',
  port: 9515,
  path: '/'
};

class ChromeDriverLauncher {
  constructor(options, capabilities, config) {
    console.log('creating ChromeDriverLauncher');
    this.config = config;

    if (!options) {
      options = {};
    }

    this.options = {
      protocol: options.protocol || DEFAULT_CONNECTION.protocol,
      hostname: options.hostname || DEFAULT_CONNECTION.hostname,
      port: options.port || DEFAULT_CONNECTION.port,
      path: options.path || DEFAULT_CONNECTION.path
    };
    this.outputDir = options.outputDir || DEFAULT_LOG_PATH;
    this.logFileName = options.logFileName || DEFAULT_LOG_FILENAME;
    this.capabilities = capabilities;
    this.args = options.args || [];
    this.chromedriverCustomPath = options.chromedriverCustomPath ? _path.default.resolve(options.chromedriverCustomPath) : _chromedriver.default.path;
  }

  async onPrepare() {
    console.log('onPrepare service');

    const binary = _path.default.resolve(__dirname, '../scripts/RunOpenFin.bat');

    const chromeOptions = {
      extensions: [],
      binary: binary,
      args: [`--config=${this.config.openfin.manifest}`]
    };

    if (this.config.openfin.debuggerPort) {
      chromeOptions.debuggerAddress = `localhost:${this.config.openfin.debuggerPort}`;
    }

    this.capabilities[0] = {
      maxInstances: 1,
      'goog:chromeOptions': chromeOptions
    };
    const promises = [];
    const driverPromise = new Promise((resolve, reject) => {
      this.process = _child_process.default.execFile(this.chromedriverCustomPath, this.args, err => {
        if (err) {
          return reject(err);
        }
      });

      if (this.process) {
        if (typeof this.logFileName === 'string') {
          this._redirectLogStream();
        }

        resolve();
      }
    });
    promises.push(driverPromise);

    if (this.config.openfin.debuggerPort) {
      const rvmArgs = [];
      rvmArgs.push(`--config=${this.config.openfin.manifest}`);
      rvmArgs.push('--remote-debugging-port=9090');
      console.log(`launching ${binary} ${rvmArgs}`);
      const rvmPromise = new Promise((resolve, reject) => {
        const process = _child_process.default.execFile(binary, rvmArgs, err => {
          if (err) {
            return reject(err);
          }
        });

        if (process) {
          resolve();
        }
      });
      promises.push(rvmPromise);
    }

    return Promise.all(promises).then(() => {
      console.log('onPrepare is done');
    });
  }

  onComplete() {
    if (this.process) {
      this.process.kill();
    }
  }

  _redirectLogStream() {
    const logFile = (0, _getFilePath.default)(this.outputDir, this.logFileName); // ensure file & directory exists

    _fsExtra.default.ensureFileSync(logFile);

    const logStream = _fsExtra.default.createWriteStream(logFile, {
      flags: 'w'
    });

    this.process.stdout.pipe(logStream);
    this.process.stderr.pipe(logStream);
  }

}

exports.default = ChromeDriverLauncher;
