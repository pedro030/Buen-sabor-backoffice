import { User } from "../../../models/User";
import { Address } from "../../../models/Address";
import { Status } from "../../../models/Status";

interface props {
  obj: {
    id: string;
    date: string;
    withdrawal_mode: string,
    address: Address,
    status: Status,
    user: User, 
  }
}
const OrderInfo = ({ obj }: props) => {
  return (
    <>
      <span className='card-name'>{obj.date}</span>
      <span className='card-name'>{obj.withdrawal_mode}</span>
      <span className='card-name'>{`${obj.address.streat} - ${obj.address.number}`}</span>
      {/* <span className='card-name'>{obj.status.name}</span> */}
      <span className='card-name'>{obj.user.id}</span>
    </>
  )
}

export default OrderInfo