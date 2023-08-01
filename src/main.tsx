import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import 'normalize.css'
import './index.scss'
import Auth0ProviderWithNavigate from './components/auth0/Auth0ProviderWithNavigate.jsx'
import App from './App';
import { Provider } from 'react-redux'
import store from './state/store/store';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </Provider>
)
