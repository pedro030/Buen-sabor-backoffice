import { Order } from "../models/Order";
import { ApiServ } from "./ApiServ";

export class OrderService extends ApiServ<Order>{
    endpoint = "orders"
}