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


  const onConnected = async (e: any) => {

    let value: number = e.target.value

    let rols = [{ "id": 1, "rol": "SuperAdmin", "topic": "" },
    { "id": 2, "rol": "Admin", "topic": "" },
    { "id": 3, "rol": "Cashier", "topic": "cashiers" },
    { "id": 4, "rol": "Chef", "topic": "chefs" },
    { "id": 5, "rol": "Delivery", "topic": "deliveries" },
    { "id": 6, "rol": "Client", "topic": "" }]

    await stompClient.subscribe(`/topic/${rols[value].topic}`, onMessageReceived)

    if (stompClient && stompClient.connected) {
      try {
        await stompClient.send(`/app/${rols[value].topic}`, {})
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log("WS is not connected")
    }

  }

  const onMessageReceived = (payload: { body: string; }) => {
    const payloadData: Order[] = JSON.parse(payload.body);
    setOrdersList(payloadData);
  }

  const onError = (err: any) => {
    console.log(err);
  }

  useEffect(() => {
    conn()

    return () => {
      stompClient?.disconnect();
    };
  }, []);

  // Format Date. Example: 2023-6-2 to 2023-06-02
  /*const formatToConsistentDate = (inputDate: string) => {
    const parts = inputDate.split("-");
    const year = parts[0];
    const month = parts[1].length === 1 ? `0${parts[1]}` : parts[1];
    const day = parts[2].length === 1 ? `0${parts[2]}` : parts[2];

    return `${year}-${month}-${day}`;
  }*/

  //Filters
  const [filters, setFilters] = useState({
    id: 0,
    total: 0
  })


  const filterOrder = (orders: any) => {
    return orders.filter((o: any) => {
      return (
        (filters.id === 0 || o.id === filters.id)
        &&
        (o.totalPrice >= filters.total)
      )
    })
  }

  const handleChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = +e.target.value
    setFilters((prevState: any) => ({
      ...prevState,
      id: d
    }))

    if (e.target.value == '') setFilters((prevState: any) => ({
      ...prevState,
      id: 0
    }))
  }

  const ordersFilter = filterOrder(orderslist)

  //Search
  const [totalPrice, setTotalPrice] = useState(0)

  const handleChangeTotalPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tp = +e.target.value
    setTotalPrice(tp)

    if (e.target.value == '') setFilters((prevState: any) => ({
      ...prevState,
      total: 0
    }))
  }

  const searchTotalPriceOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setFilters((prevState: any) => ({
        ...prevState,
        total: totalPrice
      }))
    }
  }

  //Sorting
  const [sortedOrders, setSortedOrders] = useState([]);
  const [currentSorting, setCurrentSorting] = useState(1);

  const sortOrders = (orders: any, sortOp: number) => {
    switch (sortOp) {
      case 1: setSortedOrders(orders);
        break;

      case 2: setSortedOrders(orders.sort((a: any, b: any) => a.totalPrice > b.totalPrice ? 1 : -1))
        break;

      case 3: setSortedOrders(orders.sort((a: any, b: any) => a.totalPrice < b.totalPrice ? 1 : -1))
        break;

      case 4: setSortedOrders(orders.sort((a: any, b: any) => a.date > b.date ? 1 : -1))
        break;

      case 5: setSortedOrders(orders.sort((a: any, b: any) => a.date < b.date ? 1 : -1))
        break;
    }
  }

  const handleChangeSorting = (e: any) => {
    const sortOp = +e.target.value;
    setCurrentSorting(sortOp);
    sortOrders(ordersFilter, sortOp);
  }


  useEffect(() => {
    sortOrders(ordersFilter, currentSorting);
  }, [filters, orderslist])


  return (
    <div className="m-4">
      {/* <CrudCreateButton Modal={OrderForm} Title='Orders' /> */}
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Orders</h2>
      <div className="flex items-center justify-center w-full gap-5 my-5">
        <input type="number" placeholder='SEARCH BY ID' className=" input input-sm" onChange={handleChangeId} />
        <input type="number" placeholder='TOTAL MIN.' className='input input-sm' onChange={handleChangeTotalPrice} onKeyDown={searchTotalPriceOnEnter} />
        <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeSorting}>
          <option selected value={1}>SORT BY: FEATURED</option>
          <option value={2}>SORT BY PRICE: LOW to HIGH</option>
          <option value={3}>SORT BY PRICE: HIGH to LOW</option>
          <option value={4}>SORT BY DATE: ASC.</option>
          <option value={5}>SORT BY DATE: DESC.</option>
        </select>

        <select className="w-full max-w-xs select select-bordered select-sm" onChange={onConnected} >
          <option defaultValue={0}>Super Admin</option>
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
              <th>ID</th>
              <th>Date</th>
              <th>Withdrawal Mode</th>
              <th>Status</th>
              <th>Total</th>
              <th>User</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order: Order, i: number) => (
              <tr key={i}>
                <td>{order.id}</td>
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