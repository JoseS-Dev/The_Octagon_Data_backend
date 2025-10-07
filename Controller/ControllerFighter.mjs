export class ControllerFighter {
    constructor({ModelFighters}){
        this.ModelFighters = ModelFighters;
    }
    // Controlador para cargar los luchadores desde la página de la UFC
    loadFightersFromUFC = async (req, res) => {
        try{
            const result = await this.ModelFighters.loadFightersFromUFC();
        }
        catch(error){
            console.error(error);
            return res.status(500).json({error: 'Error del servidor'});
        }
    }
}