import './sidebar.scss'
import { useAuth0 } from '@auth0/auth0-react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import loguot_icon from '../../assets/logout_icon.svg'

function Sidebar() {
  const { user, logout } = useAuth0()
  const navigate = useNavigate()
  return (

    // STRUCTURE
    <>

      {/* SIDEBAR */}
      <div className="w-[260px] bg-white h-[100vh] border shadow menu">

        {/* <h1 className='font-bold font-red-600'>Buen Sabor</h1> */}

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
                      className={({ isActive }) => isActive ? "active" : ""}>personal info</NavLink>
                  </li>
                  <li>
                    <NavLink to="change_password"
                      className={({ isActive }) => isActive ? "active" : ""}>change password</NavLink></li>
                </ul>
              </details>
            </li>

            <li>
              <details className="dropdown dropdown-end">
                <summary>Table</summary>
                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-full">
                  <li>
                    <NavLink to="categories"
                      end
                      className={({ isActive }) => isActive ? "active" : ""}>categories</NavLink>
                  </li>
                  <li>
                    <NavLink to="measures"
                      className={({ isActive }) => isActive ? "active" : ""}>measures</NavLink></li>
                  <li>
                    <NavLink to="ingredients"
                      className={({ isActive }) => isActive ? "active" : ""}>ingredients</NavLink></li>
                  <li>
                    <NavLink to="products"
                      className={({ isActive }) => isActive ? "active" : ""}>products</NavLink></li>
                  <li>
                    <NavLink to="orders"
                      className={({ isActive }) => isActive ? "active" : ""}>orders</NavLink></li>
                  <li>
                    <NavLink to="bills"
                      className={({ isActive }) => isActive ? "active" : ""}>bills</NavLink></li>
                  <li>
                    <NavLink to="users"
                      className={({ isActive }) => isActive ? "active" : ""}>users</NavLink></li>
                  <li>
                    <NavLink to="employees"
                      className={({ isActive }) => isActive ? "active" : ""}>employees</NavLink></li>
                  <li>
                    <NavLink to="locations"
                      className={({ isActive }) => isActive ? "active" : ""}>locations</NavLink></li>
                  <li>
                    <NavLink to="addresses"
                      className={({ isActive }) => isActive ? "active" : ""}>addresses</NavLink></li>
                </ul>
              </details>
            </li>
            <li>
              <NavLink to="/stock" end>
                <h2 >Stock</h2>
              </NavLink>
            </li>
            <li><NavLink to="/rankings" end>
              <h2 >Rankings</h2>
            </NavLink>
            </li>
            <li>
              <NavLink to="/movements" end>
                <h2 >Movements</h2>
              </NavLink>
            </li>

          </div>
          <ul>
            <li className="nav-list-item-logout" onClick={() => logout()}>
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