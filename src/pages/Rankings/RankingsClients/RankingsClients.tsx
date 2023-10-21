// React
import { useEffect, useState } from "react"

// React Router
import { NavLink } from "react-router-dom";

// React DatePicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Redux
import store from "../../../state/store/store";

// React Icons
import { RiEyeLine } from 'react-icons/ri';

// Components
import Pagination from "../../../components/pagination/Pagination";

// Hooks
import { useSorting } from "../../../hooks/useSorting";
import { usePagination } from "../../../hooks/usePagination";
import { useSortingStates } from "../../../hooks/useSortingStates";

// Functions
import { dateToString } from "../rankingFunctions";

// Types
import { UserRanking } from "../../../models/UserRanking";
import { ExportCSV } from "../ExportCSV";

const RankingsClients = () => {
  // User Token y Api URL para hacer los fetch
  const token = store.getState().userSession.token
  const apiURL = import.meta.env.VITE_REACT_APP_API_URL;

  // Clients Raking States
  const [clients, setClients] = useState<Array<UserRanking>>([])
  const [initialClients, setInitialClients] = useState<Array<UserRanking>>([])

  // Date States
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fetchClientRanking = async (stDate: string = '2023-01-01', edDate: string | null = dateToString(new Date(Date.now()))) => {
    // Si startDate y endDate son distintos de null se los convierte a string sino obtiene los parametros por defecto
    const endURL = startDate && endDate ? `${dateToString(startDate)}&${dateToString(endDate)}` : `${stDate}&${edDate}`

    // Fetch
    fetch(`${apiURL}/users/getUserRanking/${endURL}`, {
      headers: {
        Authorization: `Bearer ${(token).trim()}`
      }
    })
      .then(res => res.json())
      // Si el rankingInicial es igual a 0 setea los datos ya que significa que es la primera vez que se produce el fetch
      .then(data => { setClients(data); initialClients.length == 0 ? setInitialClients(data) : '' })
      .catch(error => console.error(error))
  }

  // Handle Change DatePicker
  const handleChangeDate = (range: [Date, Date]) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);

    if(!startDate && !endDate) setClients(initialClients);
  };

  // Handle Click Get Ranking by Date
  const handleClickGetRankingByDate = () => {
    if(startDate && endDate) fetchClientRanking();
  }

  // Sorting
  const { sortedItems, setSortedItems, currentSorting, isAsc, handleChangeSorting } = useSortingStates(clients, 'id');

  // Pagination
  const { currentObjects, currentPage, objetsPerPage, pages, setCurrentPage } = usePagination(sortedItems);

  useEffect(() => {
    fetchClientRanking();
  }, [])

  // UseEffect que se ejecuta cada vez que hay un cambio de estado en 'clients'
  useEffect(() => {
    setCurrentPage(1);
    setSortedItems(useSorting(clients, currentSorting, isAsc));
  }, [clients])

  return (
    <div className=" grid grid-rows-[80px_1fr]">
      <div>
      <h1 className="my-5 text-xl font-semibold tracking-widest text-center uppercase">Client Ranking</h1>
      <hr />
      </div>
      <details className='mb-10 dropdown md:hidden'>
        {/* FILTERS */}
          <summary className='m-1 btn btn-primary btn-wide btn-sm'>
            Filter
          </summary>
          <ul className='p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-80 gap-5 '>
            <li><select className="w-full h-full select select-bordered select-sm" onChange={handleChangeSorting}>
                <option selected value={'id true'}>SORT BY: ID CLIENT</option>
                <option value={'orders_quantity false'}>SORT BY: + QTY</option>
                <option value={'orders_quantity true'}>SORT BY: - QTY</option>
                <option value={'total_sum false'}>SORT BY: + TOTAL</option>
                <option value={'total_sum true'}>SORT BY: - TOTAL</option>
              </select></li>
            <li><DatePicker
                  isClearable
                  withPortal
                  selectsRange
                  selected={startDate}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleChangeDate}
                  placeholderText="Date: From - To"
                  dateFormat="yyyy/MM/dd"
                  className="cursor-pointer input input-sm input-bordered"
                  maxDate={new Date(Date.now())}
                /></li>
            <li>
            <button className="btn btn-primary btn-sm" onClick={handleClickGetRankingByDate}>Get Ranking by Date</button>
            </li>
            <ExportCSV csvData={sortedItems} rankingType={'Client Ranking'} rankingOpc={2} startDate={startDate} endDate={endDate}/>
            <li></li>
          </ul>
        </details>

          <div className="flex justify-center gap-5 my-2 max-md:hidden">
            <div>
              <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeSorting}>
                <option selected value={'id true'}>SORT BY: ID CLIENT</option>
                <option value={'orders_quantity false'}>SORT BY: + QTY</option>
                <option value={'orders_quantity true'}>SORT BY: - QTY</option>
                <option value={'total_sum false'}>SORT BY: + TOTAL</option>
                <option value={'total_sum true'}>SORT BY: - TOTAL</option>
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
                  className="cursor-pointer input input-sm input-bordered"
                  maxDate={new Date(Date.now())}
                />
            </div>
            <div>
              <button className="btn btn-primary btn-sm" onClick={handleClickGetRankingByDate}>Get Ranking by Date</button>
            </div>
            <ExportCSV csvData={sortedItems} rankingType={'Client Ranking'} rankingOpc={2} startDate={startDate} endDate={endDate}/>
          </div>
          {/* CLIENT RANKING TABLE */}
          <table className="z-0 table table-xs">
            <thead>
              <tr>
                <th>ID</th>
                <th>FULL NAME</th>
                <th>ORDER QUANTITY</th>
                <th>TOTAL</th>
                <th>VIEW ORDERS</th>
              </tr>
            </thead>
            <tbody>
              {
                currentObjects?.map((item: UserRanking, index: number) => (
                  <tr key={index}>
                    <th>{item.id}</th>
                    <th >{`${item.first_name} ${item.last_name}`}</th>
                    <th >{item.orders_quantity}</th>
                    <th >{item.total_sum}</th>
                    {<th><NavLink to={`${item.id}`} state={{ startDate, endDate, currentSorting }}><RiEyeLine className='w-5 h-5 eye-icon' /></NavLink></th>}
                  </tr>
                ))
              }
            </tbody>
            <tfoot>
              <Pagination items={sortedItems} currentPage={currentPage} setCurrentPage={setCurrentPage} pages={pages} objetsPerPage={objetsPerPage}/>
            </tfoot>
          </table>
        </div>
  )
}

export default RankingsClients
