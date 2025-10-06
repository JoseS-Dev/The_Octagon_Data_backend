import { validateCommunity } from "../Validations/SchemaComu.mjs";

export class ControllerComm {
    constructor({ModelCommunity}){
        this.ModelCommunity = ModelCommunity;
    }

    // Controlador para obtener todas las comunidades
    getAllCommunities = async (req, res) => {
        try{
            const allComm = await this.ModelCommunity.getAllCommunities();
            if(allComm.error) return res.status(500).json({error: allComm.error});
            return res.status(200).json({
                message: allComm.message,
                data: allComm.data
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor'});
        }
    }

    // Controlador para obtener una comunidad por su ID
    getCommunityById = async (req, res) => {
        const {id} = req.params;
        try{
            if(!id) return res.status(400).json({error: 'El ID de la comunidad es requerido'});
            const comm = await this.ModelCommunity.getCommunityById({id});
            if(comm.error) return res.status(404).json({error: comm.error});
            return res.status(200).json({
                message: comm.message,
                data: comm.data
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor'});
        }
    }

    // Controlador para obtener una comunidad por su tipo
    getCommunityByType = async (req, res) => {
        const {type_community} = req.params;
        try{
            if(!type_community) return res.status(400).json({error: 'El tipo de comunidad es requerido'});
            const comm = await this.ModelCommunity.getCommunityByType({type_community});
            if(comm.message) return res.status(404).json({message: comm.message});
            return res.status(200).json({
                message: comm.message,
                data: comm.data
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor'});
        }
    }

    // Controlador para crear una nueva comunidad
    createCommunity = async (req, res) => {
        if(!req.file) return res.status(400).json({error: 'No se ha subido ninguna imagen'});
        const DataCommunity = {
            ...req.body,
            image_community: req.file.path,
        }
        const validation = validateCommunity(DataCommunity);
        try{
            if(!validation.success) return res.status(400).json({error: validation.error.errors});
            const newComm = await this.ModelCommunity.createCommunity({DataCommunity: validation.data});
            if(newComm.error) return res.status(400).json({error: newComm.error});
            return res.status(201).json({
                message: newComm.message,
                data: newComm.data
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor'});
        }
    }
}