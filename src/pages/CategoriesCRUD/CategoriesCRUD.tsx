import Sidebar from "../../components/sidebar_employee/Sidebar"
import SearchBar from "../../components/search_bar/SearchBar"
import './categoriescrud.scss'
import CrudHead from "../../components/crud_header/CrudHead"
import CrudCardCategory from "../../components/crud_card_category/CrudCardCategory"
import { useState, useEffect } from "react"
import CategoryForm from "../../components/modals/category_form/CategoryForm"
import { getCategories } from "../../services/Category"
import { Category } from "../../models/Category"

function CategoriesCRUD() {

  const [category, setCategory] = useState<Category[]>()

  useEffect(() => {
    getCategories().then(cat => {
      setCategory(cat);
    })
  }, [])

  const deleteCategory = (categoryId: string) => {
    const newCategories = category?.filter(cat => cat.id !== categoryId)
    setCategory(newCategories);
  }

  return (
    <div className="container-crud">
        <Sidebar/>
        <div className="container-crud-right">
          <CrudHead/>
          <div className="th-container">
            <span>Category Name</span>
            <span>Status</span>
          </div>
          { category?.map(cat => {
            return <CrudCardCategory key={cat.id} category={cat} deleteCategory={deleteCategory}/>
          })}
        </div>
    </div>
  )
}

export default CategoriesCRUD