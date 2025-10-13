import {Router} from 'express';
import {ControllerFighter} from '../Controller/ControllerFighter.mjs';
import { ModelFighters } from '../Models/Fighters.mjs';
import { ControllerScraping } from '../Controller/ControllerScraping.mjs';

const router = Router();
const controllerFighter = new ControllerFighter({ModelFighters: ModelFighters});
const controllerScraping = new ControllerScraping();
export const RouteFighter = router;

// Ruta para obtener a todos los luchadores
RouteFighter.get('/all', controllerFighter.getAllFighters);
// Ruta para obtener un luchador por su ID
RouteFighter.get('/fighter/:id', controllerFighter.getFighterById);
// Ruta para obtener un luchador por su apodo
RouteFighter.get('/nickname/:nickname_fighter', controllerFighter.getFighterByNickname);
// Ruta para obtener luchadores por su categoria de peso
RouteFighter.get('/category/:weight_class', controllerFighter.getFightersByWeightClass);
// Ruta para obtener un luchador por su nombre
RouteFighter.get('/name/:name_fighter', controllerFighter.getFighterByName);
// Ruta para obtener los luchadores favoritos de un usuario
RouteFighter.get('/favorites/:user_id', controllerFighter.getFavoriteFightersByUser);
// Ruta para marcar o desmarcar un luchador como favorito
RouteFighter.patch('/toggle-favorite', controllerFighter.toggleFavoriteFighter);
// Ruta para cargar datos extras de luchadores de la UFC (Scraping)
RouteFighter.get('/scrape/extra-info', controllerScraping.loadExtraFighterData);
// Ruta para cargar las estadisticas de un luchador (Scraping)
RouteFighter.get('/scrape/stats/:name_fighter', controllerScraping.LoadStatsFighterFromUFC);


