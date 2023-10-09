import { Order } from "./Order";

export interface Movement {
    id: string,
    type: string,
    date: string,
    description: string,
    total: number,
    order?: Order
}