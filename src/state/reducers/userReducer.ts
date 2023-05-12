import { LOAD_USERS } from "../types";

const initialState = {
    users: []
}

export default function userReducer(state = initialState, action: any) {
    switch (action.type) {
        case LOAD_USERS:
            return {
                ...state,
                users: action.payload
            }
        default:
            return state;
    }
}