// React
import { useState, ChangeEvent } from 'react'

// Redux
import { useDispatch, useSelector } from "react-redux"
import { orderSelector, statusSelector, userSessionSelector } from "../../state/selectors"
import { updateOrder } from '../../state/actions/orderActions'

// React Router
import { NavigateFunction, useNavigate, useParams } from "react-router-dom"

// Sweet Alert 2
import Swal from 'sweetalert2'

// Types
import { Order } from "../../models/Order"
import { ProductOrder } from '../../models/Product'
import { Status } from '../../models/Status'

// Assets
import pizzaSvg from '../../assets/pizza.svg'
import { IoMdArrowRoundBack } from "react-icons/io"

const OrderDetail = () => {
    // Api URL
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    // URL Params
    const { idOrder } = useParams()

    // Redux
    const dispatch = useDispatch();
    const { token } = useSelector(userSessionSelector);
    let order: Order[] = useSelector(orderSelector);
    order = order.filter((item: Order) => item.id == idOrder);
    const status = useSelector(statusSelector);

    // Navigation
    const navigate: NavigateFunction = useNavigate();

    // States
    const [minutes, setMinutes] = useState<number>(0)
    const [creditNote, setCreditNote] = useState<string>('');

    // Extraccion de Atributos de la orden
    const { address, creationDate, id, paymode, products, statusOrder, totalPrice, user, withdrawalMode, totalCookingTime } = order[0]

    // Botonera para el cambio de estado que se cargara en base al estado de la orden
    const states: any = {
        'In_Queue': ['In_Preparation', 'Ready'],
        'In_Preparation': ['Ready'],
        'Ready': ['In_Preparation', 'Out_for_Delivery', 'Delivered'],
        'Out_for_Delivery': ['Delivered', 'Not_Delivered'],
        'Delivered': [],
        'Not_Delivered': [],
        'Cancelled': []
    }

    // Alerts
    const changeStatusAlert = (type: string) => {
        Swal.fire({
            icon: 'warning',
            title: 'Change Status',
            text: `Are you sure you want to change the status to '${type.replaceAll('_', ' ')}' ?`,
            confirmButtonText: 'Change Status',
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonColor: '#E73636',
        })
            .then((result) => {
                if(result.isConfirmed) {
                    Swal.fire({
                        title: 'Loading...',
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    })
                    fetchChangeStatus(type);
                } else if(result.isDenied) {
                    Swal.fire('Changes are not saved', '', 'info')
                }
            })
    }

    const addMinutesAlert = (minutes: number) => {
        Swal.fire({
            icon: 'warning',
            title: 'Add Minutes',
            text: `Are you sure you want to add ${minutes} minutes to the order?`,
            confirmButtonText: 'Add Minutes',
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonColor: '#E73636',
        })
            .then((result) => {
                if(result.isConfirmed) {
                    Swal.fire({
                        title: 'Loading...',
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    })
                    fetchAddMinutes();
                } else if(result.isDenied) {
                    Swal.fire('Changes are not saved', '', 'info')
                }
            })
    }

    const cancelOrderAlert = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Cancel Order',
            text: `Are you sure you want to cancel the order ${id}?`,
            confirmButtonText: 'Yes, Cancel Order',
            cancelButtonText: 'No',
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonColor: '#E73636',
        })
            .then((result) => {
                if(result.isConfirmed) {
                    Swal.fire({
                        title: 'Loading...',
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    })
                    fetchCancelOrder();
                } else if(result.isDenied) {
                    Swal.fire('Changes are not saved', '', 'info')
                }
            })
    }

    // Fetchs
    const fetchChangeStatus = async (type: string) => {
        const statusType = status.filter((status: Status) => status.statusType === type)
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(statusType)
        };

        const res = await fetch(`${apiUrl}/orders/changeStatus/${id}`, requestOptions)
            .catch((e) => console.error(e));

        if (res?.ok) {
            const updatedOrder = { ...order[0], statusOrder: statusType[0] }
            dispatch(updateOrder(id, updatedOrder));
            Swal.fire({
                title: 'The status was changed',
                icon: 'success',
                allowEscapeKey: false,
                allowOutsideClick: false,
                showCancelButton: false,
                confirmButtonColor: '#E73636'
            })
                .then((result) => {
                    if(result.isConfirmed) {
                        navigate(-1)
                    }
                })
        } else {
            Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })
        }
    }

    const fetchAddMinutes = async () => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const res = await fetch(`${apiUrl}/orders/plusMinutes/${id}&${minutes}`, requestOptions)
            .catch((e) => console.error(e));

        if (res?.ok) {
            const updatedOrder = { ...order[0], totalCookingTime: (totalCookingTime + minutes) }
            dispatch(updateOrder(id, updatedOrder))
            Swal.fire({
                title: 'The minutes were added',
                icon: 'success',
                allowEscapeKey: false,
                allowOutsideClick: false,
                showCancelButton: false,
                confirmButtonColor: '#E73636'
            })
        } else {
            Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })
        }
    }

    const fetchCancelOrder = async () => {
        const statusType = status.filter((status: Status) => status.statusType === 'Cancelled')
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: creditNote
        };

        const res = await fetch(`${apiUrl}/orders/cancelOrder/${id}`, requestOptions)
            .catch((e) => console.error(e));

        if (res?.ok) {
            const updatedOrder = { ...order[0], statusOrder: statusType[0] }
            dispatch(updateOrder(id, updatedOrder))
            Swal.fire({
                title: 'The order was cancelled',
                text: `Credit Note: ${creditNote}`,
                icon: 'success',
                allowEscapeKey: false,
                allowOutsideClick: false,
                showCancelButton: false,
                confirmButtonColor: '#E73636'
            })
                .then((result) => {
                    if(result.isConfirmed) {
                        navigate(-1)
                    }
                })
        } else {
            Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })
        }
    }

    // Handlers
    const handleChangeMinutes = (e: ChangeEvent<HTMLInputElement>) => {
        const minutes = +e.target.value;
        setMinutes(minutes);
    }

    const handleCreditNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const creditNote = e.target.value;
        setCreditNote(creditNote);
    }

    //Setea hora y minuto en el que será entregado el pedido. Todo esto en base al coockingTime
    const setDeliveryTime = (date: Date, coockingTime: number) => {
        const deliveryTime = new Date(date.getTime() + coockingTime * 60000);
        const amOrPm = deliveryTime.getHours() >= 12 ? "PM" : "AM";
        return `${deliveryTime.getHours()-3}:${deliveryTime.getMinutes() < 10 ? "0" + deliveryTime.getMinutes() : deliveryTime.getMinutes()} ${amOrPm}`;
    }

    return (
        <div className="p-5 h-[94.6vh] overflow-y-auto">
            <span onClick={() => navigate(-1)} className='flex flex-row items-center gap-2 cursor-pointer'><IoMdArrowRoundBack /> back</span>
            <h1 className="mb-5 text-2xl font-semibold text-center">Order {id} Detail</h1>

            { /* ORDER */}
            <div className="grid grid-cols-[3fr_1fr] gap-5">
                <div>
                    <div className="flex flex-col gap-6">
                        <div className="w-full h-32 p-5 bg-white rounded-3xl">
                            <div className="flex flex-row items-center justify-between">
                                <div className="flex flex-row items-center">
                                    <div className="flex justify-center avatar">
                                        <div className="w-16 rounded-full">
                                            <img src={user.picture} />
                                        </div>
                                    </div>
                                    <h1 className="ml-5 font-semibold tracking-widest">{`${user.firstName}  ${user.lastName}`}</h1>
                                </div>
                                <h2 className="tracking-widest">Creation Date: <span className="font-bold">{creationDate.substring(0, 10)} / {(+creationDate.split(' ')[1].substring(0, 2) - 3) + ":" + creationDate.split(' ')[1].substring(3, 5)} { (+creationDate.split(' ')[1].substring(0, 2) - 3) >= 12 ? 'PM' : 'AM' }</span></h2>
                            </div>
                            <div className="m-3">
                                <h2>{withdrawalMode === "Delivery" ? `Delivery Address: ${address}` : `Take Away In: ${address}`}</h2>
                            </div>
                        </div>

                        { /* PRODUCTS */}
                        <div className="bg-white h-64 rounded-3xl  w-full p-4 grid grid-rows-[1fr_50px]">
                            <div>
                                <div className="flex justify-between my-3">
                                    <h1>Order</h1>
                                    <p>{products.length} products</p>
                                </div>
                                <div className="h-32 mt-6 mb-1 overflow-y-auto scrollbar">
                                    {products.map((item: ProductOrder) => {
                                        return <div key={item.id} className='flex items-center'>
                                            <img className='h-4 mr-4' src={pizzaSvg} alt="category icon" />
                                            <p className="my-1">{item.cant}x {item.product.name} ${item.product.price * item.cant}</p>
                                        </div>
                                    })}
                                </div>
                            </div>

                            { /* DELIVERY TIME */}
                            <div>
                                <hr />
                                <div className="flex justify-between my-3">
                                    <p>{ withdrawalMode === "Delivery" ? <p>Approximate Delivery Time: </p> : <p>Approximate Take Away Time:</p> }</p>
                                    <p>{ setDeliveryTime(new Date(creationDate), totalCookingTime !== null ? totalCookingTime : 0)}</p>
                                </div>
                            </div>
                        </div>

                        { /* DELIVERY METHOD */}
                        <div className="flex flex-row items-center justify-between w-full h-20 p-5 bg-white rounded-3xl">
                            <h2>Delivery Method:</h2>
                            <h2>{withdrawalMode}</h2>
                        </div>

                        { /* RESUME */}
                        <div tabIndex={0} className="w-full bg-white shadow cursor-pointer collapse rounded-3xl">
                            <div className="flex items-center justify-between p-4">
                                <h1 className='font-bold'>Total to pay:</h1>
                                <p className='font-bold'>${totalPrice}</p>
                            </div>
                            <div className="collapse-content">
                                <div className="flex ">
                                    <div className="w-full p-1">
                                        <div className="p-2">
                                            <h1 className="mb-2 tracking-widest">Resume</h1>
                                            <hr />
                                            <div className="flex justify-between w-full">
                                                <p className="my-3 text-sm">Products cost</p>
                                                <p className="my-3 text-sm">${withdrawalMode == 'Delivery' ? totalPrice - 400 : totalPrice - 100}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="my-3 text-sm">Service fee</p>
                                                <p className="my-3 text-sm">$100</p>
                                            </div>
                                            {withdrawalMode == 'Delivery' ? <div className="flex justify-between">
                                                <p className="my-3 text-sm">Shipping cost</p>
                                                <p className="my-3 text-sm">$300</p>
                                            </div> : ''
                                            }
                                            <div className="flex justify-between">
                                                <p className="my-3 text-sm font-bold">Total</p>
                                                <p className="my-3 text-sm font-bold">${totalPrice}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        { /* PAYMENTH METHOD */}
                        <div className="flex flex-row items-center justify-between w-full h-20 p-5 bg-white rounded-3xl">
                            <h2>Paymenth method:</h2>
                            <h2>{paymode.paymode}</h2>
                        </div>
                    </div>
                </div>

                {/* CHANGE ORDER STATUS */}
                <div className=''>
                    <div className="p-5 mb-5 bg-white rounded-3xl">
                        <h1 className="mb-1 text-lg font-bold tracking-widest text-center text-gray-300">Statuses</h1>

                        <div className="flex flex-col gap-5">
                            {states[statusOrder.statusType].map((s: string) => {
                                if (statusOrder.statusType === 'Ready') {
                                    if (withdrawalMode === 'Take Away' && s === 'Out_for_Delivery') {
                                        return null; // No mostrar el botón 'Out_for_Delivery' en modo de entrega 'Delivery'
                                    } else if (withdrawalMode === 'Delivery' && s === 'Delivered') {
                                        return null; // No mostrar el botón 'Delivered' en modo de entrega 'Take_Away'
                                    }
                                }
                                return <button onClick={() => changeStatusAlert(s)} className="btn btn-primary btn-sm btn-wide">{s.replaceAll('_', " ")}</button>
                            })}
                        </div>
                    </div>

                    {/* CANCEL ORDER WITH CREDIT NOTE */}
                    <div className='flex flex-col gap-5 p-5 bg-white rounded-3xl'>
                        <textarea className="w-full h-40 resize-none textarea textarea-bordered" onChange={handleCreditNote} required name="" id="" ></textarea>
                        <button className="btn btn-primary btn-sm btn-wide" onClick={() => { creditNote.length > 5 ? cancelOrderAlert() : Swal.fire({ title: 'Error', text: 'Add a valid Credit Note', icon: 'error', confirmButtonColor: '#E73636'})}}>Cancel Order</button>
                    </div>
                </div>

                {/* ADD MINUTES */}
                {statusOrder.statusType === 'In_Preparation' && <div className={`h-28 p-5 bg-white rounded-3xl`}>
                    <h1 className="mb-1 text-lg font-bold tracking-widest text-center text-gray-300">Add Minutes</h1>

                    <div className="flex flex-row gap-5">
                        <input type="number" min={0} max={100} placeholder='MINUTES' className="input input-sm" onChange={handleChangeMinutes} />
                        <button className="btn btn-primary btn-sm" onClick={() => { minutes > 0 && minutes < 100 ? addMinutesAlert(minutes) : Swal.fire({ title: 'Error', text: 'You can only add between 1 and 99 minutes', icon: 'error', confirmButtonColor: '#E73636'})}}>Add</button>
                    </div>
                </div>
                }
            </div>
        </div>
    )
}

export default OrderDetail