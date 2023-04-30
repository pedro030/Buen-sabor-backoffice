import './crudcardcategory.scss'
import { FiEdit2 } from 'react-icons/fi'
import { TbLockOpen, TbLock } from 'react-icons/tb'
import { RiDeleteBin6Line } from 'react-icons/ri'
import CategoryForm from '../modals/category_form/CategoryForm'
import { useState } from 'react'
import { updateCategory } from '../../services/Category'

function CrudCardCategory({category} : any) {
  const [openForm, setOpenForm] = useState(false)
  const handleActive = () => {
    updateCategory({
      ...category,
      active: !category.active
    })
  }

  return (
    <div className='card-container-crud'>
        <div className='card-container-info'>
            <span className='card-name'>{category.name}</span>
            {category.active ? <span className='card-status-active'>Active</span> : <span className='card-status-inactive'>Inactive</span>}
        </div>
        <div className='card-crud-opc'>
            <FiEdit2 className='edit-icon' onClick={()=>setOpenForm(true)}/>
        {category.active ? <TbLockOpen className='status-iconUnlck' onClick={() => handleActive()} /> : <TbLock className='status-iconLock' onClick={() => handleActive()} />}
            {/* <RiDeleteBin6Line className='delete-icon' onClick={() => deleteCategory(category.id)}/> */}
        </div>
      <CategoryForm open={openForm} onClose={() => setOpenForm(false)} category={category}/>
    </div>
  )
}

export default CrudCardCategory