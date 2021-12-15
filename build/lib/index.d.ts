import { ChromeDriverLauncher } from './launcher';
export default class ChromeService {
}
export declare const launcher: typeof ChromeDriverLauncher;
export declare const switchWindow: (windowHandle: any, callback: Function) => Promise<void>;
export declare const switchWindowByTitle: (windowTitle: String) => Promise<void>;
/**
 *  Check if OpenFin Javascript API fin.desktop.System.getVersion exits
 *
 **/
export declare const checkFinGetVersion: (callback: Function) => Promise<void>;
export declare const waitForFinDesktop: () => Promise<void>;
