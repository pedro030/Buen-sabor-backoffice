import { User } from "../../models/User";
import { LOAD_TOKEN, SIGN_IN } from "../types";

interface userSession {
    token: string,
    user?: User
}
const initialState:userSession = {
    token: ""
}

export default function userSessionReducer(state = initialState, action: any){
    switch (action.type) {
        case LOAD_TOKEN:
            return{
                ...state,
                token: action.payload.token
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