import { ReduxAction } from "../../interfaces/ReduxAction";
import { LOAD_PRODUCTS } from "../types";

const initialState = {
    products: []
}

export default function productReducer(state = initialState, action: ReduxAction) {
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