import React from 'react'
import './UserProfile.scss'
import { Route, Routes } from 'react-router-dom'
import UserDetails from '../../components/user_details/UserDetails'
import { useAuth0 } from '@auth0/auth0-react'

const UserProfile = () => {
  const { user } = useAuth0()
  
  return (
    <div className="user-profile-container">
      <div className="sidebar">
        <div className="">
          <p>
            My profile
          </p>
          <h3>{user?.given_name || "User"}</h3>
        </div>
        <ul>
          <li>Account</li>
        </ul>
      </div>
      <div className="">
        <Routes>
          <Route path="/" element={<UserDetails/>} />
        </Routes>
      </div>
    </div>
  )
}

export default UserProfile