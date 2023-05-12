import { CgProfile } from 'react-icons/cg'
import './sidebar.scss'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'

function Sidebar() {
  const { user, logout } = useAuth0()
  const navigate = useNavigate()
  return (
    <div className="container">
      <div className="container-img-user-role">
        <div className="left-profile-img-container"><CgProfile className="left-profile-img" /></div>
        <span className="left-username">{`${user?.given_name} ${user?.family_name}`}</span>
        <span className="left-role">Admin</span>
      </div>
      <div className="nav-container">
        <div className="dropdown">
          <button className="dropbtn">CRUD</button>
          <div className="dropdown-content">
            <ul className="nav-list">
              <li className="nav-list-item" onClick={() => navigate('/')}>Home</li>
              <li className="nav-list-item" onClick={() => navigate('./categories')}>Categories</li>
              <li className="nav-list-item" onClick={() => navigate('./measures')}>Measures</li>
              <li className="nav-list-item" onClick={() => navigate('./ingredients')}>Ingredient</li>
              <li className="nav-list-item" onClick={() => navigate('./products')}>Products</li>
              <li className="nav-list-item" onClick={() => navigate('./orders')}>Orders</li>
              <li className="nav-list-item" onClick={() => navigate('./bills')}>Bills</li>
              <li className="nav-list-item" onClick={() => navigate('./users')}>Users</li>
              <li className="nav-list-item" onClick={() => navigate('./sections')}>Sections</li>
              <li className="nav-list-item" onClick={() => navigate('./locations')}>Locations</li>
              <li className="nav-list-item" onClick={() => navigate('./addresses')}>Addresses</li>
              {/* <li className="nav-list-item">My Profile</li>
                <li className="nav-list-item">Adressess</li>
                <li className="nav-list-item">Order History</li>
                <li className="nav-list-item">Users</li>
                <li className="nav-list-item">Products</li>
                <li className="nav-list-item">Rankings</li>
                <li className="nav-list-item">Movements</li> */}
            </ul>
          </div>
        </div>
      </div>
      <div className="nav_container">
        <ul>
          <li className="nav-list-item-logout" onClick={() => logout()}>Log Out</li>
        </ul>
      </div>
    </div>

  )
}

export default Sidebar