import { Bill } from "../models/Bill";
import { ApiServ } from "./ApiServ";

export class BillService extends ApiServ<Bill>{
    endpoint = "bills"
}