// Auth0
import { useAuth0 } from '@auth0/auth0-react'

// Redux
import { useSelector } from 'react-redux'
import { userSessionSelector } from '../../state/selectors'

// React Router
import { NavLink } from 'react-router-dom'

// Types
import { IButtonsByRol } from '../../interfaces/IButtonsByRol'

// Assets
import loguot_icon from '../../assets/logout_icon.svg'
import { FaBars } from 'react-icons/fa';

// Styles
import './sidebar.scss'

function Sidebar() {
  // Obtiene la informacion del usuario logueado con Auth0
  const { user, logout } = useAuth0()
  // A su vez se obtiene el rol para cargarle una determinada botonera a cada uno
  const { rol } = useSelector(userSessionSelector)

  // Lista de botones/opciones que tendrá acceso cada rol
  const crud: IButtonsByRol = {
    _superAdmin: ['categories', 'ingredients', 'products', 'orders', 'bills', 'users', 'employees'],
    _admin: ['categories', 'ingredients', 'products', 'bills', 'users', 'employees'],
    _cashier: ['orders', 'bills'],
    _chef: ['categories', 'ingredients', 'products', 'orders'],
    _delivery: ['orders']
  }

  return (
    <>
<details className='mt-3 ml-3 lg:hidden dropdown'>
            <summary className='m-1 btn btn-circle btn-secondary'><FaBars className="w-5 h-5"/></summary>
            <ul className='p-2 shadow menu dropdown-content z-[1] bg-secondary rounded-box w-80'>
              {/* AVATAR */}
        <div className="flex justify-center avatar">
          <div className="w-24 rounded-full">
            <img src={user?.picture} />
          </div>
        </div>

        {/* NAME EMPLOYEE */}
        <h3 className='text-center text-gray-600 menu-title'>{user?.given_name + ' ' + user?.family_name || "User"}</h3>

        {/* OPTIONS */}
        <div className='flex flex-col justify-between h-[75%]'>
          <div>
            <li>
              <NavLink to="/" end>
                <h2 >Home</h2>
              </NavLink>
            </li>

            <li>
              <details className="dropdown dropdown-end">
                <summary>My profile</summary>
                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-full">
                  <li>
                    <NavLink to="personal_info"
                      end
                      className={({ isActive }) => isActive ? "active" : ""}>Personal Info</NavLink>
                  </li>
                  <li>
                    <NavLink to="change_password"
                      className={({ isActive }) => isActive ? "active" : ""}>Change Password</NavLink></li>
                </ul>
              </details>
            </li>

            <li>
              <details className="dropdown dropdown-end">
                <summary>Table</summary>
                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-full">
                  { crud[rol].map((element: string, index:number) =>( 
                  <li key={index}>
                        <NavLink to={element} className={({ isActive }) => isActive ? "active" : ""}>{element[0].toUpperCase() + element.substring(1)}</NavLink>
                    </li>
                  )) }
                </ul>
              </details>
            </li>
            { (rol === '_admin' || rol === '_superAdmin')  && <ul className=" menu">
              <li>
                <h2 >Rankings</h2>
                <ul>
                  <li>
                    <NavLink to="/statistics/products" end>
                      <h2 >Products</h2>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/statistics/clients" end>
                      <h2 >Clients</h2>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/statistics/movements" end>
                      <h2 >Movements</h2>
                    </NavLink>
                  </li>
                </ul>
              </li>
            </ul>}
          </div>
          <ul>
            <li className="nav-list-item-logout" onClick={() => logout({logoutParams:{returnTo: import.meta.env.VITE_REACT_APP_AUTH0_CALLBACK_URL}})}>
              <div className='flex justify-center'>
                <h2>Log Out</h2>
                <img className='h-3' src={loguot_icon} />
              </div>
            </li>
          </ul>
        </div>
            </ul>
          </details>
      {/* SIDEBAR */}
      <div className="w-56 bg-white h-[100vh] border shadow menu max-lg:hidden">

        {/* AVATAR */}
        <div className="flex justify-center avatar">
          <div className="w-24 rounded-full">
            <img src={user?.picture} />
          </div>
        </div>

        {/* NAME EMPLOYEE */}
        <h3 className='text-center text-gray-600 menu-title'>{user?.given_name + ' ' + user?.family_name || "User"}</h3>

        {/* OPTIONS */}
        <div className='flex flex-col'>
          <div>
            <li>
              <NavLink to="/" end>
                <h2 >Home</h2>
              </NavLink>
            </li>

            <li>
              <details className="dropdown dropdown-end">
                <summary>My profile</summary>
                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-full">
                  <li>
                    <NavLink to="personal_info"
                      end
                      className={({ isActive }) => isActive ? "active" : ""}>Personal Info</NavLink>
                  </li>
                  <li>
                    <NavLink to="change_password"
                      className={({ isActive }) => isActive ? "active" : ""}>Change Password</NavLink></li>
                </ul>
              </details>
            </li>

            <li>
              <details className="dropdown dropdown-end">
                <summary>Table</summary>
                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-full">
                  { crud[rol].map((element: string, index:number) =>( 
                  <li key={index}>
                        <NavLink to={element} className={({ isActive }) => isActive ? "active" : ""}>{element[0].toUpperCase() + element.substring(1)}</NavLink>
                    </li>
                  )) }
                </ul>
              </details>
            </li>
            { (rol === '_admin' || rol === '_superAdmin')  && <ul className=" menu">
              <li>
                <h2 >Rankings</h2>
                <ul>
                  <li>
                    <NavLink to="/statistics/products" end>
                      <h2 >Products</h2>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/statistics/clients" end>
                      <h2 >Clients</h2>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/statistics/movements" end>
                      <h2 >Movements</h2>
                    </NavLink>
                  </li>
                </ul>
              </li>
            </ul>}
          </div>
          <ul>
            <li className="nav-list-item-logout" onClick={() => logout({logoutParams:{returnTo: import.meta.env.VITE_REACT_APP_AUTH0_CALLBACK_URL}})}>
              <div className='flex justify-center'>
                <h2>Log Out</h2>
                <img className='h-3' src={loguot_icon} />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Sidebar