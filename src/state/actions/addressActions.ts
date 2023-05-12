import { Address } from "../../models/Address"
import { LOAD_ADDRESSES } from "../types"

export const loadAddresses = (addresses: Address[]) => {
    return {
        type: LOAD_ADDRESSES,
        payload: addresses
    }
}