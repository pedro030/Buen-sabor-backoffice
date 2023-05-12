import { LOAD_SECTION } from "../types";

const initialState = {
    sections: []
}

export default function sectionReducer(state = initialState, action: any) {
    switch (action.type) {
        case LOAD_SECTION:
            return {
                ...state,
                sections: action.payload
            }
        default:
            return state;
    }
}