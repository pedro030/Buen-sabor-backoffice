import { LOAD_ORDERS } from "../types";

const initialState = {
    orders: []
}

export default function orderReducer(state = initialState, action: any) {
    switch (action.type) {
        case LOAD_ORDERS:
            return {
                ...state,
                orders: action.payload
            }
        default:
            return state;
    }
}