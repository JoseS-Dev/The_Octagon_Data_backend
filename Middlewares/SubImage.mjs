import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { acceptedImage } from '../utils.mjs';

// Función para las configuraciones de Multer
export function configureMulter(directory){
    // Se verifica si existe el directorio
    if(!fs.existsSync(directory)){
        fs.mkdirSync(directory, {recursive: true});
    }
    // Configuración del almacenamiento
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, directory);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    })
    return multer({
        storage: storage,
        limits: {fileSize: 12 * 1024 * 1024}, // Limite de 12MB
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();
            if(!acceptedImage.includes(ext)){
                return cb(new Error('Solo se permiten archivos de imagen'));
            }
            cb(null, true);
        }
    });
}

// Creamos la carpeta
const uploadDir = path.resolve('uploads/users');
const uploadDirComm = path.resolve('uploads/communities');

const uploadUser = configureMulter(uploadDir);
const uploadCommunity = configureMulter(uploadDirComm);

// Middleware para la subida
export const UploadImageUser = uploadUser.single('image_user');
export const UploadImageCommunity = uploadCommunity.single('image_community');