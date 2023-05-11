import { Category } from "./Category";

export interface Product{
    id: string,
    name: string,
    price: number,
    active: boolean,
    subcategory?: Category
}