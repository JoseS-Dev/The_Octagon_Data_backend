import zod from 'zod';

// Esquema de validación a la hora de marcar o desmarcar un luchador como favorito
export const SchemaToggleFavorite = zod.object({
    user_id: zod.number().positive(),
    fighter_id: zod.number().positive(),
    is_favorite: zod.boolean().optional()
});

// Function para validar los datos de marcar o desmarcar un luchador como favorito
export function validateToggleFavorite(data){
    return SchemaToggleFavorite.safeParse(data);
}