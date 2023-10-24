import { User } from "@auth0/auth0-react";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { Ingredient } from "../models/Ingredient";

export interface ICategoryFormModal {
    obj?: Category,
    open: boolean,
    onClose: () => void,
    watch: boolean
}

export interface IProductFormModal {
    obj?: Product,
    open: boolean,
    onClose: () => void,
    watch: boolean
}

export interface IUserFormModal {
    obj?: User,
    open: boolean,
    onClose: () => void,
    employee: boolean,
    watch: boolean
}

export interface IIngredientFormModal {
    obj?: Ingredient,
    open: boolean,
    onClose: () => void,
    watch: boolean
}

export interface IIngredientListFormModal {
    obj?: Ingredient[],
    open: boolean,
    onClose: () => void,
}