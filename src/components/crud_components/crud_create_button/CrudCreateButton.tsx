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
      <button className='btn btn-primary' onClick={() => setOpen(true)}>
        <IoIosAddCircleOutline className="w-5 h-5" />Add {Title}
      </button>
        <Modal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export default CrudCreateButton