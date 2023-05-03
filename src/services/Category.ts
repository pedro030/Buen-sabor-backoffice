import { Category } from "../models/Category";
import { loadCategories } from "../state/actions/categoryActions";
import store from "../state/store/store";


export const getCategories = async():Promise<Category[]> =>{
    const resp = await fetch("http://localhost:3000/categories")
    const data = await resp.json();
    store.dispatch(loadCategories(data))
    return data
}

export const newCategory = async(newCategory: Category) =>{
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
    };

    const resp = await fetch('http://localhost:3000/categories', requestOptions)
    const data = await resp.json()
    return data
}

export const updateCategory = async(category: Category) => {
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
    };

    const resp = await fetch(`http://localhost:3000/categories/${category.id}`, requestOptions)
    const data = await resp.json()
    return data
}