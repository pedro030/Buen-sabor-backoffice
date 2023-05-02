import SearchBar from "../search_bar/SearchBar"
import { IoIosAddCircleOutline } from 'react-icons/io'
import { CiFilter } from 'react-icons/ci'
import './crudhead.scss'
import { useState } from "react"
import CategoryForm from "../modals/category_form/CategoryForm"

function CrudHead() {
  const [openForm, setOpenForm] = useState(false)
  return (
    <div className="crud-container-head">
        <CategoryForm open={openForm} onClose={() => setOpenForm(false)} />
        <div className="crud-name">Category</div>
        <div className="search-bar"><SearchBar/></div>
        <div className="btn-container">
            <button className="btn-filter"><CiFilter className="icon-filter" />Filter</button>
            <button className="btn-add" onClick={()=>setOpenForm(true)}><IoIosAddCircleOutline className="icon-add" />Add Category</button>
        </div>
    </div>
  )
}

export default CrudHead