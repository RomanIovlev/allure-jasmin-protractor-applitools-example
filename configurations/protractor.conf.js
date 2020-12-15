const allureReporter = require('jasmine-allure-reporter');

exports.config = {
    framework: 'jasmine2',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['../tests/**/**.spec.ts'],
    browserName: "chrome",
    allScriptsTimeout: 10000,
    getPageTimeout: 10000,
    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            args: ['--disable-browser-side-navigation', '--start-maximized']
        }
    },
   
    onPrepare: function () {
        jasmine.getEnv().addReporter(new allureReporter({
            resultsDir: '../allure-results'
        }));
        jasmine.getEnv().afterEach(spec => {
            browser.takeScreenshot().then(function (png) {
                allure.createAttachment('Screenshot', function () {
                    return Buffer.from(png, 'base64')
                }, 'image/png')();
                spec();
            })
        });
        require('ts-node').register({
            compilerOptions: {
                module: 'commonjs'
            },
            disableWarnings: true,
            fast: true
        });
    },
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 10000
    }
}
