import { Category } from "../models/Category";
import { ApiServ } from "./ApiServ";

export class CategoryService extends ApiServ<Category>{
    endpoint = "categories"
}