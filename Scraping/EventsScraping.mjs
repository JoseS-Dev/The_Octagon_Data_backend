import { CONFIG_SCRAPING_EVENTS } from "../Services/ConfigScraping.mjs";
import { DataEvents } from "../Services/DataEvents.mjs";
import { getEventsUFC, cleanElement, extraTypeEvent} from "../utils.mjs";
import {db} from '../Database/db.mjs'


// Obtener todos los eventos de la UFC
export async function getAllEvents(){
    const url = getEventsUFC();
    if(!url) throw new Error('No se pudo obtener la URL de los eventos de la UFC');
    console.log('Obteniendo eventos de la UFC desde:', url);
    const $ = await new DataEvents().getEventsFromUFC(url);
    if($.error) throw new Error($.error);
    const Events = Array.from($.querySelectorAll(CONFIG_SCRAPING_EVENTS.list_events))
    .map(event => {
        return {
            date_event: cleanElement(event, CONFIG_SCRAPING_EVENTS.date_event),
            venue_event: cleanElement(event, CONFIG_SCRAPING_EVENTS.venue_event),
            country_event: cleanElement(event, CONFIG_SCRAPING_EVENTS.location_event)
            .replaceAll('\n', ' '),
            type_event: extraTypeEvent(event, CONFIG_SCRAPING_EVENTS.type_event)
        }
    })
    if(Events.length === 0) throw new Error('No se encontraron eventos de la UFC');
    // Guardamos en la base de datos
    for(const event of Events){
        await db.query(
            `INSERT INTO events (date_event, venue_event, country_event, type_event)
            VALUES ($1, $2, $3, $4)`,
            [event.date_event, event.venue_event, event.country_event, event.type_event]
        );
    }
    return {data: Events, message: `Se ha cargado ${Events.length} eventos de la UFC correctamente.`};
}