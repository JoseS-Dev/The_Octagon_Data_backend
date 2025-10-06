import zod from 'zod';

// Defino el esquema de datos del usuario
export const userSchema = zod.object({
    name_user: zod.string().min(2),
    email_user: zod.string().email(),
    password_user: zod.string().min(6),
    username: zod.string().min(2),
    image_user: zod.string().url().optional()
});

// Defino el esquema de datos para el login
export const loginSchema = zod.object({
    email_user: zod.string().email(),
    password_user: zod.string().min(6)
})

// Función que valida los datos del usuario
export function validateUser(data){
    return userSchema.safeParse(data);
}

// Función que valida los datos del login
export function validateLogin(data){
    return loginSchema.safeParse(data);
}