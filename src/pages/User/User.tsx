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

function User() {
  const dispatch = useDispatch();
  const user: User[] = useSelector(userSelector)
  const rols = useSelector(rolSelector)
  const userService = new UserService()
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<User>()
  const [watchInfo, setWatchInfo] = useState<boolean>(false);

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
              <th>First Name</th>
              <th>Last Name</th>
              <th>Mail</th>
              <th>Password</th>
              <th>Rol</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentObjects.map((userItem: User, i: number) => (
              <tr key={i}>
                <td>{userItem.firstName}</td>
                <td>{userItem.lastName}</td>
                <td>{userItem.mail}</td>
                <td>{userItem.password}</td>
                <td>{userItem.rol?.rol}</td>
                <td>
                  <div className='flex gap-2'>
                    <button onClick={() => handleWatch(userItem)}><RiEyeLine className='w-5 h-5 eye-icon' /> </button>
                  </div>
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