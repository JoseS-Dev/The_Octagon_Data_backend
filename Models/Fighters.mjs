import { ServicesScraping } from '../Services/DataFighters.mjs';
import { CONFIG_SCAPING, getAltheleURl } from '../Services/ConfigScraping.mjs';
import {db} from '../Database/db.mjs';

export class ModelFighters{
    // método para obtener los luchadores desde la página de la UFC
    static async LoadFightersFromUFC({id}){
        if(!id) return {error: 'ID del luchador es requerido'};
        const url = getAltheleURl(id);
        console.log(`Scaping URL: ${url}`);

        // Scraping de datos
        const $ = await new ServicesScraping().getFightersFromUFC(url);
        if($.error) return {error: $.error};
        const name_fighter = $.querySelector(CONFIG_SCAPING.name_fighter)|| 'N/A';
        const nickname_fighter = $.querySelector(CONFIG_SCAPING.nickname_fighter) ?
            $.querySelector(CONFIG_SCAPING.nickname_fighter).textContent.replaceAll('"', '') : 'N/A';
        const image_fighter = $.querySelector(CONFIG_SCAPING.image_fighter)?.getAttribute('src') || 'N/A';
        const record_fighter = $.querySelector(CONFIG_SCAPING.record_fighter).textContent
        const [wins, losses, draws] = record_fighter.split(' ')[0].split('-')
        const category_fighter = $.querySelector(CONFIG_SCAPING.category_fighter)?.textContent || 'N/A';

        // Biografia del luchador
        const bio_labels = $.querySelectorAll(CONFIG_SCAPING.bio_field);
        let bio_fighter = {};
        bio_labels.forEach((el) => {
            const label = el.textContent.replace(':', '').trim().toLowerCase().replaceAll(' ', '_');
            const value = el.nextElementSibling?.textContent.trim() || 'N/A';
            bio_fighter[label] = value;
        })

        const fighter = {
            name_fighter,
            nickname_fighter,
            image_fighter,
            wins: parseInt(wins) || 0,
            losses: parseInt(losses) || 0,
            draws: parseInt(draws) || 0,
            category_fighter,
            ...bio_fighter
        }
        return {data: fighter};
    }
}