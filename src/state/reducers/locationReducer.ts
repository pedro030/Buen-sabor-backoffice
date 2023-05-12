import { LOAD_LOCATION } from "../types";

const initialState = {
    locations: []
}

export default function locationReducer(state = initialState, action: any) {
    switch (action.type) {
        case LOAD_LOCATION:
            return {
                ...state,
                locations: action.payload
            }
        default:
            return state;
    }
}