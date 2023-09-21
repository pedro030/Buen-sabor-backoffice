import { useEffect, useState } from "react"
import store from "../../../state/store/store";
import { Product } from "../../../models/Product";
import { RiFileExcel2Line } from 'react-icons/ri';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RankingsProducts = () => {
  const token = store.getState().userSession.token
  const apiURL = import.meta.env.VITE_REACT_APP_API_URL;
  const [products, setProducts] = useState<Array<Product>>([])
  const [initialRanking, setInitialRanking] = useState<Array<Product>>([])
  const [foodRanking, setFoodRanking] = useState<boolean>(true)
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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

    if(!startDate && !endDate) setProducts(initialRanking);
  };

  useEffect(() => {
    fetch(`${apiURL}/products/getByQuanSold`, {
      headers: {
        Authorization: `Bearer ${(token).trim()}`
      }
    })
      .then(res => res.json())
      .then(data => {setProducts(data); setInitialRanking(data)})
      .catch(error => console.error(error))
  }, [])

  return (
    <div className="h-[100vh] overflow-y-auto">
      <h1 className="my-5 text-xl font-semibold tracking-widest text-center uppercase">Product Ranking</h1>
      <hr />
      <div>
        <div className="grid grid-cols-2 join">
          <input className="rounded-full join-item btn" type="radio" name="ranking" aria-label="FOOD RANKING" onClick={() => { setFoodRanking(true); setStartDate(null); setEndDate(null) }} defaultChecked={foodRanking ? true : false} />
          <input className="rounded-full join-item btn" type="radio" name="ranking" aria-label="DRINKS RANKING" onClick={() => { setFoodRanking(false); setStartDate(null); setEndDate(null) }} defaultChecked={!foodRanking ? true : false} />
        </div>
        <h1 className="mt-5 text-lg tracking-widest text-center ">{foodRanking ? 'FOOD RANKING' : 'DRINKS RANKING'}</h1>
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
              <button className="btn btn-primary btn-sm">Get Ranking by Date</button>
            </div>
            <div>
              <button className="text-white btn btn-success"><RiFileExcel2Line />EXPORT EXCEL</button>
            </div>
          </div>
        { foodRanking ? (<>
          <table className="table table-xs">
            <thead>
              <tr>
                <th>NAME</th>
                <th className="text-center">QUANTITY SOLD</th>
                <th>ACTIVE</th>
                <th className="text-center">PRICE</th>
                <th>CATEGORY</th>
              </tr>
            </thead>
            <tbody>
            {
              products.filter((item: Product) => item.subcategory?.name !== "Gaseosas").map((product: Product, index: number) => (
                <tr key={index}>
                  <th >{product.name}</th>
                  <th className="text-center">{product.quantitySold}</th>
                  <th ><div className={`${product.active ? 'badge badge-success text-white' : 'badge badge-primary'}`}>{product.active ? "Active" : "No Active"}</div></th>
                  <th className="text-center">{product.price}</th>
                  <th >{product.subcategory?.name}</th>
                </tr>
              ))
            }
          </tbody>
        </table>
        </>)
        : 
        (<>
          <table className="table table-xs">
            <thead>
              <tr>
              <th>NAME</th>
                <th className="text-center">QUANTITY SOLD</th>
                <th>ACTIVE</th>
                <th className="text-center">PRICE</th>
                <th>CATEGORY</th>
              </tr>
            </thead>
            <tbody>
              {
                products.filter((item: Product) => item.subcategory?.name === "Gaseosas").map((product: Product, index: number) => (
                  <tr key={index}>
                  <th >{product.name}</th>
                  <th className="text-center">{product.quantitySold}</th>
                  <th ><div className={`${product.active ? 'badge badge-success text-white' : 'badge badge-primary'}`}>{product.active ? "Active" : "No Active"}</div></th>
                  <th className="text-center">{product.price}</th>
                  <th >{product.subcategory?.name}</th>
                </tr>
                ))
              }
            </tbody>
          </table>
        </>)}
        
      </div>

    </div>
  )
}

export default RankingsProducts
