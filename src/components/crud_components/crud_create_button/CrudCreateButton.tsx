// React
import { useState, FC } from 'react'

// Assets
import { AiOutlineReload } from 'react-icons/ai'
import { IoIosAddCircleOutline } from 'react-icons/io'

interface PropsModal {
  open: boolean,
  onClose: () => void,
  watch: boolean
}
interface Props {
  Modal: FC<PropsModal>
  Title: string
}
const CrudCreateButton = ({ Modal, Title }: Props) => {
  const [open, setOpen] = useState<boolean>(false)

  const aux: boolean = (Title === "Re-Stock")

  return (
    <div>
      <button className={`btn ${aux ? 'btn-secondary' : 'btn-primary'}`} onClick={() => setOpen(true)}>
        {(aux) ? <><AiOutlineReload /> {Title}</> : <><IoIosAddCircleOutline className="w-5 h-5" />Add {Title}</>}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} watch={false}/>
    </div>
  )
}

export default CrudCreateButton