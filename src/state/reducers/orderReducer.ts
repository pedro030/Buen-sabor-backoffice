import { Order } from "../../models/Order";
import { LOAD_ORDERS, UPDATE_ORDER } from "../types";

const initialState = {
    orders: []
}

export default function orderReducer(state = initialState, action: any) {
    switch (action.type) {
        case LOAD_ORDERS:
            return {
                ...state,
                orders: action.payload
            }
        case UPDATE_ORDER:
            const { orderId, updatedOrder } = action.payload;
            const updatedOrders = state.orders.map((order: Order) => order.id === orderId ? { ...order, ...updatedOrder } : order);

            return {
                ...state,
                orders: updatedOrders
            }
        default:
            return state;
    }
}