import { Location } from "../models/Location";
import { ApiServ } from "./ApiServ";

export class LocationService extends ApiServ<Location>{
    endpoint = "locations"
}