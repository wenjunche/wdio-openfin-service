import { ChromeDriverLauncher } from './launcher';
export default class ChromeService {
}
export declare const launcher: typeof ChromeDriverLauncher;
/**
 * Switch focus to a particular window with the matching document.title
 *
 * @param windowTitle
 */
export declare const switchWindowByTitle: (title: string) => Promise<void>;
/**
 * Switch focus to a particular web content with the matching document.title
 *
 * @param title
 */
export declare const switchWebContentByTitle: (title: string) => Promise<void>;
/**
 * Switch focus to a particular web content with the matching URL
 *
 * @param url
 */
export declare const switchWebContentByURL: (url: string) => Promise<void>;
/**
 *  Check if OpenFin Javascript API fin.desktop.System.getVersion exits
 *
 **/
export declare const checkFinGetVersion: (callback: Function) => Promise<void>;
export declare const waitForFinDesktop: () => Promise<void>;
