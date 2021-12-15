"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const index_1 = require("../../lib/index");
/**
 *  Check if OpenFin Javascript API fin.desktop.System.getVersion exits
 *
 **/
async function checkFinGetVersion(callback) {
    const result = await browser.executeAsync(function (done) {
        if (fin && fin.desktop && fin.desktop.System && fin.desktop.System.getVersion) {
            done(true);
        }
        else {
            done(false);
        }
    });
    callback(result);
}
async function waitForFinDesktop() {
    var callback = async (ready) => {
        if (ready === true) {
            return;
        }
        else {
            await browser.pause(1000);
            await waitForFinDesktop();
        }
    };
    await checkFinGetVersion(callback);
}
describe('Test Hello OpenFin', () => {
    it('Switch to Hello OpenFin Main window', async () => {
        await index_1.switchWindowByTitle('Hello OpenFin');
        const title = await browser.getTitle();
        assert_1.strictEqual(title, 'Hello OpenFin');
    });
    it('Wait for OpenFin API ready', async () => {
        await waitForFinDesktop();
    });
    it('Click notification button', async () => {
        const button = await browser.$('#desktop-notification');
        await button.click();
        await browser.pause(3000); // Pause here so you can see the notification
    });
    it('Exit OpenFin Runtime', async () => {
        // execute OpenFin API to exit Runtime
        await browser.execute(function () {
            fin.desktop.System.exit();
        });
        await browser.pause(2000); // pause here to give Runtime time to exit
    });
});
