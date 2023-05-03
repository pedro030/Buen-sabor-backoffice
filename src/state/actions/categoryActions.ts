import { Category } from "../../models/Category"
import { LOAD_CATEGORIES } from "../types"

export const loadCategories = (categories: Category[]) => {
    return {
        type: LOAD_CATEGORIES,
        payload: categories
    }
}