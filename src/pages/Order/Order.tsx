// React
import { useEffect, useState, useRef, ChangeEvent } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { orderSelector, userSessionSelector } from "../../state/selectors";

// React Router
import { NavLink } from "react-router-dom";

// SockJS & Stomp
import SockJS from "sockjs-client";
import { Client, over } from "stompjs";

// Hooks
import { useSorting } from "../../hooks/useSorting";
import { useSortingStates } from "../../hooks/useSortingStates";

//Types
import { Order as Order } from "../../models/Order";

// Assets
import { RiEyeLine } from "react-icons/ri";
import { addOrder, updateOrder } from "../../state/actions/orderActions";

const Order = () => {
  // Obtiene el Rol para saber a que topico suscribirse
  const { rol } = useSelector(userSessionSelector);

  // Redux
  const dispatch = useDispatch();

  // Obtiene las orders
  let orders: Order[] = useSelector(orderSelector);

  // WebSocket
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  
  const stompClientRef = useRef<Client | undefined>(undefined);

  useEffect(() => {
    stompClientRef.current = over(new SockJS("https://buen-sabor-backend-production.up.railway.app/ws"));
  }, [])

  const rols: any = {
    _cashier: "cashiers",
    _chef: "chefs",
    _delivery: "deliveries"
  }

  // Connection to Socket
  const connection = () => {
    stompClientRef.current?.connect({}, onConnected, onError);
  };

  const onConnected = async () => {
    setIsConnected(true);
    await stompClientRef.current?.subscribe(
      `/topic/${rols[rol]}`,
      onMessageReceived
    );

    if (stompClientRef.current && stompClientRef.current.connected) {
      try {
        await stompClientRef.current.send(`/app/${rols[rol]}`, {});
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

    if(payloadData.length != 0) {
      payloadData.forEach((order: Order) => {
        const existingOrder = orders.find((o: Order) => o.id == order.id);
        existingOrder ? dispatch(updateOrder(order.id, order)) : dispatch(addOrder(order))
      })
    }
  };

  const onError = (err: any) => {
    setIsConnected(false);
    console.log(err);
  };

  useEffect(() => {
    return () => {
      stompClientRef.current?.disconnect(() => { setIsConnected(false); });
    };
  }, [])

  useEffect(() => {
    !isConnected && connection();
  }, [])

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
    setFilters((prevState) => ({
      ...prevState,
      id: d,
    }));

    if (e.target.value == "")
      setFilters((prevState) => ({
        ...prevState,
        id: 0,
      }));
  };

  const handleChangeStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters((prevState) => {
      return {
        ...prevState,
        status: value
      }
    })
  }

  const ordersFilter: Order[] = filterOrder(ordersList);

  //Search
  const [totalPrice, setTotalPrice] = useState(0);

  const handleChangeTotalPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tp = +e.target.value;
    setTotalPrice(tp);

    if (e.target.value == "")
      setFilters((prevState) => ({
        ...prevState,
        total: 0,
      }));
  };

  const searchTotalPriceOnEnter = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      setFilters((prevState) => ({
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

  return (
    <div className='m-4'>
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Orders</h2>
      <details className='mb-10 dropdown md:hidden'>
        {/* FILTERS */}
        <summary className='w-full m-1 btn btn-primary lg:btn-wide btn-md '>
          Filter
        </summary>
        <ul className='p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-full gap-5 '>
          <li>
            <input
              type='number'
              placeholder='SEARCH BY ID'
              className=' input'
              onChange={handleChangeId}
            />
          </li>
          <li>
            <input
              type='number'
              placeholder='MIN. TOTAL.'
              className='input '
              onChange={handleChangeTotalPrice}
              onKeyDown={searchTotalPriceOnEnter}
            />
          </li>
          <li>
            <select
              className='w-full h-full select select-bordered select-sm'
              onChange={handleChangeSorting}
            >
              <option value="id true">SORT BY: ID</option>
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
              <option value="">STATUS: ALL</option>
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
          <option value="id true">SORT BY: ID</option>
          <option value="totalPrice true">SORT BY TOTAL PRICE: LOW to HIGH</option>
          <option value="totalPrice false">SORT BY TOTAL PRICE: HIGH to LOW</option>
          <option value="creationDate true">SORT BY DATE: ASC.</option>
          <option value="creationDate false">SORT BY DATE: DESC.</option>
        </select>
        {/* SI ES CASHIER SE LE MUESTRA FILTRADO POR STATUS */}
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
        <table className='z-0 table table-pin-rows'>
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
          {/* PENDING ORDERS TABLE */}
          <tbody>
            { sortedItems.map((order: Order, i: number) => (
              <tr key={i}>
                <td>{order.id}</td>
                <td>{order.creationDate}</td>
                <td>{order.withdrawalMode}</td>
                <td>{order.statusOrder?.statusType.replaceAll("_", " ")}</td>
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
