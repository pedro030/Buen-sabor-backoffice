import { ReduxAction } from "../../interfaces/ReduxAction";
import { LOAD_CATEGORIES } from "../types";

const initialState = {
    categories: []
}

export default function categoryReducer(state = initialState, action: ReduxAction) {
    switch (action.type) {
        case LOAD_CATEGORIES:
            return {
                ...state,
                categories: action.payload
            }
        default:
            return state;
    }
}