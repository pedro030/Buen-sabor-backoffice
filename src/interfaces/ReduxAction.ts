import { Address } from "../models/Address";
import { Bill } from "../models/Bill";
import { Category } from "../models/Category";
import { Ingredient } from "../models/Ingredient";
import { Location } from "../models/Location";
import { Measure } from "../models/Measure";
import { Movement } from "../models/Movement";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { Section } from "../models/Section";
import { Status } from "../models/Status";
import { User } from "../models/User";
import {
  ADD_ORDER,
  LOAD_ADDRESSES,
  LOAD_BILLS,
  LOAD_CATEGORIES,
  LOAD_INGREDIENTS,
  LOAD_LOCATION,
  LOAD_MEASURE,
  LOAD_MOVEMENTS,
  LOAD_ORDERS,
  LOAD_PRODUCTS,
  LOAD_ROL,
  LOAD_ROLS,
  LOAD_SECTION,
  LOAD_STATUSES,
  LOAD_TOKEN,
  LOAD_USERS,
  SIGN_IN,
  UPDATE_ORDER,
} from "../state/types";

// CATEGORY
type LoadCategoriesAction = {
  type: typeof LOAD_CATEGORIES;
  payload: Category[];
};

// STATUS
type LoadStatusesAction = {
  type: typeof LOAD_STATUSES;
  payload: Status[];
};

// ADDRESS
type LoadAddressesAction = {
  type: typeof LOAD_ADDRESSES;
  payload: Address[];
};

// BILL
type LoadBillsAction = {
  type: typeof LOAD_BILLS;
  payload: Bill[];
};

// INGREDIENT
type LoadIngredientsAction = {
  type: typeof LOAD_INGREDIENTS;
  payload: Ingredient[];
};

// LOCATION
type LoadLocationsAction = {
  type: typeof LOAD_LOCATION;
  payload: Location[];
};

// MEASURE
type LoadMeasuresAction = {
  type: typeof LOAD_MEASURE;
  payload: Measure[];
};

// MOVEMENT
type LoadMovementsAction = {
  type: typeof LOAD_MOVEMENTS;
  payload: Movement[];
};

// PRODUCT
type LoadProductsAction = {
  type: typeof LOAD_PRODUCTS;
  payload: Product[];
};

// ROLS
type LoadRolsAction = {
  type: typeof LOAD_ROLS;
  payload: Measure[];
};

// SECTION
type LoadSectionsAction = {
  type: typeof LOAD_SECTION;
  payload: Section[];
};

// USER
type LoadUserssAction = {
  type: typeof LOAD_USERS;
  payload: User[];
};

// USER SESSION
type LoadUserTokenAction = {
  type: typeof LOAD_TOKEN;
  payload: string;
};

type LoadUserSessionAction = {
  type: typeof SIGN_IN;
  payload: User;
};

type LoadUserRolAction = {
  type: typeof LOAD_ROL;
  payload: string;
};

// ORDER
type LoadOrdersAction = {
  type: typeof LOAD_ORDERS;
  payload: Order[];
};

type UpdateOrderAction = {
  type: typeof UPDATE_ORDER;
  payload: {
    orderId: string;
    updatedOrder: Order;
  };
};

type AddOrderAction = {
  type: typeof ADD_ORDER;
  payload: Order
}

export type ReduxAction =
  | LoadStatusesAction
  | LoadCategoriesAction
  | LoadAddressesAction
  | LoadBillsAction
  | LoadIngredientsAction
  | LoadLocationsAction
  | LoadMeasuresAction
  | LoadMovementsAction
  | LoadProductsAction
  | LoadRolsAction
  | LoadSectionsAction
  | LoadUserssAction
  | LoadUserTokenAction
  | LoadUserSessionAction
  | LoadUserRolAction
  | LoadOrdersAction
  | UpdateOrderAction
  | AddOrderAction;
