// React
import { useState } from 'react'

// Interface
import { ICrudCreateButtonProps } from '../../../interfaces/ICrudCreateButtonProps'

// Assets
import { IoIosAddCircleOutline } from 'react-icons/io'

const CrudCreateButton = ({ Modal, Title }: ICrudCreateButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <button className='w-full btn btn-primary lg:btn-wide' onClick={() => setOpen(true)}>
        <IoIosAddCircleOutline className="w-5 h-5" />Add {Title}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} watch={false}/>
    </div>
  )
}

export default CrudCreateButton