import { Category } from "./Category";

export interface Product{
    id:string;
    name: String;
    price: Number;
    active: Boolean;
    subcategory?: Category
}