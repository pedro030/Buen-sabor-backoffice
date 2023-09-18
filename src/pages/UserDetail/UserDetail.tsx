import React from 'react'
import { User } from '../../models/User'
import { userSelector } from '../../state/selectors'
import { useSelector } from 'react-redux'
import { Order } from '../../models/Order'
import { NavLink, useParams } from 'react-router-dom'
import { RiEyeLine } from 'react-icons/ri'
import { IoMdArrowRoundBack } from 'react-icons/io'



export const UserDetail = () => {

    let { idUser } = useParams()
    let user: User[] = useSelector(userSelector).filter((item: User) => item.id == idUser)
    const { orders, firstName, lastName } = user[0]

    return (
        <div className="m-4">
            <NavLink to="/statistics/clients" ><span className='flex flex-row items-center gap-2'><IoMdArrowRoundBack /> back</span></NavLink>
            <h2 className='my-2 text-lg font-bold text-center stat-title'></h2>
            <div className="flex items-center justify-center w-full gap-5 ">
                {/* <input type="date" placeholder='DATE' className=" input input-sm" onChange={handleChangeDate} />
            <input type="number" placeholder='TOTAL MIN.' className='input input-sm' onChange={handleChangeTotalPrice} onKeyDown={searchTotalPriceOnEnter} />
            <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeSorting}>
              <option defaultValue={1}>SORT BY: FEATURED</option>
              <option value={2}>SORT BY PRICE: LOW to HIGH</option>
              <option value={3}>SORT BY PRICE: HIGH to LOW</option>
              <option value={4}>SORT BY DATE: ASC.</option>
              <option value={5}>SORT BY DATE: DESC.</option>
            </select> */}

                {/* <select className="w-full max-w-xs select select-bordered select-sm" onChange={onConnected} >
              <option defaultValue={0}>Super Admin</option>
              <option value={1}>Admin</option>
              <option value={2}>Casher</option>
              <option value={3}>Chef</option>
              <option value={4}>Delivery</option>
              <option value={5}>Client</option>
            </select> */}

            </div>
            <div className='flex justify-center w-full'>
                <div className="overflow-x-auto h-[35rem] w-[60vw]">
                    <h1 className='mb-5 text-lg font-bold tracking-widest text-center uppercase'>{`Orders by: ${firstName} ${lastName}`}</h1>
                    <table className="table table-xs table-pin-rows ">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Withdrawal Mode</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (orders.length > 0) &&
                                orders.map((order: Order, i: number) => (
                                    <tr key={i}>
                                        <td>{order.date}</td>
                                        <td>{order.withdrawalMode}</td>
                                        <td>{order.statusOrder?.statusType}</td>
                                        <td>{order.totalPrice}</td>
                                        <td><NavLink to={`/statistics/clients/${idUser}/order/${order.id}`} ><RiEyeLine className='w-5 h-5 eye-icon' /></NavLink></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {(orders.length === 0) &&
                        <div className='flex items-center justify-center h-[25rem]'>
                            <h1 className='text-2xl font-bold tracking-widest text-secondary'>He does not have any orders</h1>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
