import AddressForm from "../../components/modals/address_form/AddressForm"
import { Address } from "../../models/Address"
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';
import { useSelector } from "react-redux";
import { UserService } from "../../services/User";
import { rolSelector, userSelector } from "../../state/selectors";
import User from "../User/User";
import UserForm from "../../components/modals/user_form/UserForm";
import { useState, useEffect } from 'react'


const Employees = () => {

  const user = useSelector(userSelector)
  const rols = useSelector(rolSelector)
  const userService = new UserService()
  const employees = user.filter((e: User) => e.rol?.rol != 'Client');

    //Filters
  const [filters, setFilters] = useState({
    fn: "",
    ln: "",
    rol: 0
  })

  const filterEmployee = (employees: any) => {
    return employees.filter((e: any) => {
      return (
        (e.firstName.toLowerCase().includes(filters.fn.toLowerCase()))
        &&
        (e.lastName.toLowerCase().includes(filters.ln.toLowerCase()))
        &&
        (filters.rol === 0 || e.rol.id === filters.rol)
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

  const employeesFilter = filterEmployee(employees)

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
  const [sortedEmployees, setSortedEmployees] = useState([]);
  const [currentSorting, setCurrentSorting] = useState(1);

  const sortEmployees = (employees: any, sortOp: number) => {
      switch (sortOp) {
          case 1: setSortedEmployees(employees);
              break;

          case 2: setSortedEmployees(employees.sort((a: any, b: any) => a.firstName > b.firstName ? 1 : -1))
              break;

          case 3: setSortedEmployees(employees.sort((a: any, b: any) => a.firstName < b.firstName ? 1 : -1))
              break;
          
          case 4: setSortedEmployees(employees.sort((a: any, b: any) => a.lastName > b.lastName ? 1 : -1))
              break;
          
          case 5: setSortedEmployees(employees.sort((a: any, b: any) => a.lastName < b.lastName ? 1 : -1))
              break;
      }
  }

  const handleChangeSorting = (e: any) => {
      const sortOp = +e.target.value;
      setCurrentSorting(sortOp);
      sortEmployees(employeesFilter, sortOp);
  }


  useEffect(() => {
    sortEmployees(employeesFilter, currentSorting);
  }, [filters])


    return (
        <>
            <div className="m-4">
                <CrudCreateButton Modal={UserForm} Title='Employee' />
                <h2 className='my-2 text-lg font-bold text-center stat-title'>Employees</h2>
                <div className="flex items-center justify-center w-full gap-5 my-5">
                    <input type="text" placeholder='FIRST NAME' className=" input input-sm" onChange={handleChangeFirstName} onKeyDown={searchFirstNameOnEnter}/>
                    <input type="text" placeholder='LAST NAME' className=" input input-sm" onChange={handleChangeLastName} onKeyDown={searchLastNameOnEnter}/>
                    <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeRol}>
                        <option selected value={0}>ROL: ALL</option>
                        { rols.map((r:any) => {
                            if(r.rol != 'Client') return <option value={r.id}>ROL: {r.rol.toUpperCase()}</option>
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
                                <th>Full Name</th>
                                <th>Mail</th>
                                <th>Password</th>
                                <th>Rol</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedEmployees.map((employee: User, i: number) => (
                                <tr key={i}>
                                    <td>{employee.firstName + '  ' + employee.lastName}</td>
                                    <td>{employee.mail}</td>
                                    <td>{employee.password}</td>
                                    <td>{employee.rol?.rol}</td>
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
        </>
    )
}

export default Employees