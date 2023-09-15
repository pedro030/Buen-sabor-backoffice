import { title } from 'process'
import React, { useState } from 'react'
import { AiOutlineReload } from 'react-icons/ai'
import { IoIosAddCircleOutline } from 'react-icons/io'
// import './CrudCreateButton.scss'

interface PropsModal {
  open: boolean,
  onClose: () => void
}
interface Props {
  Modal: React.FC<PropsModal>
  Title: string
}
const CrudCreateButton = ({ Modal, Title }: Props) => {
  const [open, setOpen] = useState<boolean>(false)

  const aux: boolean = (Title === "Recargar Stock")

  return (
    <div>
      <button className={`btn ${aux ? 'btn-secondary' : 'btn-primary'}`} onClick={() => setOpen(true)}>
        {(aux) ? <><AiOutlineReload /> {Title}</> : <><IoIosAddCircleOutline className="w-5 h-5" />Add {Title}</>}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export default CrudCreateButton