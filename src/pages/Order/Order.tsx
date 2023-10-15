import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, ChangeEvent } from "react";
import { userSessionSelector } from "../../state/selectors";
import { OrderService } from "../../services/Order";
import { Order as Order } from "../../models/Order";
import { RiEyeLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client, over } from "stompjs";
import { useSortingStates } from "../../hooks/useSortingStates";
import { useSorting } from "../../hooks/useSorting";

const Order = () => {
  // selecciona el listados de orders del reducer
  const dispatch = useDispatch();
  const { rol } = useSelector(userSessionSelector)
  const orderService = new OrderService();

  // WebSocket
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [stompClient, setStompClient] = useState<Client>(
    over(new SockJS("https://buen-sabor-backend-production.up.railway.app/ws"))
  );
  const rols: any = {
    _cashier: "cashiers",
    _chef: "chefs",
    _delivery: "deliveries"
  }

  // CONNECTION
  const connection = () => {
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = async () => {

    await stompClient.subscribe(
      `/topic/${rols[rol]}`,
      onMessageReceived
    );

    if (stompClient && stompClient.connected) {
      try {
        await stompClient.send(`/app/${rols[rol]}`, {});
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("WS is not connected");
    }
  };

  const onMessageReceived = (payload: { body: string }) => {
    const payloadData: Order[] = JSON.parse(payload.body);
    setOrdersList(payloadData);
  };

  const onError = (err: any) => {
    console.log(err);
  };

  useEffect(() => {
    connection();

    return () => {
      stompClient.connected ? stompClient?.disconnect(() => { }) : '';
    };
  }, []);

  //Filters
  const [filters, setFilters] = useState({
    id: 0,
    total: 0,
    status: "",
  });

  const filterOrder = (orders: Order[]) => {
    return orders.filter((o: Order) => {
      return (
        (filters.id === 0 || +o.id === filters.id) &&
        o.totalPrice >= filters.total &&
        (filters.status === "" || filters.status === o.statusOrder.statusType)
      );
    });
  };

  const handleChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = +e.target.value;
    setFilters((prevState: any) => ({
      ...prevState,
      id: d,
    }));

    if (e.target.value == "")
      setFilters((prevState: any) => ({
        ...prevState,
        id: 0,
      }));
  };

  const ordersFilter = filterOrder(ordersList);

  //Search
  const [totalPrice, setTotalPrice] = useState(0);

  const handleChangeTotalPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tp = +e.target.value;
    setTotalPrice(tp);

    if (e.target.value == "")
      setFilters((prevState: any) => ({
        ...prevState,
        total: 0,
      }));
  };

  const searchTotalPriceOnEnter = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      setFilters((prevState: any) => ({
        ...prevState,
        total: totalPrice,
      }));
    }
  };

  //Sorting
  const {
    sortedItems,
    setSortedItems,
    currentSorting,
    isAsc,
    handleChangeSorting,
  } = useSortingStates(ordersFilter, "id");

  useEffect(() => {
    setSortedItems(useSorting(ordersFilter, currentSorting, isAsc));
  }, [filters, ordersList]);

  const handleChangeStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters((prevState) => {
      return {
        ...prevState,
        status: value
      }
    })
  }

  return (
    <div className='m-4'>
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Orders</h2>
      <details className='mb-10 dropdown md:hidden'>
        <summary className='m-1 btn btn-primary btn-wide btn-sm'>
          Filter
        </summary>
        <ul className='p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-80 gap-5 '>
          <li>
            <input
              type='number'
              placeholder='SEARCH BY ID'
              className=' input input-sm'
              onChange={handleChangeId}
            />
          </li>
          <li>
            <input
              type='number'
              placeholder='MIN. TOTAL.'
              className='input input-sm'
              onChange={handleChangeTotalPrice}
              onKeyDown={searchTotalPriceOnEnter}
            />
          </li>
          <li>
            <select
              className='w-full h-full select select-bordered select-sm'
              onChange={handleChangeSorting}
            >
              <option selected value="id true">
                SORT BY: ID
              </option>
              <option value="totalPrice true">SORT BY TOTAL PRICE: LOW to HIGH</option>
              <option value="totalPrice false">SORT BY TOTAL PRICE: HIGH to LOW</option>
              <option value="creationDate true">SORT BY DATE: ASC.</option>
              <option value="creationDate false">SORT BY DATE: DESC.</option>
            </select>
          </li>
          { rol === "_cashier" && <li>
            <select
              className='w-full h-full select select-bordered select-sm'
              onChange={handleChangeStatus}
            >
              <option selected value="">STATUS: ALL</option>
              <option value="In_Queue">STATUS: IN QUEUE</option>
              <option value="Ready">STATUS: READY</option>
            </select>
          </li> }
        </ul>
      </details>

      <div className='flex items-center justify-center w-full gap-5 my-5 max-md:hidden'>
        <input
          type='number'
          placeholder='SEARCH BY ID'
          className=' input input-sm'
          onChange={handleChangeId}
        />
        <input
          type='number'
          placeholder='TOTAL MIN.'
          className='input input-sm'
          onChange={handleChangeTotalPrice}
          onKeyDown={searchTotalPriceOnEnter}
        />
        <select
          className='w-full max-w-xs select select-bordered select-sm'
          onChange={handleChangeSorting}
        >
          <option selected value={1}>
            SORT BY: FEATURED
          </option>
          <option value={2}>SORT BY PRICE: LOW to HIGH</option>
          <option value={3}>SORT BY PRICE: HIGH to LOW</option>
          <option value={4}>SORT BY DATE: ASC.</option>
          <option value={5}>SORT BY DATE: DESC.</option>
        </select>
        { rol === "_cashier" && <select
              className='w-full max-w-xs select select-bordered select-sm'
              onChange={handleChangeStatus}
            >
              <option selected value="">STATUS: ALL</option>
              <option value="In_Queue">STATUS: IN QUEUE</option>
              <option value="Ready">STATUS: READY</option>
            </select> }
      </div>
      <div className='overflow-x-auto h-[35rem]'>
        <table className='z-0 table table-xs table-pin-rows'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Withdrawal Mode</th>
              <th>Status</th>
              <th>Total</th>
              <th>User ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { sortedItems.map((order: Order, i: number) => (
              <tr key={i}>
                <td>{order.id}</td>
                <td>{order.creationDate}</td>
                <td>{order.withdrawalMode}</td>
                <td>{order.statusOrder?.statusType}</td>
                <td>{order.totalPrice}</td>
                <td>{order.user?.id}</td>
                <td>
                  <NavLink to={`${order.id}`}>
                    <RiEyeLine className='w-5 h-5 eye-icon' />
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
