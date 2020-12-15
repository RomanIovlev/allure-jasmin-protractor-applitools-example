import {ElementFinder} from "protractor";
import {by} from "protractor";

export interface UIComponent {
    parent(): ElementFinder;
    setParent(parent: ElementFinder);
    locators?: string[];
}

export function getBy(locator: string) {
    return by.css(locator);
}