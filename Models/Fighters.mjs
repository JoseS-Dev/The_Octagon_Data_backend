import { ServicesScraping } from '../Services/DataFighters.mjs';
import { CONFIG_SCAPING, getAltheleURl, getAltheleAll, CONFIG_SCAPING_ALL } from '../Services/ConfigScraping.mjs';
import {db} from '../Database/db.mjs';

export class ModelFighters{
    // método para obtener los datos de un luchador y guardarlos en la base de datos
    static async LoadFightersFromUFC({name}){
        if(!name) return {error: 'Nombre del luchador es requerido'};
        const url = getAltheleURl(name);
        console.log(`Scaping URL: ${url}`);

        // Scraping de datos
        const $ = await new ServicesScraping().getFightersFromUFC(url);
        const name_fighter = $.querySelector(CONFIG_SCAPING.name_fighter).textContent|| 'N/A';
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

        // Estadisticas del luchador por golpes significativos
        const stats_labels = $.querySelectorAll(CONFIG_SCAPING.strike_favor_fighter);
        let stats_fighter = {};
        stats_labels.forEach((el) => {
            const label = el.querySelector('.c-stat-3bar__label')?.textContent.trim().toLowerCase().replaceAll(' ', '_');
            const value = el.querySelector('.c-stat-3bar__value')?.textContent.trim() || 'N/A';
            stats_fighter[label] = value;
        })
        console.log(stats_fighter);

        const fighter = {
            name_fighter: String(name_fighter),
            nickname_fighter: String(nickname_fighter),
            image_fighter: String(image_fighter),
            wins_fight: parseInt(wins) || 0,
            losses_fight: parseInt(losses) || 0,
            draws_fight: parseInt(draws) || 0,
            weight_class: String(category_fighter),
            status_fighter: String(bio_fighter['status']) || 'N/A',
            town_fighter: String(bio_fighter['ciudad_natal']) || 'N/A',
            team_fighter: String(bio_fighter['trenes_en']) || 'N/A',
            style_fighter: String(bio_fighter['estilo_de_lucha']) || 'N/A',
            age_fighter: parseInt(bio_fighter['años']) || 'N/A',
            height_fighter: parseFloat(bio_fighter['alto']) || 'N/A',
            weight_fighter: parseFloat(bio_fighter['peso']) || 'N/A',
            debut_octagon: String(bio_fighter['debut_del_octágono']) || 'N/A',
            scope_fighter: parseFloat(bio_fighter['alcance']) || 'N/A',
            scope_legs_fighter: parseFloat(bio_fighter['alcance_de_la_pierna']) || 'N/A'
            
        };

        // Guardamos en la base de datos
        // Verficamos si ya el luchador esta en la base de datos
        const existingFighter = await db.query(
            `SELECT name_fighter FROM fighters WHERE name_fighter = $1`, [name_fighter]
        );
        if(existingFighter.rowCount > 0) return {message: 'Si existe en la base de datos'}
        // Si no existe se agrega
        await db.query(
            `INSERT INTO fighters
            (name_fighter, nickname_fighter, image_fighter, wins_fight, losses_fight, draws_fight, weight_class,
            status_fighter, town_fighter, team_fighter, style_fighter, age_fighter, height_fighter, weight_fighter,
            debut_octagon, scope_fighter, scope_legs_fighter) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
            [fighter.name_fighter, fighter.nickname_fighter, fighter.image_fighter, fighter.wins_fight,
            fighter.losses_fight, fighter.draws_fight, fighter.weight_class, fighter.status_fighter, fighter.town_fighter,
            fighter.team_fighter, fighter.style_fighter, fighter.age_fighter, fighter.height_fighter,
            fighter.weight_fighter, fighter.debut_octagon, fighter.scope_fighter, fighter.scope_legs_fighter
            ]
        )

        return {data: fighter, message: 'Luchador agregado correctamente'};
    }

    // Método para cargar todos los luchadores desde la pagina
    static async LoadAllFightersFromUFC(){
        const url = getAltheleAll();
        if(!url) return {error: 'No se pudo obtener la URL de los luchadores'};
        const $ = await new ServicesScraping().getFightersFromUFC(url);
        const fighters = Array.from($.querySelectorAll(CONFIG_SCAPING_ALL.List_fighters))
        .map((el) => {
            // Función pa limpiar el nombre del luchador
            const cleanElement = (selector, defaultValue) => {
                const element = el.querySelector(selector);
                if(element.textContent == '') return defaultValue;
                return element ? element.textContent.trim() : defaultValue;
            }
            // Función para limpiar el record del luchador
            const cleanRecord = (selector, defaultValue = '0-0-0') => {
                const element = el.querySelector(selector);
                return element ? element.textContent.split('(')[0].trim() : defaultValue;
            }
            return {
                name_fighter: cleanElement('.c-listing-athlete__name'),
                nickname_fighter: cleanElement('.c-listing-athlete__nickname', 'Sin Apodo')
                .replaceAll('"', ''),
                image_fighter: el.querySelector('img')?.getAttribute('src') || 'N/A',
                weight_class: cleanElement('.c-listing-athlete__title'),
                record_fighter: cleanRecord('.c-listing-athlete__record')
            }
        });
        if(fighters.length === 0) return {error: 'No se encontraron luchadores'};
        // Si se encuentra luchadores se guardan en la base de datos
        for(const fighter of fighters){
            await db.query(
                `INSERT INTO fighters
                (name_fighter, nickname_fighter, image_fighter, weight_class, record_fighter)
                VALUES($1, $2, $3, $4, $5)`,
                [
                    fighter.name_fighter, fighter.nickname_fighter, fighter.image_fighter,
                    fighter.weight_class, fighter.record_fighter
                ]
            )
        }
        return {data: fighters, message: 'Luchadores agregados correctamente'};
    }
}