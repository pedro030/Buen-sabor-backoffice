import { Dispatch } from "redux";
import { ApiServ } from "../services/ApiServ";
import Swal from "sweetalert2";

type ReduxAction<T> = {
    type: string;
    payload: T[];
};

export const useCrudActions = <T extends { id: string }>(item: T, service: ApiServ<T>, type: string, dispatch: Dispatch, loadAction: (data: T[]) => ReduxAction<T>, onClose: () => void) => {
   
    const deleteObjectAlerts = () => {
        Swal.fire({
            icon: 'warning',
            title: `Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            text: `Are you sure you want to delete this ${type}?`,
            confirmButtonText: `Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonColor: '#E73636'
        })
            .then((result) => {
                if(result.isConfirmed) {
                    Swal.fire({
                        title: 'Removing...',
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    })
                    service.deleteObj(item)
                    .then((response) => {
                        if(response?.ok) {
                            service.GetAll()
                                .then((res: T[]) => {
                                    dispatch(loadAction(res))
                                })
                            Swal.fire({
                                icon: 'success',
                                title: `The ${type} was removed`,
                                allowEscapeKey: false,
                                allowOutsideClick: false,
                                showCancelButton: false,
                                confirmButtonColor: '#E73636'
                            })
                        } else {
                            Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })
                        }
                    })
                }
            })
    }

    const updateObjectAlerts = () => {
        Swal.fire({
            title: 'Updating...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
            showCancelButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        })

        service.updateObj(item)
        .then((response) => {
            if(response?.ok) {
                onClose();
                service.GetAll()
                    .then((res: T[]) => {
                        dispatch(loadAction(res))
                    })
                Swal.fire({
                    icon: 'success',
                    title: `The ${type} was updated`,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    showCancelButton: false,
                    confirmButtonColor: '#E73636'
                })
            } else {
                Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })
            }
        })
    }

    const addObjectAlerts = () => {
        Swal.fire({
            title: 'Adding...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
            showCancelButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        })

        service.newObj(item)
        .then((response) => {
            if(response?.ok) {
                onClose();
                service.GetAll()
                    .then((res: T[]) => {
                        dispatch(loadAction(res))
                    })
                Swal.fire({
                    icon: 'success',
                    title: `The ${type} was added`,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    showCancelButton: false,
                    confirmButtonColor: '#E73636'
                })
            } else {
                Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })
            }
        })
    }

    return { deleteObjectAlerts, updateObjectAlerts, addObjectAlerts }
    
}