import bcrypt from 'bcryptjs';
import pkg from 'lodash';
import { db } from '../Database/db.mjs'; 

const { omit } = pkg;

export class ModelUsers {
    // Método para registrar un nuevo usuario
    static async registerUser({userData}){
        if(!userData) return {message: 'La información del usuario no fue propocionada'}
        const {name_user, email_user, username, password_user} = userData
        // Se verifica si ya existe un usuario con ese email
        const existingUser = await db.query(
            `SELECT * FROM users WHERE email_user = $1 OR username = $2`,
            [email_user, username]
        );
        if(existingUser.rowCount > 0) return {Exist: 'Ya existe un usuario con ese email o apodo'};
        // Si no se inserta al nuevo usuario al sistema
        const hashedPassword = await bcrypt.hash(password_user, 10);
        const newUser = await db.query(
            `INSERT INTO users(name_user,email_user,password_user,username) VALUES
            ($1,$2,$3,$4)  RETURNING *`, [name_user, email_user, hashedPassword, username]
        )
        if(newUser.rowCount === 0) return {error: 'Hubo un error al registrar al usuario'}
        const sanitizedUser = omit(newUser.rows[0], ['id', 'password_user', 'created_at', 'image_user']);
        return {data: sanitizedUser, message: 'Usuario creado correctamente'}
    }

    // Método para loguear a un usuario
    static async LoginUser({LoginData}){
        if(!LoginData) return {message: 'No fue propocionado los datos del usuario necesarios para el login'}
        const {email_user, password_user} = LoginData
        // Se verifica si existe el usuario
        const existingUser = await db.query(
            `SELECT * FROM users WHERE email_user = $1`,
            [email_user]
        );
        if(existingUser.rowCount === 0) return {error: 'No existe un usuario con ese email'};
        // Si existe el usuario se verifica la contraseña
        const user = existingUser.rows[0];
        const isPasswordValid = await bcrypt.compare(password_user, user.password_user);
        if(isPasswordValid){
            const sanitizedUser = omit(user, ['id', 'password_user', 'created_at', 'image_user']);
            // Se comprueba si el usuario ya habido iniciado sesión antes
            const existingLogin = await db.query(
                `SELECT * FROM login_sessions WHERE user_id = $1`,
                [user.id]
            );
            if(existingLogin.rowCount > 0){
                // Se actualiza la sesión existente
                await db.query(
                    `UPDATE login_sessions SET is_active = true WHERE user_id = $1`,
                    [user.id]
                );
                return {data: sanitizedUser, message: 'Usuario logueado correctamente'};
            }
            // Si no existe se crea una nueva sesión
            else{
                await db.query(
                    `INSERT INTO login_sessions(user_id, is_active) VALUES($1, true)`,
                    [user.id]
                );
                return {data: sanitizedUser, message: 'Usuario logueado correctamente'};
            }
        }
        return {error: 'Contraseña incorrecta'};
    }

    // Método para cerrar la sesión de un usuario
    static async LogoutUser({email_user}){
        if(!email_user) return {message: 'No fue propocionado el email del usuario necesario para el logout'}
        // Se verifica si existe dicho usuario
        const existingUser = await db.query(
            `SELECT email_user, id FROM users WHERE email_user = $1`,
            [email_user]
        );
        if(existingUser.rowCount === 0) return {error: 'No existe un usuario con ese email'};
        // Si existe el usuario se cierra su sesión
        const userId = existingUser.rows[0].id
        const LogoutSesion = await db.query(
            `UPDATE login_sessions SET is_active = false WHERE user_id = $1 AND is_active = true`,
            [userId]
        );
        if(LogoutSesion.rowCount === 0) return {error: 'El usuario no tiene una sesión activa'};
        return {OutLogout: 'Sesión cerrada correctamente'};
    }
}