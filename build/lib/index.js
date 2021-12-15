"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForFinDesktop = exports.checkFinGetVersion = exports.switchWindowByTitle = exports.switchWindow = exports.launcher = void 0;
const launcher_1 = require("./launcher");
class ChromeService {
}
exports.default = ChromeService;
exports.launcher = launcher_1.ChromeDriverLauncher;
const switchWindow = async (windowHandle, callback) => {
    await browser.switchToWindow(windowHandle);
    const title = await browser.getTitle();
    await callback(title);
};
exports.switchWindow = switchWindow;
const switchWindowByTitle = async (windowTitle) => {
    const handles = await browser.getWindowHandles();
    let handleIndex = 0;
    let checkTitle = async (title) => {
        console.log(title, windowTitle);
        if (title !== windowTitle) {
            handleIndex++;
            if (handleIndex < handles.length) {
                await exports.switchWindow(handles[handleIndex], checkTitle);
            }
            else {
                // the window may not be loaded yet, so call itself again
                await exports.switchWindowByTitle(windowTitle);
            }
        }
        else {
            console.log(`matched ${handleIndex}`, title, windowTitle);
        }
    };
    await exports.switchWindow(handles[handleIndex], checkTitle);
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
