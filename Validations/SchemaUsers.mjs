import zod from 'zod';

// Defino el esquema de datos del usuario
export const userSchema = zod.object({
    name_user: zod.string().min(2),
    email_user: zod.string().email(),
    password_user: zod.string().min(6),
    image_user: zod.string().url().optional()
});

// Función que valida los datos del usuario
export function validateUser(data){
    return userSchema.safeParse(data);
}