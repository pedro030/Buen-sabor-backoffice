import { User } from "../../models/User";
import { LOAD_ROL, LOAD_TOKEN, SIGN_IN } from "../types";

interface userSession {
    token: string,
    user?: User,
    rol:string
}
const initialState:userSession = {
    token: "",
    rol:""
}

export default function userSessionReducer(state = initialState, action: any){
    switch (action.type) {
        case LOAD_TOKEN:
            return{
                ...state,
                token: action.payload.token
            }
        case LOAD_ROL:
            return{
                ...state,
                rol: action.payload.rol
            }
        case SIGN_IN:
            return{
                ...state,
                user: action.payload.user
            }
        default:
            return state;
    }
}