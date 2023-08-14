import { Category } from "./Category";

export interface Product{
    id: string,
    name: string,
    price: number,
    subcategory: Category
}