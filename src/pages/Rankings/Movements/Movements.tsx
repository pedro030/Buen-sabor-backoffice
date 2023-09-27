import { useEffect, useState } from "react"
import store from "../../../state/store/store";
import { RiFileExcel2Line } from 'react-icons/ri';
import { orderSelector } from "../../../state/selectors";
import { useSelector } from "react-redux";
import { Order } from "../../../models/Order";
import { Product } from "../../../models/Product";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Movements = () => {
  const token = store.getState().userSession.token
  const apiURL = import.meta.env.VITE_REACT_APP_API_URL;
  const orders: Order[] = useSelector(orderSelector)
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  let totalIncome = 0;
  let totalEgress = 0;

  const totalIncomeF = (n: number) => {
    totalIncome += n
    return (n)
  }

  const totalEgressF = (products: Product[]) => {
    // console.log(products)
    let n = 0;
    products.map((item: Product) => {
      n += item.product.cost
    })
    totalEgress += n;
    return n
  }

  const handleChangeDate = (range: [Date, Date]) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);

    if(!startDate && !endDate) {} // ADD LOGIC
  };

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
                <button className="btn btn-primary btn-sm">Get Movements by Date</button>
              </div>
          </div>
          <div className="w-[50vw] h-[60vh] overflow-y-auto">
            <table className="table table-pin-rows">
              <thead>
                <tr>
                  <th className="text-center">INCOME</th>
                  <th className="text-center">EGRESS</th>
                </tr>
              </thead>
              <tbody>
                {
                  orders.map((order: Order, index: number) => (
                    <tr key={index}>
                      <th className="text-center text-green-500">+{totalIncomeF(order.totalPrice)}</th>
                      <th className="text-center text-red-500">-{totalEgressF(order.products)}</th>
                    </tr>
                  ))
                }
              </tbody>
              <tfoot>
                <tr>
                  <th className="text-center">{totalIncome}</th>
                  <th className="text-center">{totalEgress}</th>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className={`flex flex-row justify-end mr-10 `}><h1>TOTAL: </h1> <span className={`ml-2 ${(totalIncome > totalEgress) ? 'text-green-500' : 'text-red-500'}`}>{totalIncome - totalEgress}</span></div>
        </div>
      </div>


      <div className="flex justify-end w-full mt-10 mb-5 ">
        <button className="mr-10 text-white btn btn-success btn-wide"><RiFileExcel2Line />EXPORT EXCEL</button>
      </div>

    </div>
  )
}

export default Movements
