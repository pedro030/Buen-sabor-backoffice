import store from '../state/store/store';

// Api Service Genérico
export class ApiServ<T extends { id: string }> {
    // El endpoint dependerá del tipo de service que se instancie
    endpoint: string = "";
    // Se obtiene el token y la Api URL para poder hacer los fetch
    token = store.getState().userSession.token
    apiURL = import.meta.env.VITE_REACT_APP_API_URL;

    // Get All
    GetAll(): Promise<T[]> {
        return fetch(`${this.apiURL}/${this.endpoint}/getAll`, {
            headers: {
                Authorization: `Bearer ${(this.token).trim()}`
            }
        })
            .then(res => {
                const response = res.json()
                return response;
            })
            .catch(err => {
                console.log(err)
            })
    }

    // Get One by Id
    GetOne(id: string): Promise<T> {
        return fetch(`${this.apiURL}/${this.endpoint}/get/${id}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        })
            .then(res => {
                return res.json()
            })
            .catch(err => {
                console.log(err)
            })
    }

    // Crear un nuevo objeto
    async newObj(newObj: T) {

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(newObj)
        };


        const response = await fetch(`${this.apiURL}/${this.endpoint}/save`, requestOptions);
        return response;
    }

    // Actualizar Objeto
    async updateObj(updateObj: T) {
        const requestOptions: RequestInit = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(updateObj)
        };

        const response = await fetch(`${this.apiURL}/${this.endpoint}/update/${updateObj.id}`, requestOptions);
        return response;
    }

    // Eliminar Objeto
    async deleteObj(deleteObj: T) {
        const requestOptions: RequestInit = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(deleteObj)
        };

        const response = await fetch(`${this.apiURL}/${this.endpoint}/delete/${deleteObj.id}`, requestOptions)
        return response;
    }
}