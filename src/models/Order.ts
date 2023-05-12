import { Address } from "./Address";
import { Status } from "./Status";

export interface Order{
    id: string;
    date:string;
    withdrawal_mode:string,
    address: Address,
    status:Status,
    user: string, //pass
    }