import { combineReducers } from "redux";
import userSessionReducer from "./userSessionReducer";
import measureReducer from "./measureReducer";
import categoryReducer from "./categoryReducer";
import ingredientReducer from "./ingredientReducer";
import productReducer from "./productReducer";
import orderReducer from "./orderReducer";

const reducer = combineReducers({
    measures: measureReducer,
    categories: categoryReducer,
    ingredients: ingredientReducer,
    products: productReducer,
    orders: orderReducer,
    userSession: userSessionReducer
})

export default reducer;