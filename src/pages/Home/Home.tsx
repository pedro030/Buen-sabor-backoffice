//React
import { useEffect, useState } from "react"

// Auth0
import { useAuth0 } from "@auth0/auth0-react"

// Redux
import { useDispatch, useSelector } from "react-redux"
import { userSessionSelector } from "../../state/selectors"
import { load_token, sign_in, load_rol } from "../../state/actions/userSessionAction"
import { loadLocations } from "../../state/actions/locationActions"
import { loadAddresses } from "../../state/actions/addressActions"
import { loadCategories } from "../../state/actions/categoryActions"
import { loadMeasures } from "../../state/actions/measureActions"
import { loadIngredients } from "../../state/actions/ingredientActions"
import { loadProducts } from "../../state/actions/productActions"
import { loadRols } from "../../state/actions/rolActions"
import { loadOrders } from "../../state/actions/orderActions"
import { loadUsers } from "../../state/actions/userActions"
import { loadMovements } from "../../state/actions/movementsActions"
import { loadStatuses } from "../../state/actions/statusActions"

// Services
import { LocationService } from "../../services/Location"
import { AddressService } from "../../services/Address"
import { CategoryService } from "../../services/Category"
import { MeasureService } from "../../services/Measure"
import { IngredientService } from "../../services/Ingredient"
import { ProductService } from "../../services/Product"
import { StatusService } from "../../services/Status"
import { RolService } from "../../services/Rol"
import { OrderService } from "../../services/Order"
import { UserService } from "../../services/User"
import { MovementsService } from "../../services/Movements"

// JWT Decode
import jwtDecode from "jwt-decode"

// Components
import Sidebar from "../../components/sidebar_employee/Sidebar"
import HomeRoutes from "../../router/HomeRoutes"
import PageLoader from "../../components/page_loader/PageLoader"

function Home() {
    // Auth0 User, getToken & logout
    const { user, getAccessTokenSilently, logout } = useAuth0();

    // Redux
    const dispatch = useDispatch();

    // Obtener Rol
    const { rol } = useSelector(userSessionSelector)

    // Si el rol se obtiene se setea la vista
    const [rolReady, setRolReady] = useState(false);

    useEffect(() => {
        // Se obtiene y decodifica el token
        getAccessTokenSilently(
            {
                authorizationParams: {
                    audience: import.meta.env.VITE_REACT_APP_AUDIENCE,
                }
            }
        )
            .then(data => {
                const decodedToken = jwtDecode(data)
                // Se obtiene el strinn del Rol
                const rol: string = decodedToken.permissions.find((p: string) => p.charAt(0) === '_')
                // Si no hay rol o el rol es Client se lo redirecciona al logout
                if(!rol || rol === "_client") return logout({
                    logoutParams: {
                        returnTo: import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_LOGOUT_URL
                    }
                })
                // Si hay rol y es distinto de Client se lo carga al mismo
                else {
                    dispatch(load_rol(rol))
                }
                // Guardar token antes de hacer llamadas a la api
                dispatch(load_token(data))

                // Se obtienen los datos del usuario que inicia sesión
                if(user?.email){
                    new UserService().getUserByMail(user.email)
                        .then(userdata => {
                            if (userdata) {
                                dispatch(sign_in(userdata));
                            }
                        })
                }
                // se obtienen los registros de las diferentes secciones del sitio
                    new CategoryService().GetAll().then((categories) => { dispatch(loadCategories(categories)) }),
                    new MeasureService().GetAll().then((measures) => { dispatch(loadMeasures(measures)) }),
                    new IngredientService().GetAll().then((ingredients) => { dispatch(loadIngredients(ingredients)) }),
                    new ProductService().GetAll().then((products) => { dispatch(loadProducts(products)) }),
                    new RolService().GetAll().then((rols) => { dispatch(loadRols(rols)) }),
                    new AddressService().GetAll().then((addressess) => { dispatch(loadAddresses(addressess)) }),
                    new OrderService().GetAll().then((orders) => { dispatch(loadOrders(orders)) }),
                    new UserService().getAllWP().then((users) => { dispatch(loadUsers(users)) }),
                    new LocationService().GetAll().then((locations) => { dispatch(loadLocations(locations)) }),
                    new StatusService().GetAll().then((statuses) => { dispatch(loadStatuses(statuses)) })
                    new MovementsService().GetAll().then((movements) => { dispatch(loadMovements(movements)) })
            })
    }, [])

    // UseEffect que se ejecuta cada vez que cambia de estado 'rol' para ver si se setea la vista o sigue el loader
    useEffect(() => {
        if(rol.length > 0) {
            setRolReady(true);
        }
      }, [rol])
    
      // Loader
      if(!rolReady) {
          return (
              <div className="page-layout">
                <PageLoader />
              </div>
            );
      }

    return (
        <div className="flex max-lg:flex-col">
            <Sidebar />
            <div className="w-full">
                <HomeRoutes />
            </div>
        </div>
    )
}

export default Home