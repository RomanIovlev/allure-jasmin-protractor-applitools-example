import {element, ElementFinder} from "protractor";
import {getBy, UIComponent} from "./UIComponent";

export class UIElement implements UIComponent {
    private p: ElementFinder;
    parent(): ElementFinder { return this.p; }
    setParent(parent: ElementFinder) { this.p = parent; }
    locators: string[] = [];

    public async getElement(): Promise<ElementFinder> {
        const p = await this.parent();
        if (p) {
            if (this.locators.length == 1) {
                return p.element(getBy(this.locators[0]));
            }
        }
        return p
            ? p.element(getBy(this.locators.slice(-1)[0]))
            : element(this.locators.slice(-1)[0]);
    }

    public constructor(locator: string, parent: ElementFinder = undefined) {
        this.locators.push(locator);
        this.setParent(parent);
    }
    public async click() {
        this.getElement().then(el => el.click());
    }
    public async text(): Promise<string> {
        return this.getElement().then(el => el.getText());
    }
    public sendKeys() {}
    public input() {}
    public attribute(name: string) {}
    public value() {}
    public dragNDrop() {}
    public css(style: string) {}
    public show() {}
}

export function ui(locator: string, parent: ElementFinder = null) {
    return new UIElement(locator, parent);
}
