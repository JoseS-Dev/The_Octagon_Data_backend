import { validateCommunity, validateCommunityUpdate, 
validateBanUser } from "../Validations/SchemaComu.mjs";

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

    // Controlador para obtener todas las comunidades creadas por un usuario
    getAllCommunitieByUser = async (req, res) => {
        const {created_by} = req.params;
        try{
            if(!created_by) return res.status(400).json({error: 'El ID del usuario es requerido'});
            const comm = await this.ModelCommunity.getAllCommunitieByUser({created_by});
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

    // Controlador para obtener los miembros de una comunidad
    getAllMembersByCommunity = async (req, res) => {
        const {community_id} = req.params;
        try{
            if(!community_id) return res.status(400).json({error: 'El ID de la comunidad es requerido'});
            const members = await this.ModelCommunity.getAllMembersFromCommunity({community_id});
            if(members.error) return res.status(404).json({error: members.error});
            return res.status(200).json({
                message: members.message,
                data: members.data
            });
        }
        catch(error){
            console.error(error);
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
            if(comm.error) return res.status(404).json({message: comm.error});
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
            created_by: parseInt(req.body.created_by),
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
            console.error(error);
            return res.status(500).json({error: 'Error del servidor'});
        }
    }

    // Controlador para actualizar una comunidad por su ID
    updateCommunity = async (req, res) => {
        if(!req.file) return res.status(400).json({error: 'No se ha subido ninguna imagen'});
        const {id} = req.params;
        const DataUpdate = {
            ...req.body,
            created_by: parseInt(req.body.created_by),
            image_community: req.file.path
        }
        const validation = validateCommunityUpdate(DataUpdate);
        try{
            if(!validation.success) return res.status(400).json({error: validation.error.errors});
            const updatedComm = await this.ModelCommunity.updateCommunity({id, DataUpdate: validation.data});
            if(updatedComm.error) return res.status(500).json({error: updatedComm.error});
            return res.status(200).json({
                message: updatedComm.message,
                data: updatedComm.data
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor'});
        }
        
    }

    // Controlador para agregar un miembro a una comunidad
    addMemberToCommunity = async (req, res) => {
        try{
            const addMember = await this.ModelCommunity.addMemberToCommunity({DataMember: req.body});
            if(addMember.error) return res.status(400).json({error: addMember.error});
            return res.status(200).json({
                message: addMember.message,
                data: addMember.data
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor'});
        }
    }

    // Controlador para eliminar un miembro de una comunidad
    removeMemberFromCommunity = async (req, res) => {
        try{
            const deleteMember = await this.ModelCommunity.removeMemberFromCommunity({DataMember: req.body});
            if(deleteMember.error) return res.status(400).json({error: deleteMember.error});
            return res.status(200).json({
                message: deleteMember.message
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor'});
        }
    }

    // Controlador para banear a un miembro de una comunidad
    banMemberFromCommunity = async (req, res) => {
        const validation = validateBanUser(req.body);
        try{
            if(!validation.success) return res.status(400).json({error: validation.error.errors});
            const banMember = await this.ModelCommunity.banMemberFromCommunity({DataMember: validation.data});
            if(banMember.error) return res.status(400).json({error: banMember.error});
            return res.status(200).json({
                message: banMember.message
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor'});
        }
    }

    // Controlador para desbanear a un miembro de una comunidad
    unbanMemberFromCommunity = async (req, res) => {
        try{
            const unbanMember = await this.ModelCommunity.unbanMemberFromCommunity({DataMember: req.body});
            if(unbanMember.error) return res.status(400).json({error: unbanMember.error});
            return res.status(200).json({
                message: unbanMember.message
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor'});
        }
    }
}