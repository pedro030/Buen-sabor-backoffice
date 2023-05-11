import { LOAD_TOKEN } from "../types"

export const load_token = (token: string) => {
    return {
        type: LOAD_TOKEN,
        payload:{
            token
        }
    }
}