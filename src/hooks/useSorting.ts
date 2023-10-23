// Hook personalizado para ordenar una lista de elementos de acuerdo a una propiedad del determinado objeto y una dirección (ASC, DESC).
// Recibe la lista de elementos a ordenar.
// La clave por la cual se realizará la clasificación.
// Un valor booleano que indica si la clasificación es descendente (true) o ascendente (false).
// Retorna una nueva lista de elementos ordenada de acuerdo a la clave de clasificación y dirección especificadas.
export const useSorting = <T>(items: T[], keySort: keyof T, isDesc: boolean) => {
    const sortedItems = isDesc ? items.sort((a: T, b: T) => a[keySort] > b[keySort] ? 1 : -1) : items.sort((a: T, b: T) => a[keySort] < b[keySort] ? 1 : -1);
        
    return sortedItems;
}