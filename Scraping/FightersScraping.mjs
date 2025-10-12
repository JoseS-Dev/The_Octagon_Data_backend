import { CONFIG_SCAPING_ALL, CONFIG_SCAPING } from "../Services/ConfigScraping.mjs";
import { ServicesScraping } from "../Services/DataFighters.mjs";
import { db } from "../Database/db.mjs";
import { cleanElement, cleanRecord, getAltheleAll, getAltheleURl } from '../utils.mjs';

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

// Función para obtener la información extra de un luchador
export async function LoadExtraFighterDataFromUFC({name_fighter}){
    if(!name_fighter) return {error: 'El nombre del luchador es obligatorio'};
    const slugName = name_fighter.toLowerCase().replaceAll(' ', '-');
    const url = getAltheleURl(slugName);
    console.log(`Scaping URL: ${url}`);

    // Obtenemos la biografia del luchador
    const $ = await new ServicesScraping().getFightersFromUFC(url);
    if($.error) return {error: $.error};
    const bio = $.querySelectorAll(CONFIG_SCAPING.bio_field)
    const BioFields = {}
    bio.forEach((el) => {
        const label = el.textContent.trim().replaceAll(':', '').toLowerCase().replaceAll(' ', '_');
        const value = el.nextElementSibling?.textContent.trim() || 'N/A';
        BioFields[label] = value;
    })
    
    // Hacemos un objeto con los datos del luchador
    const fighterData = {
        image_fighter_2: $.querySelector(CONFIG_SCAPING.image_fighter)?.getAttribute('src') || 'N/A',
        status_fighter: String(BioFields['status'] || 'N/A'),
        country_fighter: String(BioFields['ciudad_natal'] || 'N/A'),
        team_fighter: String(BioFields['trenes_en'] || 'N/A'),
        height_fighter: parseFloat(BioFields['alto'] || 'N/A'),
        weight_fighter: parseFloat(BioFields['peso'] || 'N/A'),
        reach_fighter: parseFloat(BioFields['alcance'] || 'N/A'),
        age_fighter: parseInt(BioFields['años'] || 'N/A'),
        reach_legs_fighter: parseFloat(BioFields['alcance_de_la_pierna'] || 'N/A')
    }

    // Ahora verificamos si dicho luchador existe en la base de datos
    const existingFighter = await db.query(
        `SELECT id FROM fighters WHERE name_fighter = $1`, [name_fighter]
    );
    if(existingFighter.rowCount === 0) return {error: 'El luchador no existe en la base de datos'};
    // Si existe, actualizamos su información
    const fighterId = existingFighter.rows[0].id;
    // Verificamos si ya existe dicha información en la tabla extras
    const existingExtras = await db.query(
        `SELECT fighter_id FROM fighters_extras WHERE fighter_id = $1`, [fighterId]
    );
    if(existingExtras.rowCount > 0){
        // Si ya existe, actualizamos la información
        await db.query(
            `UPDATE fighters_extras SET image_fighter_2 = $1, status_fighter = $2,
            country_fighter = $3, team_fighter = $4, height_fighter = $5,
            weight_fighter = $6, reach_fighter = $7, reach_legs_fighter = $8,
            age_fighter = $9 WHERE fighter_id = $10`,
            [
                fighterData.image_fighter_2, fighterData.status_fighter,
                fighterData.country_fighter, fighterData.team_fighter,
                fighterData.height_fighter, fighterData.weight_fighter,
                fighterData.reach_fighter, fighterData.reach_legs_fighter,
                fighterData.age_fighter, fighterId
            ]
        )
        return {data: fighterData, message: 'Información del luchador actualizada correctamente'};
    }
    else{
        // Si no existe, insertamos la información
        await db.query(
            `INSERT INTO fighters_extras (fighter_id, image_fighter_2, status_fighter,
            country_fighter, team_fighter, height_fighter, weight_fighter, age_fighter,
            reach_fighter, reach_legs_fighter) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                fighterId, fighterData.image_fighter_2, fighterData.status_fighter,
                fighterData.country_fighter, fighterData.team_fighter, 
                fighterData.height_fighter, fighterData.weight_fighter,
                fighterData.reach_fighter, fighterData.reach_legs_fighter,
                fighterData.age_fighter
            ]
        )
        return {data: fighterData, message: 'Información del luchador agregada correctamente'};
    }
}