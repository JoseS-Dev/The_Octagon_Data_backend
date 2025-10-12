import { CONFIG_SCAPING_ALL, getAltheleAll } from "../Services/ConfigScraping.mjs";
import { ServicesScraping } from "../Services/DataFighters.mjs";
import { db } from "../Database/db.mjs";
import { cleanElement, cleanRecord } from '../utils.mjs';

// Método para cargar todos los luchadores desde la pagina
export async function LoadAllFightersFromUFC(){
        const url = getAltheleAll();
        if(!url) return {error: 'No se pudo obtener la URL de los luchadores'};
        console.log(`Scaping URL: ${url}`);
        const $ = await new ServicesScraping().getFightersFromUFC(url);
        const fighters = Array.from($.querySelectorAll(CONFIG_SCAPING_ALL.List_fighters))
        .map((el) => {
            
            return {
                name_fighter: cleanElement(el,'.c-listing-athlete__name'),
                nickname_fighter: cleanElement(el,'.c-listing-athlete__nickname', 'Sin Apodo')
                .replaceAll('"', ''),
                image_fighter: el.querySelector('img')?.getAttribute('src') || 'N/A',
                weight_class: cleanElement(el,'.c-listing-athlete__title'),
                record_fighter: cleanRecord(el,'.c-listing-athlete__record')
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