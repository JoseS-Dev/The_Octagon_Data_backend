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
    // método para obtener todas las comunidades creadas por un usuario
    static async getAllCommunitieByUser({id}){
        if(!id) return {error: 'El id del usuario es requerido'}
        // Se verifica si existe dicho usuario
        const existingUser = await db.query(
            `SELECT * FROM users WHERE id = $1`, [id]
        );
        if(existingUser.rowCount === 0) return {message: "No existe un usuario con dicho ID"}
        // Si existe, hacemos la busqueda de las comunidades creadas por él
        const communitiesUser = await db.query(
            `SELECT U.name_user, C.* FROM communities C
            JOIN users U ON C.created_by = U.id WHERE U.id = $1
            ORDER BY C.name_community ASC`, [id]
        );
        if(communitiesUser.rowCount === 0) return {message: "El usuario no ha creado comunidades"}
        return {data: communitiesUser.rows, 
            message: `Comunidades de ${existingUser.rows[0].name_user} obtenidas correctamente`
        }
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
            `SELECT U.name_user, C.* FROM communities C
            JOIN users U ON C.created_by = U.id
            WHERE C.type_community = $1 AND C.is_blocked = false
            ORDER BY C.name_community ASC`,
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
            image_community, type_community, created_by) VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name_community, description_community, image_community, type_community, 
            created_by, created_at`,
            [name_community, description_community, image_community, type_community, created_by]
        );
        return {data: newCommunity.rows[0], message: 'Comunidad creada correctamente'};

    }

    // Actualizar una comunidad (solo el creador puede hacerlo)
    static async updateCommunity({id, DataCommunity}){
        if(!id || !DataCommunity) return {error: 'No fue propocionado el ID de la comunidad a actualizar'};
        const allowedFields = [
            'name_community', 'description_community', 'image_community', 'type_community'
        ];
        const fieldsToUpdate = {};
        for(const field of allowedFields){
            if(DataCommunity[field] !== undefined) fieldsToUpdate[field] = DataCommunity[field];
        }
        // Se verifica si existe la comunidad
        const existingCommunity = await db.query(
            `SELECT * FROM communities WHERE id = $1`,
            [id]
        );
        if(existingCommunity.rowCount === 0) return {error: 'No existe una comunidad con ese ID'};
        // Si existe, se actualiza la comunidad
        const setClause = [];
        const values = [];

        Object.entries(fieldsToUpdate).forEach(([key, value], index) => {
            setClause.push(`${key} = $${index + 1}`);
            values.push(value);
        });
        values.push(id);
        // Contruyendo la consulta SQL
        const updatedCommunity = await db.query(
            `UPDATE communities SET ${setClause.join(', ')} WHERE id = $${values.length}
            RETURNING *`,
            values
        );
        const sanitizedCommunity = omit(updatedCommunity.rows[0], ['is_blocked']);
        return {data: sanitizedCommunity, message: 'Comunidad actualizada correctamente'};
    }

    // método para agregar un miembro a una comunidad
    static async addMemberToCommunity({DataMember}){
        if(!DataMember) return {error: 'No fue propocionado el ID de la comunidad o del usuario'};
        const {community_id, user_id} = DataMember;
        // Se verifica si existe la comunidad y el usuario
        const existingCommunity = await db.query(
            `SELECT * FROM  communities WHERE id = $1`,
            [community_id]
        );
        const existingUser = await db.query(
            `SELECT * FROM users WHERE id = $1`,
            [user_id]
        );
        if(existingCommunity.rowCount === 0 || existingUser.rowCount === 0){
            return {error: 'No existe la comunidad o el usuario con los IDs proporcionados'};
        }
        // Si existen, se verifica si el usuario ya es miembro de la comunidad
        const existingMember = await db.query(
            `SELECT user_id FROM user_communities WHERE
            community_id = $1 AND user_id = $2`, [community_id, user_id]
        );
        if(existingMember.rowCount > 0) return {error: 'El usuario ya es miembro de la comunidad'};
        // Si no es miembro, se agrega a la comunidad
        const newMember = await db.query(
            `INSERT INTO user_communities(community_id, user_id)
            VALUES ($1, $2) RETURNING community_id, user_id, joined_at`,
            [community_id, user_id]
        );
        // A su vez se actualiza el número de miembros en la tabla communities
        await db.query(
            `UPDATE communities SET members_count = members_count + 1 WHERE id = $1`,
            [community_id]
        );
        return {data: newMember.rows[0], message: 'Usuario agregado a la comunidad correctamente'};
    }

    // método para eliminar un miembro de una comunidad
    static async removeMemberFromCommunity({DataMember}){
        if(!DataMember) return {error: 'No fue propocionado el ID de la comunidad o del usuario'};
        const {community_id, user_id} = DataMember;
        // Se verifica si existe el usuario
        const existingUser = await db.query(
            `SELECT * FROM users WHERE id = $1`,
            [user_id]
        );
        if(existingUser.rowCount === 0) return {error: 'No existe un usuario con ese ID'};
        // Se verifica si el usuario es miembro de la comunidad
        const existingMember = await db.query(
            `SELECT * FROM user_communities WHERE community_id = $1 AND user_id = $2`,
            [community_id, user_id]
        );
        // Si es miembro, se procede a eliminarlo
        if(existingMember.rowCount > 0){
            await db.query(
                `DELETE FROM user_communities WHERE community_id = $1 AND user_id = $2`,
                [community_id, user_id]
            );
            await db.query(
                `UPDATE communities SET members_count = members_count - 1 WHERE id = $1`,
                [community_id]
            );
            return {message: `El usuario ${existingUser.rows[0].name_user} ha sido eliminado de la 
            comunidad correctamente`};
        }
        return {error: 'El usuario no es miembro de la comunidad'};
    }

    // método para banear un usuario de una comunidad
    static async banMemberFromComunity({DataMember}){
        if(!DataMember) return {error: 'No fue propocionado el ID de la comunidad o del usuario'};
        const {community_id, user_id, banned_text} = DataMember;
        // Se verifica si existe el usuario
        const existingUser = await db.query(
            `SELECT * FROM users WHERE id = $1`,
            [user_id]
        );
        if(existingUser.rowCount === 0) return {error: 'No existe un usuario con ese ID'};
        // Se verifica si el usuario es miembro de la comunidad
        const existingMember = await db.query(
            `SELECT * FROM user_communities WHERE community_id = $1 AND user_id = $2`,
            [community_id, user_id]
        );
        if(existingMember.rowCount === 0) return {error: 'El usuario no es miembro de la comunidad'};
        // Si existe y es miembro, se procede a banearlo
        const bannedMember = await db.query(
            `INSERT INTO user_communities(community_id, user_id, is_banned, banned_text, banned_at)
            VALUES ($1, $2, true, $3, NOW())`, [community_id, user_id, banned_text]
        );
        // se elimina de la comunidad y se actualiza el número de miembros
        await db.query(
            `DELETE FROM user_communities WHERE community_id = $1 AND user_id = $2`,
            [community_id, user_id]
        );
        await db.query(
            `UPDATE communities SET members_count = members_count - 1 WHERE id = $1`,
            [community_id]
        );
        return {data: bannedMember.rows[0], message: `El usuario ${existingUser.rows[0].name_user} 
        ha sido baneado de la comunidad correctamente`};
    } 
}