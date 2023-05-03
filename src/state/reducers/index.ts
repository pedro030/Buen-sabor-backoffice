import { combineReducers } from "redux";
import userSessionReducer from "./userSessionReducer";
import unitOfMeasureReducer from "./unitOfMeasureReducer";
import categoryReducer from "./categoryReducer";

const reducer = combineReducers({
    unitOfMeasure: unitOfMeasureReducer,
    categories: categoryReducer
})

export default reducer;