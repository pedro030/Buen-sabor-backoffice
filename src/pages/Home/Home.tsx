import { useDispatch} from "react-redux"
import Sidebar from "../../components/sidebar_employee/Sidebar"
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from "react"
import { load_token } from "../../state/actions/userSessionAction"
import HomeRoutes from "../../router/HomeRoutes"

function Home() {

    const {user, getAccessTokenSilently} = useAuth0();
    const dispatch = useDispatch();

    useEffect(()=>{
        getAccessTokenSilently(
            {
                authorizationParams: {
                    audience: import.meta.env.VITE_REACT_APP_AUDIENCE,
                }
            }
        )   
        .then(data => {
            console.log('token?')
            console.log(data)
            dispatch(load_token(data))
        })
    },[])
    console.log(user)

    return (
        <div className="container-crud">
            <Sidebar />
            <div className="container-crud-right">
                <HomeRoutes/>
            </div>
        </div>
    )
}

export default Home