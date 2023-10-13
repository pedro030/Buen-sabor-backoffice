import AddressForm from "../../components/modals/address_form/AddressForm";
import { Address } from "../../models/Address";
import CrudCreateButton from "../../components/crud_components/crud_create_button/CrudCreateButton";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line, RiEyeLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { UserService } from "../../services/User";
import { rolSelector, userSelector } from "../../state/selectors";
import UserForm from "../../components/modals/user_form/UserForm";
import { useState, useEffect } from "react";
import { useSortingStates } from "../../hooks/useSortingStates";
import { useSorting } from "../../hooks/useSorting";
import { User } from "../../models/User";
import { useCrudActions } from "../../hooks/useCrudActions";
import { loadUsers } from "../../state/actions/userActions";
import { IoIosAddCircleOutline } from "react-icons/io";

const Employees = () => {
  const dispatch = useDispatch();
  const user: User[] = useSelector(userSelector);
  const rols = useSelector(rolSelector);
  const userService = new UserService();
  const employees: User[] = user.filter((e: User) => e.rol?.rol != "Client");
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<User>();
  const [watchInfo, setWatchInfo] = useState<boolean>(false);

  //Filters
  const [filters, setFilters] = useState({
    fn: "",
    ln: "",
    rol: 0,
  });

  const filterEmployee = (employees: any) => {
    return employees.filter((e: any) => {
      return (
        e.firstName?.toLowerCase().includes(filters.fn?.toLowerCase()) &&
        e.lastName?.toLowerCase().includes(filters.ln?.toLowerCase()) &&
        (filters.rol === 0 || e.rol.id === filters.rol)
      );
    });
  };

  const handleChangeRol = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const op = +e.target.value;

    setFilters((prevState: any) => ({
      ...prevState,
      rol: op,
    }));
  };

  const filteredEmployees: User[] = filterEmployee(employees);

  //Search
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const handleChangeFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fn = e.target.value;
    setFirstName(fn);

    if (fn == "")
      setFilters((prevState: any) => ({
        ...prevState,
        fn: "",
      }));
  };

  const searchFirstNameOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFilters((prevState: any) => ({
        ...prevState,
        fn: firstName,
      }));
    }
  };

  const handleChangeLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ln = e.target.value;
    setLastName(ln);

    if (e.target.value == "")
      setFilters((prevState: any) => ({
        ...prevState,
        ln: "",
      }));
  };

  const searchLastNameOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFilters((prevState: any) => ({
        ...prevState,
        ln: lastName,
      }));
    }
  };

  //Sorting
  const {
    sortedItems,
    setSortedItems,
    currentSorting,
    isAsc,
    handleChangeSorting,
  } = useSortingStates(filteredEmployees, "id");

  const handleDelete = (employee: User) => {
    const { deleteObjectAlerts } = useCrudActions(
      employee,
      userService,
      "employee",
      dispatch,
      loadUsers,
      () => setEditModalOpen(false)
    );
    deleteObjectAlerts();
  };

  const handleEdit = (employee: User) => {
    setWatchInfo(false);
    setSelectedItem(employee);
    setEditModalOpen(true);
  };

  const handleAddNew = () => {
    setWatchInfo(false);
    setSelectedItem(undefined);
    setEditModalOpen(true);
  };

  const handleWatch = (employee: User) => {
    setWatchInfo(true);
    setSelectedItem(employee);
    setEditModalOpen(true);
  };

  useEffect(() => {
    setSortedItems(useSorting(filteredEmployees, currentSorting, isAsc));
  }, [filters, user]);

  return (
    <>
      <div className='m-4'>
        <UserForm
          obj={selectedItem}
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          employee={true}
          watch={watchInfo}
        />
        <h2 className='my-2 text-lg font-bold text-center stat-title'>
          Employees
        </h2>

        <details className='mb-10 dropdown md:hidden'>
          <summary className='m-1 btn btn-primary btn-wide btn-sm'>
            Filter
          </summary>
          <ul className='p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-80 gap-5 '>
            <li>
              <input
                type='text'
                placeholder='FIRST NAME'
                className=' input input-sm'
                onChange={handleChangeFirstName}
                onKeyDown={searchFirstNameOnEnter}
              />
            </li>
            <li>
              <input
                type='text'
                placeholder='LAST NAME'
                className=' input input-sm'
                onChange={handleChangeLastName}
                onKeyDown={searchLastNameOnEnter}
              />
            </li>
            <li>
              <select
                className='w-full h-full select select-bordered select-sm'
                onChange={handleChangeRol}
              >
                <option selected value={0}>
                  ROL: ALL
                </option>
                {rols.map((r: any) => {
                  if (r.rol != "Client")
                    return (
                      <option value={r.id}>ROL: {r.rol.toUpperCase()}</option>
                    );
                })}
              </select>
            </li>
            <li>
              <select
                className='w-full h-full select select-bordered select-sm'
                onChange={handleChangeSorting}
              >
                <option selected value='id true'>
                  SORT BY: FEATURED
                </option>
                <option value='firstName true'>
                  SORT BY FIRST NAME: A - Z
                </option>
                <option value='firstName false'>
                  SORT BY FIRST NAME: Z - A
                </option>
                <option value='lastName true'>SORT BY LAST NAME: A - Z</option>
                <option value='lastName false'>SORT BY LAST NAME: Z - A</option>
              </select>
            </li>
          </ul>
        </details>

        <div className='flex items-center justify-center w-full gap-5 my-5 max-md:hidden'>
          <input
            type='text'
            placeholder='FIRST NAME'
            className=' input input-sm'
            onChange={handleChangeFirstName}
            onKeyDown={searchFirstNameOnEnter}
          />
          <input
            type='text'
            placeholder='LAST NAME'
            className=' input input-sm'
            onChange={handleChangeLastName}
            onKeyDown={searchLastNameOnEnter}
          />
          <select
            className='w-full max-w-xs select select-bordered select-sm'
            onChange={handleChangeRol}
          >
            <option selected value={0}>
              ROL: ALL
            </option>
            {rols.map((r: any) => {
              if (r.rol != "Client")
                return <option value={r.id}>ROL: {r.rol.toUpperCase()}</option>;
            })}
          </select>
          <select
            className='w-full max-w-xs select select-bordered select-sm'
            onChange={handleChangeSorting}
          >
            <option selected value='id true'>
              SORT BY: FEATURED
            </option>
            <option value='firstName true'>SORT BY FIRST NAME: A - Z</option>
            <option value='firstName false'>SORT BY FIRST NAME: Z - A</option>
            <option value='lastName true'>SORT BY LAST NAME: A - Z</option>
            <option value='lastName false'>SORT BY LAST NAME: Z - A</option>
          </select>
        </div>
        <div className='overflow-x-auto h-[35rem]'>
          <table className='z-0 table table-xs table-pin-rows'>
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
              {sortedItems.map((employee: User, i: number) => (
                <tr key={i}>
                  <td>{employee.firstName + "  " + employee.lastName}</td>
                  <td className="max-sm:text-[10px]">{employee.mail}</td>
                  <td>{employee.password}</td>
                  <td className="max-sm:text-[10px]">{employee.rol?.rol}</td>
                  <td>
                    <div className='flex gap-2'>
                      <button onClick={() => handleWatch(employee)}>
                        <RiEyeLine className='w-5 h-5 eye-icon' />{" "}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Employees;
