import { Order } from "../../models/Order"
import { LOAD_ORDERS } from "../types"

export const loadOrders = (orders: Order[]) => {
    return {
        type: LOAD_ORDERS,
        payload: orders
    }
}