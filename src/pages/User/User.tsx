import { useEffect } from "react"
import UserForm from "../../components/modals/user_form/UserForm"
import { User } from "../../models/User"
import { useDispatch, useSelector } from "react-redux"
import { loadUsers } from "../../state/actions/userActions"
import { userSelector } from "../../state/selectors"
import CrudCard from "../../components/crud_components/crud_card/CrudCard"
import { UserService } from '../../services/User'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'

function User() {

  const user = useSelector(userSelector)
  const userService = new UserService()
  const dispatch = useDispatch()

  useEffect(() => {
    userService.GetAll()
    .then((users) => {
      dispatch(loadUsers(users))
    })
  }, [])

  return (
    <>
          {/* <CrudHead/> */}
          <CrudCreateButton Modal={UserForm} Title='User'/>
          <div className="th-container">
            <span>FIRST_NAME</span>
            <span>LAST_NAME</span>
            <span></span>
            <span>MAIL</span>
            <span>PASSWORD</span>
            <span>ROL</span>
          </div>
          { user && user[0] && user.map((cat:User) => {
            return <CrudCard
            key={cat.id}
            obj={cat}
            EditModal={UserForm}
            loadAction={loadUsers}
            apiServ={userService}
            DeleteModal={CrudDeleteModal}
            modelo='User'
            />
          })}
    </>
  )
}

export default User