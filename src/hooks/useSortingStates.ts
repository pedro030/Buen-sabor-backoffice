// React
import { useState, ChangeEvent } from 'react'

// Hook
import { useSorting } from './useSorting';

export const useSortingStates = <T>(items: T[], keySort: keyof T) => {
    const [sortedItems, setSortedItems] = useState<T[]>(items);
    const [currentSorting, setCurrentSorting] = useState<keyof T>(keySort);
    const [isAsc, setIsAsc] = useState<boolean>(true);

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