// React
import { useState, ChangeEvent } from 'react'

// Hook
import { useSorting } from './useSorting';

// Hook personalizado que proporciona estados y funciones para gestionar el ordenamiento dinámico de una lista de elementos.
// Recibe la lista de elementos a clasificar.
// La clave inicial de ordenamiento.
// Retorna un objeto que contiene la lista ordenada, la clave de ordenamiento actual, la dirección de ordenamiento y una función para cambiar la clave de ordenamiento.
export const useSortingStates = <T>(items: T[], keySort: keyof T) => {
    // State: Se setean los objetos a ordenar.
    const [sortedItems, setSortedItems] = useState<T[]>(items);
    // State: Contiene la clave de ordenamiento actual.
    const [currentSorting, setCurrentSorting] = useState<keyof T>(keySort);
    // State: Direccion de ordenamiento.
    const [isAsc, setIsAsc] = useState<boolean>(true);

    // Handler: Cada vez que se cambie la opcion de un select se trabaja el value del option para realizar el ordenamiento.
    // Cabe destacar que el option debe tener como value la clave de ordenamiento y la direccion de ordenamiento por medio del booleano, ejemplo: "id true" ==> se ordena por ID de forma ascendente.
    const handleChangeSorting = (e: ChangeEvent<HTMLSelectElement>) => {
        const arr: string[] = e.target.value.split(" ");
        const keySort: keyof T = arr[0] as keyof T;
        const isAsc: boolean = JSON.parse(arr[1]);
        setCurrentSorting(keySort);
        setIsAsc(isAsc);
        setSortedItems(useSorting(items, keySort, isAsc))
    }

    return { sortedItems, setSortedItems, currentSorting, isAsc, handleChangeSorting }
}