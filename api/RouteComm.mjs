import {Router} from 'express';
import { ControllerComm } from '../Controller/ControllerComm.mjs';
import { ModelCommunity } from '../Models/Community.mjs';
import { UploadImageCommunity } from '../Middlewares/SubImage.mjs';

const router = Router();
const controllerComm = new ControllerComm({ModelCommunity: ModelCommunity});
export const RouteComm = router;

// Ruta para obtener todas las comunidades
RouteComm.get('/', controllerComm.getAllCommunities);
// Ruta para obtener una comunidad por su ID
RouteComm.get('/:id', controllerComm.getCommunityById);
// Ruta para obtener una comunidad por su tipo
RouteComm.get('/type/:type_community', controllerComm.getCommunityByType);
// Ruta para crear una nueva comunidad (Ruta protegida)
RouteComm.post('/create', UploadImageCommunity, controllerComm.createCommunity);