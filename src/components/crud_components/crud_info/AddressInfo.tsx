import { User } from "../../../models/User";
import { Location } from "../../../models/Location";

interface props {
  obj: {
    id: string,
    streat: string,
    number: number
    location: Location,
    user: User
  }
}
const AddressInfo = ({ obj }: props) => {
  return (
    <>
      <span className='card-name'>{obj.streat}</span>
      <span className='card-name'>{obj.number}</span>
      <span className='card-name'>{obj.location.location}</span>
      <span className='card-name'>{obj.user.id}</span>
    </>
  )
}

export default AddressInfo