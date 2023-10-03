// React Router
import { Route, Routes } from "react-router-dom";

// Auth0
import { useAuth0 } from '@auth0/auth0-react';
import { AuthenticationGuard } from './components/auth0/AuthenticationGuard';

// Components
import PageLoader from './components/page_loader/PageLoader';
import Home from './pages/Home/Home';
import {Toaster} from 'react-hot-toast'

// Font
import WebFont from 'webfontloader';

WebFont.load({
   google: {
     families: ['Poppins']
   }
});

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
