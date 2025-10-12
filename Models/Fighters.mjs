import {db} from '../Database/db.mjs';

export class ModelFighters{
    // Método para obtener todos los luchadores
    static async getAllFighters(){
        const fighters = await db.query('SELECT * FROM fighters');
        if(fighters.rowCount === 0) return {error: 'No se encontraron luchadores'};
        return {data: fighters.rows, message: 'Luchadores encontrados correctamente'};
    }
    // Método para obtener un luchador por su ID
    static async getFighterById({id}){
        if(!id) return {error: 'El ID del luchador es obligatorio'};
        const fighter = await db.query('SELECT * FROM fighters WHERE id = $1', [id]);
        if(fighter.rowCount === 0) return {error: 'No se encontró el luchador'};
        return {data: fighter.rows[0], message: 'Luchador encontrado correctamente'};
    }

    // Método para obtener a los luchadores favoritos de un usuario
    static async getFavoriteFightersByUser({user_id}){
        if(!user_id) return {error: 'El ID del usuario es obligatorio'};
        const favoriteFighters = await db.query(
            `SELECT f.* FROM fighters f
            JOIN user_fighters uf ON f.id = uf.fighter_id
            WHERE uf.user_id = $1 AND uf.is_favorite = true`,
            [user_id]
        );
        if(favoriteFighters.rowCount === 0) return {
            error: 'No se encontraron luchadores favoritos para este usuario'
        };
        return {data: favoriteFighters.rows, message: 'Luchadores favoritos encontrados correctamente'};
    }

    // Método para obtener un luchador por su apodo
    static async getFighterByNickname({nickname_fighter}){
        if(!nickname_fighter) return {error: 'El apodo del luchador es obligatorio'};
        const fighter = await db.query(
            `SELECT * FROM fighters WHERE nickname_fighter = $1`,
            [nickname_fighter]
        );
        if(fighter.rowCount === 0) return {error: 'No se encontró el luchador'};
        return {data: fighter.rows[0], message: 'Luchador encontrado correctamente'};
    }

    // Método para buscar luchadores de una categoria
    static async getFightersByWeightClass({weight_class}){
        if(!weight_class) return {error: 'La categoria de peso es obligatoria'};
        const fighters = await db.query(
            `SELECT * FROM fighters WHERE weight_class = $1`,
            [weight_class]
        );
        if(fighters.rowCount === 0) return {error: 'No se encontraron luchadores'};
        return {data: fighters.rows, message: 'Luchadores encontrados correctamente'};
    }

    // Método para buscar luchadores por su nombre
    static async getFighterByName({name_fighter}){
        if(!name_fighter) return {error: 'El nombre del luchador es obligatorio'};
        const fighter = await db.query(
            `SELECT * FROM fighters WHERE name_fighter = $1`,
            [name_fighter]
        );
        if(fighter.rowCount === 0) return {error: 'No se encontró el luchador'};
        return {data: fighter.rows[0], 
        message: 'Luchador encontrado correctamente'};
    }

    // Método para que el usuario coloque comof avorito a un luchador
    static async toggleFavoriteFighter({user_id, fighter_id, is_favorite}){
        if(!user_id || !fighter_id) return {error: 'El ID del usuario y del luchador son obligatorios'};
        if(is_favorite === undefined || is_favorite === null) return {
        error: 'El estado de favorito es obligatorio'};
        // Verificamos si el usuario existe y el luchador existe
        const existingUser = await db.query(
            `SELECT * FROM login_sessions WHERE user_id = $1 AND is_active = true`
            ,[user_id]
        );
        const existingFighter = await db.query(`SELECT * FROM fighters WHERE id = $1`, [fighter_id]);
        if(existingUser.rowCount === 0 || existingFighter.rowCount === 0) return { error: 'El usuario no esta logueado o el luchador no existe'};
        // Verificamos ya si el luchador está en favoritos del usuario
        const favoriteCheck = await db.query(
            `SELECT * FROM user_fighters WHERE user_id = $1 AND fighter_id = $2`,
            [user_id, fighter_id]
        );
        if(favoriteCheck.rowCount > 0){
            // Si ya está en favoritos, actualizamos el estado
            await db.query(
                `UPDATE user_fighters SET is_favorite = $1 WHERE user_id = $2 AND fighter_id = $3`,
                [is_favorite, user_id, fighter_id]
            );
            return {message: `${existingFighter.rows[0].name_fighter} ha sido ${is_favorite ? 'agregado' 
            : 'removido'} de tus favoritos`};
        }
        else{
            // Si no está en favoritos, lo agregamos
            await db.query(
                `INSERT INTO user_fighters (user_id, fighter_id, is_favorite) VALUES ($1, $2, $3)`,
                [user_id, fighter_id, is_favorite]
            );
            return {message: `${existingFighter.rows[0].name_fighter} ha sido agregado a tus favoritos`};
        }
    }
}