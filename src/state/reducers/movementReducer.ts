import { ReduxAction } from "../../interfaces/ReduxAction";
import { LOAD_MOVEMENTS } from "../types";

const initialState = {
    movements: []
}

export default function movementReducer(state = initialState, action: ReduxAction) {
    switch (action.type) {
        case LOAD_MOVEMENTS:
            return {
                ...state,
                movements: action.payload
            }
        default:
            return state;
    }
}