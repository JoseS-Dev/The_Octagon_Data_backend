import { validateUser, validateLogin, validateUpdateUser } from "../Validations/SchemaUsers.mjs";
import { generateToken } from "../Middlewares/VerifyAuth.mjs";

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
            const LoginUser = await this.ModelUsers.LoginUser({LoginData: validation.data});
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
            console.log(error)
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

    // Controlador para obtener a todos los usuarios
    getAllUsers = async (req, res) => {
        try{
            const allUsers = await this.ModelUsers.getAllUsers();
            if(allUsers.error) return res.status(500).json({error: allUsers.error});
            return res.status(200).json({
                message: allUsers.message,
                data: allUsers.data
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor'});
        }
    }

    // Controlador para obtener a un usuario por su ID
    getUserById = async (req, res) => {
        const {id} = req.params;
        try{
            if(!id) return res.status(400).json({error: 'El ID del usuario es requerido'});
            const user = await this.ModelUsers.getUserById({id});
            if(user.error) return res.status(404).json({error: user.error});
            return res.status(200).json({
                message: user.message,
                data: user.data
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor'});
        }
    }

    // Controlador para actualizar la información de un usuario
    updateUser = async (req, res) => {
        if(!req.file) return res.status(400).json({error: 'No se ha subido ninguna imagen'});
        const { id } = req.params;
        const DataUser = {
            ...req.body,
            image_user: req.file.path
        };
        const validation = validateUpdateUser(DataUser);
        try{
            if(!validation.success) return res.status(400).json({error: validation.error.errors});
            const updateUser = await this.ModelUsers.updateUser({id, updateData: validation.data});
            if(updateUser.error) return res.status(400).json({error: updateUser.error});
            return res.status(200).json({
                message: updateUser.message,
                data: updateUser.data
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor'});
        }
    }
}