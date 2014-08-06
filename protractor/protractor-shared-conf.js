
exports.config = {

  allScriptsTimeout: 11000,

  baseUrl: 'http://localhost:3000',

  framework: 'jasmine',

  onPrepare: function() {
    // At this point, global 'protractor' object will be set up, and jasmine
    // will be available. For example, you can add a Jasmine reporter with:
    //     jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter(
    //         'outputdir/', true, true));
    //

    /**
     * add jasmine spec reporter
     */
    require('jasmine-spec-reporter');
    jasmine.getEnv().addReporter(new jasmine.SpecReporter({displayStacktrace: true}));

    /**
     * install the screenshot reporter
     */
    var ScreenShotReporter = require('protractor-screenshot-reporter');
    jasmine.getEnv().addReporter(new ScreenShotReporter({
        baseDirectory: './.screenshots',
        takeScreenShotsOnlyForFailedSpecs: true
    }));

    // /**
    //  * Disable animations so e2e tests run more quickly
    //  */
    // var disableNgAnimate = function() {
    //   angular.module('disableNgAnimate', []).run(function($animate) {
    //     $animate.enabled(false);
    //   });
    // };
    //
    // browser.addMockModule('disableNgAnimate', disableNgAnimate);

    /**
     * Store the name of the browser that's currently being used.
     */
    // browser.getCapabilities().then(function(caps) {
    //   browser.params.browser = caps.get('browserName');
    // });

    /**
     * set the screen width
     */
    var minWindowWidth = 1024,
        minWindowHeight = 768,
        browserName,
        platform,
        window = browser.manage().window();

    browser.getCapabilities().then(function (capabilities) {
            browser.params.browser = capabilities.get('browserName');
            browserName = capabilities.caps_.browserName;
            platform = capabilities.caps_.platform;
        }
    ).then(function getCurrentWindowSize() {
            return window.getSize();
        }
    ).then(function setWindowSize(dimensions) {
            var windowWidth = Math.max(dimensions.width, minWindowWidth),
                windowHeight = Math.max(dimensions.height, minWindowHeight);

            return window.setSize(windowWidth, windowHeight);
        }
    ).then(function getUpdatedWindowSize() {
            return window.getSize();
        }
    ).then(function showWindowSize(dimensions) {
            console.log('Browser:', browserName, 'on', platform, 'at', dimensions.width + 'x' + dimensions.height);
            console.log("Running e2e tests...");
        }
    );

  },

  jasmineNodeOpts: {
    // onComplete will be called just before the driver quits.
    onComplete: null,
    // If true, display spec names.
    isVerbose: false,
    // If true, print colors to the terminal.
    showColors: true,
    // If true, include stack traces in failures.
    includeStackTrace: false,
    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 40000
  }

};

// vim: ts=2 sw=2 expandtab:
