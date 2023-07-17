import UserForm from "../../components/modals/user_form/UserForm"
import { User } from "../../models/User"
import { useSelector } from "react-redux"
import { loadUsers } from "../../state/actions/userActions"
import { userSelector } from "../../state/selectors"
import CrudCard from "../../components/crud_components/crud_card/CrudCard"
import { UserService } from '../../services/User'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';

function User() {

  const user = useSelector(userSelector)
  const userService = new UserService()

  return (
    <div className="m-4">
      <CrudCreateButton Modal={UserForm} Title='Users' />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Users</h2>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Mail</th>
              <th>Password</th>
              <th>Rol</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {user.map((userItem: User, i: number) => (
              <tr key={i}>
                <td>{userItem.firstName}</td>
                <td>{userItem.lastName}</td>
                <td>{userItem.mail}</td>
                <td>{userItem.password}</td>
                <td>{userItem.rol.rol}</td>
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
    // <>
    //       {/* <CrudHead/> */}
    //       <CrudCreateButton Modal={UserForm} Title='User'/>
    //       <div className="th-container">
    //         <span>FIRST_NAME</span>
    //         <span>LAST_NAME</span>
    //         <span></span>
    //         <span>MAIL</span>
    //         <span>PASSWORD</span>
    //         <span>ROL</span>
    //       </div>
    //       { user && user[0] && user.map((cat:User) => {
    //         return <CrudCard
    //         key={cat.id}
    //         obj={cat}
    //         EditModal={UserForm}
    //         loadAction={loadUsers}
    //         apiServ={userService}
    //         DeleteModal={CrudDeleteModal}
    //         modelo='User'
    //         />
    //       })}
    // </>
  )
}

export default User