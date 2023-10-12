// React
import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react"

// Redux
import { useDispatch, useSelector } from "react-redux"
import { loadCategories } from "../../state/actions/categoryActions"
import { categoriesSelector } from "../../state/selectors"

//Services
import { CategoryService } from '../../services/Category'

// Hooks
import { useSortingStates } from "../../hooks/useSortingStates"
import { useSorting } from "../../hooks/useSorting"

// Components
import CategoryForm from "../../components/modals/category_form/CategoryForm"
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'

// Types
import { Category } from "../../models/Category"

// Assets
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';
import { useCrudActions } from "../../hooks/useCrudActions"


function CategoriesCRUD() {

  const dispatch = useDispatch()
  const category: Category[] = useSelector(categoriesSelector)
  const categoryService = new CategoryService()

  const [selectedItem, setSelectedItem] = useState<Category>()
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [watchInfo, setWatchInfo] = useState<boolean>(false);

  //Filters
  const [filters, setFilters] = useState({
    search: "",
    parentCategory: ''
  })

  const filterCategories = (categories: Category[]) => {
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

  const categories: Category[] = filterCategories(category)

  //Search
  const [search, setSearch] = useState<string>('')

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value
    setSearch(s)

    if (s == '') setFilters((prevState: any) => ({
      ...prevState,
      search: ''
    }))
  }

  const searchOnEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setFilters((prevState: any) => ({
        ...prevState,
        search: search
      }))
    }
  }

  //Sorting
  const { sortedItems, setSortedItems, currentSorting, isAsc, handleChangeSorting } = useSortingStates(categories, 'id');

  useEffect(() => {
    setSortedItems(useSorting(categories, currentSorting, isAsc));
  }, [filters, category])


  const handleDelete = (category: Category) => {
    const { deleteObjectAlerts } = useCrudActions(category, categoryService, 'category', dispatch, loadCategories, () => setEditModalOpen(false))
    deleteObjectAlerts()
  }

  const handleEdit = (category: Category) => {
    setSelectedItem(category);
    setEditModalOpen(true);
  }

  const handleWatch = (category: Category) => {
    setWatchInfo(true);
    setSelectedItem(category);
    setEditModalOpen(true);
  }

  return (
    <div className="mx-4 mt-4">
      <CrudCreateButton Modal={CategoryForm} Title='Category' />
      <CategoryForm
        obj={selectedItem}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        watch={watchInfo}
      />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Categories</h2>
      <details className="mb-10 dropdown lg:hidden">
  <summary className="m-1 btn btn-primary btn-wide btn-sm">Filter</summary>
  <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-80  ">
    <li><input type="text" placeholder='NAME' className=" input" onChange={handleChangeSearch} value={search} onKeyDown={searchOnEnter} />
</li>
    <li><select className="w-full h-full max-w-xs select select-bordered select-sm" onChange={handleChangeSorting}>
          <option selected value={'id true'}>SORT BY: FEATURED</option>
          <option value={'name true'}>SORT BY NAME: A - Z</option>
          <option value={'name false'}>SORT BY NAME: Z - A</option>
        </select></li>
        <li><select className="w-full h-full max-w-xs select select-bordered select-sm" onChange={handleChangeSubcategory}>
          <option selected value={1}>SUBCATEGORY: STANDARD</option>
          <option value={2}>SUBCATEGORY: EMPTY</option>
        </select></li>
  </ul>
</details>
      <div className="flex items-center justify-center w-full gap-5 my-2 max-lg:hidden">
        <input type="text" placeholder='NAME' className=" input w-[60%] input-sm" onChange={handleChangeSearch} value={search} onKeyDown={searchOnEnter} />
        <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeSorting}>
          <option selected value={'id true'}>SORT BY: FEATURED</option>
          <option value={'name true'}>SORT BY NAME: A - Z</option>
          <option value={'name false'}>SORT BY NAME: Z - A</option>
        </select>
        
        <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeSubcategory}>
          <option selected value={1}>SUBCATEGORY: STANDARD</option>
          <option value={2}>SUBCATEGORY: EMPTY</option>
        </select>
      </div>
      <div className="overflow-x-auto h-[35rem]">
        <table className="z-0 table table-xs table-pin-rows ">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subcategory</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { sortedItems.map((cat: Category, i: number) => (
              <tr key={i}>
                <td>{cat.name}</td>
                <td>{cat.parentCategory?.name}</td>
                <td>
                  <div className='flex gap-2'>
                    <button onClick={() => handleWatch(cat)} className="cursor-pointer"><RiEyeLine className='w-5 h-5 eye-icon' /></button>
                    <button onClick={() => handleEdit(cat)} className="cursor-pointer"><FiEdit2 className='w-5 h-5 edit-icon' /></button>
                    <button onClick={() => handleDelete(cat)} className="cursor-pointer"><RiDeleteBin6Line className='w-5 h-5 delete-icon' /></button>
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoriesCRUD