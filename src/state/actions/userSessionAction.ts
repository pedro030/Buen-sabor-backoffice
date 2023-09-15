import { User } from "../../models/User"
import { LOAD_ROL, LOAD_TOKEN, SIGN_IN } from "../types"

export const load_token = (token: string) => {
    return {
        type: LOAD_TOKEN,
        payload:{
            token
        }
    }
}
export const sign_in = (user: User) => {
    return {
        type: SIGN_IN,
        payload: {
            user
        }
    }
}
export const load_rol = (rol: string) => {
    return {
        type: LOAD_ROL,
        payload: {
            rol
        }
    }
}