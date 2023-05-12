import { Location } from "./Location"
import { User } from "./User"

export interface Address {
    id: string,
    streat: string,
    number: number
    location: Location,
    user: User
}