import { Measure } from "./Measure";

export interface Ingredient{
    id:string;
    name: string;
    cost: number;
    stock: number;
    measure?:Measure;
}