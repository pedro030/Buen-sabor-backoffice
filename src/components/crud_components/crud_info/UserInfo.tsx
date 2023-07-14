import { Order } from "../../../models/Order";
import { Rol } from "../../../models/Rol";

interface props {
  obj: {
    id: string,
    firstName: string,
    lastName: string,
    mail: string,
    password: string,
    rol: Rol
  }
}
const UserInfo = ({ obj }: props) => {
  return (
    <>
      <span className='card-name'>{obj.firstName}</span>
      <span className='card-name'>{obj.lastName}</span>
      <span className='card-name'>{obj.mail}</span>
      <span className='card-name'>{obj.password}</span>
      <span className='card-name'>{obj.rol.rol}</span>
    </>
  )
}

export default UserInfo