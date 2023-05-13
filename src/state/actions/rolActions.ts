import { Rol } from "../../models/Rol"
import { LOAD_ROLS } from "../types"

export const loadRols = (rols: Rol[]) => {
    return {
        type: LOAD_ROLS,
        payload: rols
    }
}