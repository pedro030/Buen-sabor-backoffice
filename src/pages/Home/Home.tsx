import { useDispatch, useSelector } from "react-redux"
import Sidebar from "../../components/sidebar_employee/Sidebar"
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react"
import { load_token, sign_in, load_rol } from "../../state/actions/userSessionAction"
import HomeRoutes from "../../router/HomeRoutes"
import { LocationService } from "../../services/Location"
import { loadLocations } from "../../state/actions/locationActions"
import { AddressService } from "../../services/Address"
import { loadAddresses } from "../../state/actions/addressActions"
import { CategoryService } from "../../services/Category"
import { loadCategories } from "../../state/actions/categoryActions"
import { loadMeasures } from "../../state/actions/measureActions"
import { MeasureService } from "../../services/Measure"
import { loadIngredients } from "../../state/actions/ingredientActions"
import { IngredientService } from "../../services/Ingredient"
import { ProductService } from "../../services/Product"
import { loadProducts } from "../../state/actions/productActions"
import { userSessionSelector } from "../../state/selectors"
import { StatusService } from "../../services/Status"
import { loadStatues } from "../../state/actions/statusActions"
import { RolService } from "../../services/Rol"
import { loadRols } from "../../state/actions/rolActions"
import { OrderService } from "../../services/Order"
import { loadOrders } from "../../state/actions/orderActions"
import { UserService } from "../../services/User"
import { loadUsers } from "../../state/actions/userActions"
import jwtDecode from "jwt-decode"
import PageLoader from "../../components/page_loader/PageLoader"
import { MovementsService } from "../../services/Movements"
import { loadMovements } from "../../state/actions/movementsActions"

function Home() {

    const { user, getAccessTokenSilently, logout } = useAuth0();
    const dispatch = useDispatch();
    const { rol } = useSelector(userSessionSelector)
    const [rolReady, setRolReady] = useState(false);


    useEffect(() => {
        getAccessTokenSilently(
            {
                authorizationParams: {
                    audience: import.meta.env.VITE_REACT_APP_AUDIENCE,
                }
            }
        )
            .then(data => {
                const decodedToken = jwtDecode(data)
                const rol: string = decodedToken.permissions.find((p: string) => p.charAt(0) === '_')
                dispatch(load_rol(rol))
                new UserService().GetAll()
                    .then(users => {
                        let userLoged = users.find(u => u.mail == user?.email);
                        // if (userLoged?.rol.id == "6") return logout({
                        //     logoutParams: {
                        //         returnTo: import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_LOGOUT_URL
                        //     }
                        // })
                        if (userLoged) {
                            dispatch(sign_in(userLoged));
                        }
                    })
                dispatch(load_token(data))
                    new CategoryService().GetAll().then((categories) => { dispatch(loadCategories(categories)) }),
                    new MeasureService().GetAll().then((measures) => { dispatch(loadMeasures(measures)) }),
                    new IngredientService().GetAll().then((ingredients) => { dispatch(loadIngredients(ingredients)) }),
                    new ProductService().GetAll().then((products) => { dispatch(loadProducts(products)) }),
                    new RolService().GetAll().then((rols) => { dispatch(loadRols(rols)) }),
                    new AddressService().GetAll().then((addressess) => { dispatch(loadAddresses(addressess)) }),
                    new OrderService().GetAll().then((orders) => { dispatch(loadOrders(orders)) }),
                    new UserService().GetAll().then((users) => { dispatch(loadUsers(users)) }),
                    new LocationService().GetAll().then((locations) => { dispatch(loadLocations(locations)) }),
                    new StatusService().GetAll().then((statueses) => { dispatch(loadStatues(statueses)) }),
                    new MovementsService().GetAll().then((movements) => { dispatch(loadMovements(movements)) })
                    //new SectionService().GetAll().then((sections) => { dispatch(loadSections(sections)) }),
            })
    }, [])

    useEffect(() => {
        if(rol.length > 0) {
            setRolReady(true);
        }
      }, [rol])
    
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