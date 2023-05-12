import { User } from "../models/User";
import { ApiServ } from "./ApiServ";

export class UserService extends ApiServ<User>{
    endpoint = "users"
}