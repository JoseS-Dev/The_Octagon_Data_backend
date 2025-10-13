import { LoadExtraFighterDataFromUFC, LoadAllFightersFromUFC, 
LoadStatsFighterFromUFC } from "../Scraping/FightersScraping.mjs";

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

    // Controlador para cargar las estadisticas de un luchador
    LoadStatsFighterFromUFC = async (req, res) => {
        const {name_fighter} = req.params;
        try{
            const statsFighter = await LoadStatsFighterFromUFC({name_fighter});
            if(statsFighter.error) return res.status(500).json({error: statsFighter.error});
            return res.status(200).json({
                message: statsFighter.message,
                data: statsFighter.data
            });
        }
        catch(error){
            console.error('Error al cargar las estadisticas del luchador:', error);
            return res.status(500).json({error: 'Error al cargar las estadisticas del luchador'});
        }
    }
}