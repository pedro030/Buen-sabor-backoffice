import { LOAD_UNITS_OF_MEASURE } from "../types";

const initialState = {
    unitsOfMeasure: []
}

export default function unitOfMeasureReducer(state = initialState, action: any) {
    switch (action.type) {
        case LOAD_UNITS_OF_MEASURE:
            return {
                ...state,
                unitsOfMeasure: action.payload
            }
        default:
            return state;
    }
}