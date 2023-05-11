import React from 'react'
import { useDispatch } from 'react-redux'
import { ApiServ } from '../../../services/ApiServ'
import './CrudDeleteModal.scss'

interface Props {
    obj: any,
    open: boolean,
    onClose: () => void
    apiServ: ApiServ<any>
    loadAction: (items: any[]) => any
}
const CrudDeleteModal = ({ obj: obj, open, onClose, loadAction, apiServ }: Props) => {
    if (!open) return null
    const dispatch = useDispatch()

    const handleDelete = () => {
        apiServ.deleteObj(obj)
        .then(()=>{
          apiServ.GetAll()
          .then(data => {
            dispatch(loadAction(data))
          })
        })
        .finally(()=>{
          onClose();
        })
    }
  return (
    <div className='overlay' onClick={() => onClose()}>
        <div className='modal-container' onClick={(e) => { e.stopPropagation() }}>
          <h3>Are you sure you want to delete it?</h3>
          <div className="buttons">
            <span className='btn btn-principal' onClick={handleDelete}>Delete</span>
            <span className='btn btn-cancel' onClick={() => onClose()}>Cancel</span>
          </div>
        </div>
    </div>
  )
}

export default CrudDeleteModal