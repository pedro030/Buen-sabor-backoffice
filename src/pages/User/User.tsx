import UserForm from "../../components/modals/user_form/UserForm"
import { User } from "../../models/User"
import { useDispatch, useSelector } from "react-redux"
import { loadUsers } from "../../state/actions/userActions"
import { rolSelector, userSelector } from "../../state/selectors"
import CrudCard from "../../components/crud_components/crud_card/CrudCard"
import { UserService } from '../../services/User'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';
import { useState, useEffect } from 'react'
import { useSorting } from "../../hooks/useSorting"
import { usePagination } from "../../hooks/usePagination"
import Pagination from "../../components/pagination/Pagination"
import { useSortingStates } from "../../hooks/useSortingStates"
import { IoIosAddCircleOutline } from "react-icons/io"
import { useCrudActions } from "../../hooks/useCrudActions"
import { AiOutlineCheckSquare } from "react-icons/ai"
import { MdOutlineDisabledByDefault } from 'react-icons/md'
import Swal from "sweetalert2"
import store from "../../state/store/store"

function User() {
  // Token
  const token: string = store.getState().userSession.token
  const apiURL = import.meta.env.VITE_REACT_APP_API_URL;
  const dispatch = useDispatch();
  const user: User[] = useSelector(userSelector)
  const rols = useSelector(rolSelector)
  const userService = new UserService()
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<User>()
  const [watchInfo, setWatchInfo] = useState<boolean>(false);

  const fetchBlacklist = async (id: number) => {
    const response = await fetch(`${apiURL}/users/changeBlacklist/${id}`, {
      headers: {
        'Authorization': `Bearer ${(token).trim()}`
      }
    })

    return response;
  }

  //Filters
  const [filters, setFilters] = useState({
    fn: "",
    ln: "",
    rol: 0
  })

  const filterUser = (users: any) => {
    return users.filter((u: any) => {
      return (
        (u.firstName?.toLowerCase().includes(filters.fn?.toLowerCase()))
        &&
        (u.lastName?.toLowerCase().includes(filters.ln?.toLowerCase()))
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

  const usersFilter: User[] = filterUser(user)

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
  const { sortedItems, setSortedItems, currentSorting, isAsc, handleChangeSorting } = useSortingStates(usersFilter, 'id');

  //Pagination
  const { currentObjects, currentPage, objetsPerPage, pages, setCurrentPage } = usePagination(sortedItems);

  // Handlers
  const handleDelete = (user: User) => {
    const { deleteObjectAlerts } = useCrudActions(user, userService, 'user', dispatch, loadUsers, () => setEditModalOpen(false))
    deleteObjectAlerts()
  }

  const handleEdit = (user: User) => {
    setSelectedItem(user);
    setEditModalOpen(true);
  }

  const handleAddNew = () => {
    setSelectedItem(undefined);
    setEditModalOpen(true);
  }

  const handleWatch = (user: User) => {
    setWatchInfo(true);
    setSelectedItem(user);
    setEditModalOpen(true);
  }

  const handleBlacklist = (user: User) => {
    Swal.fire({
      icon: "warning",
      title: `${user.blacklist === 'Enabled' ? 'Disabled User' : 'Enabled User'}`,
      text: `Are you sure you want to ${user.blacklist === 'Enabled' ? 'disabled' : 'enabled'} this user?`,
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: '#E73636',
      confirmButtonText: `${user.blacklist === 'Enabled' ? 'Disable User' : 'Enable User'}`
    })
      .then((result) => {
        if(result.isConfirmed) {
          Swal.fire({
            title: `${user.blacklist === 'Enabled' ? 'Disabling...' : 'Enabling...'}`,
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
            showCancelButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
          })
          fetchBlacklist(+user.id)
          .then((response) => {
            if(response?.ok) {
              userService.GetAll()
              .then((res: User[]) => {
                dispatch(loadUsers(res))
              })
              Swal.fire({
                icon: 'success',
                title: `The user was ${user.blacklist === 'Enabled' ? 'disabled' : 'enabled'}`,
                allowEscapeKey: false,
                allowOutsideClick: false,
                showCancelButton: false,
                confirmButtonColor: '#E73636'
              })
            } else Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })
          })
        }
      })
  }


  useEffect(() => {
    setCurrentPage(1);
    setSortedItems(useSorting(usersFilter, currentSorting, isAsc));
  }, [filters, user])

  return (
    <div className="m-4">
      <UserForm
        obj={selectedItem}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        employee={false}
        watch={watchInfo}
      />
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
                        <option selected value={'id true'}>SORT BY: FEATURED</option>
                        <option value={'firstName true'}>SORT BY FIRST NAME: A - Z</option>
                        <option value={'firstName false'}>SORT BY FIRST NAME: Z - A</option>
                        <option value={'lastName true'}>SORT BY LAST NAME: A - Z</option>
                        <option value={'lastName false'}>SORT BY LAST NAME: Z - A</option>
                    </select>
      </div>
      <div className="overflow-x-auto h-[35rem]">
        <table className="table table-xs table-pin-rows ">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Mail</th>
              <th>Rol</th>
              <td>State</td>
              <th>View</th>
              <th>Blacklist</th>
            </tr>
          </thead>
          <tbody>
            {currentObjects.map((userItem: User, i: number) => (
              <tr key={i}>
                <td>{userItem.firstName + '  ' + userItem.lastName}</td>
                <td>{userItem.mail}</td>
                <td>{userItem.rol?.rol}</td>
                <td className={userItem.blacklist === 'Enabled' ? 'text-green-500' : 'text-red-500'}>{userItem.blacklist}</td>
                <td>
                  <button onClick={() => handleWatch(userItem)}><RiEyeLine className='w-5 h-5 eye-icon' /></button>
                </td>
                <td>
                  <button onClick={() => handleBlacklist(userItem)}>{userItem.blacklist === 'Enabled' ? <MdOutlineDisabledByDefault className="w-5 h-5 text-red-500"/> : <AiOutlineCheckSquare className="w-5 h-5 text-green-500"/>}</button>
                </td>
              </tr>))}
          </tbody>
          <tfoot>
            <Pagination items={sortedItems} currentPage={currentPage} setCurrentPage={setCurrentPage} pages={pages} objetsPerPage={objetsPerPage}/>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default User