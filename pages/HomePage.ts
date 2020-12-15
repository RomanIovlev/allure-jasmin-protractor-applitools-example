import {uiList} from "../framework/UIList";
import {Component} from "./Component";
import {step} from "../framework/stepAllure";
import {by, element, promise} from "protractor";

class HomePage {
    tiles() { return uiList(".docs-component-category-list-card", Component); }
    summary() { return element(by.css("#category-summary")); }

    @step({ message: "Get Summary", logResult: true })
    summaryText() { return this.summary().getText(); }

    @step({ logResult: true })
    outStep(): promise.Promise<string> {
        return this.inner1(3);
    }
    @step({ takeScreen: true })
    inner1(index: number): promise.Promise<string> {
        return this.inner2({ one: "test", two:2, three: true});
    }
    @step("Select {two} index in '{one}'")
    inner2(index: any): promise.Promise<string> {
        return this.inner3(5, "'test'", false);
    }
    @step("Select {2} index in {0} and {1}")
    inner3(index: number, value: string, flag: boolean): promise.Promise<string> {
        return this.inner4();
    }
    @step({message: "Return result", logResult: true, takeScreen: true})
    inner4(): promise.Promise<string> {
        return this.inner5({ one: "test", two:2, three: true});
    }
    @step()
    inner5(index: any): promise.Promise<string> {
        return this.inner6(5, "test", false);
    }
    @step()
    inner6(index: number, value: string, flag: boolean): promise.Promise<string> {
        return this.inner7("'test'");
    }
    @step("Inner Step {0}")
    inner7(val: string): promise.Promise<string> {
        return this.summary().getText();
    }
}
export const homePage = new HomePage();