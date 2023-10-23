export interface PaginationProps<T> {
    items: T[],
    currentPage: number,
    setCurrentPage: (page: number) => void,
    pages: number[],
    objetsPerPage: number,
}