"use strict";
/**
 *  Launcher class for wedio OpenFin service
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromeDriverLauncher = void 0;
const ChromeDriver = require('chromedriver');
const fs = require('fs-extra');
const getFilePath_1 = __importDefault(require("./utils/getFilePath"));
const childProcess = __importStar(require("child_process"));
const path = __importStar(require("path"));
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
        this.chromedriverCustomPath = options.chromedriverCustomPath ? path.resolve(options.chromedriverCustomPath) : ChromeDriver.path;
    }
    async onPrepare() {
        console.log('onPrepare service');
        const binary = path.resolve(__dirname, '../scripts/RunOpenFin.bat');
        const chromeOptions = {
            extensions: [],
            binary: binary,
            args: [`--config=${this.config.openfin.manifest}`],
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
            this.process = childProcess.execFile(this.chromedriverCustomPath, this.args, (err) => {
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
                const process = childProcess.execFile(binary, rvmArgs, (err) => {
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
        const logFile = getFilePath_1.default(this.outputDir, this.logFileName);
        // ensure file & directory exists
        fs.ensureFileSync(logFile);
        const logStream = fs.createWriteStream(logFile, { flags: 'w' });
        this.process.stdout.pipe(logStream);
        this.process.stderr.pipe(logStream);
    }
}
exports.ChromeDriverLauncher = ChromeDriverLauncher;
