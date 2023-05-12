import { Rol } from "./Rol";

export interface User{
    id: string,
    first_name: string,
    last_name: string,
    mail: string,
    password: string,
    rol: Rol
}