import './categoriescrud.scss'
import { useEffect } from "react"
import CategoryForm from "../../components/modals/category_form/CategoryForm"
import { Category } from "../../models/Category"
import { useDispatch, useSelector } from "react-redux"
import { loadCategories } from "../../state/actions/categoryActions"
import { categoriesSelector } from "../../state/selectors"
import CrudCard from "../../components/crud_components/crud_card/CrudCard"
import { CategoryService } from '../../services/Category'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'

function CategoriesCRUD() {

  const category = useSelector(categoriesSelector)
  const categoryService = new CategoryService()
  const dispatch = useDispatch()

  useEffect(() => {
    categoryService.GetAll()
    .then((categories) => {
      dispatch(loadCategories(categories))
    })
  }, [])

  return (
    <>
          {/* <CrudHead/> */}
          <CrudCreateButton Modal={CategoryForm} Title='Category'/>
          <div className="th-container">
            <span>Category Name</span>
            <span></span>
            <span></span>
            <span>Subcategory</span>
          </div>
          { category && category[0] && category.map((cat:Category) => {
            return <CrudCard
            key={cat.id}
            obj={cat}
            EditModal={CategoryForm}
            loadAction={loadCategories}
            apiServ={categoryService}
            DeleteModal={CrudDeleteModal}
            modelo='Category'
            />
          })}
    </>
  )
}

export default CategoriesCRUD