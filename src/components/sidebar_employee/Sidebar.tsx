import './sidebar.scss'
import { useAuth0 } from '@auth0/auth0-react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import loguot_icon from '../../assets/logout_icon.svg'

function Sidebar() {
  const { user, logout } = useAuth0()
  const navigate = useNavigate()
  return (

    <div className='grid grid-cols-[260px_1fr] h-[100vh] overflow-x-hidden overflow-y-auto gap-3'>

      <ul className="w-56 m-4 menu bg-secondary rounded-box">
        <div className="flex justify-center avatar">
          <div className="w-24 rounded-full">
            <img src={user?.picture} />
          </div>
        </div>
        <h3 className='text-center text-gray-600 menu-title'>{user?.given_name + ' ' + user?.family_name || "User"}</h3>
        <div className='flex flex-col justify-between h-[75%]'>
          <div>
            <li>
              <h2 >Home</h2>
            </li>
            <li>
              <h2 >My profile</h2>
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
                    <NavLink to="sections"
                      className={({ isActive }) => isActive ? "active" : ""}>sections</NavLink></li>
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
              <h2 >Stock</h2>
            </li>
            <li>
              <h2 >Rankings</h2>
            </li>
            <li>
              <h2 >Movements</h2>
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
      </ul>

      <div className=''>
        {/* <Routes>
          <Route path="/" element={<UserDetails />} />
          <Route path="/addresses" element={<Address />} />
          <Route path="/password-form" element={<Change_password />} />
          <Route path="/orders" element={<History_Order />} />
        </Routes> */}
      </div>
    </div>

  )
}

export default Sidebar