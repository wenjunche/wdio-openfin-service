/**
 *  Launcher class for wedio OpenFin service
 */
/// <reference types="node" />
import * as childProcess from 'child_process';
export declare class ChromeDriverLauncher {
    config: any;
    options: {
        protocol: any;
        hostname: any;
        port: any;
        path: any;
    };
    outputDir: any;
    logFileName: string;
    capabilities: any;
    args: any;
    chromedriverCustomPath: any;
    process: childProcess.ChildProcess;
    constructor(options: any, capabilities: any, config: any);
    onPrepare(): Promise<void>;
    onComplete(): void;
    _redirectLogStream(): void;
}
