export const useSorting = <T>(items: T[], keySort: keyof T, isDesc: boolean) => {
    const sortedItems = isDesc ? items.sort((a: T, b: T) => a[keySort] > b[keySort] ? 1 : -1) : items.sort((a: T, b: T) => a[keySort] < b[keySort] ? 1 : -1);
        
    return sortedItems;
}
