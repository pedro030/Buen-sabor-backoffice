import { combineReducers } from "redux";
import userSessionReducer from "./userSessionReducer";
import measureReducer from "./measureReducer";
import categoryReducer from "./categoryReducer";
import ingredientReducer from "./ingredientReducer";

const reducer = combineReducers({
    measures: measureReducer,
    categories: categoryReducer,
    ingredients: ingredientReducer,
    userSession: userSessionReducer
})

export default reducer;