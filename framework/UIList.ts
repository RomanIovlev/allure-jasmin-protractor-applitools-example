import {getBy, UIComponent} from "./UIComponent";
import {by, element, ElementArrayFinder, ElementFinder} from "protractor";
import {HasValue} from "./HasValue";
import {step} from "./stepAllure";

export class UIList<T extends UIComponent & HasValue> implements UIComponent {
    private p: ElementFinder;
    parent(): ElementFinder { return this.p; }
    setParent(parent: ElementFinder) { this.p = parent; }
    locators: string[] = [];
    private readonly instance: new () => T;
    list(): ElementArrayFinder {
        if (!this.locators?.length) {
            throw 'now locators specified';
        }
        return this.locators.length == 1
            ? element.all(getBy(this.locators[0]))
            : this.chainLocators()
    }

    private chainLocators(): ElementArrayFinder {
        let ctx: ElementFinder = undefined;
        for (let i = 0; i < this.locators.length; i++) {
            const locator = getBy(this.locators[i]);
            switch (i) {
                case 0:
                    ctx = element(locator);
                    break;
                case this.locators.length - 1:
                    return ctx.all(locator);
                default:
                    ctx = ctx.element(locator);
            }
        }
        return undefined;
    }

    public constructor(locator: string, instance: new () => T) {
        this.locators.push(locator);
        this.instance = instance;
    }
    public get(value: number): T {
        const ef: ElementFinder = this.list().get(value);
        return this.getInstance(ef);
    }

    @step()
    public async all(): Promise<T[]> {
        return this.list()
            .map(el => this.getInstance(el));
    }
    @step()
    public async doAction(action: (c: T[]) => { }) {
        const result: T[] = await this.list()
            .map(el => this.getInstance(el));
        await action(result);
    }
    @step()
    public clickByValue(value: string) {
        this.list()
            .filter(el => el.element(by.css(".docs-component-category-list-card-title")).getText()
                .then(text => text === value)
            ).first().click();
    }
    // @step()
    public async map<R>(mapFunc: (c: T) => R): Promise<R[]> {
        return this.list().map(async el => await mapFunc(this.getInstance(el)));
    }
    public first(): T {
        return this.getInstance(this.list().first());
    }
    public last(): T {
        return this.getInstance(this.list().last());
    }
    public async filter(filterFunc: (c: T) => any): Promise<T[]> {
        return this.list().filter(el => filterFunc(this.getInstance(el)))
            .map(el => this.getInstance(el));
    }
    public async find(filterFunc: (c: T) => any): Promise<T> {
        const list: ElementArrayFinder = this.list().filter(el => filterFunc(this.getInstance(el)));
        return this.getInstance(list.first());
    }
    private getInstance(ef: ElementFinder): T {
        const instance: T = new this.instance();
        instance.setParent(ef);
        return instance;
    }
}
export function uiList<T extends UIComponent & HasValue>(locator: string, instance: new () => T) {
    return new UIList<T>(locator, instance);
}
