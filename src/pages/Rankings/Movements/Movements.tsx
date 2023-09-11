import { useEffect, useState } from "react"
import store from "../../../state/store/store";
import { RiFileExcel2Line } from 'react-icons/ri';

const Movements = () => {
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
      <h1 className="my-5 text-xl font-semibold tracking-widest text-center uppercase">Movements</h1>
      <hr />

      <div className="flex justify-center">
        <div className="w-[50vw]">

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

          <table className="table">
            <thead>
              <tr>
                <th className="text-center">INGRESO</th>
                <th className="text-center">EGRESO</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="text-center text-green-500">+500</th>
                <th className="text-center text-red-500">-300</th>
              </tr>
              <tr>
                <th className="text-center text-green-500">+1500</th>
                <th className="text-center text-red-500">-700</th>
              </tr>
              <tr>
                <th className="text-center text-green-500">+2500</th>
                <th className="text-center text-red-500">-1400</th>
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
            <tfoot>
              <tr>
                <th className="text-center">4500</th>
                <th className="text-center">2400</th>
              </tr>
            </tfoot>
          </table>
          <div className="flex justify-end mr-10"><h1>TOTAL: 2100</h1></div>
        </div>
      </div>


      <div className="flex justify-end w-full mt-10 mb-5 ">
        <button className="mr-10 text-white btn btn-success btn-wide"><RiFileExcel2Line />EXPORT EXCEL</button>
      </div>

    </div>
  )
}

export default Movements
