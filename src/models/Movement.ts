import { Order } from "./Order";

export interface Movement {
    id: number,
    type: string,
    date: string,
    description: string,
    total: number,
    order?: Order
}