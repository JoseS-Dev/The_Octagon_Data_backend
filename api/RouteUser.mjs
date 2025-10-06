import { Router } from "express";
import { ControllerUser } from "../Controller/ControllerUser.mjs";
import { ModelUsers } from "../Models/Users.mjs";
import { verifyToken } from "../Middlewares/VerifyAuth.mjs";

const router = Router();
const controllerUser = new ControllerUser({ModelUsers: ModelUsers});
export const RouteUsers = router;

// Ruta para registrar un nuevo usuario
RouteUsers.post('/register', controllerUser.registerUser);
// Ruta para loguear a un usuario
RouteUsers.post('/login', controllerUser.LoginUser);
// Ruta para cerrar la sesión de un usuario
RouteUsers.post('/logout', controllerUser.LogoutUser);
// Ruta protegida para probar el middleware de verificación de token
RouteUsers.post('/verify', verifyToken, controllerUser.verifyAuth);
// Obtener todos los usuarios (ruta protegida)
RouteUsers.get('/', controllerUser.getAllUsers);
// Obtener un usuario por su ID (ruta protegida)
RouteUsers.get('/:id', controllerUser.getUserById);