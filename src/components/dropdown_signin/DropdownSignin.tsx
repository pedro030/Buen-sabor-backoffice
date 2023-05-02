import React, { useState } from 'react'
import './Dropdown.scss'
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const DropdownSignin = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { loginWithRedirect, logout, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    console.log(user)
    const getToken = async () =>{
        let token = await getAccessTokenSilently()
        return token;
    }
    console.log(getToken())
    const navigate = useNavigate();

    const handleLogin = async () => {
        await loginWithRedirect();
        console.log(user)
    };

    const handleSignUp = async () => {
        await loginWithRedirect({
            authorizationParams: {
                screen_hint: "signup",
            },
        });
    };

    const handleLogout = () => {
        logout({
            logoutParams: {
                returnTo: window.location.origin,
            },
        });
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
            <div className="dropdown__toggle">
                <span className='button'>{!isAuthenticated ?"Sign In":"O"}</span>
            </div>
            {isOpen && (
                <ul className="dropdown__list">
                    {!isAuthenticated && (
                        <>
                        <li className='dropdown-item' onClick={handleLogin}>Log In</li>
                        <li className='dropdown-item' onClick={handleSignUp}>Log Up</li>
                        </>
                    )}
                    {isAuthenticated && (
                        <>
                            <li className='dropdown-item' onClick={() => navigate('categories-crud')}>Admin Panel</li>
                            <li className='dropdown-item' onClick={handleLogout}>Logout</li>
                        </>
                    )}
                </ul>
            )}
        </div>
    );
}

export default DropdownSignin