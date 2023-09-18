import { useEffect, useState } from "react"
import store from "../../../state/store/store";
import { RiEyeLine, RiFileExcel2Line } from 'react-icons/ri';
import { userSelector } from "../../../state/selectors";
import { useSelector } from "react-redux";
import { User } from "../../../models/User";
import { Order } from "../../../models/Order";
import { NavLink } from "react-router-dom";

const RankingsClients = () => {
  const token = store.getState().userSession.token
  const apiURL = import.meta.env.VITE_REACT_APP_API_URL;
    const user = useSelector(userSelector).filter((item:User) => item.rol.rol === 'Client')
  const [clients, setClients] = useState<Array<User>>(user)

  const total = (orders: Order[]) => {
    let total = 0;
    orders.map((item: Order) => {
      total += item.totalPrice
    })
    return total
  }

// console.log(clients)

  return (
    <div className=" grid grid-rows-[80px_0.9fr_50px] overflow-y-auto h-[99vh]">
      <div>
      <h1 className="my-5 text-xl font-semibold tracking-widest text-center uppercase">Rankings clients</h1>
      <hr />
      </div>

      <div className="flex justify-center overflow-y-auto">
        <div className="w-[60vw]">
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
              {
                clients.sort((a:User, b:User) => b.orders.length - a.orders.length).map((item: User, index: number) => (
                  <tr key={index}>
                    <th >{`${item.firstName} ${item.lastName}`}</th>
                    <th >{item.orders.length}</th>
                    <th >{total(item.orders)}</th>
                    <th><NavLink to={`${item.id}`} ><RiEyeLine className='w-5 h-5 eye-icon' /></NavLink></th>
                  </tr>
                ))
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
