import pkg from 'lodash';
import { db } from '../Database/db.mjs';

const { omit } = pkg;

export class ModelCommunity {
    // método para obtener todas las comunidades
    static async getAllCommunities(){
        const communities = await db.query(
            `SELECT U.name_user, C.* FROM communities C
            JOIN users U ON C.created_by = U.id
            WHERE C.is_blocked = false ORDER BY C.name_community ASC`
        );
        if(communities.rowCount === 0) return {error: 'No hay comunidades registradas'};
        const sanitizedCommunities = communities.rows.map(comm => 
            omit(comm, ['is_blocked'])
        );
        return {data: sanitizedCommunities, message: 'Comunidades obtenidas correctamente'};
    }
    // método para obtener una comunidad por su ID
    static async getCommunityById({id}){
        if(!id) return {message: 'No fue propocionado el ID de la comunidad necesario para la búsqueda'};
        // Se busca la comunidad por su ID
        const conmunity = await db.query(
            `SELECT U.name_user, C.* FROM communities C
            JOIN users U ON C.created_by = U.id
            WHERE C.id = $1`,
            [id]
        );
        if(conmunity.rowCount === 0) return {error: 'No existe una comunidad con ese ID'};
        const sanitizedCommunity = omit(conmunity.rows[0], ['is_blocked']);
        return {data: sanitizedCommunity, message: 'Comunidad obtenida correctamente'};
    }

    // método para obtener una comunidad por el tipo
    static async getCommunityByType({type_community}){
        if(!type_community) return {error: 'No fue propocionado el tipo de comunidad necesario para la búsqueda'};
        // Se busca la comunidad por su tipo
        const communities = await db.query(
            `SELECT * FROM communities WHERE type_communities = $1 ORDER BY name_community ASC`,
            [type_community]
        );
        if(communities.rowCount === 0) return {error: 'No hay comunidades registradas con ese tipo'};
        const sanitizedCommunities = communities.rows.map(comm => 
            omit(comm, ['is_blocked'])
        );
        return {data: sanitizedCommunities, message: 'Comunidades obtenidas correctamente'};
    }

    // método para crear una nueva comunidad
    static async createCommunity({DataCommunity}){
        if(!DataCommunity) return {error: 'No fue proporcionada la información de la comunidad'};
        const {name_community, description_community, 
        image_community, type_community, created_by} = DataCommunity;
        // Se verifica si ya existe una comunidad con ese nombre
        const existingCommunity = await db.query(
            `SELECT name_community FROM communities WHERE name_community = $1`,
            [name_community]
        );
        if(existingCommunity.rowCount > 0) return {error: 'Ya existe una comunidad con ese nombre'};
        // Si no existe se crea la comunidad
        const newCommunity = await db.query(
            `INSERT INTO communities(name_community, description_community,
            image_community, type_communities, created_by) VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name_community, description_community, image_community, type_communities, 
            created_by, created_at`,
            [name_community, description_community, image_community, type_community, created_by]
        );
        return {data: newCommunity.rows[0], message: 'Comunidad creada correctamente'};

    }
}