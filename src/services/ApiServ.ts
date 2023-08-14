import toast from 'react-hot-toast'
import { userSelector } from '../state/selectors';
import store from '../state/store/store';

export class ApiServ<T extends { id: string }> {
    endpoint: string = "";
    token = store.getState().userSession.token

    apiURL = import.meta.env.VITE_REACT_APP_API_URL;



    GetAll(): Promise<T[]> {
        // console.log('get all token')
        // console.log(this.token)
        return fetch(`${this.apiURL}/${this.endpoint}/getAll`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        })
            .then(res => {
                // TO DO: agregar notificación
                //toast.success("Success got data")
                // console.log("Load success")
                const resouls = res.json()
                // resouls.then(data => console.log(data))
                return resouls
            })
            .catch(err => {
                //toast.error("error getting data")
                console.log(err)
            })
    }

    GetOne(id: string): Promise<T> {
        return fetch(`${this.apiURL}/${this.endpoint}/get/${id}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        })
            .then(res => {
                // TO DO: agregar notificación
                //toast.success("Success got data")
                console.log("Load success")
                return res.json()
            })
            .catch(err => {
                //toast.error("error getting data")
                console.log(err)
            })
    }

    async newObj(newObj: T) {

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(newObj)
        };


        const resp = await fetch(`${this.apiURL}/${this.endpoint}/save`, requestOptions)
        const data = await resp.json()
        return data
    }

    async updateObj(updateObj: T) {
        const requestOptions: RequestInit = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(updateObj)
        };

        const resp = await fetch(`${this.apiURL}/${this.endpoint}/update/${updateObj.id}`, requestOptions)
        const data = await resp.json()
        return data
    }

    async deleteObj(deleteObj: T) {
        const requestOptions: RequestInit = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(deleteObj)
        };

        const resp = await fetch(`${this.apiURL}/${this.endpoint}/delete/${deleteObj.id}`, requestOptions)
        const data = await resp.status
        return data
    }
}