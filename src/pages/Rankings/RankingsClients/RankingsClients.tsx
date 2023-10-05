// React
import { useEffect, useState, ChangeEvent } from "react"

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
  // User Token
  const token = store.getState().userSession.token

  // Api URL
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

  //Sorting
  const { sortedItems, setSortedItems, currentSorting, isAsc, handleChangeSorting } = useSortingStates(clients, 'id');

  //Pagination
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
    <div className=" grid grid-rows-[80px_0.9fr_50px] overflow-y-auto h-[99vh]">
      <div>
      <h1 className="my-5 text-xl font-semibold tracking-widest text-center uppercase">Client Ranking</h1>
      <hr />
      </div>
      <div className="flex justify-center overflow-y-auto">
        <div className="w-[60vw]">
          <div className="flex justify-center gap-5 my-2">
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
                  className="input input-sm input-bordered cursor-pointer"
                  maxDate={new Date(Date.now())}
                />
            </div>
            <div>
              <button className="btn btn-primary btn-sm" onClick={handleClickGetRankingByDate}>Get Ranking by Date</button>
            </div>
            <ExportCSV csvData={sortedItems} rankingType={'Client Ranking'} rankingOpc={2} startDate={startDate} endDate={endDate}/>
          </div>
          <table className="table table-xs">
            <thead>
              <tr>
                <th>ID</th>
                <th>FULL NAME</th>
                <th>ORDER QUANTITY</th>
                <th>TOTAL</th>
                <th>VIEW</th>
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
      </div>
    </div>
  )
}

export default RankingsClients
