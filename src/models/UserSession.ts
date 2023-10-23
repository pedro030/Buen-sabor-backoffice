import { IButtonsByRol } from "../interfaces/IButtonsByRol";
import { User } from "./User";

export interface UserSession {
    token: string,
    user?: User,
    rol: keyof IButtonsByRol
}