import {LogParams} from "./log-params";
import {browser} from "protractor";

declare const allure: any;

export function step(logParams: LogParams | string = { message: null, logResult: false, takeScreen: false }) {
    const params: LogParams = typeof logParams === 'string'
        ? { message: logParams, logResult: false, takeScreen: false }
        : logParams;
    return function(target, name, descriptor) {
        const original = descriptor.value;
        descriptor.value = async function(...args: any[]) {
            const stepName = getStep(params.message, name, args);
            console.log(stepName);
            return await allure.createStep(stepName, async function() {
                const result = await original.apply(target, args);
                if (params.logResult && result) {
                    console.log(`>>> ${result}`);
                    allure.createAttachment('Result', function () {
                        return `${result}`;
                    }, 'text/html')();
                }
                if (params.takeScreen) {
                    await browser.takeScreenshot().then(function (png) {
                        allure.createAttachment('Screen', function () {
                            return Buffer.from(png, 'base64')
                        }, 'image/png')();
                    })
                }
                return result;
            })();
        }
    };
}

function getStep(message, name: string, args: any[]): string {
    if (message) {
        return args.length == 0 ? message : formatString(message, args);
    }
    const a = args.map(x => `${replacer(x)}`);
    return `${name}(${a})`;
}
function replacer(value) {
    return typeof value === 'object' ? require('json-stringify-safe')(value) : value;
}
function formatString(str: string, args: any[]) {
    let result: string = str;
    if (args.length == 1 && typeof args[0] === 'object') {
        for (const [key, value] of Object.entries(args[0])) {
            const template = `{${key}}`;
            result.includes(template);
            result = result.replace(template, `${value}`);
        }
        return result;
    }
    for (let i = 0; i < args.length; i++) {
        const value = typeof args[i] === 'object'
            ? require('json-stringify-safe')(args[i])
            : `${args[i]}`;
        result = result.replace(`{${i}}`, value);
    }
    return result;
}
