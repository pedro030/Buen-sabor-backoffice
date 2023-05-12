import { Address } from "../models/Address";
import { ApiServ } from "./ApiServ";

export class AddressService extends ApiServ<Address>{
    endpoint = "addresses"
}