import { Status } from "../../models/Status"
import { LOAD_STATUES } from "../types"

export const loadStatues = (statues: Status[]) => {
    return {
        type: LOAD_STATUES,
        payload: statues
    }
}