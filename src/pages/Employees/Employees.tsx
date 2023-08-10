import AddressForm from "../../components/modals/address_form/AddressForm"
import { Address } from "../../models/Address"
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';
import { useSelector } from "react-redux";
import { UserService } from "../../services/User";
import { userSelector } from "../../state/selectors";
import User from "../User/User";
import UserForm from "../../components/modals/user_form/UserForm";


const Employees = () => {

    
  const user = useSelector(userSelector)
  const userService = new UserService()
  const employees = user.filter((e:User) => e.rol?.rol != 'Client');

    return (
        <>
            <div className="m-4">
                <CrudCreateButton Modal={UserForm} Title='Employee' />
                <h2 className='my-2 text-lg font-bold text-center stat-title'>Employees</h2>
                <div className="overflow-x-auto h-[35rem]">
                    <table className="table table-xs table-pin-rows ">
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Mail</th>
                                <th>Password</th>
                                <th>Rol</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee: User, i: number) => (
                                <tr key={i}>
                                    <td>{employee.firstName + '  ' + employee.lastName}</td>
                                    <td>{employee.mail}</td>
                                    <td>{employee.password}</td>
                                    <td>{employee.rol?.rol}</td>
                                    <td>
                                        <div className='flex gap-2'>
                                            <RiEyeLine className='w-5 h-5 eye-icon' />
                                            <FiEdit2 className='w-5 h-5 edit-icon' />
                                            <RiDeleteBin6Line className='w-5 h-5 delete-icon' />
                                        </div>
                                    </td>
                                </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Employees