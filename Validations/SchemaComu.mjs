import zod from 'zod';

// Defino el esquema de datos de la comunidad
export const communitySchema = zod.object({
    name_community: zod.string().min(2),
    description_community: zod.string().min(10).max(300),
    image_community: zod.string().url().optional(),
    type_community: zod.enum(['public', 'private']),
    created_by: zod.number()
});

// Función que valida los datos de la comunidad
export function validateCommunity(data){
    return communitySchema.safeParse(data);
}