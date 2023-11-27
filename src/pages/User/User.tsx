// React
import { useState, useEffect } from "react";

// Redux
import store from "../../state/store/store";
import { useDispatch, useSelector } from "react-redux";
import { rolSelector, userSelector } from "../../state/selectors";
import { loadUsers } from "../../state/actions/userActions";

// Services
import { UserService } from "../../services/User";

// Hooks
import { useSorting } from "../../hooks/useSorting";
import { useSortingStates } from "../../hooks/useSortingStates";
import { usePagination } from "../../hooks/usePagination";
import { useCrudActions } from "../../hooks/useCrudActions";

// Sweet Alert 2
import Swal from "sweetalert2";

// Components
import UserForm from "../../components/modals/user_form/UserForm";
import Pagination from "../../components/pagination/Pagination";

// Types
import { User } from "../../models/User";
import { Rol } from "../../models/Rol";

// Assets
import { RiEyeLine } from "react-icons/ri";
import { AiOutlineBars } from "react-icons/ai";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { MdOutlineDisabledByDefault } from "react-icons/md";

function User() {
  // Token y Api URL para hacer los fetch
  const token: string = store.getState().userSession.token;
  const apiURL = import.meta.env.VITE_REACT_APP_API_URL;

  // Redux
  const dispatch = useDispatch();

  // Obtiene los Usuarios y los Roles
  const user: User[] = useSelector(userSelector);
  const rols = useSelector(rolSelector);

  // User Service
  const userService = new UserService();

  // Modal
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<User>();
  const [watchInfo, setWatchInfo] = useState<boolean>(false);

  // Set User to Blacklist
  const fetchBlacklist = async (id: number) => {
    const response = await fetch(`${apiURL}/users/changeBlacklist/${id}`, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
      },
    });
    return response;
  };

  //Filters
  const [filters, setFilters] = useState({
    fn: "",
    ln: "",
    rol: 0,
  });

  const filterUser = (users: User[]) => {
    return users.filter((u: User) => {
      return (
        u.firstName?.toLowerCase().includes(filters.fn?.toLowerCase()) &&
        u.lastName?.toLowerCase().includes(filters.ln?.toLowerCase()) &&
        (filters.rol === 0 || +u.rol.id === filters.rol)
      );
    });
  };

  const handleChangeRol = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const op = +e.target.value;

    setFilters((prevState) => ({
      ...prevState,
      rol: op,
    }));
  };

  const usersFilter: User[] = filterUser(user);

  //Search
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const handleChangeFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fn = e.target.value;
    setFirstName(fn);

    if (fn == "")
      setFilters((prevState) => ({
        ...prevState,
        fn: "",
      }));
  };

  const searchFirstNameOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFilters((prevState) => ({
        ...prevState,
        fn: firstName,
      }));
    }
  };

  const handleChangeLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ln = e.target.value;
    setLastName(ln);

    if (e.target.value == "")
      setFilters((prevState) => ({
        ...prevState,
        ln: "",
      }));
  };

  const searchLastNameOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFilters((prevState) => ({
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
  } = useSortingStates(usersFilter, "id");

  //Pagination
  const { currentObjects, currentPage, objetsPerPage, pages, setCurrentPage } =
    usePagination(sortedItems);

  // Handlers
  const handleDelete = (user: User) => {
    const { deleteObjectAlerts } = useCrudActions(
      user,
      userService,
      "user",
      dispatch,
      loadUsers,
      () => setEditModalOpen(false)
    );
    deleteObjectAlerts();
  };

  const handleEdit = (user: User) => {
    setSelectedItem(user);
    setEditModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedItem(undefined);
    setEditModalOpen(true);
  };

  const handleWatch = (user: User) => {
    setWatchInfo(true);
    setSelectedItem(user);
    setEditModalOpen(true);
  };

  const handleBlacklist = (user: User) => {
    Swal.fire({
      icon: "warning",
      title: `${
        user.blacklist === "Enabled" ? "Disabled User" : "Enabled User"
      }`,
      text: `Are you sure you want to ${
        user.blacklist === "Enabled" ? "disabled" : "enabled"
      } this user?`,
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#E73636",
      confirmButtonText: `${
        user.blacklist === "Enabled" ? "Disable User" : "Enable User"
      }`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `${
            user.blacklist === "Enabled" ? "Disabling..." : "Enabling..."
          }`,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: false,
          showCancelButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        fetchBlacklist(+user.id).then((response) => {
          if (response?.ok) {
            userService.GetAll().then((res: User[]) => {
              dispatch(loadUsers(res));
            });
            Swal.fire({
              icon: "success",
              title: `The user was ${
                user.blacklist === "Enabled" ? "disabled" : "enabled"
              }`,
              allowEscapeKey: false,
              allowOutsideClick: false,
              showCancelButton: false,
              confirmButtonColor: "#E73636",
            });
          } else
            Swal.fire({
              title: "There was an error",
              icon: "error",
              confirmButtonColor: "#E73636",
            });
        });
      }
    });
  };

  useEffect(() => {
    setCurrentPage(1);
    setSortedItems(useSorting(usersFilter, currentSorting, isAsc));
  }, [filters, user]);

  return (
    <div className='m-4'>
      <UserForm
        obj={selectedItem}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        employee={false}
        watch={watchInfo}
      />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Users</h2>

      {/* FILTERS */}
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
              {rols.map((r: Rol) => {
                return <option value={r.id}>ROL: {r.rol.toUpperCase()}</option>;
              })}
            </select>
          </li>
          <li>
            {/* SORTING TYPE */}
            <select
              className='w-full h-full select select-bordered select-sm'
              onChange={handleChangeSorting}
            >
              <option selected value={"id true"}>
                SORT BY: FEATURED
              </option>
              <option value={"firstName true"}>
                SORT BY FIRST NAME: A - Z
              </option>
              <option value={"firstName false"}>
                SORT BY FIRST NAME: Z - A
              </option>
              <option value={"lastName true"}>SORT BY LAST NAME: A - Z</option>
              <option value={"lastName false"}>SORT BY LAST NAME: Z - A</option>
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
          {rols.map((r: Rol) => {
            return <option value={r.id}>ROL: {r.rol.toUpperCase()}</option>;
          })}
        </select>
        <select
          className='w-full max-w-xs select select-bordered select-sm'
          onChange={handleChangeSorting}
        >
          <option selected value={"id true"}>
            SORT BY: FEATURED
          </option>
          <option value={"firstName true"}>SORT BY FIRST NAME: A - Z</option>
          <option value={"firstName false"}>SORT BY FIRST NAME: Z - A</option>
          <option value={"lastName true"}>SORT BY LAST NAME: A - Z</option>
          <option value={"lastName false"}>SORT BY LAST NAME: Z - A</option>
        </select>
      </div>
      <div className='overflow-x-auto h-[35rem]'>
        <table className='z-0 table  table-pin-rows'>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Mail</th>
              <th>Rol</th>
              <td>State</td>
              <td className="md:hidden">Actions</td>
              <th className="max-md:hidden">View</th>
              <th className="max-md:hidden">Blacklist</th>
            </tr>
          </thead>
          {/* USERS TABLE */}
          <tbody>
            {currentObjects.map((userItem: User, i: number) => (
              <tr key={i}>
                <td>{userItem.firstName + "  " + userItem.lastName}</td>
                <td>{userItem.mail}</td>
                <td>{userItem.rol?.rol}</td>
                <td
                  className={
                    userItem.blacklist === "Enabled"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {userItem.blacklist}
                </td>
                <td>
                <div className='dropdown dropdown-end md:hidden'>
                    <label tabIndex={0} className='hover:shadow-sm btn btn-link btn-sm '>
                      <AiOutlineBars />
                    </label>
                    <ul
                      tabIndex={0}
                      className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
                    >
                      <li>
                        <button onClick={() => handleWatch(userItem)}>
                          <RiEyeLine className='w-5 h-5 eye-icon' />
                          {" View "}
                        </button>
                      </li>
                      <li>
                      <button onClick={() => handleBlacklist(userItem)}>
                        
                    {userItem.blacklist === "Enabled" ? (
                      <MdOutlineDisabledByDefault className='w-5 h-5 text-red-500' />
                    ) : (
                      <AiOutlineCheckSquare className='w-5 h-5 text-green-500' />
                    )}
                    Blacklist
                  </button>
                      </li>
                    </ul>
                  </div>
                  <button className="max-md:hidden" onClick={() => handleWatch(userItem)}>
                    <RiEyeLine className='w-5 h-5 eye-icon' />
                  </button>
                </td>
                <td className="max-md:hidden">
                  <button onClick={() => handleBlacklist(userItem)}>
                    {userItem.blacklist === "Enabled" ? (
                      <MdOutlineDisabledByDefault className='w-5 h-5 text-red-500' />
                    ) : (
                      <AiOutlineCheckSquare className='w-5 h-5 text-green-500' />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {/* PAGINATION */}
          <tfoot>
            <Pagination
              items={sortedItems}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pages={pages}
              objetsPerPage={objetsPerPage}
            />
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default User;
