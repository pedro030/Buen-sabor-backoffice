import { Order } from "../../../models/Order";

interface props {
  obj: {
    id: string,
    name: string
  }
}
const SectionInfo = ({ obj }: props) => {
  return (
    <>
      <span className='card-name'>{obj.name}</span>
    </>
  )
}

export default SectionInfo