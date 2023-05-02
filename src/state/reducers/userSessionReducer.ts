import { SIGN_IN } from "../types";

const initialState = {
    username:'',
    password: '',
}

export default function userSessionReducer(state = initialState, action: any){
    switch (action.type) {
        case SIGN_IN:
            return{
                ...state,
                username: action.payload.username,
                password: action.payload.password
            }
        default:
            return state;
    }
}