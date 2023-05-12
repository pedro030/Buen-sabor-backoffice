import { Bill } from "../../models/Bill"
import { LOAD_BILLS } from "../types"

export const loadBills = (bills: Bill[]) => {
    return {
        type: LOAD_BILLS,
        payload: bills
    }
}