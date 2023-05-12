import { Section } from "../../models/Section"
import { LOAD_SECTION } from "../types"

export const loadSections = (sections: Section[]) => {
    return {
        type: LOAD_SECTION,
        payload: sections
    }
}