import { validateUser, validateLogin } from "../Validations/SchemaUsers.mjs";
import { generateToken } from "../Middlewares/VerifyAuth.mjs";
import { is } from "zod/locales";

export class ControllerUser {
    constructor({ModelUsers}){
        this.ModelUsers = ModelUsers;
    }
    // Controlador para registrar un nuevo usuario
    registerUser = async (req, res) => {
        const validation = validateUser(req.body);
        try{
            if(!validation.success) return res.status(400).json({error: validation.error.errors});
            const registerUser = await this.ModelUsers.registerUser({userData: validation.data});
            if(registerUser.error || registerUser.Exist) return res.status(400 || 409).json({
                error: registerUser.error || registerUser.Exist
            })
            return res.status(201).json({
                message: registerUser.message,
                data: registerUser.data
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor'});
        }
    }

    // Controlador para loguear a un usuario
    LoginUser = async (req, res) => {
        const validation = validateLogin(req.body);
        try{
            if(!validation.success) return res.status(400).json({error: validation.error.errors});
            const LoginUser = await this.ModelUsers.LoginData({LoginData: validation.data});
            if(LoginUser.error) return res.status(400).json({
                error: LoginUser.error
            })
            return res.status(200).json({
                message: LoginUser.message,
                data: LoginUser.data,
                token: generateToken(LoginUser.data)
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor'});
        }
    }

    // Controlador para cerrar la sesión de un usuario
    LogoutUser = async (req, res) => {
        const {email_user} = req.body;
        try{
            if(!email_user) return res.status(400).json({error: 'El email del usuario es requerido'});
            const logoutUser = await this.ModelUsers.LogoutUser({email_user});
            if(logoutUser.message) return res.status(400).json({message: logoutUser.message});
            if(logoutUser.error) return res.status(500).json({error: logoutUser.error});
            return res.status(200).json({OutLogout: logoutUser.OutLogout});
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor'});
        }
    }

    // Controlador para verificar el token de un usuario
    verifyAuth = async (req, res) => {
        if(!req.user) return res.status(401).json({error: 'No autenticado', isAuth: false});
        return res.status(200).json({message: 'Autenticado', isAuth: true});
    }
}