import { Rol } from "../models/Rol";
import { ApiServ } from "./ApiServ";

export class RolService extends ApiServ<Rol>{
    endpoint = "rols"
}