"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForFinDesktop = exports.checkFinGetVersion = exports.switchWindowByTitle = exports.switchWindow = exports.launcher = void 0;
const launcher_1 = require("./launcher");
class ChromeService {
}
exports.default = ChromeService;
exports.launcher = launcher_1.ChromeDriverLauncher;
/**
 * Switch focus to a particular window
 *
 * @param windowHandle
 * @param callback
 * @returns title of the window
 */
const switchWindow = async (windowHandle) => {
    await browser.switchToWindow(windowHandle);
    return browser.getTitle();
};
exports.switchWindow = switchWindow;
/**
 * Switch focus to a particular window with the matching title
 *
 * @param windowTitle
 */
const switchWindowByTitle = async (windowTitle) => {
    while (true) {
        const handles = await browser.getWindowHandles();
        for (const handle of handles) {
            const title = await exports.switchWindow(handle);
            if (title === windowTitle) {
                return;
            }
        }
        browser.pause(200);
    }
};
exports.switchWindowByTitle = switchWindowByTitle;
/**
 *  Check if OpenFin Javascript API fin.desktop.System.getVersion exits
 *
 **/
const checkFinGetVersion = async (callback) => {
    const result = await browser.executeAsync(function (done) {
        if (fin && fin.desktop && fin.desktop.System && fin.desktop.System.getVersion) {
            done(true);
        }
        else {
            done(false);
        }
    });
    callback(result);
};
exports.checkFinGetVersion = checkFinGetVersion;
const waitForFinDesktop = async () => {
    var callback = async (ready) => {
        if (ready === true) {
            return;
        }
        else {
            await browser.pause(1000);
            await exports.waitForFinDesktop();
        }
    };
    await exports.checkFinGetVersion(callback);
};
exports.waitForFinDesktop = waitForFinDesktop;
