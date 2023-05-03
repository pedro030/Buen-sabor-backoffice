import { Measure } from "../../models/Measure"
import { LOAD_UNITS_OF_MEASURE } from "../types"

export const loadUnitsOfMeasure = (units: Measure[]) => {
    return {
        type: LOAD_UNITS_OF_MEASURE,
        payload: units
    }
}