import { User } from "../../models/User"
import { LOAD_USERS } from "../types"

export const loadUsers = (users: User[]) => {
    return {
        type: LOAD_USERS,
        payload: users
    }
}