import { LOAD_ROLS } from "../types";

const initialState = {
    rols: []
}

export default function rolReducer(state = initialState, action: any) {
    switch (action.type) {
        case LOAD_ROLS:
            return {
                ...state,
                rols: action.payload
            }
        default:
            return state;
    }
}