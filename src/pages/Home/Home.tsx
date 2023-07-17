import { useDispatch} from "react-redux"
import Sidebar from "../../components/sidebar_employee/Sidebar"
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from "react"
import { load_token } from "../../state/actions/userSessionAction"
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
import { userSelector } from "../../state/selectors"
import { StatusService } from "../../services/Status"
import { loadStatues } from "../../state/actions/statusActions"
import { RolService } from "../../services/Rol"
import { loadRols } from "../../state/actions/rolActions"
import { OrderService } from "../../services/Order"
import { loadOrders } from "../../state/actions/orderActions"
import { BillService } from "../../services/Bill"
import { loadBills } from "../../state/actions/billActions"
import { UserService } from "../../services/User"
import { loadUsers } from "../../state/actions/userActions"
import { SectionService } from "../../services/Section"
import { loadSections } from "../../state/actions/sectionActions"

function Home() {

    const {user, getAccessTokenSilently} = useAuth0();
    const dispatch = useDispatch();

    useEffect(() => {
        new CategoryService().GetAll().then((categories) => {dispatch(loadCategories(categories))}),
        new MeasureService().GetAll().then((measures) => {dispatch(loadMeasures(measures))}),
        new IngredientService().GetAll().then((ingredients) => {dispatch(loadIngredients(ingredients))}),
        new ProductService().GetAll().then((products) => {dispatch(loadProducts(products))}),
        new StatusService().GetAll().then((statueses) => {dispatch(loadStatues(statueses))}),
        new RolService().GetAll().then((rols) => {dispatch(loadRols(rols))}),
        new AddressService().GetAll().then((addressess) => {dispatch(loadAddresses(addressess))}),
        new OrderService().GetAll().then((orders) => {dispatch(loadOrders(orders))}),
        new BillService().GetAll().then((bills) => {dispatch(loadBills(bills))}),
        new UserService().GetAll().then((users) => {dispatch(loadUsers(users))}),
        new SectionService().GetAll().then((sections) => {dispatch(loadSections(sections))}),
        new LocationService().GetAll().then((locations) => {dispatch(loadLocations(locations))})

    }, [])

    useEffect(()=>{
        getAccessTokenSilently(
            {
                authorizationParams: {
                    audience: import.meta.env.VITE_REACT_APP_AUDIENCE,
                }
            }
        )   
        .then(data => {
            dispatch(load_token(data))
        })
    },[])
    console.log(user)

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-[85vw]">
                <HomeRoutes/>
            </div>
        </div>
    )
}

export default Home