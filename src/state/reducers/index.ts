import { combineReducers } from "redux";
import userSessionReducer from "./userSessionReducer";

const reducer = combineReducers({
    userSession: userSessionReducer
})

export default reducer;