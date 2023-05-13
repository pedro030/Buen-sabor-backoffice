import { Order } from "../../../models/Order";
import { Rol } from "../../../models/Rol";

interface props {
  obj: {
    id: string,
    first_name: string,
    last_name: string,
    mail: string,
    password: string,
    rol: Rol
  }
}
const UserInfo = ({ obj }: props) => {
  return (
    <>
      <span className='card-name'>{obj.first_name}</span>
      <span className='card-name'>{obj.last_name}</span>
      <span className='card-name'>{obj.mail}</span>
      <span className='card-name'>{obj.password}</span>
      <span className='card-name'>{obj.rol.name}</span>
    </>
  )
}

export default UserInfo