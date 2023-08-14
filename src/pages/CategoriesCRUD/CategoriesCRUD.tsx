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


function CategoriesCRUD() {

  const dispatch = useDispatch()
  const category = useSelector(categoriesSelector)
  const categoryService = new CategoryService()
  
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

  return (
    <div className="m-4">
      <CrudCreateButton Modal={CategoryForm} Title='Category' />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Categories</h2>
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
            {category.map((cat: Category, i: number) => (
              <tr key={i}>
                <td>{cat.name}</td>
                <td>{cat.parentCategory?.name}</td>
                <td>
                  <div className='flex gap-2'>
                    <button className="cursor-pointer"><RiEyeLine className='w-5 h-5 eye-icon' /></button>
                    <button className="cursor-pointer"><FiEdit2 className='w-5 h-5 edit-icon' /></button>
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