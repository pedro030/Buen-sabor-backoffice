import { Category } from "./Category";
import { Ingredient } from "./Ingredient";

export interface Product{
    id: string,
    name: string,
    image: string,
    price: number,
    cookingTime: number,
    quantitySold: number,
    subcategory: Category
    ingredients: Array<Ingredient>
    active: boolean
}
