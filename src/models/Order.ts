import { User } from "@auth0/auth0-react";
import { Address } from "./Address";
import { Status } from "./Status";

export interface Order{
    id: string;
    date: string;
    withdrawalMode: string,
    address: Address,
    statusOrder: Status,
    totalPrice: number,
    user: User, 
  }