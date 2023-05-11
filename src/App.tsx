import React from 'react'
import './App.scss'
import { Route, Routes } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import PageLoader from './components/page_loader/PageLoader';
import UserProfile from './pages/UserProfile/UserProfile';
import { AuthenticationGuard } from './components/auth0/AuthenticationGuard';
import Header from './components/header/Header';
import CategoriesCRUD from './pages/CategoriesCRUD/CategoriesCRUD';
import Home from './pages/Home/Home';
import {Toaster} from 'react-hot-toast'




const  App = () => {

  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="page-layout">
        <PageLoader />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/*" element={<AuthenticationGuard component={Home} />} />
      </Routes>
      <Toaster/>
    </>
  )
}

export default App
