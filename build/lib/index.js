"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForFinDesktop = exports.checkFinGetVersion = exports.switchWebContentByURL = exports.switchWebContentByTitle = exports.switchWindowByTitle = exports.launcher = void 0;
const launcher_1 = require("./launcher");
class ChromeService {
}
exports.default = ChromeService;
exports.launcher = launcher_1.ChromeDriverLauncher;
/**
 * Switch focus to a particular window with the matching document.title
 *
 * @param windowTitle
 */
const switchWindowByTitle = async (title) => {
    return exports.switchWebContentByTitle(title);
};
exports.switchWindowByTitle = switchWindowByTitle;
/**
 * Switch focus to a particular web content with the matching document.title
 *
 * @param title
 */
const switchWebContentByTitle = async (title) => {
    const filter = async () => {
        const currentTitle = await browser.getTitle();
        if (title === currentTitle) {
            return true;
        }
        return false;
    };
    return switchWebContentWithFilter(filter);
};
exports.switchWebContentByTitle = switchWebContentByTitle;
/**
 * Switch focus to a particular web content with the matching URL
 *
 * @param url
 */
const switchWebContentByURL = async (url) => {
    const filter = async () => {
        const currentUrl = await browser.getUrl();
        if (url === currentUrl) {
            return true;
        }
        else {
            return false;
        }
    };
    return switchWebContentWithFilter(filter);
};
exports.switchWebContentByURL = switchWebContentByURL;
const switchWebContentWithFilter = async (filter) => {
    while (true) {
        const handles = await browser.getWindowHandles();
        for (const handle of handles) {
            await browser.switchToWindow(handle);
            const matched = await filter();
            if (matched) {
                return;
            }
        }
        await browser.pause(500);
    }
};
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
