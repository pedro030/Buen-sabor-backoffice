import { Section } from "../models/Section";
import { ApiServ } from "./ApiServ";

export class SectionService extends ApiServ<Section>{
    endpoint = "sections"
}