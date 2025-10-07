import { ServicesDataFighters } from '../Services/DataFighters.mjs';
import {db} from '../Database/db.mjs';

export class ModelFighters{
    // Método para cargar los luchadores desde la página de la UFC
    static async loadFightersFromUFC(){
        const serviceFighters = new ServicesDataFighters();
        const DataUFC = await serviceFighters.getFightersFromUFC();
        if(DataUFC.error) return {error: DataUFC.error};
        DataUFC.forEach( async (fighter) => {
            const{FirstName, LastName, Nickname, WeightClass} = fighter;
            const name_fighter = `${FirstName} ${LastName}`;
            await db.query(`
                INSERT INTO fighters (name_fighter, nickname_fighter, weightClass)
                VALUES ($1, $2, $3)
            `, [name_fighter, Nickname, WeightClass]);
        })
        console.log(`Se encontraron ${DataUFC.length} luchadores`);
    }
}