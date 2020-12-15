import {by, element} from "protractor";

class TablePage {
    addHeadersTitle() { return element(by.css("#adding-sort-to-table-headers")); }
    async hasAddHeaders() { expect(await this.addHeadersTitle().getText()).toEqual("Adding sort to table headers") }
}
export const tablePage = new TablePage();