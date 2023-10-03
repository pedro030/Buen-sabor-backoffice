import { Order } from "./Order";

export interface UserRanking {
    id: number,
    blacklist: number,
    mail: string,
    telephone: number | null,
    first_name: string,
    last_name: string,
    orders_quantity: number,
    total_sum: number
}