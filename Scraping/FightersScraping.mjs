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

export async function LoadExtraFighterDataFromUFC() {
    try {
        // Obtener todos los luchadores
        const fighters = await db.query('SELECT * FROM fighters');
        if (fighters.rowCount === 0) {
            return { error: 'No hay luchadores en la base de datos' };
        }

        const results = {
            success: 0,
            errors: 0,
            details: []
        };

        // Procesar en lotes para no sobrecargar la API/servidor
        const batchSize = 5;
        for (let i = 0; i < fighters.rows.length; i += batchSize) {
            const batch = fighters.rows.slice(i, i + batchSize);
            
            // Procesar el lote en paralelo
            const batchPromises = batch.map(fighter => 
                processSingleFighter(fighter)
            );
            
            const batchResults = await Promise.allSettled(batchPromises);
            
            batchResults.forEach(result => {
                if (result.status === 'fulfilled') {
                    results.success++;
                    results.details.push({
                        fighter: result.value.fighterName,
                        status: 'success',
                        message: result.value.message
                    });
                } else {
                    results.errors++;
                    results.details.push({
                        fighter: 'Unknown',
                        status: 'error',
                        message: result.reason.message
                    });
                }
            });

            // Pequeña pausa entre lotes para no sobrecargar
            if (i + batchSize < fighters.rows.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return {
            message: `Procesamiento completado: ${results.success} exitosos, ${results.errors} errores`,
            details: results.details
        };

    } catch (error) {
        console.error('Error general:', error);
        return { error: 'Error general en el procesamiento' };
    }
}

// Función auxiliar para procesar un solo luchador
async function processSingleFighter(fighter) {
    try {
        const url = getAltheleURl(fighter.name_fighter.toLowerCase().replaceAll(' ', '-'));
        if (!url) {
            throw new Error(`No se pudo obtener la URL para ${fighter.name_fighter}`);
        }

        console.log(`Scraping URL: ${url}`);
        const $ = await new ServicesScraping().getFightersFromUFC(url);
        
        // Obtener la biografía (tu código original)
        const bio_fighter = $.querySelectorAll(CONFIG_SCAPING.bio_field);
        const bio = {};
        bio_fighter.forEach((el) => {
            const label = el.textContent.split(':')[0].trim().toLowerCase().replaceAll(' ', '_');
            const value = el.nextElementSibling?.textContent.trim() || 'N/A';
            bio[label] = value;
        });

        const FightersDataExtra = {
            image_fighter_2: $.querySelector(CONFIG_SCAPING.image_fighter)?.getAttribute('src') || 'N/A',
            height_fighter: parseFloat(bio['alto']),
            weight_fighter: parseFloat(bio['peso']),
            reach_fighter: parseFloat(bio['alcance']),
            reach_legs_fighter: parseFloat(bio['alcance_de_la_pierna']),
            status_fighter: String(bio['status'] || 'N/A'),
            country_fighter: String(bio['ciudad_natal'] || 'N/A'),
            team_fighter: String(bio['trenes_en'] || 'No Tiene equipo'),
            age_fighter: parseInt(bio['años']),
        };

        // Verificar si existe data extra
        const existingData = await db.query(
            'SELECT * FROM fighters_extras WHERE fighter_id = $1',
            [fighter.id]
        );

        if (existingData.rowCount > 0) {
            // Actualizar
            await db.query(
                `UPDATE fighters_extras SET image_fighter_2 = $1, status_fighter = $2,
                country_fighter = $3, team_fighter = $4, height_fighter = $5,
                weight_fighter = $6, reach_fighter = $7, reach_legs_fighter = $8,
                age_fighter = $9 WHERE fighter_id = $10`,
                [
                    FightersDataExtra.image_fighter_2, FightersDataExtra.status_fighter,
                    FightersDataExtra.country_fighter, FightersDataExtra.team_fighter,
                    FightersDataExtra.height_fighter, FightersDataExtra.weight_fighter,
                    FightersDataExtra.reach_fighter, FightersDataExtra.reach_legs_fighter,
                    FightersDataExtra.age_fighter, fighter.id
                ]
            );
        } else {
            // Insertar
            await db.query(
                `INSERT INTO fighters_extras (fighter_id, image_fighter_2, status_fighter,
                country_fighter, team_fighter, height_fighter, weight_fighter, age_fighter,
                reach_fighter, reach_legs_fighter) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [
                    fighter.id, FightersDataExtra.image_fighter_2, FightersDataExtra.status_fighter,
                    FightersDataExtra.country_fighter, FightersDataExtra.team_fighter,
                    FightersDataExtra.height_fighter, FightersDataExtra.weight_fighter,
                    FightersDataExtra.age_fighter, FightersDataExtra.reach_fighter, 
                    FightersDataExtra.reach_legs_fighter
                ]
            );
        }

        return {
            fighterName: fighter.name_fighter,
            message: existingData.rowCount > 0 ? 
                'Información actualizada correctamente' : 
                'Información agregada correctamente'
        };

    } catch (error) {
        console.error(`Error procesando ${fighter.name_fighter}:`, error);
        throw error;
    }
}