import { ReduxAction } from "../../interfaces/ReduxAction";
import { LOAD_ADDRESSES } from "../types";

const initialState = {
    addresses: []
}

export default function addressReducer(state = initialState, action: ReduxAction) {
    switch (action.type) {
        case LOAD_ADDRESSES:
            return {
                ...state,
                addresses: action.payload
            }
        default:
            return state;
    }
}