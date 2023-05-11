import { Ingredient } from "../../models/Ingredient"
import { LOAD_INGREDIENTS } from "../types"

export const loadIngredients = (ingredients: Ingredient[]) => {
    return {
        type: LOAD_INGREDIENTS,
        payload: ingredients
    }
}