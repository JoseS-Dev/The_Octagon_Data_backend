import { LoadExtraFighterDataFromUFC, LoadAllFightersFromUFC } from "../Scraping/FightersScraping.mjs";

export class ControllerScraping {
    // Controlador para cargar los datos extras de un luchador
    loadExtraFighterData = async (req, res) => {
        try{
            const fightersExtras = await LoadExtraFighterDataFromUFC();
            if(fightersExtras.error) return res.status(500).json({error: fightersExtras.error});
            return res.status(200).json({
                message: fightersExtras.message,
                details: fightersExtras.details
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error al cargar los datos extras de los luchadores'});
        }
    }
}