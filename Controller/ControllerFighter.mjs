import { validateToggleFavorite } from "../Validations/SchemaFighter.mjs";

export class ControllerFighter {
    constructor({ModelFighters}){
        this.ModelFighters = ModelFighters;
    }

    // Controlador para obtener todos los luchadores
    getAllFighters = async (req, res) => {
        try{
            const fighters = await this.ModelFighters.getAllFighters();
            if(fighters.error) return res.status(404).json({error: fighters.error});
            return res.status(200).json({
                message: fighters.message,
                data: fighters.data,
                
            })
        }
        catch(error){
            return res.status(500).json({error: 'Error al obtener los luchadores'});
        }
    }

    // Controlador para obtener un luchador por su ID
    getFighterById = async (req, res) => {
        const {id} = req.params;
        try{
            const fighter = await this.ModelFighters.getFighterById({id});
            if(fighter.error) return res.status(404).json({error: fighter.error});
            return res.status(200).json({
                message: fighter.message,
                data: fighter.data,
                
            })
        }
        catch(error){
            return res.status(500).json({error: 'Error al obtener el luchador'});
        }
    }

    // Controlador para obtener un luchador por su apodo
    getFighterByNickname = async (req, res) => {
        const {nickname_fighter} = req.params;
        try{
            const fighter = await this.ModelFighters.getFighterByNickname({nickname_fighter});
            if(fighter.error) return res.status(404).json({error: fighter.error});
            return res.status(200).json({
                message: fighter.message,
                data: fighter.data,
            })
        }
        catch(error){
            return res.status(500).json({error: 'Error al obtener el luchador'});
        }
    }

    // Controlador para buscar luchadores de una categoria
    getFightersByWeightClass = async (req, res) => {
        const {weight_class} = req.params;
        try{
            const fighters = await this.ModelFighters.getFightersByWeightClass({weight_class});
            if(fighters.error) return res.status(404).json({error: fighters.error});
            return res.status(200).json({
                message: fighters.message,
                data: fighters.data,
            })
        }
        catch(error){
            return res.status(500).json({error: 'Error al obtener los luchadores'});
        }
    }

    // Controlador para obtener un luchador por su nombre
    getFighterByName = async (req, res) => {
        const {name_fighter} = req.params;
        try{
            const fighter = await this.ModelFighters.getFighterByName({name_fighter});
            if(fighter.error) return res.status(404).json({error: fighter.error});
            return res.status(200).json({
                message: fighter.message,
                data: fighter.data,
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error al obtener el luchador'});
        }
    }

    // Controlador para obtener a los luchadores favoritos de un usuario
    getFavoriteFightersByUser = async (req, res) => {
        const {user_id} = req.params;
        try{
            const favoriteFighters = await this.ModelFighters.getFavoriteFightersByUser({user_id});
            if(favoriteFighters.error) return res.status(404).json({error: favoriteFighters.error});
            return res.status(200).json({
                message: favoriteFighters.message,
                data: favoriteFighters.data,
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error al obtener los luchadores favoritos'});
        }
    }

    // Controlador para marcar o desmarcar un luchador como favorito para un usuario
    toggleFavoriteFighter = async (req, res) => {
        const validation = validateToggleFavorite(req.body);
        try{
            if(!validation.success) return res.status(400).json({
            error: 'Datos inválidos', details: validation.error.errors});
            const {user_id, fighter_id, is_favorite} = validation.data;
            const result = await this.ModelFighters.toggleFavoriteFighter({
            user_id, fighter_id, is_favorite});
            if(result.error) return res.status(400).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                data: result.data,
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error al actualizar el luchador favorito'});
        }
    }
}