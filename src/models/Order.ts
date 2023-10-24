import { User } from "@auth0/auth0-react";
import { Status } from "./Status";
import { ProductOrder } from "./Product";

export interface Order {
    id: string,
    creationDate: string,
    totalCookingTime: number,
    paymode: { id: number, paymode: string },
    withdrawalMode: string,
    address: string,
    statusOrder: Status,
    totalPrice: number,
    products: ProductOrder[],
    user: User 
  }