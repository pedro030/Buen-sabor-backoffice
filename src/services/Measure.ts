import { Measure } from "../models/Measure";
import { ApiServ } from "./ApiServ";

export class MeasureService extends ApiServ<Measure>{
    endpoint= "measures";
}