import { configureStore } from "@reduxjs/toolkit";
import reducer from "../reducers"

const store = configureStore({
    reducer
})

store.subscribe(() => store);

export default store;