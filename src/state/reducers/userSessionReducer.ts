import { LOAD_TOKEN } from "../types";

const initialState = {
    token: ""
}

export default function userSessionReducer(state = initialState, action: any){
    switch (action.type) {
        case LOAD_TOKEN:
            return{
                ...state,
                token: action.payload.token
            }
        default:
            return state;
    }
}