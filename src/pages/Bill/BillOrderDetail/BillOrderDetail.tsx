// React Router
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'

// Redux
import { useSelector } from 'react-redux'
import { orderSelector } from '../../../state/selectors'

// Types
import { Order } from '../../../models/Order'
import { ProductOrder } from '../../../models/Product'

// Assets
import pizzaSvg from '../../../assets/pizza.svg'
import { IoMdArrowRoundBack } from 'react-icons/io'

export const BillOrderDetail = () => {
  // Navigation
  const navigate: NavigateFunction = useNavigate();

  // ID Order URL Params
  const { idOrder } = useParams()

  // Filtra y setea la orden
  const orders: Order[] = useSelector(orderSelector).filter((item: Order) => item.id == idOrder)
  const { address, creationDate, id, paymode, products, totalPrice, user, withdrawalMode, totalCookingTime } = orders[0]

  //Setea hora y minuto en el que será entregado el pedido. Todo esto en base al coockingTime
  const setDeliveryTime = (date: Date, coockingTime: number) => {
    const deliveryTime = new Date(date.getTime() + coockingTime * 60000);
    const amOrPm = deliveryTime.getHours() >= 12 ? "PM" : "AM";
    return `${deliveryTime.getHours()-3}:${deliveryTime.getMinutes() < 10 ? "0" + deliveryTime.getMinutes() : deliveryTime.getMinutes()} ${amOrPm}`;
}

  return (
    <div className=" p-5 h-[100vh] overflow-y-auto">
      <span className='flex flex-row items-center gap-2 cursor-pointer' onClick={() => navigate(-1)}><IoMdArrowRoundBack /> back</span>
      <h1 className="mb-5 text-2xl font-semibold text-center">Order {id} Detail</h1>

      { /* ORDER */}
      <div className='flex flex-col items-center w-full'>
        <div className="flex w-[90%] flex-col gap-6" >
          <div className="flex flex-col justify-between w-full p-5 bg-white lg:flex-row rounded-3xl">
            <div className="flex flex-col items-center justify-between lg:flex-row">
              <div className="flex flex-col items-center lg:flex-row">
                <div className="flex justify-center avatar">
                  <div className="w-16 rounded-full">
                    <img src={user.picture} />
                  </div>
                </div>
                <h1 className="ml-5 font-semibold tracking-widest">{`${user.firstName}  ${user.lastName}`}</h1>
              </div>
            </div>
            <div className="mt-5 ">
              <h2 className='text-xs lg:text-sm lg:text-right'>{withdrawalMode === "Delivery" ? `Delivery Address: ${address}` : `Take Away In: ${address}`}</h2>
              <h2 className="text-sm tracking-widest lg:text-right">Creation Date: <span className="font-bold">{creationDate.substring(0, 10)} / {(+creationDate.split(' ')[1].substring(0, 2) - 3) + ":" + creationDate.split(' ')[1].substring(3, 5)} { (+creationDate.split(' ')[1].substring(0, 2) - 3) >= 12 ? 'PM' : 'AM' }</span></h2>
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
                  return <div className='flex items-center'>
                    <img className='h-4 mr-4' src={pizzaSvg} alt="category icon" />
                    <p className="my-1 text-xs">{item.cant}x {item.product.name} ${item.product.price * item.cant}</p>
                  </div>
                })}
              </div>
            </div>

            { /* DELIVERY TIME */}
            <div>
              <hr />
              <div className="flex justify-between my-3 [&>p]:text-xs ">
                <p className='lg:text-md'>{ withdrawalMode === "Delivery" ? <p>Approximate Delivery Time: </p> : <p>Approximate Take Away Time:</p> }</p>
                <p className='lg:text-md'>{ setDeliveryTime(new Date(creationDate), totalCookingTime !== null ? totalCookingTime : 0)}</p>
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
    </div>
  )
}
