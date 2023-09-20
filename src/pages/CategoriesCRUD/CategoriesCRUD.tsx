// import './categoriescrud.scss'
import CategoryForm from "../../components/modals/category_form/CategoryForm"
import { Category } from "../../models/Category"
import { useDispatch, useSelector } from "react-redux"
import { loadCategories } from "../../state/actions/categoryActions"
import { categoriesSelector } from "../../state/selectors"
import CrudCard from "../../components/crud_components/crud_card/CrudCard"
import { CategoryService } from '../../services/Category'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';
import { useState, useEffect } from "react"
import { usePagination } from "../../hooks/usePagination"


function CategoriesCRUD() {

  const dispatch = useDispatch()
  const category = useSelector(categoriesSelector)
  const categoryService = new CategoryService()

  const [selectedItem, setSelectedItem] = useState<Category>()
  const [editModalOpen, setEditModalOpen] = useState(false)

  //Filters
  const [filters, setFilters] = useState({
    search: "",
    parentCategory: ''
  })

  const filterCategories = (categories: any) => {
    return categories.filter((c: any) => {
      return (
        (c.name.toLowerCase().includes(filters.search.toLowerCase()))
        &&
        (filters.parentCategory === '' || c.parentCategory === filters.parentCategory)
        )
    })
  }

  const handleChangeSubcategory = (e: any) => {
    const subcatOpc = +e.target.value;
    if (subcatOpc === 1) {
      setFilters((prevState: any) => ({
        ...prevState,
        parentCategory: ''
      }));
    } else if (subcatOpc === 2) {
      setFilters((prevState: any) => ({
        ...prevState,
        parentCategory: null
      }))
    }
  }

  const categories = filterCategories(category)

  //Search
  const [search, setSearch] = useState('')

  const handleChangeSearch = (e: any) => {
    const s = e.target.value
    setSearch(s)

    if (s == '') setFilters((prevState: any) => ({
      ...prevState,
      search: ''
    }))
  }

  const searchOnEnter = (e: any) => {
    if (e.key === 'Enter') {
      setFilters((prevState: any) => ({
        ...prevState,
        search: search
      }))
    }
  }

  //Sorting
  const [sortedCategories, setSortedCategories] = useState([]);
  const [currentSorting, setCurrentSorting] = useState(1);

  const sortCategories = (categories: any, sortOp: number) => {
    switch (sortOp) {
      case 1: setSortedCategories(categories);
        break;

      case 2: setSortedCategories(categories.sort((a: any, b: any) => a.name > b.name ? 1 : -1))
        break;

      case 3: setSortedCategories(categories.sort((a: any, b: any) => a.name < b.name ? 1 : -1))
        break;
    }
  }

  const handleChangeSorting = (e: any) => {
    const sortOp = +e.target.value;
    setCurrentSorting(sortOp);
    sortCategories(categories, sortOp);
  }

  //Pagination
  const [currentObjects, currentPage, objetsPerPage, pages, setCurrentPage] = usePagination(sortedCategories)


  useEffect(() => {
    setCurrentPage(1);
    sortCategories(categories, currentSorting);
  }, [filters])


  const handleDelete = (state: Category) => {
    if (confirm(`You want to delete this item?`)) {
      categoryService.deleteObj(state)
        .then(() => {
          categoryService.GetAll()
            .then((res: Category[]) => {
              dispatch(loadCategories(res))
            })
        })
    }
  }

  const handleEdit = (c: Category) => {
    setSelectedItem(c);
    setEditModalOpen(true);
  }

  return (
    <div className="mx-4 mt-4">
      <CrudCreateButton Modal={CategoryForm} Title='Category' />
      <CategoryForm
        obj={selectedItem}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Categories</h2>
      <div className="flex items-center justify-center w-full gap-5 my-2">
        <input type="text" placeholder='NAME' className=" input w-[60%] input-sm" onChange={handleChangeSearch} value={search} onKeyDown={searchOnEnter} />
        <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeSorting}>
          <option selected value={1}>SORT BY: FEATURED</option>
          <option value={2}>SORT BY NAME: A - Z</option>
          <option value={3}>SORT BY NAME: Z - A</option>
        </select>
        
        <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeSubcategory}>
          <option selected value={1}>SUBCATEGORY: STANDARD</option>
          <option value={2}>SUBCATEGORY: EMPTY</option>
        </select>
      </div>
      <div className="overflow-x-auto h-[35rem]">
        <table className="table table-xs table-pin-rows ">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subcategory</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentObjects.map((cat: Category, i: number) => (
              <tr key={i}>
                <td>{cat.name}</td>
                <td>{cat.parentCategory?.name}</td>
                <td>
                  <div className='flex gap-2'>
                    <button className="cursor-pointer"><RiEyeLine className='w-5 h-5 eye-icon' /></button>
                    <button onClick={() => handleEdit(cat)} className="cursor-pointer"><FiEdit2 className='w-5 h-5 edit-icon' /></button>
                    <button onClick={() => handleDelete(cat)} className="cursor-pointer"><RiDeleteBin6Line className='w-5 h-5 delete-icon' /></button>
                  </div>
                </td>
              </tr>))}
          </tbody>
          <tfoot>
            {
              (category.length > 0) && <div className='mt-5 join'>
                <button className="join-item btn btn-sm max-lg:btn-xs" onClick={() => currentPage > 1 ? setCurrentPage(currentPage - 1) : ''}>«</button>
                {pages.map((page: any, index: any) => {
                  return <input key={index} className="join-item btn btn-sm max-lg:btn-xs btn-square" type="radio" name="options" aria-label={index + 1} onClick={() => setCurrentPage(page)} checked={currentPage === page} />
                })}
                <button className="join-item btn btn-sm max-lg:btn-xs" onClick={() => currentPage < Math.ceil(category.length / objetsPerPage) ? setCurrentPage(currentPage + 1) : ''}>»</button>
              </div>
            }
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default CategoriesCRUD