import { parse } from 'node-html-parser';
import { CONFIG_HEADERS } from './ConfigScraping.mjs';
import {chromium} from 'playwright';


export class ServicesScraping {
    // método para obtener los luchadores desde la página de la UFC
    async getFightersFromUFC(url){
        let browser;
        try{
            browser = await chromium.launch({headless: true});
            const context = await browser.newContext();
            const page = await context.newPage();
            await page.setExtraHTTPHeaders(CONFIG_HEADERS);
            await page.goto(url, {waitUntil: 'networkidle'});
            const content = await page.content();
            const $ = parse(content);
            return $;
        }
        catch(error){
            console.error(error);
            return {error: 'Error al obtener los luchadores desde la página de la UFC'};
        }
        finally{
            await browser.close();
        }
    }
}
