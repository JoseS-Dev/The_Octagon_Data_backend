export class ControllerFighter {
    constructor({ModelFighters}){
        this.ModelFighters = ModelFighters;
    }
    // Controlador para cargar los luchadores desde la página de la UFC
    loadFightersFromUFC = async (req, res) => {
        try{
            const {id} = req.params;
            const result = await this.ModelFighters.LoadFightersFromUFC({id});
            if(result.error) return res.status(500).json({error: result.error});
            return res.status(200).json({data: result.data});
        }
        catch(error){
            console.error(error);
            return res.status(500).json({error: 'Error al cargar los luchadores desde la página de la UFC'});
        }
    }
}