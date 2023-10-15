import { ReduxAction } from "../../interfaces/ReduxAction";
import { LOAD_INGREDIENTS } from "../types";

const initialState = {
    ingredients: []
}

export default function ingredientReducer(state = initialState, action: ReduxAction) {
    switch (action.type) {
        case LOAD_INGREDIENTS:
            return {
                ...state,
                ingredients: action.payload
            }
        default:
            return state;
    }
}