import { Order } from "../../models/Order"
import { ADD_ORDER, LOAD_ORDERS, UPDATE_ORDER } from "../types"

export const loadOrders = (orders: Order[]) => {
    return {
        type: LOAD_ORDERS,
        payload: orders
    }
}

export const updateOrder = (orderId: string, updatedOrder: Order) => {
    return {
        type: UPDATE_ORDER,
        payload: { orderId, updatedOrder}
    }
}

export const addOrder = (newOrder: Order) => {
    return {
        type: ADD_ORDER,
        payload: newOrder
    }
}