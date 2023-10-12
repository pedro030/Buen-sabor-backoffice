// React
import { useEffect, useState, ChangeEvent } from "react"

// Redux
import { useDispatch, useSelector } from "react-redux";
import { movementsSelector } from "../../../state/selectors";
import { loadMovements } from "../../../state/actions/movementsActions";

// React DatePicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Services
import { MovementsService } from "../../../services/Movements";

// Hooks
import { useSorting } from "../../../hooks/useSorting";
import { usePagination } from "../../../hooks/usePagination";
import { useSortingStates } from "../../../hooks/useSortingStates";

// Functions
import { dateToString } from "../rankingFunctions";

// Components
import Pagination from "../../../components/pagination/Pagination";

// Types
import { Movement } from "../../../models/Movement";

// Assets
import { RiFileExcel2Line } from 'react-icons/ri';

const Movements = () => {  
  // Service
  const movementServ = new MovementsService();

  // Redux
  const dispatch = useDispatch();
  const { movements } = useSelector(movementsSelector);
  
  //Filters
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type:""
  });

  const filterMovements = (movements: Movement[]) => {
    return movements.filter((movement: Movement) => {
      return (
        (
          filters.type === '' ||
          movement.type === filters.type
        )
      )
    })
  }

  const filteredMovements =  filterMovements(movements);

  // Sorting
  const { sortedItems, setSortedItems, currentSorting, isAsc, handleChangeSorting } = useSortingStates(filteredMovements, 'date');

  //Pagination
  const { currentObjects, currentPage, objetsPerPage, pages, setCurrentPage } = usePagination(sortedItems);

  // Calcula el total que ingresa
  const totalIncome = () => {
    let totalIncome = 0;
    movements.forEach((movement: Movement) => { movement.total >= 0 ? totalIncome += movement.total : '' });
    return totalIncome;
  }

  // Calcula el total que egresa
  const totalEgress = () => {
    let totalEgress = 0;
    movements.forEach((movement: Movement) => { movement.total < 0 ? totalEgress -= movement.total : '' });
    return totalEgress;
  }

  // Handlers
  const handleChangeDate = (range: [Date, Date]) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);

    const stDate = dateToString(startDate);
    const edDate = dateToString(endDate);

    if(startDate && endDate) {
      setFilters({
        ...filters,
        startDate: stDate ? stDate : '',
        endDate: edDate ? edDate : '',
      })
    } else {
      setFilters({
        ...filters,
        startDate: '',
        endDate: ''
      })
    }
  };

  const handleChangeType = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      type: e.target.value
    })
  }

  // UseEffect inicial
  useEffect(() => {
    movementServ.GetAll()
    .then(data => {
      dispatch(loadMovements(data));
    })
  }, [])

  // UseEffect que se ejecuta cuando cambia el estado de filters así se realiza el filtrado
  useEffect(() => {
    if(filters.startDate && filters.endDate && filters.type){
      movementServ.GetByDates(filters.startDate,filters.endDate,filters.type)
      .then(data => {
        dispatch(loadMovements(data));
      })
    }else if (filters.startDate && filters.endDate){
      movementServ.GetByDates(filters.startDate,filters.endDate)
      .then(data => {
        dispatch(loadMovements(data));
      })
    }else{
      movementServ.GetAll()
      .then(data => {
        dispatch(loadMovements(data));
      })
    }
  }, [filters])

  // UseEffect que se ejecuta cada vez que cambia el estado de movements
  useEffect(() => {
    setCurrentPage(1);
    setSortedItems(useSorting(filteredMovements, currentSorting, isAsc));
  }, [movements])

  return (
    <div className="h-[100vh] overflow-y-auto">
      <h1 className="my-5 text-xl font-semibold tracking-widest text-center uppercase">Movements</h1>
      <hr />

      <div className="flex justify-center">
        <div className="">

          <div className="flex justify-center gap-5 my-2">
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
                <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeType}>
                  <option selected value="">TYPE: ALL</option>
                  <option value="Restocking">TYPE: RESTOCKING</option>
                  <option value="Bill">TYPE: BILL</option>
                  <option value="Credit_Note">TYPE: CREDIT NOTE</option>
                </select>
              </div>
              <div>
                <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeSorting}>
                  <option value='date true'>SORT BY DATE: OLD to NEW</option>
                  <option value='date false'>SORT BY DATE: NEW to OLD</option>
                  <option value='total false'>SORT BY TOTAL: HIGH to LOW</option>
                  <option value='total true'>SORT BY TOTAL: LOW to HIGH</option>
                </select>
              </div>
          </div>
          <div className="w-[50vw] h-[60vh] overflow-y-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">TYPE</th>
                  <th className="text-center">DATE / HOUR</th>
                  <th className="text-center">DESCRIPTION</th>
                  <th className="text-center">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {
                  currentObjects.map((movement: Movement, index: number) => (
                    <tr key={index}>
                      <th className="text-center">{movement.id}</th>
                      <th className="text-center">{movement.type.replace("_", " ")}</th>
                      <th className="text-center">{movement.date.replace(" ", " / ")}</th>
                      <th className="text-center">{movement.description.replaceAll(`"`, "")}</th>
                      <th className={`text-center text-${movement.total >= 0?'green':'red'}-500`}>{movement.total}</th>
                    </tr>
                  ))
                }
              </tbody>
              <tfoot>
                <Pagination items={sortedItems} currentPage={currentPage} setCurrentPage={setCurrentPage} pages={pages} objetsPerPage={objetsPerPage}/>
              </tfoot>
            </table>
          </div>
          <div className='flex flex-row justify-end mr-10'><h1>TOTAL INCOME: </h1> <span className='ml-2 text-green-500'>+{totalIncome()}</span></div>
          <div className='flex flex-row justify-end mr-10'><h1>TOTAL EGRESS: </h1> <span className='ml-2 text-red-500'>-{totalEgress()}</span></div>
          <div className={`flex flex-row justify-end mr-10 `}><h1>TOTAL: </h1> <span className={`ml-2 ${(totalIncome() > totalEgress()) ? 'text-green-500' : 'text-red-500'}`}>{totalIncome() - totalEgress()}</span></div>
        </div>
      </div>
      <div className="flex justify-end w-full mt-10 mb-5 ">
        <button className="mr-10 text-white btn btn-success btn-wide"><RiFileExcel2Line />EXPORT EXCEL</button>
      </div>

    </div>
  )
}

export default Movements
