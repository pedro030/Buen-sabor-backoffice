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
    subcategory_fk?: Category,
    cost:number,
    ingredients: Array<Ingredient>,
    active: boolean
}

export interface ProductOrder {
    id: number,
    product: Product,
    cant: number
}
