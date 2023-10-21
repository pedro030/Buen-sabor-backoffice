// React DOM
import ReactDOM from 'react-dom/client'

// React Router
import { BrowserRouter } from "react-router-dom";

// Auth0
import Auth0ProviderWithNavigate from './components/auth0/Auth0ProviderWithNavigate.jsx'

// Redux
import { Provider } from 'react-redux'
import store from './state/store/store';

// Components
import App from './App';

// Styles
import 'normalize.css'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </Provider>
)
