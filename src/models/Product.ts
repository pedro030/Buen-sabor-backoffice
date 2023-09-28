import { Category } from "./Category";
import { Ingredient } from "./Ingredient";

export interface Product{
    id: string,
    name: string,
    image: string,
    price: number,
    cookingTime: number,
    quantity_sold: number,
    subcategory: Category,
    cost:number,
    ingredients: Array<Ingredient>,
    active: boolean
}
