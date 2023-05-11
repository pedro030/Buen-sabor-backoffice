import { LOAD_PRODUCTS } from "../types";

const initialState = {
    products: []
}

export default function productReducer(state = initialState, action: any) {
    switch (action.type) {
        case LOAD_PRODUCTS:
            return {
                ...state,
                products: action.payload
            }
        default:
            return state;
    }
}