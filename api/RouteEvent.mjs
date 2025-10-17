import { Router } from "express";
import { ControllerScraping } from "../Controller/ControllerScraping.mjs";

const router = Router();
const controllerScraping = new ControllerScraping();
export const RouteEvents = router;

// Ruta para cargar todos los eventos de la UFC
RouteEvents.get('/all', controllerScraping.LoadEventsUFC);