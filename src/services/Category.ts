import { Category } from "../models/Category";

export const getCategories = async():Promise<Category[]> =>{
    const resp = await fetch("http://localhost:3000/categories")
    const data = await resp.json();

    return data;
}

export const newCategory = async(newCategory: Category) =>{
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
    };

    fetch('http://localhost:3000/categories', requestOptions)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
}

export const updateCategory = async(category: Category) => {
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
    };

    fetch(`http://localhost:3000/categories/${category.id}`, requestOptions)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
}