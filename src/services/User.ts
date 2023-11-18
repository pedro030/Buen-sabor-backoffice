import { User } from "../models/User";
import { ApiServ } from "./ApiServ";

export class UserService extends ApiServ<User>{
    endpoint = "users"

    async getUserByMail(mail: string): Promise<User> {
        const requestOptions: RequestInit = {
            headers: {
                Authorization: `Bearer ${this.token.trim()}`
            }
        }
        return fetch(`${this.apiURL}/${this.endpoint}/getUserByEmail/${mail}`, requestOptions)
            .then(res => {
                if (res.status != 200) return
                return res.json();
            })
            .catch(err => {
                console.log(err)
            })
    }

    async getAllWP(): Promise<User[]> {
        const requestOptions: RequestInit = {
            headers: {
                Authorization: `Bearer ${this.token.trim()}`
            }
        }
        return fetch(`${this.apiURL}/${this.endpoint}/getAllWP`, requestOptions)
            .then(res => {
                if (res.status != 200) return
                return res.json();
            })
            .catch(err => {
                console.log(err)
            })
    }
}