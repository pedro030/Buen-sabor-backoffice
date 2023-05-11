import { Measure } from "../../models/Measure"
import { LOAD_MEASURE } from "../types"

export const loadMeasures = (measures: Measure[]) => {
    return {
        type: LOAD_MEASURE,
        payload: measures
    }
}