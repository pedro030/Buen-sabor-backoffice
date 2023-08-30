import UserForm from "../../components/modals/user_form/UserForm"
import { User } from "../../models/User"
import { useSelector } from "react-redux"
import { loadUsers } from "../../state/actions/userActions"
import { rolSelector, userSelector } from "../../state/selectors"
import CrudCard from "../../components/crud_components/crud_card/CrudCard"
import { UserService } from '../../services/User'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';
import { useState, useEffect } from 'react'

function User() {

  const user = useSelector(userSelector)
  const rols = useSelector(rolSelector)
  const userService = new UserService()

  //Filters
  const [filters, setFilters] = useState({
    fn: "",
    ln: "",
    rol: 0
  })

  const filterUser = (users: any) => {
    return users.filter((u: any) => {
      return (
        (u.firstName.toLowerCase().includes(filters.fn.toLowerCase()))
        &&
        (u.lastName.toLowerCase().includes(filters.ln.toLowerCase()))
        &&
        (filters.rol === 0 || u.rol.id === filters.rol)
        )
    })
  }

  const handleChangeRol = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const op = +e.target.value

    setFilters((prevState: any) => ({
        ...prevState,
        rol: op
      }))
  }

  const usersFilter = filterUser(user)

  //Search
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')

  const handleChangeFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fn = e.target.value
    setFirstName(fn)

    if(fn == '') setFilters((prevState: any) => ({
      ...prevState,
      fn: ''
    }))
  }
  
  const searchFirstNameOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      setFilters((prevState: any) => ({
        ...prevState,
        fn: firstName
      }))
    }
  }

  const handleChangeLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ln = e.target.value
    setLastName(ln)

    if(e.target.value == '') setFilters((prevState: any) => ({
      ...prevState,
      ln: ''
    }))
  }

  const searchLastNameOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      setFilters((prevState: any) => ({
        ...prevState,
        ln: lastName
      }))
    }
  }

  //Sorting
  const [sortedUsers, setSortedUsers] = useState([]);
  const [currentSorting, setCurrentSorting] = useState(1);

  const sortUsers = (users: any, sortOp: number) => {
      switch (sortOp) {
          case 1: setSortedUsers(users);
              break;

          case 2: setSortedUsers(users.sort((a: any, b: any) => a.firstName > b.firstName ? 1 : -1))
              break;

          case 3: setSortedUsers(users.sort((a: any, b: any) => a.firstName < b.firstName ? 1 : -1))
              break;
          
          case 4: setSortedUsers(users.sort((a: any, b: any) => a.lastName > b.lastName ? 1 : -1))
              break;
          
          case 5: setSortedUsers(users.sort((a: any, b: any) => a.lastName < b.lastName ? 1 : -1))
              break;
      }
  }

  const handleChangeSorting = (e: any) => {
      const sortOp = +e.target.value;
      setCurrentSorting(sortOp);
      sortUsers(usersFilter, sortOp);
  }


  useEffect(() => {
    sortUsers(usersFilter, currentSorting);
  }, [filters])

  return (
    <div className="m-4">
      <CrudCreateButton Modal={UserForm} Title='Users' />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Users</h2>
      <div className="flex items-center justify-center w-full gap-5 my-5">
        <input type="text" placeholder='FIRST NAME' className=" input input-sm" onChange={handleChangeFirstName} onKeyDown={searchFirstNameOnEnter}/>
        <input type="text" placeholder='LAST NAME' className=" input input-sm" onChange={handleChangeLastName} onKeyDown={searchLastNameOnEnter}/>
        <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeRol}>
          <option selected value={0}>ROL: ALL</option>
          { rols.map((r:any) => {
            return <option value={r.id}>ROL: {r.rol.toUpperCase()}</option>
          })}
        </select>
        <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeSorting}>
                        <option selected value={1}>SORT BY: FEATURED</option>
                        <option value={2}>SORT BY FIRST NAME: A - Z</option>
                        <option value={3}>SORT BY FIRST NAME: Z - A</option>
                        <option value={4}>SORT BY LAST NAME: A - Z</option>
                        <option value={5}>SORT BY LAST NAME: Z - A</option>
                    </select>
      </div>
      <div className="overflow-x-auto h-[35rem]">
        <table className="table table-xs table-pin-rows ">
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
            {sortedUsers.map((userItem: User, i: number) => (
              <tr key={i}>
                <td>{userItem.firstName}</td>
                <td>{userItem.lastName}</td>
                <td>{userItem.mail}</td>
                <td>{userItem.password}</td>
                <td>{userItem.rol?.rol}</td>
                <td>
                  <div className='flex gap-2'>
                  <button><RiEyeLine className='w-5 h-5 eye-icon' /> </button>
                    <button><FiEdit2 className='w-5 h-5 edit-icon' /> </button>
                    <button onClick={() => alert('coming soon')}><RiDeleteBin6Line className='w-5 h-5 delete-icon' /> </button>
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