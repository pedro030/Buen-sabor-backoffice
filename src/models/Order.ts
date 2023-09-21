import { User } from "@auth0/auth0-react";
import { Address } from "./Address";
import { Status } from "./Status";
import { Product } from "./Product";

export interface Order{
    id: string,
    date: string,
    totalCookingTime: number | null,
    paymode: any,
    withdrawalMode: string,
    address: String,
    statusOrder: Status,
    totalPrice: number,
    products: Product[],
    user: User 
  }