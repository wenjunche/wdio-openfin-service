declare var fin: any;
declare var browser: any;

import { ChromeDriverLauncher } from './launcher'

export default class ChromeService {}
export const launcher = ChromeDriverLauncher

/**
 * Switch focus to a particular window with the matching document.title
 * 
 * @param windowTitle 
 */
export const switchWindowByTitle = async (title: string): Promise<void> => {
    return switchWebContentByTitle(title);
}

/**
 * Switch focus to a particular web content with the matching document.title
 * 
 * @param title
 */
 export const switchWebContentByTitle = async (title: string): Promise<void> => {
    const filter = async() => {
        const currentTitle = await browser.getTitle();
        if (title === currentTitle) {
            return true;
        }
        return false;
    }
    return switchWebContentWithFilter(filter);
}

/**
 * Switch focus to a particular web content with the matching URL
 * 
 * @param url
 */
 export const switchWebContentByURL = async (url: string): Promise<void> => {
    const filter = async() => {
        const currentUrl = await browser.getUrl();
        if (url === currentUrl) {
            return true;
        } else {
            return false;
        }
    }
    return switchWebContentWithFilter(filter);
}

const switchWebContentWithFilter = async (filter: () => Promise<boolean>): Promise<void> => {
    while (true) {
        const handles: string[] = await browser.getWindowHandles();
        for (const handle of handles) {
            await browser.switchToWindow(handle);
            const matched = await filter();
            if (matched) {
                return;
            }        
        }
        await browser.pause(500);
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
