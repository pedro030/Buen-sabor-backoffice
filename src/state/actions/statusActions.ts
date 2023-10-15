import { Status } from "../../models/Status"
import { LOAD_STATUSES } from "../types"

export const loadStatuses = (statuses: Status[]) => {
    return {
        type: LOAD_STATUSES,
        payload: statuses
    }
}