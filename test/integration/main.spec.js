const assert = require('assert');


function switchWindowByTitle(windowTitle) {
    let done = false;
    while (!done) {
        let ids = browser.getTabIds();
        console.log(`return from getTabIds ${JSON.stringify(ids)} `);
        for (let i=0; i<ids.length; i++) {
            browser.switchTab(ids[i]);
            console.log(`window title ${browser.getTitle()} `);
            if (browser.getTitle() === windowTitle) {
                done = true;
                break;
            }
        }
    }
}

/**
 *  Check if OpenFin Javascript API fin.desktop.System.getVersion exits
 *
 **/
function checkFinGetVersion() {
    return browser.executeAsync(function (done) {
        if (fin && fin.desktop && fin.desktop.System && fin.desktop.System.getVersion) {
            done(true);
        } else {
            done(false);
        }
    });
}

function waitForFinDesktop(readyCallback) {
    while (!checkFinGetVersion()) {
        browser.pause(1000);
    }
}


describe('Test Hello OpenFin', function() {
    it('Switch to Hello OpenFin Main window', function () {
        switchWindowByTitle("Hello OpenFin");
        const title = browser.getTitle();
        assert.equal(title, 'Hello OpenFin');
    });

    it('Wait for OpenFin API ready', function() {
        waitForFinDesktop();
    });

    it("Click notification button", function() {
        browser.click("#desktop-notification");
        browser.pause(3000);  // Pause here so you can see the notification
    });

    it("Click CPU Info button", function() {
        browser.click("#cpu-info");
        browser.pause(3000);  // Pause here so you can see the CPU INFO child window
    });

    it('Switch to CPU Info window', function() {
        switchWindowByTitle("Hello OpenFin CPU Info");
    });

    it("Close CPU Info window", function(done) {
        browser.click("#close-app");
    });

    it('Exit OpenFin Runtime', function (done) {
        // execute OpenFin API to exit Runtime
        browser.execute(function () {
            fin.desktop.System.exit();
        });
        browser.pause(2000);  // pause here to give Runtime time to exit
    });
});
