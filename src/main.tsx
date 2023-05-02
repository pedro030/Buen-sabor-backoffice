import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import 'normalize.css'
import './index.scss'
import Auth0ProviderWithNavigate from './components/auth0/Auth0ProviderWithNavigate.jsx'
import App from './App';
import routes from './router/routes'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <Auth0ProviderWithNavigate>
      <App/>
    </Auth0ProviderWithNavigate>
  </BrowserRouter>
)
