import { User } from "./User";

export interface UserSession {
    token: string,
    user?: User,
    rol: string
}