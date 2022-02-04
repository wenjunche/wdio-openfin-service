declare var fin: any;
declare var browser: any;

import { ChromeDriverLauncher } from './launcher'

export default class ChromeService {}
export const launcher = ChromeDriverLauncher

/**
 * Switch focus to a particular window
 * 
 * @param windowHandle 
 * @param callback
 * @returns title of the window
 */
export const switchWindow = async (windowHandle: string): Promise<string> => {
    await browser.switchToWindow(windowHandle);
    return browser.getTitle();
}

/**
 * Switch focus to a particular window with the matching title
 * 
 * @param windowTitle 
 */
export const switchWindowByTitle = async (windowTitle: string): Promise<void> => {
    while (true) {
        const handles: string[] = await browser.getWindowHandles();
        for (const handle of handles) {
            const title = await switchWindow(handle);
            if (title === windowTitle) {
                return;
            }        
        }
        browser.pause(200);
    }
}

/**
 *  Check if OpenFin Javascript API fin.desktop.System.getVersion exits
 *
 **/
export const checkFinGetVersion = async (callback: Function): Promise<void> => {
    const result = await browser.executeAsync(function (done) {
        if (fin && fin.desktop && fin.desktop.System && fin.desktop.System.getVersion) {
            done(true);
        } else {
            done(false);
        }
    });
    callback(result);
}

export const waitForFinDesktop = async (): Promise<void> => {
    var callback = async (ready) => {
        if (ready === true) {
            return;
        } else {
            await browser.pause(1000);
            await waitForFinDesktop();
        }
    };
    await checkFinGetVersion(callback);
}
