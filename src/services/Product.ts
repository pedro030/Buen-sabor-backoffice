import { Product } from "../models/Product";
import { ApiServ } from "./ApiServ";

export class ProductService extends ApiServ<Product>{
    endpoint = "products"
}