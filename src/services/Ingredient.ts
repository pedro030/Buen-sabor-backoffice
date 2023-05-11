import { Ingredient } from "../models/Ingredient";
import { ApiServ } from "./ApiServ";

export class IngredientService extends ApiServ<Ingredient>{
    endpoint= "ingredients";
}