import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { orderSelector } from '../../state/selectors'
import { OrderService } from '../../services/Order'
import { loadOrders } from '../../state/actions/orderActions'
import { Order as Order } from '../../models/Order'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';
import { NavLink } from 'react-router-dom'
import SockJS from 'sockjs-client'
import Stomp, { Client, over } from 'stompjs';


const Order = () => {
  // selecciona el listados de orders del reducer
  const dispatch = useDispatch()
  const orders: Order[] = useSelector(orderSelector)
  const orderService = new OrderService()

  const handleDelete = (state: Order) => {
    if (confirm(`You want to delete this item?`)) {
      orderService.deleteObj(state)
        .then(() => {
          orderService.GetAll()
            .then((res: Order[]) => {
              dispatch(loadOrders(res))
            })
        })
    }
  }

  //let stompClient: any = null;
  const [orderslist, setOrdersList] = useState<Order[]>([]);
  const [stompClient, setStompClient] = useState<any>(over(new SockJS('https://buen-sabor-backend-production.up.railway.app/ws')))

  // // CONNECTION
  const conn = () => {
    stompClient.connect({}, onConnected, onError)
  }

  const onConnected = async () => {
    // SUBSCRIBE
    await stompClient.subscribe('/topic/orderslist', onMessageReceived)
    // await stompClient.send("/app/rols", {}, JSON.stringify({ "id": 3, "rol": "Cashier" }));
  }

  /** Envio de datos al web socket */  
  const userJoin = async (e:any) => {
    let value:number = e.target.value
    let rols = [{ "id": 1, "rol": "SuperAdmin" },
    { "id": 2, "rol": "Admin" },
    { "id": 3, "rol": "Cashier" },
    { "id": 4, "rol": "Chef" },
    { "id": 5, "rol": "Delivery" },
    { "id": 6, "rol": "Client" }]

    if(stompClient && stompClient.connected ) {
      try {
        console.log(stompClient)
        console.log("WS is connected. Sending msg...")
        await stompClient.send("/app/rols", {}, JSON.stringify(rols[value != null? value : 0]))
        console.log("SENT")
      } catch(error) {
        console.log(error)
      } 
    } else {
      console.log("WS is not connected")
      console.log(stompClient)
    }

  }

  // const handleEmployee = (e:any) => (e.target.value)

  const onMessageReceived = (payload: { body: string; }) => {
    console.log(stompClient)
    var payloadData: Order[] = JSON.parse(payload.body);
    setOrdersList(payloadData);
    // console.log(payloadData)
  }

  const onError = (err: any) => {
    console.log(err);
  }

  useEffect(() => {
    conn()
    // console.log(orderslist)
    return () => {
      stompClient?.disconnect();
    };
  }, []);


  return (
    <div className="m-4">
      {/* <CrudCreateButton Modal={OrderForm} Title='Orders' /> */}
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Orders</h2>
      <div className="flex items-center justify-center w-full gap-5 my-5">
        <input type="date" placeholder='DATE' className=" input input-sm input-disabled" />
        <input type="number" placeholder='TOTAL' className='input input-sm input-disabled' />
        <select className="w-full max-w-xs select select-bordered select-sm" /*onChange={handleChangeSorting}*/>
          <option selected value={1}>SORT BY: FEATURED</option>
          <option value={2}>SORT BY PRICE: LOW to HIGH</option>
          <option value={3}>SORT BY PRICE: HIGH to LOW</option>
          <option value={4}>SORT BY NAME: A - Z</option>
          <option value={5}>SORT BY NAME: Z - A</option>
        </select>

        <select className="w-full max-w-xs select select-bordered select-sm" onChange={userJoin} >
          <option selected value={0}>Super Admin</option>
          <option value={1}>Admin</option>
          <option value={2}>Casher</option>
          <option value={3}>Chef</option>
          <option value={4}>Delivery</option>
          <option value={5}>Client</option>
        </select>

      </div>
      <div className="overflow-x-auto h-[35rem]">
        <table className="table table-xs table-pin-rows ">
          <thead>
            <tr>
              <th>Date</th>
              <th>Withdrawal Mode</th>
              <th>Status</th>
              <th>Total</th>
              <th>User</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orderslist.map((order: Order, i: number) => (
              <tr key={i}>
                <td>{order.date}</td>
                <td>{order.withdrawalMode}</td>
                <td>{order.statusOrder?.statusType}</td>
                <td>{order.totalPrice}</td>
                <td>{order.user?.id}</td>
                <td>
                  <div className='flex gap-2'>
                    <NavLink to={`${order.id}`} ><RiEyeLine className='w-5 h-5 eye-icon' /></NavLink>
                    {/* <button><FiEdit2 className='w-5 h-5 edit-icon' /> </button> */}
                    {/* <button onClick={() => alert('coming soon')}><RiDeleteBin6Line className='w-5 h-5 delete-icon' /> </button> */}
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Order