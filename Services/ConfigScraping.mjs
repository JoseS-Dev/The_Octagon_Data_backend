import dotenv from 'dotenv';
dotenv.config();

export const getAltheleURl = (name_fighter) => 'https://www.ufc.com/athlete/' + name_fighter;
export const getAltheleAll = () => 'https://www.ufcespanol.com/athletes/all?filters[0]=location:UZ';

// Configuraciones de variables de scraping para los luchadores
export const CONFIG_SCAPING = {
    bio_field: '.c-bio__label',
    category_fighter: '.hero-profile__division-title',
    image_fighter: '.hero-profile__image',
    name_fighter: '.hero-profile__name',
    nickname_fighter: '.hero-profile__nickname',
    record_fighter: '.hero-profile__division-body',
    strike_favor_fighter: '.c-stat-3bar__group',
    compare_fighter: '.c-stat-compare__group',
    stats_fighter: '.stats-records--compare',
}

// Configuraciones del scaping para el all fighters
export const CONFIG_SCAPING_ALL = {
    List_fighters: '.l-flex__item .node--type-athlete',

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