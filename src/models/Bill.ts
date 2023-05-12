import { Order } from "./Order";

export interface Bill{
    id: string,
    date: string,
    order: Order
}