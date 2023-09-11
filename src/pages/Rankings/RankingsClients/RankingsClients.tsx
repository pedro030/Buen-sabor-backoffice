import { useEffect, useState } from "react"
import store from "../../../state/store/store";
import { RiEyeLine, RiFileExcel2Line } from 'react-icons/ri';
import { User } from "@auth0/auth0-react";

const RankingsClients = () => {
  const token = store.getState().userSession.token
  const apiURL = import.meta.env.VITE_REACT_APP_API_URL;
  // const [clients, setClients] = useState<Array<User>>([])

  useEffect(() => {
    // fetch(`${apiURL}/products/getByQuanSold`, {
    //   headers: {
    //     Authorization: `Bearer ${(token).trim()}`
    //   }
    // })
    //   .then(res => res.json())
    //   .then(data => setClients(data))
    //   .catch(error => console.error(error))
  }, [])

  return (
    <div className="h-[100vh] overflow-y-auto">
      <h1 className="my-5 text-xl font-semibold tracking-widest text-center uppercase">Rankings clients</h1>
      <hr />
      <div className="flex justify-center">
        <div className="w-[70vw]">
          <div className="flex justify-center gap-5 my-2">
            <div>
              <label className="label">
                <span className="text-gray-500 label-text">Desde</span>
              </label>
              <input className="input input-sm input-bordered" type="date" />
            </div>
            <div>
              <label className="label">
                <span className="text-gray-500 label-text">Hasta</span>
              </label>
              <input className="input input-sm input-bordered" type="date" />
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
              <tr>
                <th>test</th>
                <th>test</th>
                <th>test</th>
                <th><button><RiEyeLine className='w-5 h-5 eye-icon' /> </button></th>
              </tr>
              <tr>
                <th>test</th>
                <th>test</th>
                <th>test</th>
                <th>test</th>
              </tr>
              <tr>
                <th>test</th>
                <th>test</th>
                <th>test</th>
                <th>test</th>
              </tr>
              {
                // clients.filter((item: Product) => item.subcategory?.name !== "Gaseosas").map((product: Product, index: number) => (
                //   <tr key={index}>
                //     <th >{product.name}</th>
                //     <th className="text-center">{product.quantitySold}</th>
                //     <th ><div className={`${product.active ? 'badge badge-success text-white' : 'badge badge-primary'}`}>{product.active ? "Active" : "No Active"}</div></th>
                //     <th className="text-center">{product.price}</th>
                //     <th >{product.subcategory?.name}</th>
                //   </tr>
                // ))
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
