// Axios
import axios from "axios";

// Types
import { Product } from "../models/Product";
import { ApiServ } from "./ApiServ";

export class ProductService extends ApiServ<Product>{
    endpoint = "products"

    // Nuevo Producto
    async newProduct(product: Product, imagen: File | null) {

        try {
            let formData = new FormData();

            formData.append(
                'productDto',
                new Blob([JSON.stringify(product)], {
                    type: 'application/json',
                })
            );

            imagen !== null && formData.append('image', imagen);

            const data = await axios.post(`${this.apiURL}/${this.endpoint}/save`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + this.token,
                },
            });
            return data;
        } catch (error) {
            console.error(error)
        }
    }
    
    // Actualizar Producto
    async updateProduct(product: Product, imagen: File | null) {

        try {

            let formData = new FormData();

            formData.append(
                'productDto',
                new Blob([JSON.stringify(product)], {
                    type: 'application/json',
                })
            );

            imagen !== null && formData.append('image', imagen);

            const data = await axios.put(`${this.apiURL}/${this.endpoint}/update/${product.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + this.token,
                },
            });
            return data;
        } catch (error) {
            console.error(error)
        }
    }
}