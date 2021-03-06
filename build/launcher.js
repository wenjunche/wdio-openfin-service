'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  Launcher class for wedio OpenFin service
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _chromedriver = require('chromedriver');

var _chromedriver2 = _interopRequireDefault(_chromedriver);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _getFilePath = require('./utils/getFilePath');

var _getFilePath2 = _interopRequireDefault(_getFilePath);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var binPath = _chromedriver2.default.path;

var DEFAULT_LOG_FILENAME = 'ChromeDriver.txt';

var ChromeDriverLauncher = function () {
    function ChromeDriverLauncher() {
        _classCallCheck(this, ChromeDriverLauncher);

        this.chromeDriverLogs = null;
        this.chromeDriverArgs = {};
        this.logToStdout = false;
    }

    _createClass(ChromeDriverLauncher, [{
        key: 'onPrepare',
        value: function onPrepare(config, capabilities) {
            var _this = this;

            console.log('onPrepare service');
            var binary = _path2.default.resolve(__dirname, 'scripts/RunOpenFin.bat');
            config.capabilities = config.capabilities || { browserName: 'chrome' };
            capabilities[0] = {
                maxInstances: 1,
                chromeOptions: {
                    extensions: [],
                    binary: binary,
                    args: ['--config=' + config.openfin.manifest]
                }
            };
            this.chromeDriverLogs = config.chromeDriverLogs;
            this.logToStdout = config.logToStdout;

            return new Promise(function (resolve, reject) {
                _this.process = _child_process2.default.execFile(binPath, _this.chromeDriverArgs, function (err, stdout, stderr) {
                    if (err) {
                        return reject(err);
                    }
                });

                if (_this.process) {
                    if (typeof _this.chromeDriverLogs === 'string') {
                        _this._redirectLogStream();
                    }
                    resolve();
                }
            });
        }
    }, {
        key: 'onComplete',
        value: function onComplete() {
            if (this.process) {
                this.process.kill();
            }
        }
    }, {
        key: '_redirectLogStream',
        value: function _redirectLogStream() {
            var logFile = (0, _getFilePath2.default)(this.chromeDriverLogs, DEFAULT_LOG_FILENAME);

            // ensure file & directory exists
            _fsExtra2.default.ensureFileSync(logFile);

            var logStream = _fsExtra2.default.createWriteStream(logFile, { flags: 'w' });

            this.process.stdout.pipe(logStream);
            this.process.stderr.pipe(logStream);
        }
    }]);

    return ChromeDriverLauncher;
}();

exports.default = ChromeDriverLauncher;
