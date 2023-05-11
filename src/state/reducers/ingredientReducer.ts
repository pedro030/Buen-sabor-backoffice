import { LOAD_INGREDIENTS } from "../types";

const initialState = {
    categories: []
}

export default function ingredientReducer(state = initialState, action: any) {
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