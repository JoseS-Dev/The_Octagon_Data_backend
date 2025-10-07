import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Servicios para Interactuar con la pagina de la UFC con web scraping
export class ServicesDataFighters{
    // Servicio para obtener los datos de la vista de los luchadores de la UFC
    getFightersFromUFC = async () => {
        try{
            const response = await axios.get(process.env.UFC_URL);
            if(response.status !== 200) return {
                error: 'Error al obtener los datos de la página de la UFC'
            };
            return response.data;
        }
        catch(error){
            console.error('Error al obtener los datos de la página de la UFC:', error);
            return {error: 'Error al obtener los datos de la página de la UFC'};
        }
    }
}