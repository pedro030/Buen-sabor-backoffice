import { Order } from "../../../models/Order";

interface props {
  obj: {
    id: string,
    type: string
  }
}
const SectionInfo = ({ obj }: props) => {
  return (
    <>
      <span className='card-name'>{obj.type}</span>
    </>
  )
}

export default SectionInfo