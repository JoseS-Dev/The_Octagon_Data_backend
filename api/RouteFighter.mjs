import {Router} from 'express';
import {ControllerFighter} from '../Controller/ControllerFighter.mjs';
import {ModelFighters} from '../Models/Fighters.mjs';

const router = Router();
const controllerFighter = new ControllerFighter({ModelFighters: ModelFighters});
export const RouteFighter = router;

// Ruta para obtener a todos los luchadores
RouteFighter.get('/fighters', controllerFighter.getAllFighters);
// Ruta para obtener un luchador por su ID
RouteFighter.get('/fighters/fighter/:id', controllerFighter.getFighterById);
// Ruta para obtener un luchador por su apodo
RouteFighter.get('/fighters/nickname/:nickname_fighter', controllerFighter.getFighterByNickname);
// Ruta para obtener luchadores por su categoria de peso
RouteFighter.get('/fighters/weight_class/:weight_class', controllerFighter.getFightersByWeightClass);
// Ruta para obtener un luchador por su nombre
RouteFighter.get('/fighters/name/:name_fighter', controllerFighter.getFighterByName);
