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
import { useState } from "react"


function CategoriesCRUD() {

  const dispatch = useDispatch()
  const category = useSelector(categoriesSelector)
  const categoryService = new CategoryService()

  const [selectedItem, setSelectedItem] = useState<Category>()
  const [editModalOpen, setEditModalOpen] = useState(false)

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
    <div className="m-4">
      <CrudCreateButton Modal={CategoryForm} Title='Category' />
      <CategoryForm
        obj={selectedItem}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Categories</h2>
      <div className="flex items-center justify-center w-full gap-5 my-2">
        <input type="text" placeholder='NAME'  className=" input w-[60%] input-sm input-disabled" />
        <select className="w-full max-w-xs select select-bordered select-sm" /*onChange={handleChangeSorting}*/>
                                    <option selected value={1}>SORT BY: FEATURED</option>
                                    <option value={2}>SORT BY PRICE: LOW to HIGH</option>
                                    <option value={3}>SORT BY PRICE: HIGH to LOW</option>
                                    <option value={4}>SORT BY NAME: A - Z</option>
                                    <option value={5}>SORT BY NAME: Z - A</option>
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
            {category.map((cat: Category, i: number) => (
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
        </table>
      </div>
    </div>
  )
}

export default CategoriesCRUD