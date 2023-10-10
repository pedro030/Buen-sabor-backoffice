import { useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { orderSelector, statusSelector, userSessionSelector } from "../../state/selectors"
import { Order } from "../../models/Order"
import pizzaSvg from '../../assets/pizza.svg'
import { IoMdArrowRoundBack } from "react-icons/io"
import { updateOrder } from '../../state/actions/orderActions'
import swal from 'sweetalert'
import { ProductOrder } from '../../models/Product'

const OrderDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { idOrder } = useParams()
    let orders: Order[] = useSelector(orderSelector)
    const { token } = useSelector(userSessionSelector);
    const status = useSelector(statusSelector);
    orders = orders.filter(item => item.id == idOrder)
    const [minutes, setMinutes] = useState<number>(0)

    const { address, creationDate, id, paymode, products, statusOrder, totalPrice, user, withdrawalMode, totalCookingTime } = orders[0]

    const states: any = {
        'In_Queue': ['In_Preparation', 'Ready'],
        'In_Preparation': ['Ready'],
        'Ready': ['In_Preparation', 'Out_for_Delivery', 'Delivered'],
        'Out_for_Delivery': ['Delivered', 'Not_Delivered'],
        'Delivered': [],
        'Not_Delivered': []
    }

    const changeStatus = async (type: string) => {
        if (confirm(`You sure of change the status to '${type.replaceAll('_', ' ')}' ?`)) {
            const statusType = status.find((s: any) => s.statusType === type)
            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(statusType)
            };

            const res = await fetch(`https://buen-sabor-backend-production.up.railway.app/api/orders/changeStatus/${id}`, requestOptions)
                .catch((e) => console.error(e));

            if (res?.ok) {
                const updatedOrder = { ...orders[0], statusOrder: statusType }
                dispatch(updateOrder(id, updatedOrder))
                navigate(-1);
            }
        }
    }

    const handleChangeMinutes = (e: any) => {
        const minutes = +e.target.value;
        setMinutes(minutes);
    }

    const handleClickAddMinutes = async () => {
        if (minutes > 0 && confirm(`Are you sure you need to add ${minutes} to the order?`)) {
            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            const res = await fetch(`https://buen-sabor-backend-production.up.railway.app/api/orders/${id}&${minutes}`, requestOptions)
                .catch((e) => console.error(e));

            if (res?.ok) {
                const updatedOrder = { ...orders[0], totalCookingTime: minutes }
                dispatch(updateOrder(id, updatedOrder))
            }
        }
    }

    const confirm = () => {
        swal("Are you sure?", {
            dangerMode: true,
            buttons: [true, "Do it!"],
        })
        .then(data => data && swal({
            icon: "success",
            text: "Se ha hecho cancelacion de la factura",
            timer: 1200,
            buttons: [false]
          }))
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
                            {states[statusOrder.statusType].map((s: any) => {
                                if (statusOrder.statusType === 'Ready') {
                                    if (withdrawalMode === 'Take Away' && s === 'Out_for_Delivery') {
                                        return null; // No mostrar el botón 'Out_for_Delivery' en modo de entrega 'Delivery'
                                    } else if (withdrawalMode === 'Delivery' && s === 'Delivered') {
                                        return null; // No mostrar el botón 'Delivered' en modo de entrega 'Take_Away'
                                    }
                                }
                                return <button onClick={() => changeStatus(s)} className="btn btn-primary btn-sm btn-wide">{s.replaceAll('_', " ")}</button>
                            })}
                        </div>
                    </div>

                    {/* CANCEL ORDER WITH CREDIT NOTE */}
                    <div className='flex flex-col gap-5 p-5 bg-white rounded-3xl'>
                        <textarea className="w-full h-40 resize-none textarea textarea-bordered" required name="" id="" ></textarea>
                        <button className="btn btn-primary btn-sm btn-wide" onClick={() => confirm()}>Canceled</button>
                    </div>
                </div>

                {/* ADD MINUTES */}
                {statusOrder.statusType === 'In_Preparation' && <div className={`h-28 p-5 bg-white rounded-3xl`}>
                    <h1 className="mb-1 text-lg font-bold tracking-widest text-center text-gray-300">Add Minutes</h1>

                    <div className="flex flex-row gap-5">
                        <input type="number" min={0} max={120} placeholder='MINUTES' className="input input-sm" onChange={handleChangeMinutes} />
                        <button className="btn btn-primary btn-sm" onClick={handleClickAddMinutes}>Add</button>
                    </div>
                </div>
                }
            </div>
        </div>
    )
}

export default OrderDetail