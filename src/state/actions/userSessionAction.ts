import { SIGN_IN } from "../types"

export const sign_in = (username:String, password:String) => {
    return {
        type: SIGN_IN,
        payload:{
            username,
            password
        }
    }
}