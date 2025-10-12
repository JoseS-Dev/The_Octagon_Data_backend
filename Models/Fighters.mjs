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
}