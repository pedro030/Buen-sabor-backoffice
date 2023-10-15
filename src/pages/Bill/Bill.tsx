// React
import { useState, useEffect } from "react";

// React Router
import { NavLink } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { movementsSelector } from "../../state/selectors";
import { loadMovements } from "../../state/actions/movementsActions";

// React DatePicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Services
import { MovementsService } from "../../services/Movements";

// Components
import Pagination from "../../components/pagination/Pagination";

// Hooks
import { useSorting } from "../../hooks/useSorting";
import { useSortingStates } from "../../hooks/useSortingStates";
import { usePagination } from "../../hooks/usePagination";

// Functions
import { dateToString } from "../Rankings/rankingFunctions";

// Types
import { Movement } from "../../models/Movement";

// Assets
import { RiEyeLine } from "react-icons/ri";

function Bill() {
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
    type: "Bill",
  });

  const filterBills = (movements: Movement[]) => {
    return movements.filter((movement: Movement) => {
      return movement.type === filters.type;
    });
  };

  const filteredBills: Movement[] = filterBills(movements);

  // Handlers
  const handleChangeDate = (range: [Date, Date]) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);

    const stDate = dateToString(startDate);
    const edDate = dateToString(endDate);

    if (startDate && endDate) {
      setFilters({
        ...filters,
        startDate: stDate ? stDate : "",
        endDate: edDate ? edDate : "",
      });
    } else {
      setFilters({
        ...filters,
        startDate: "",
        endDate: "",
      });
    }
  };

  // Sorting
  const {
    sortedItems,
    setSortedItems,
    currentSorting,
    isAsc,
    handleChangeSorting,
  } = useSortingStates(filteredBills, "date");

  //Pagination
  const { currentObjects, currentPage, objetsPerPage, pages, setCurrentPage } =
    usePagination(sortedItems);

  // UseEffect inicial
  useEffect(() => {
    movementServ.GetAll().then((data) => {
      dispatch(loadMovements(data));
    });
  }, []);

  // UseEffect que se ejecuta cuando cambia el estado de filters así se realiza el filtrado
  useEffect(() => {
    if (filters.startDate && filters.endDate && filters.type) {
      movementServ
        .GetByDates(filters.startDate, filters.endDate, filters.type)
        .then((data) => {
          dispatch(loadMovements(data));
        });
    } else if (filters.startDate && filters.endDate) {
      movementServ
        .GetByDates(filters.startDate, filters.endDate)
        .then((data) => {
          dispatch(loadMovements(data));
        });
    } else {
      movementServ.GetAll().then((data) => {
        dispatch(loadMovements(data));
      });
    }
  }, [filters]);

  // UseEffect que se ejecuta cada vez que cambia el estado de movements
  useEffect(() => {
    setCurrentPage(1);
    setSortedItems(useSorting(filteredBills, currentSorting, isAsc));
  }, [movements]);

  return (
    <div className='m-4'>
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Bills</h2>

      <details className='mb-10 dropdown md:hidden'>
        <summary className='m-1 btn btn-primary btn-wide btn-sm'>
          Filter
        </summary>
        <ul className='p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-80 gap-5 '>
          <li>
            <div>
              <DatePicker
                isClearable
                withPortal
                selectsRange
                selected={startDate}
                startDate={startDate}
                endDate={endDate}
                onChange={handleChangeDate}
                placeholderText='Date: From - To'
                dateFormat='yyyy/MM/dd'
                className=' input input-sm input-bordered'
                maxDate={new Date(Date.now())}
              />
            </div>
          </li>
          <li>
            <select
              className='w-full h-full select select-bordered select-sm'
              onChange={handleChangeSorting}
            >
              <option value='date true'>SORT BY DATE: OLD to NEW</option>
              <option value='date false'>SORT BY DATE: NEW to OLD</option>
              <option value='total false'>SORT BY TOTAL: HIGH to LOW</option>
              <option value='total true'>SORT BY TOTAL: LOW to HIGH</option>
            </select>
          </li>
        </ul>
      </details>

      <div className='flex items-center justify-center w-full gap-5 my-5 max-md:hidden'>
        <div>
          <DatePicker
            isClearable
            withPortal
            selectsRange
            selected={startDate}
            startDate={startDate}
            endDate={endDate}
            onChange={handleChangeDate}
            placeholderText='Date: From - To'
            dateFormat='yyyy/MM/dd'
            className='input input-sm input-bordered'
            maxDate={new Date(Date.now())}
          />
        </div>
        <div>
          <select
            className='w-full max-w-xs select select-bordered select-sm'
            onChange={handleChangeSorting}
          >
            <option value='date true'>SORT BY DATE: OLD to NEW</option>
            <option value='date false'>SORT BY DATE: NEW to OLD</option>
            <option value='total false'>SORT BY TOTAL: HIGH to LOW</option>
            <option value='total true'>SORT BY TOTAL: LOW to HIGH</option>
          </select>
        </div>
      </div>
      <div className='overflow-x-auto h-[35rem]'>
        <table className='z-0 table table-xs table-pin-rows'>
          <thead>
            <tr>
              <th>DATE</th>
              <th>ORDER ID</th>
              <th>TOTAL</th>
              <th>VIEW ORDER</th>
            </tr>
          </thead>
          <tbody>
            {currentObjects.map((item: Movement, i: number) => (
              <tr key={i}>
                <td>{item.date}</td>
                <td>{item.order?.id}</td>
                <td>{item.total}</td>
                <td>
                  <NavLink to={`${item.order?.id}`}>
                    <RiEyeLine className='w-5 h-5 eye-icon' />
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <Pagination
              items={sortedItems}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pages={pages}
              objetsPerPage={objetsPerPage}
            />
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default Bill;
