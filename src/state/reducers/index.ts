import { combineReducers } from "redux";
import userSessionReducer from "./userSessionReducer";
import measureReducer from "./measureReducer";
import categoryReducer from "./categoryReducer";

const reducer = combineReducers({
    measures: measureReducer,
    categories: categoryReducer,
    userSession: userSessionReducer
})

export default reducer;