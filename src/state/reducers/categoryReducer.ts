import { LOAD_CATEGORIES } from "../types";

const initialState = {
    categories: []
}

export default function categoryReducer(state = initialState, action: any) {
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