import { ReduxAction } from "../../interfaces/ReduxAction";
import { LOAD_MEASURE } from "../types";

const initialState = {
    measures: []
}

export default function measureReducer(state = initialState, action: ReduxAction) {
    switch (action.type) {
        case LOAD_MEASURE:
            return {
                ...state,
                measures: action.payload
            }
        default:
            return state;
    }
}