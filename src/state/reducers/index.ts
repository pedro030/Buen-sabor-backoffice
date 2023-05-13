import { combineReducers } from "redux";
import userSessionReducer from "./userSessionReducer";
import measureReducer from "./measureReducer";
import categoryReducer from "./categoryReducer";
import ingredientReducer from "./ingredientReducer";
import productReducer from "./productReducer";
import orderReducer from "./orderReducer";
import billReducer from "./billReducer";
import userReducer from "./userReducer";
import sectionReducer from "./sectionReducer";
import locationReducer from "./locationReducer";
import addressReducer from "./addressReducer";
import rolReducer from "./rolReducer";

const reducer = combineReducers({
    measures: measureReducer,
    categories: categoryReducer,
    ingredients: ingredientReducer,
    products: productReducer,
    orders: orderReducer,
    bills: billReducer,
    users: userReducer,
    sections: sectionReducer,
    locations: locationReducer,
    addresses: addressReducer,
    rols: rolReducer,
    userSession: userSessionReducer
})

export default reducer;