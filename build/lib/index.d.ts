import { ChromeDriverLauncher } from './launcher';
export default class ChromeService {
}
export declare const launcher: typeof ChromeDriverLauncher;
/**
 * Switch focus to a particular window
 *
 * @param windowHandle
 * @param callback
 * @returns title of the window
 */
export declare const switchWindow: (windowHandle: string) => Promise<string>;
/**
 * Switch focus to a particular window with the matching title
 *
 * @param windowTitle
 */
export declare const switchWindowByTitle: (windowTitle: string) => Promise<void>;
/**
 *  Check if OpenFin Javascript API fin.desktop.System.getVersion exits
 *
 **/
export declare const checkFinGetVersion: (callback: Function) => Promise<void>;
export declare const waitForFinDesktop: () => Promise<void>;
