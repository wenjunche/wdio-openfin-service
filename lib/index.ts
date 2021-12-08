declare var fin: any;
declare var browser: any;

import ChromeDriverLauncher from './launcher'

export default class ChromeService {}
export const launcher = ChromeDriverLauncher

export const switchWindow = async (windowHandle: any, callback: Function) => {
    await browser.switchToWindow(windowHandle);
    const title = await browser.getTitle();
    await callback(title);
}

export const switchWindowByTitle = async (windowTitle: String): Promise<void> => {
    const handles = await browser.getWindowHandles();
    let handleIndex = 0;
    let checkTitle = async (title) => {
        console.log(title, windowTitle);
        if (title !== windowTitle) {
            handleIndex++;
            if (handleIndex < handles.length) {
                await switchWindow(handles[handleIndex], checkTitle);
            } else {
                // the window may not be loaded yet, so call itself again
                await switchWindowByTitle(windowTitle);
            }
        } else {
            console.log(`matched ${handleIndex}`, title, windowTitle);
        }
    };
    await switchWindow(handles[handleIndex], checkTitle);
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
