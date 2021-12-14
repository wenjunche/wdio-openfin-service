"use strict";
/**
 *  Launcher class for wedio OpenFin service
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chromedriver_1 = require("chromedriver");
var fs_extra_1 = require("fs-extra");
var getFilePath_1 = require("./utils/getFilePath");
var child_process_1 = require("child_process");
var path_1 = require("path");
var DEFAULT_LOG_PATH = '.';
var DEFAULT_LOG_FILENAME = 'wdio-chromedriver.log';
var DEFAULT_CONNECTION = {
    protocol: 'http',
    hostname: 'localhost',
    port: 9515,
    path: '/'
};
var ChromeDriverLauncher = /** @class */ (function () {
    function ChromeDriverLauncher(options, capabilities, config) {
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
        this.chromedriverCustomPath = options.chromedriverCustomPath ? path_1.default.resolve(options.chromedriverCustomPath) : chromedriver_1.default.path;
    }
    ChromeDriverLauncher.prototype.onPrepare = function () {
        return __awaiter(this, void 0, void 0, function () {
            var binary, chromeOptions, promises, driverPromise, rvmArgs_1, rvmPromise;
            var _this = this;
            return __generator(this, function (_a) {
                console.log('onPrepare service');
                binary = path_1.default.resolve(__dirname, '../scripts/RunOpenFin.bat');
                chromeOptions = {
                    extensions: [],
                    binary: binary,
                    args: ["--config=" + this.config.openfin.manifest],
                };
                if (this.config.openfin.debuggerPort) {
                    chromeOptions.debuggerAddress = "localhost:" + this.config.openfin.debuggerPort;
                }
                this.capabilities[0] = {
                    maxInstances: 1,
                    'goog:chromeOptions': chromeOptions
                };
                promises = [];
                driverPromise = new Promise(function (resolve, reject) {
                    _this.process = child_process_1.default.execFile(_this.chromedriverCustomPath, _this.args, function (err) {
                        if (err) {
                            return reject(err);
                        }
                    });
                    if (_this.process) {
                        if (typeof _this.logFileName === 'string') {
                            _this._redirectLogStream();
                        }
                        resolve();
                    }
                });
                promises.push(driverPromise);
                if (this.config.openfin.debuggerPort) {
                    rvmArgs_1 = [];
                    rvmArgs_1.push("--config=" + this.config.openfin.manifest);
                    rvmArgs_1.push('--remote-debugging-port=9090');
                    console.log("launching " + binary + " " + rvmArgs_1);
                    rvmPromise = new Promise(function (resolve, reject) {
                        var process = child_process_1.default.execFile(binary, rvmArgs_1, function (err) {
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
                return [2 /*return*/, Promise.all(promises).then(function () {
                        console.log('onPrepare is done');
                    })];
            });
        });
    };
    ChromeDriverLauncher.prototype.onComplete = function () {
        if (this.process) {
            this.process.kill();
        }
    };
    ChromeDriverLauncher.prototype._redirectLogStream = function () {
        var logFile = getFilePath_1.default(this.outputDir, this.logFileName);
        // ensure file & directory exists
        fs_extra_1.default.ensureFileSync(logFile);
        var logStream = fs_extra_1.default.createWriteStream(logFile, { flags: 'w' });
        this.process.stdout.pipe(logStream);
        this.process.stderr.pipe(logStream);
    };
    return ChromeDriverLauncher;
}());
exports.default = ChromeDriverLauncher;
