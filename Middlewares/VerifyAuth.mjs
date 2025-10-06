import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Función para asignar un Token JWT
export function generateToken(user){
    if(!user) return null;
    try{
        const token = jwt.sign(
            {id_user: user.id, email_user: user.email_user, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '4h'}
        );
        return token;
    }
    catch(error){
        return null;
    }
}

// Middleware para verificar el Token JWT
export function verifyToken(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({error: 'No se proporcionó un token de autenticación'});
    }
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(error){
        return res.status(401).json({error: 'Token de autenticación inválido o expirado'});
    }
}