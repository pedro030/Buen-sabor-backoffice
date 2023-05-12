import { LOAD_BILLS } from "../types";

const initialState = {
    bills: []
}

export default function billReducer(state = initialState, action: any) {
    switch (action.type) {
        case LOAD_BILLS:
            return {
                ...state,
                bills: action.payload
            }
        default:
            return state;
    }
}