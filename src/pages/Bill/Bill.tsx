import BillForm from "../../components/modals/bill_form/BillForm";
import { Bill } from "../../models/Bill";
import { useDispatch, useSelector } from "react-redux";
import { loadBills } from "../../state/actions/billActions";
import { billSelector } from "../../state/selectors";
import CrudCard from "../../components/crud_components/crud_card/CrudCard";
import { BillService } from "../../services/Bill";
import CrudCreateButton from "../../components/crud_components/crud_create_button/CrudCreateButton";
import CrudDeleteModal from "../../components/crud_components/crud_delete_modal/CrudDeleteModal";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line, RiEyeLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import { Movement } from "../../models/Movement";
import store from "../../state/store/store";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Bill() {
  const token = store.getState().userSession.token;
  const apiURL = import.meta.env.VITE_REACT_APP_API_URL;
  const [movements, setMovements] = useState<Movement[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fetchMovements = async () => {
    try {
      const response = await fetch(`${apiURL}/movements/getAll`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.trim()}`,
        },
      });

      const data = await response.json();
      setMovements(data);
    } catch (e) {
      console.log(e);
    }
  };

  /*const handleDelete = (state: Bill) => {
    if (confirm(`You want to delete this item?`)) {
      billService.deleteObj(state)
        .then(() => {
          billService.GetAll()
            .then((res: Bill[]) => {
              dispatch(loadBills(res))
            })
        })
    }
  }*/

  // Format Date. Example: 2023-6-2 to 2023-06-02
  const formatToConsistentDate = (inputDate: string) => {
    const parts = inputDate.split("-");
    const year = parts[0];
    const month = parts[1].length === 1 ? `0${parts[1]}` : parts[1];
    const day = parts[2].length === 1 ? `0${parts[2]}` : parts[2];

    return `${year}-${month}-${day}`;
  };

  //Filters
  const [filters, setFilters] = useState({
    date: "",
  });

  const filterBill = (bills: any) => {
    return bills.filter((b: any) => {
      return (
        filters.date === "" ||
        formatToConsistentDate(b.order.date) === filters.date
      );
    });
  };

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = e.target.value;
    setFilters({ date: d });

    if (d == "") setFilters({ date: "" });
  };

  const billsFilter = filterBill(bill);

  //Sorting
  const [sortedBills, setSortedBills] = useState([]);
  const [currentSorting, setCurrentSorting] = useState(1);

  const sortBills = (bills: any, sortOp: number) => {
    switch (sortOp) {
      case 1:
        setSortedBills(bills);
        break;

      case 2:
        setSortedBills(
          bills.sort((a: any, b: any) => (a.order.date > b.order.date ? 1 : -1))
        );
        break;

      case 3:
        setSortedBills(
          bills.sort((a: any, b: any) => (a.order.date < b.order.date ? 1 : -1))
        );
        break;
    }
  };

  const handleChangeSorting = (e: any) => {
    const sortOp = +e.target.value;
    setCurrentSorting(sortOp);
    sortBills(billsFilter, sortOp);
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  useEffect(() => {
    sortBills(billsFilter, currentSorting);
  }, [filters]);

  return (
    <div className="m-4">
      <CrudCreateButton Modal={BillForm} Title="Bills" />
      <h2 className="my-2 text-lg font-bold text-center stat-title">Bills</h2>
      <div className="flex items-center justify-center w-full gap-5 my-5">
        <div>
          <DatePicker
            isClearable
            withPortal
            selectsRange
            selected={startDate}
            startDate={startDate}
            endDate={endDate}
            onChange={()=>{}}
            placeholderText="Date: From - To"
            dateFormat="yyyy/MM/dd"
            className="input input-sm input-bordered"
            maxDate={new Date(Date.now())}
          />
        </div>
        <div>
          <select
            className="w-full max-w-xs select select-bordered select-sm"
            onChange={handleChangeSorting}
          >
            <option selected value={1}>
              SORT BY: FEATURED
            </option>
            <option value={2}>SORT BY DATE: ASC.</option>
            <option value={3}>SORT BY DATE: DESC.</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto h-[35rem]">
        <table className="table table-xs table-pin-rows ">
          <thead>
            <tr>
              <th>Date</th>
              <th>Order ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedBills.map((item: Bill, i: number) => (
              <tr key={i}>
                <td>{item.date}</td>
                <td>{item.order.id}</td>
                <td>
                  <div className="flex gap-2">
                    <button>
                      <RiEyeLine className="w-5 h-5 eye-icon" />{" "}
                    </button>
                    <button>
                      <FiEdit2 className="w-5 h-5 edit-icon" />{" "}
                    </button>
                    <button onClick={() => handleDelete(item)}>
                      <RiDeleteBin6Line className="w-5 h-5 delete-icon" />{" "}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Bill;
