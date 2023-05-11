import React, { useState } from 'react'
import { IoIosAddCircleOutline } from 'react-icons/io'
import './CrudCreateButton.scss'

interface PropsModal {
    open: boolean,
    onClose: () => void
}
interface Props {
    Modal: React.FC<PropsModal>
    Title: string
}
const CrudCreateButton = ({Modal, Title}:Props) => {
    const [open, setOpen] = useState<boolean>(false)

  return (
    <div>
      <button className='btn btn-principal' onClick={() => setOpen(true)}>
        <IoIosAddCircleOutline className="icon-add" />Add {Title}
      </button>
        <Modal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export default CrudCreateButton