import { ReduxAction } from "../../interfaces/ReduxAction";
import { UserSession } from "../../models/UserSession";
import { LOAD_ROL, LOAD_TOKEN, SIGN_IN } from "../types";

const initialState: UserSession = {
    token: "",
    rol: ""
}

export default function userSessionReducer(state = initialState, action: ReduxAction){
    switch (action.type) {
        case LOAD_TOKEN:
            return{
                ...state,
                token: action.payload
            }
        case LOAD_ROL:
            return{
                ...state,
                rol: action.payload
            }
        case SIGN_IN:
            return{
                ...state,
                user: action.payload
            }
        default:
            return state;
    }
}