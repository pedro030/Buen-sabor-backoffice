import { Bill } from "../models/Bill";
import { Category } from "../models/Category";
import { Ingredient } from "../models/Ingredient";
import { Measure } from "../models/Measure";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { Section } from "../models/Section";
import { Address } from "../models/Address";
import { User } from "../models/User";
import { Rol } from "../models/Rol";
import { Status } from "../models/Status";
import { Movement } from "../models/Movement";
import { UserSession } from "../models/UserSession";

export interface IRootState {
    categories: {
        categories: Category[];
    };
    measures: {
        measures: Measure[];
    };
    ingredients: {
        ingredients: Ingredient[];
    };
    products: {
        products: Product[];
    };
    orders: {
        orders: Order[];
    };
    bills: {
        bills: Bill[];
    };
    users: {
        users: User[];
    };
    sections: {
        sections: Section[];
    };
    locations: {
        locations: Location[];
    };
    addresses: {
        addresses: Address[]
    };
    rols: {
        rols: Rol[];
    };
    statuses: {
        statuses: Status[];
    };
    movements: {
        movements: Movement[];
    }
    userSession: UserSession;
}