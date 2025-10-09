import {Router} from 'express';
import {ControllerFighter} from '../Controller/ControllerFighter.mjs';
import {ModelFighters} from '../Models/Fighters.mjs';

const router = Router();
const controllerFighter = new ControllerFighter({ModelFighters: ModelFighters});
export const RouteFighter = router;

// Ruta para cargar los luchadores desde la página de la UFC
router.get('/load-fighters/:name', controllerFighter.loadFightersFromUFC);