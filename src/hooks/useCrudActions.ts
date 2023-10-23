// Redux
import { Dispatch } from "redux";

// Service
import { ApiServ } from "../services/ApiServ";

// Sweet Alert 2
import Swal from "sweetalert2";

// Types
import { LoadAction } from "../interfaces/LoadAction";

// Hook personalizado para realizar operaciones CRUD en objetos determinados y con SweetAlerts.
// EL hook recibe el item el cual se agrega, edita o elimina.
// El servicio que proporciona las operaciones CRUD.
// El type es el string indicativo del tipo del objeto.
// La función de dispatch para actualizar el estado.
// La acción de carga para actualizar el estado con nuevos datos.
// Función para cerrar ventanas modales u otras acciones posteriores a las operaciones CRUD.
export const useCrudActions = <T extends { id: string }>(item: T, service: ApiServ<T>, type: string, dispatch: Dispatch, loadAction: (data: T[]) => LoadAction<T>, onClose: () => void) => {
   
    // Elimina un objeto e informa la situacion mediante Sweet Alerts
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

    // Actualiza un objeto e informa la situacion mediante Sweet Alerts
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

    // Agrega un objeto e informa la situacion mediante Sweet Alerts
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

    // Retorna las funciones
    return { deleteObjectAlerts, updateObjectAlerts, addObjectAlerts }
    
}