import dotenv from 'dotenv';
dotenv.config();


// Configuraciones de variables de scraping para los luchadores
export const CONFIG_SCAPING = {
    bio_field: '.c-bio__label',
    image_fighter: '.hero-profile__image',
}

// Configuraciones de variables de scraping para los eventos
export const CONFIG_SCRAPING_EVENTS = {
    list_events: '.l-listing__item',
    date_event: '.c-card-event--result__date',
    venue_event: '.field--name-taxonomy-term-title',
    location_event: '.field--name-location',
    type_event: '.c-card-event--result__logo a'
}

// Configuraciones del scaping para el all fighters
export const CONFIG_SCAPING_ALL = {
    List_fighters: '.l-flex__item .node--type-athlete',

}

// Configuraciones del Scraping para las estadisticas de los luchadores
export const CONFIG_SCRAPING_STATS = {
    Strikes_wins: '.c-stat-3bar__group',
    Stats_compare: '.c-stat-compare__group'
}

// Configuraciones de cabezeras para las solicitudes HTTPS
export const CONFIG_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
}