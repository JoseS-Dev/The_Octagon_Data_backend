import {Router} from 'express';
import {ControllerFighter} from '../Controller/ControllerFighter.mjs';
import { ModelFighters } from '../Models/Fighters.mjs';

const router = Router();
const controllerFighter = new ControllerFighter({ModelFighters: ModelFighters});
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
// Ruta para obtener la información extra de un luchador

/*RouteFighter.get('/extra-info/:name_fighter', async (req, res) => {
    const {name_fighter} = req.params;
    try{
        const extraInfo = await LoadExtraFighterDataFromUFC({name_fighter});
        if(extraInfo.error) return res.status(404).json({error: extraInfo.error});
        return res.status(200).json({
            message: extraInfo.message,
            data: extraInfo.data,
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error: 'Error al obtener la información extra del luchador'});
    }
});*/
