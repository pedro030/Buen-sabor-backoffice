import { useEffect, useState } from "react"
import store from "../../../state/store/store";
import { RiFileExcel2Line } from 'react-icons/ri';
import { movementsSelector, orderSelector } from "../../../state/selectors";
import { useDispatch, useSelector } from "react-redux";
import { Order } from "../../../models/Order";
import { Product } from "../../../models/Product";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Movement } from "../../../models/Movement";
import { loadMovements } from "../../../state/actions/movementsActions";

const Movements = () => {
  const dispatch = useDispatch();
  const token = store.getState().userSession.token
  const apiURL = import.meta.env.VITE_REACT_APP_API_URL;
  const orders: Order[] = useSelector(orderSelector)
  const {movements}= useSelector(movementsSelector);
  const [movementsState, setMovements] = useState<Movement[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fetchMovements = async () => {
    try {
      const response = await fetch(`${apiURL}/movements/getAll`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${(token).trim()}`
        }
      })

      const data = await response.json();
      dispatch(loadMovements(data));
      setMovements(data);
    } catch(e) {
      console.log(e)
    }
  }

  /*let totalIncome = 0;
  let totalEgress = 0;

  const totalIncomeF = (n: number) => {
    totalIncome += n
    return (n)
  }*/

  /*const totalEgressF = (products: Product[]) => {
    // console.log(products)
    let n = 0;
    products.map((item: Product) => {
      n += item.product.cost
    })
    totalEgress += n;
    return n
  }*/

  const handleChangeDate = (range: [Date, Date]) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);

    if(!startDate && !endDate) {} // ADD LOGIC
  };

  useEffect(() => {
    fetchMovements();
  }, [])

  return (
    <div className="h-[100vh] overflow-y-auto">
      <h1 className="my-5 text-xl font-semibold tracking-widest text-center uppercase">Movements</h1>
      <hr />

      <div className="flex justify-center">
        <div className="">

          <div className="flex justify-center gap-5 my-2">
            {/* <div>
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
              </div> */}
              <div>
                <button className="btn btn-primary btn-sm">Get Movements by Date</button>
              </div>
              <div>
                <select className="w-full max-w-xs select select-bordered select-sm" onChange={()=>{}}>
                  <option selected value={1}>TYPE: ALL</option>
                  <option value={2}>TYPE: RESTOCKING</option>
                  <option value={3}>TYPE: BILL</option>
                </select>
              </div>
              <div>
                <select className="w-full max-w-xs select select-bordered select-sm" onChange={()=>{}}>
                  <option selected value={1}>SORT BY: FEATURED</option>
                  <option value={2}>SORT BY DATE: NEW to OLD</option>
                  <option value={3}>SORT BY DATE: OLD to NEW</option>
                  <option value={4}>SORT BY PRICE: HIGH to LOW</option>
                  <option value={5}>SORT BY PRICE: LOW to HIGH</option>
                </select>
              </div>
          </div>
          <div className="w-[50vw] h-[60vh] overflow-y-auto">
            <table className="table table-pin-rows">
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">TYPE</th>
                  <th className="text-center">DATE / HOURS</th>
                  <th className="text-center">DESCRIPTION</th>
                  <th className="text-center">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {
                  movements.map((movement: Movement, index: number) => (
                    <tr key={index}>
                      <th className="text-center">{movement.id}</th>
                      <th className="text-center">{movement.type}</th>
                      <th className="text-center">{movement.date}</th>
                      <th className="text-center">{movement.type === "Credit_Note"?JSON.parse(movement.description).description:movement.description}</th>
                      <th className={`text-center text-${movement.total >= 0?'green':'red'}-500`}>{movement.total}</th>
                    </tr>
                  ))
                }
              </tbody>
              <tfoot>
                <tr>
                  {/* <th className="text-center">{totalIncome}</th>
                  <th className="text-center">{totalEgress}</th> */}
                </tr>
              </tfoot>
            </table>
          </div>
          {/* <div className={`flex flex-row justify-end mr-10 `}><h1>TOTAL: </h1> <span className={`ml-2 ${(totalIncome > totalEgress) ? 'text-green-500' : 'text-red-500'}`}>{totalIncome - totalEgress}</span></div> */}
        </div>
      </div>
      <div className="flex justify-end w-full mt-10 mb-5 ">
        <button className="mr-10 text-white btn btn-success btn-wide"><RiFileExcel2Line />EXPORT EXCEL</button>
      </div>

    </div>
  )
}

export default Movements
