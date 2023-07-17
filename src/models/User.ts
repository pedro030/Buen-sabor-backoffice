import { Rol } from "./Rol";

export interface User{
    id: string,
    firstName: string,
    lastName: string,
    mail: string,
    password: string,
    rol: Rol
}