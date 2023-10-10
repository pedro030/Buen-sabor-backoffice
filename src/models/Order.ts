import { User } from "@auth0/auth0-react";
import { Address } from "./Address";
import { Status } from "./Status";
import { Product } from "./Product";

export interface Order{
    id: string,
    creationDate: string,
    totalCookingTime: number | null,
    paymode: { id: number, paymode: string },
    withdrawalMode: string,
    address: string,
    statusOrder: Status,
    totalPrice: number,
    products: Product[],
    user: User 
  }