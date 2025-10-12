// Lista de de archivos aceptados para la subida de imágenes
export const acceptedImage = [
    '.png', '.jpg', '.jpeg', '.gif', '.webp',
    '.avid'
]

// Función para limpiar el contenido HTML
export function cleanElement(el, selector, defaultValue = 'N/A'){
    const element = el.querySelector(selector);
    if(element.textContent == '') return defaultValue;
    return element ? element.textContent.trim() : defaultValue;
}
// Función para limpiar el record del luchador
export function cleanRecord(el, selector, defaultValue = '0-0-0'){
    const element = el.querySelector(selector);
    return element ? element.textContent.split('(')[0].trim() : defaultValue;
}

export const getAltheleURl = (name_fighter) => 'https://www.ufc.com/athlete/' + name_fighter;
export const getAltheleAll = () => 'https://www.ufcespanol.com/athletes/all?filters[0]=location:SE&filters[1]=status:778&page=1';
