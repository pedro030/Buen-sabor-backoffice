import { useSelector } from "react-redux"
import { NavLink, useParams } from "react-router-dom"
import { orderSelector } from "../../state/selectors"
import { Order } from "../../models/Order"
import pizzaSvg from '../../assets/pizza.svg'
import iceCreamSVG from '../../assets/ice-cream.svg'

const OrderDetail = () => {

    let { idOrder } = useParams()
    let orders: Order[] = useSelector(orderSelector)
    orders = orders.filter(item => item.id == idOrder)
    const { address, date, id, paymode, products, statusOrder, totalPrice, user, withdrawalMode } = orders[0]

    // console.log(orders)

    return (
        <div className="m-5 h-[94.6vh] overflow-y-auto">
            <NavLink to="/orders" >back</NavLink>
            <h1 className="mb-5 text-2xl font-semibold text-center">Order Detail</h1>

            <div className="flex flex-col gap-6">
                <div className="w-full h-32 p-5 bg-white rounded-3xl">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center">
                            <div className="flex justify-center avatar">
                                <div className="w-16 rounded-full">
                                    <img src={user.picture} />
                                </div>
                            </div>
                            <h1 className="font-semibold tracking-widest">{`${user.firstName}  ${user.lastName}`}</h1>
                        </div>
                        <h2 className="tracking-widest">Created 7:33 PM</h2>
                    </div>
                    <div className="m-3">
                        <h2>{`Address: ${address}`}</h2>
                    </div>
                </div>



                <div className="bg-white h-64 rounded-3xl  w-full p-4 grid grid-rows-[1fr_50px]">
                    <div>
                        <div className="flex justify-between my-3">
                            <h1>Order</h1>
                            <p>{/*order.products.length*/} products</p>
                        </div>
                        <div className="h-32 mt-6 mb-1 overflow-y-auto scrollbar">
                            {products.map((item: any) => {
                                return <div className='flex items-center'>
                                    <img className='h-4 mr-4' src={pizzaSvg} alt="category icon" />
                                    <p className="my-1">{item.cant}x {item.product.name} ${item.product.price * item.cant}</p>
                                </div>
                            })}
                        </div>
                    </div>
                    <div>
                        <hr />
                        <div className="flex justify-between my-3">
                            <p>Estimated Delivery:</p>
                            <p> 26 - 41 min</p>
                        </div>
                    </div>
                </div>



                <div className="flex flex-row items-center justify-between w-full h-20 p-5 bg-white rounded-3xl">
                    <h2>Method of delivery</h2>
                    <h2>{withdrawalMode}</h2>
                </div>



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

                <div className="flex flex-row items-center justify-between w-full h-20 p-5 bg-white rounded-3xl">
                    <h2>Your pay method is:</h2>
                    <h2>{paymode.paymode}</h2>
                </div>

            </div>

            {/* <h1> - id {id}</h1>` */}
            {/* <h1> - address {address}</h1> */}
            {/* <h1> - date {date}</h1> */}
            {/* <h1> - paymode {paymode.paymode}</h1> */}
            {/* <h1> - products {products}</h1> */}
            {/* <h1> - id{statusOrder.statusType}</h1> */}
            {/* <h1> - id{totalPrice}</h1> */}
            {/* <h1> - id{user.name}</h1> */}
            {/* <h1> - id{withdrawalMode}</h1> */}
            {/* {orders[Number(idOrder)]} */}
        </div>
    )

}

export default OrderDetail