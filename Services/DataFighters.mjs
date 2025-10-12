import { parse } from 'node-html-parser';
import { CONFIG_HEADERS} from './ConfigScraping.mjs';
import {chromium} from 'playwright';


export class ServicesScraping {
    // método para obtener los luchadores desde la página de la UFC
    async getFightersFromUFC(url){
        let browser;
        try{
            browser = await chromium.launch({ headless: true});
            if(!browser) throw new Error('No se pudo iniciar el navegador');
            // Creamos un contexto y una pagina
            const context = await browser.newContext();
            const page = await context.newPage();
            if(!page || !context) throw new Error('No se pudo crear la página o el contexto');
            // Agregamos los headers para evitar bloqueos
            await page.setExtraHTTPHeaders(CONFIG_HEADERS);
            // Navegamos a la pagina
            await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
            
            const content = await page.content();
            const html = parse(content);
            return html;
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
