"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForFinDesktop = exports.checkFinGetVersion = exports.switchWindowByTitle = exports.switchWindow = exports.launcher = exports.default = void 0;

require("source-map-support/register");

var _launcher = _interopRequireDefault(require("./launcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ChromeService {}

exports.default = ChromeService;
const launcher = _launcher.default;
exports.launcher = launcher;

const switchWindow = async (windowHandle, callback) => {
  await browser.switchToWindow(windowHandle);
  const title = await browser.getTitle();
  await callback(title);
};

exports.switchWindow = switchWindow;

const switchWindowByTitle = async windowTitle => {
  const handles = await browser.getWindowHandles();
  let handleIndex = 0;

  let checkTitle = async title => {
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
};
/**
 *  Check if OpenFin Javascript API fin.desktop.System.getVersion exits
 *
 **/


exports.switchWindowByTitle = switchWindowByTitle;

const checkFinGetVersion = async callback => {
  const result = await browser.executeAsync(function (done) {
    if (fin && fin.desktop && fin.desktop.System && fin.desktop.System.getVersion) {
      done(true);
    } else {
      done(false);
    }
  });
  callback(result);
};

exports.checkFinGetVersion = checkFinGetVersion;

const waitForFinDesktop = async () => {
  var callback = async ready => {
    if (ready === true) {
      return;
    } else {
      await browser.pause(1000);
      await waitForFinDesktop();
    }
  };

  await checkFinGetVersion(callback);
};

exports.waitForFinDesktop = waitForFinDesktop;
