import {ui} from "../framework/UIElement";
import {UIComponent} from "../framework/UIComponent";
import {ElementFinder} from "protractor";
import {HasValue} from "../framework/HasValue";

export class Component implements UIComponent, HasValue {
    private p: ElementFinder;
    parent(): ElementFinder { return this.p; }
    setParent(parent: ElementFinder) { this.p = parent; }
    async value(): Promise<string> { return this.title().text(); }

    image() { return ui("img", this.parent()); }
    title() { return ui(".docs-component-category-list-card-title", this.parent()); }
    description() { return ui(".docs-component-category-list-card-summary", this.parent()); }
}
