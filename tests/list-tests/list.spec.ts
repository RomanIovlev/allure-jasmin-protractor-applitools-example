import {browser, protractor} from "protractor";
import {homePage} from "../../pages/HomePage";
import {tablePage} from "../../pages/TablePage";

describe('Angular material test:',  function() {
    beforeEach(async function() {
        await browser.get('https://material.angular.io/components/categories');
    })

    const allComponents = "Autocomplete,Badge,Bottom Sheet,Button,Button toggle,Card,Checkbox,Chips,Datepicker,Dialog,Divider,Expansion Panel,Form field,Grid list,Icon,Input,List,Menu,Paginator,Progress bar,Progress spinner,Radio button,Ripples,Select,Sidenav,Slide toggle,Slider,Snackbar,Sort header,Stepper,Table,Tabs,Toolbar,Tooltip,Tree";
    const firstComponent = "Autocomplete";
    const forthComponent = "Button toggle";
    const lastComponent = "Tree";

    it("simple inner test", async function() {
        const values = await homePage.outStep();
        const s = await homePage.summaryText();
        expect(values).toEqual(s);
        expect(values).toEqual('Angular Material offers a wide variety of UI components based on the Material Design specification');
    });
    it('check all components', async function() {
        const firstElement = homePage.tiles().first();
        const firstValue = await firstElement.title().text();
        expect(firstValue).toEqual(firstComponent);

        const lastValue = await homePage.tiles().last().title().text();
        expect(lastValue).toEqual(lastComponent);

        expect(await homePage.tiles().get(4).title().text()).toEqual(forthComponent);

        const values = await homePage.tiles().map(c => c.title().text());
        expect(`${values}`).toEqual(allComponents);
    });
    it('table page', async function() {
        const sortTableTile = await homePage.tiles()
            .find(c => c.title().text().then(t => t === 'Sort header'));
        await sortTableTile.title().click();
        const EC = protractor.ExpectedConditions;
        browser.wait(EC.urlContains('/components/sort/overview'), 5000);
        expect(await tablePage.addHeadersTitle().getText()).toEqual("Adding sort to table headers")
        await tablePage.hasAddHeaders();
    });
});
