import { Product } from "../../models/Product"
import { LOAD_PRODUCTS } from "../types"

export const loadProducts = (products: Product[]) => {
    return {
        type: LOAD_PRODUCTS,
        payload: products
    }
}