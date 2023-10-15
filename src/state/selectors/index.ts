import { IRootState } from "../../interfaces/IRootState"

// CATEGORIES
export const categoriesSelector = (state:IRootState) => state.categories.categories

// MEASURES
export const measureSelector = (state: IRootState) => state.measures.measures

// INGREDIENTS
export const ingredientSelector = (state: IRootState) => state.ingredients.ingredients

// PRODUCTS
export const productSelector = (state: IRootState) => state.products.products

// ORDERS
export const orderSelector = (state: IRootState) => state.orders.orders

// BILL
export const billSelector = (state: IRootState) => state.bills.bills

// USER
export const userSelector = (state: IRootState) => state.users.users

// SECTION
export const sectionSelector = (state: IRootState) => state.sections.sections

// LOCATION
export const locationSelector = (state: IRootState) => state.locations.locations

// ADDRESS
export const addressSelector = (state: IRootState) => state.addresses.addresses

// ROLS
export const rolSelector = (state: IRootState) => state.rols.rols

// STATUSES
export const statusSelector = (state: IRootState) => state.statuses.statuses

// USER SESSION INFO
export const userSessionSelector = (state: IRootState) => state.userSession

// MOVEMENTS
export const movementsSelector = (state: IRootState) => state.movements.movements

