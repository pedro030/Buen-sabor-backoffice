import { LOAD_STATUES } from "../types";

const initialState = {
    statues: []
}

export default function statusReducer(state = initialState, action: any) {
    switch (action.type) {
        case LOAD_STATUES:
            return {
                ...state,
                statues: action.payload
            }
        default:
            return state;
    }
}