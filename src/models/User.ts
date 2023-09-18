import Order from "../pages/Order/Order";
import { Address } from "./Address";
import { Rol } from "./Rol";

export interface User{
    id: string,
    firstName: string,
    lastName: string,
    mail: string,
    password: string,
    rol: Rol,
    blacklist: string,
    orders: Order[],
    telephone: number,
    addresses: Address[]
}
