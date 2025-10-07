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
// Ruta para obtener todas las comunidades creadas por un usuario
RouteComm.get('/user/:created_by', controllerComm.getAllCommunitieByUser);
// Ruta para obtener los miembros de una comunidad
RouteComm.get('/members/:community_id', controllerComm.getAllMembersByCommunity);
// Ruta para crear una nueva comunidad (Ruta protegida)
RouteComm.post('/create', UploadImageCommunity, controllerComm.createCommunity);
// Ruta para actualizar una comunidad (Ruta protegida)
RouteComm.patch('/update/:id', UploadImageCommunity, controllerComm.updateCommunity);
// Ruta para agregar un miembro a una comunidad (Ruta protegida)
RouteComm.patch('/addMember', controllerComm.addMemberToCommunity);
// Ruta para eliminar un miembro de una comunidad (Ruta protegida)
RouteComm.patch('/removeMember', controllerComm.removeMemberFromCommunity);
// Ruta para bannear un usuario de una comunidad (Ruta protegida)
RouteComm.patch('/banUser', controllerComm.banMemberFromCommunity);
// Ruta para desbannear un usuario de una comunidad (Ruta protegida)
RouteComm.patch('/unbanUser', controllerComm.unbanMemberFromCommunity);