import React, { useState } from 'react'
import './CrudCard.scss'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';
import { ApiServ } from '../../../services/ApiServ';
import MeasureInfo from '../crud_info/MeasureInfo';
import IngredientInfo from '../crud_info/IngredientInfo';
import CategoryInfo from '../crud_info/CategoryInfo';
import ProductInfo from '../crud_info/ProductInfo';
import OrderInfo from '../crud_info/OrderInfo';
import BillInfo from '../crud_info/BillInfo';
import UserInfo from '../crud_info/UserInfo';
import SectionInfo from '../crud_info/SectionInfo';

// prototipo de lo que tiene que recibir el modal de edicion
interface PropsModal {
    obj: {
        id: string;
    }
    open: boolean,
    onClose: () => void
}
// las props que recibe el modal para editar
interface Props {
    obj:any
    // modalForm para editar el obj
    EditModal: React.FC<PropsModal>
    // modal para eliminar
    DeleteModal: React.FC<any>
    // instancia de api serv
    apiServ: ApiServ<any>
    // es la accion que guarda los datos en el reducer
    loadAction: (items: any[]) => any
    modelo: string;
}
const CrudCard = ({obj, EditModal, apiServ, loadAction, DeleteModal, modelo}:Props) => {
    const [open, setOpen]=useState<boolean>(false)
    const [openDelete, setOpenDelete] = useState<boolean>(false)

  return (
      <div className='card-container-crud'>
          <div className='card-container-info'>
              {modelo === "Measure" && <MeasureInfo obj={obj}/>}
              {modelo === "Ingredient" && <IngredientInfo obj={obj}/>}
              {modelo === "Category" && <CategoryInfo obj={obj}/>}
              {modelo === "Product" && <ProductInfo obj={obj}/>}
              {modelo === "Order" && <OrderInfo obj={obj}/>}
              {modelo === "Bill" && <BillInfo obj={obj}/>}
              {modelo === "User" && <UserInfo obj={obj}/>}
              {modelo === "Section" && <SectionInfo obj={obj}/>}
          </div>
          <div className='card-crud-opc'>
            <RiEyeLine className='eye-icon' onClick={()=>console.log("open detail")}/>
            <FiEdit2 className='edit-icon' onClick={() => setOpen(true)} />
            <RiDeleteBin6Line className='delete-icon' onClick={() => setOpenDelete(true)}/>
          </div>
          <EditModal open={open} onClose={() => setOpen(false)} obj={obj}/>
          <DeleteModal obj={obj} open={openDelete} onClose={() => setOpenDelete(false)} loadAction={loadAction} apiServ={apiServ}/>
      </div>
  )
}

export default CrudCard