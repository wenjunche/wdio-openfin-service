/**
 *  Launcher class for wedio OpenFin service
 */

const ChromeDriver = require('chromedriver');
const fs = require('fs-extra');
import getFilePath from './utils/getFilePath'
import * as childProcess from 'child_process'
import * as path from 'path'

const DEFAULT_LOG_PATH = '.';
const DEFAULT_LOG_FILENAME = 'wdio-chromedriver.log';
const DEFAULT_CONNECTION = {
    protocol: 'http',
    hostname: 'localhost',
    port: 9515,
    path: '/'
};

export class ChromeDriverLauncher {
    config: any;
    options: { protocol: any; hostname: any; port: any; path: any };
    outputDir: any;
    logFileName: string;
    capabilities: any;
    args: any;
    chromedriverCustomPath: any;
    process: childProcess.ChildProcess;
    constructor (options, capabilities, config) {
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

    async onPrepare () {
        console.log('onPrepare service');
        const binary = path.resolve(__dirname, '../scripts/RunOpenFin.bat');
        const chromeOptions: any = {
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
        const driverPromise = new Promise<void>((resolve, reject) => {
            this.process = childProcess.execFile(this.chromedriverCustomPath, this.args, (err) => {
                if (err) {
                    return reject(err);
                }
            });

            if (this.process) {
                if (typeof this.logFileName === 'string') {
                    this._redirectLogStream();
                }
                resolve()
            }
        });
        promises.push(driverPromise);

        if (this.config.openfin.debuggerPort) {
            const rvmArgs = [];
            rvmArgs.push(`--config=${this.config.openfin.manifest}`);
            rvmArgs.push('--remote-debugging-port=9090');
            console.log(`launching ${binary} ${rvmArgs}`);
            const rvmPromise = new Promise<void>((resolve, reject) => {
                const process = childProcess.execFile(binary, rvmArgs, (err) => {
                    if (err) {
                        return reject(err);
                    }
                });
                if (process) {
                    resolve()
                }
            });
            promises.push(rvmPromise);
        }

        return Promise.all(promises).then(() => {
            console.log('onPrepare is done');
        });
    }

    onComplete () {
        if (this.process) {
            this.process.kill();
        }
    }

    _redirectLogStream () {
        const logFile = getFilePath(this.outputDir, this.logFileName)

        // ensure file & directory exists
        fs.ensureFileSync(logFile)

        const logStream = fs.createWriteStream(logFile, { flags: 'w' })

        this.process.stdout.pipe(logStream)
        this.process.stderr.pipe(logStream)
    }
}
