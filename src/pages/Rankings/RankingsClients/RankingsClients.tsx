import { useEffect, useState } from "react"
import store from "../../../state/store/store";
import { RiEyeLine, RiFileExcel2Line } from 'react-icons/ri';
import { userSelector } from "../../../state/selectors";
import { useSelector } from "react-redux";
import { User } from "../../../models/User";
import { Order } from "../../../models/Order";
import { NavLink, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RankingsClients = () => {
  const location = useLocation()
  const start = location.state ? location.state.start : null
  const end = location.state ? location.state.end : null
  const token = store.getState().userSession.token
  const apiURL = import.meta.env.VITE_REACT_APP_API_URL;
  const user = useSelector(userSelector).filter((item:User) => item.rol.rol === 'Client')
  const [clients, setClients] = useState<Array<User>>(user)
  const [startDate, setStartDate] = useState<Date | null>(start);
  const [endDate, setEndDate] = useState<Date | null>(end);

  //Sorting
  const [sortedRanking, setSortedRanking] = useState<Array<User>>();
  const [currentSorting, setCurrentSorting] = useState(1);

  const sortRanking = (users: User[], sortOp: number) => {
    switch (sortOp) {
      case 1: setSortedRanking(clients.sort((a:User, b:User) => a.orders.length < b.orders.length ? 1 : -1));
        break;

      case 2: setSortedRanking(clients.sort((a: User, b: User) => a.orders.length > b.orders.length ? 1 : -1))
        break;

      case 3: setSortedRanking(clients.sort((a: User, b: User) => total(a.orders) < total(b.orders) ? 1 : -1))
        break;
      
      case 4: setSortedRanking(clients.sort((a: User, b: User) => total(a.orders) > total(b.orders) ? 1 : -1))
        break;
    }
  }

  const handleChangeSorting = (e: any) => {
    const sortOp = +e.target.value;
    setCurrentSorting(sortOp);
    sortRanking(clients, sortOp);
  }

  // Total Gastado en Orders
  const total = (orders: Order[]) => {
    let total = 0;
    orders.map((item: Order) => {
      total += item.totalPrice
    })
    return total
  }
  
  // Format Date. Example: 2023-6-2 to 2023-06-02
  const formatToConsistentDate = (inputDate: string) => {
    const parts = inputDate.split("-");
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1].length === 1 ? `0${parts[1]}` : parts[1]) - 1;
    const day = parseInt(parts[2].length === 1 ? `0${parts[2]}` : parts[2]);
    
    return new Date(year, month, day);
  }

  // Handle Change DatePicker
  const handleChangeDate = (range: [Date, Date]) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);

    if(!startDate && !endDate) setClients(user);
  };

  // Handle Click Get Ranking by Date
  const handleClickGetRankingByDate = () => {
    if(startDate && endDate) {
      const newRanking = clients.map((user: User) => {
        const filteredOrders = user.orders.filter((order: Order) => {
          const orderDate = formatToConsistentDate(order.date)
          return (
            (!startDate || orderDate >= startDate) &&
            (!endDate || orderDate <= endDate)
          );
        })

        return {
          ...user,
          orders: filteredOrders,
        };
      })

      setClients(newRanking)
    } else setClients(clients)
  }

  // UseEffect que se ejecuta cada vez que hay un cambio de estado en 'clients'
  useEffect(() => {
    handleClickGetRankingByDate();
    sortRanking(clients, currentSorting);
  }, [clients])

  return (
    <div className=" grid grid-rows-[80px_0.9fr_50px] overflow-y-auto h-[99vh]">
      <div>
      <h1 className="my-5 text-xl font-semibold tracking-widest text-center uppercase">Rankings clients</h1>
      <hr />
      </div>

      <div className="flex justify-center overflow-y-auto">
        <div className="w-[60vw]">
          <div className="flex justify-center gap-5 my-2">
            <div>
              <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeSorting}>
                <option selected value={1}>SORT BY: + QTY</option>
                <option value={2}>SORT BY NAME: - QTY</option>
                <option value={3}>SORT BY NAME: + TOTAL</option>
                <option value={4}>SORT BY NAME: - TOTAL</option>
              </select>
            </div>
            <div>
              <DatePicker
                  isClearable
                  withPortal
                  selectsRange
                  selected={startDate}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleChangeDate}
                  placeholderText="Date: From - To"
                  dateFormat="yyyy/MM/dd"
                  className="input input-sm input-bordered"
                  maxDate={new Date(Date.now())}
                />
            </div>
            <div>
              <button className="btn btn-primary btn-sm" onClick={handleClickGetRankingByDate}>Get Ranking by Date</button>
            </div>
          </div>
          <table className="table table-xs">
            <thead>
              <tr>
                <th>FULL NAME</th>
                <th>ORDER QUANTITY</th>
                <th>TOTAL</th>
                <th>VIEW</th>
              </tr>
            </thead>
            <tbody>
              {
                sortedRanking?.map((item: User, index: number) => (
                  <tr key={index}>
                    <th >{`${item.firstName} ${item.lastName}`}</th>
                    <th >{item.orders.length}</th>
                    <th >{total(item.orders)}</th>
                    <th><NavLink to={`${item.id}`} state={{ orders: item.orders, startDate, endDate, currentSorting }}><RiEyeLine className='w-5 h-5 eye-icon' /></NavLink></th>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end w-full mt-10 mb-5 ">
        <button className="mr-10 text-white btn btn-success btn-wide"><RiFileExcel2Line />EXPORT EXCEL</button>
      </div>

    </div>
  )
}

export default RankingsClients
