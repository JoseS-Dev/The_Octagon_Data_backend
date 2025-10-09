import { parse } from 'node-html-parser';
import { CONFIG_HEADERS } from './ConfigScraping.mjs';
import puppeteer from 'puppeteer';


export class ServicesScraping {
    // método para obtener los luchadores desde la página de la UFC
    async getFightersFromUFC(url){
        try{
            const browser = await puppeteer.launch({
                headless: "new",
                product: 'chrome',
                args: [
                    '--no-sandbox', 
                    '--disable-setuid-sandbox',
                    `--user-agent=${CONFIG_HEADERS['User-Agent']}`
                ]
            });
            if(!browser) return {error: 'No se pudo iniciar el navegador'};
            const page = await browser.newPage();
            if(!page) return {error: 'No se pudo abrir una nueva página'};
            await page.goto(url, {waitUntil: 'networkidle2', timeout: 30000});

            const content = await page.content();
            if(!content) return {error: 'No se pudo obtener el contenido de la página'};
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
