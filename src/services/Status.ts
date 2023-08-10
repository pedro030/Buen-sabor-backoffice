import { Status } from "../models/Status";
import { ApiServ } from "./ApiServ";

export class StatusService extends ApiServ<Status>{
    endpoint = "statusorder"
}