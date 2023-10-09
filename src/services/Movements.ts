import { Movement } from "../models/Movement";
import { ApiServ } from "./ApiServ";

export class MovementsService extends ApiServ<Movement>{
    endpoint = "movements"

    GetByDates(startDate:string, endDate:string, type:string = ""): Promise<Movement[]> {
        return fetch(`${this.apiURL}/${this.endpoint}/getMovementsByDates/${startDate}&${endDate}&${type}`, {
            headers: {
                Authorization: `Bearer ${(this.token).trim()}`
            }
        })
            .then(res => {
                const resouls = res.json()
                return resouls
            })
            .catch(err => {
                console.log(err)
            })
    }

}