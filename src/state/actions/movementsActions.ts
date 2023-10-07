import { Movement } from "../../models/Movement"
import { LOAD_MOVEMENTS } from "../types"

export const loadMovements = (movements: Movement[]) => {
    return {
        type: LOAD_MOVEMENTS,
        payload: movements
    }
}