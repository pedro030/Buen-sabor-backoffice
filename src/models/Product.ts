import { Category } from "./Category";
import { Ingredient } from "./Ingredient";

export interface Product {
    id: string,
    name: string,
    image: string,
    price: number,
    cookingTime: number,
    quantity_sold: number,
    subcategory: Category,
    subcategory_fk?: Category,
    cost:number,
    ingredients: ProductIngredient[],
    active: boolean
}

export interface ProductIngredient {
    id: string,
    ingredient: Ingredient,
    cant: number
}

export interface ProductOrder {
    id: number,
    product: Product,
    cant: number
}
