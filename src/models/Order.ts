import { User } from "@auth0/auth0-react";
import { Address } from "./Address";
import { Status } from "./Status";

export interface Order{
    id: string;
    date:string;
    withdrawal_mode:string,
    address: Address,
    status:Status,
    user: User,
    }