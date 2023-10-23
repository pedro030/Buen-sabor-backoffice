import { PaginationProps } from "../../interfaces/IPaginationProps";

function Pagination <T>({ items, currentPage, setCurrentPage, pages, objetsPerPage }: PaginationProps<T>) {

    return(
        <>
        {
            (items.length > 0) && <div className='mt-5 join'>
            <button className="join-item btn btn-sm max-lg:btn-xs" onClick={() => currentPage > 1 ? setCurrentPage(currentPage - 1) : ''}>«</button>
            {pages.map((page: number, index: number) => {
              return <input key={index.toString()} className="join-item btn btn-sm max-lg:btn-xs btn-square" type="radio" name="options" aria-label={(index + 1).toString()} onClick={() => setCurrentPage(page)} checked={currentPage === page} />
            })}
            <button className="join-item btn btn-sm max-lg:btn-xs" onClick={() => currentPage < Math.ceil(items.length / objetsPerPage) ? setCurrentPage(currentPage + 1) : ''}>»</button>
          </div>
        }
        </>
    )
}

export default Pagination;