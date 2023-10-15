import { ReduxAction } from "../../interfaces/ReduxAction";
import { LOAD_STATUSES } from "../types";

const initialState = {
    statuses: []
}

export default function statusReducer(state = initialState, action: ReduxAction) {
    switch (action.type) {
        case LOAD_STATUSES:
            return {
                ...state,
                statuses: action.payload
            }
        default:
            return state;
    }
}