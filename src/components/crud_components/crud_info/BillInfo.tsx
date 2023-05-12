import { Order } from "../../../models/Order";

interface props {
  obj: {
    id: string,
    date: string,
    order: Order
  }
}
const BillInfo = ({ obj }: props) => {
  return (
    <>
      <span className='card-name'>{obj.date}</span>
      <span className='card-name'>{obj.order.id}</span>
    </>
  )
}

export default BillInfo