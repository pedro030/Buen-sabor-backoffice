import { ReduxAction } from "../../interfaces/ReduxAction";
import { LOAD_BILLS } from "../types";

const initialState = {
    bills: []
}

export default function billReducer(state = initialState, action: ReduxAction) {
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