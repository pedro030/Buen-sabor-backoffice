import { Location } from "../../models/Location"
import { LOAD_LOCATION } from "../types"

export const loadLocations = (locations: Location[]) => {
    return {
        type: LOAD_LOCATION,
        payload: locations
    }
}