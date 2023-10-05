import { usePagination } from "../../hooks/usePagination";

interface PaginationProps<T> {
    items: T[],
    currentPage: number,
    setCurrentPage: (page: number) => void,
    pages: number[],
    objetsPerPage: number,
}

function Pagination <T>({ items, currentPage, setCurrentPage, pages, objetsPerPage }: PaginationProps<T>) {

    return(
        <>
        {
            (items.length > 0) && <div className='mt-5 join'>
            <button className="join-item btn btn-sm max-lg:btn-xs" onClick={() => currentPage > 1 ? setCurrentPage(currentPage - 1) : ''}>«</button>
            {pages.map((page: any, index: any) => {
              return <input key={index} className="join-item btn btn-sm max-lg:btn-xs btn-square" type="radio" name="options" aria-label={index + 1} onClick={() => setCurrentPage(page)} checked={currentPage === page} />
            })}
            <button className="join-item btn btn-sm max-lg:btn-xs" onClick={() => currentPage < Math.ceil(items.length / objetsPerPage) ? setCurrentPage(currentPage + 1) : ''}>»</button>
          </div>
        }
        </>
    )
}

export default Pagination;