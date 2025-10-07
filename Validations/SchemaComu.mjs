import zod from 'zod';

// Defino el esquema de datos de la comunidad
export const communitySchema = zod.object({
    name_community: zod.string().min(2),
    description_community: zod.string().min(10).max(300),
    image_community: zod.string().url().optional(),
    type_community: zod.enum(['public', 'private']),
    created_by: zod.number()
});

// Defino el esquema para los datos a la hora de banear a un usuario
export const banUserSchema = zod.object({
    community_id: zod.number(),
    user_id: zod.number(),
    banned_text: zod.string().min(5).max(200)
});

// Función que valida los datos de la comunidad
export function validateCommunity(data){
    return communitySchema.safeParse(data);
}

// Función que valida los datos de la comunidad para actualización
export function validateCommunityUpdate(data){
    return communitySchema.partial().safeParse(data);
}

// Función que valida los datos para banear a un usuario
export function validateBanUser(data){
    return banUserSchema.safeParse(data);
}