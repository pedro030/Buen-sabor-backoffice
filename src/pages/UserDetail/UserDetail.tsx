//React
import { useEffect, useState } from 'react'

// Redux
import store from '../../state/store/store'
import { userSelector } from '../../state/selectors'
import { useSelector } from 'react-redux'

// React Router
import { Location, NavLink, NavigateFunction, useLocation, useNavigate, useParams } from 'react-router-dom'

// React Icons
import { RiEyeLine } from 'react-icons/ri'
import { IoMdArrowRoundBack } from 'react-icons/io'

// Functions
import { dateToString } from '../Rankings/rankingFunctions'

// Types
import { User } from '../../models/User'
import { Order } from '../../models/Order'

export const UserDetail = () => {
    const token = store.getState().userSession.token
    const apiURL = import.meta.env.VITE_REACT_APP_API_URL;
    const navigate: NavigateFunction = useNavigate();

    // Para obtener y pasar Props al navegar de una pagina a otra
    const location: Location = useLocation()

    // Props obtenidos del obj 'location': startDate y endDate
    const { startDate, endDate } = location.state ? location.state : null

    // ID Params del URL
    const { idUser } = useParams()

    // Obtenemos datos del usuario
    const user: User = useSelector(userSelector).find((item: User) => item.id == idUser)
    const { firstName, lastName } = user

    // Orders State
    const [orders, setOrders] = useState<Order[]>([])

    const fetchOrdersByDates = async (stDate: string = '2023-01-01', edDate: string | null = dateToString(new Date(Date.now()))) => {
        // Si startDate y endDate son distintos de null se los convierte a string sino obtiene los parametros por defecto
        const endURL = startDate && endDate ? `${dateToString(startDate)}&${dateToString(endDate)}` : `${stDate}&${edDate}`

        // Fetch
        fetch(`${apiURL}/orders/getOrdersByDate/${endURL}`, {
            headers: {
            Authorization: `Bearer ${(token).trim()}`
        }
        })
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(error => console.error(error))
    }

    useEffect(() => {
        //fetchOrdersByDates()
    }, [])

    return (
        <div className="m-4">
            <span className='flex flex-row items-center gap-2' onClick={() => navigate(-1)}><IoMdArrowRoundBack /> back</span>
            <h2 className='my-2 text-lg font-bold text-center stat-title'></h2>
            <div className="flex items-center justify-center w-full gap-5 ">
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
                                        <td>{order.creationDate}</td>
                                        <td>{order.withdrawalMode}</td>
                                        <td>{order.statusOrder?.statusType}</td>
                                        <td>{order.totalPrice}</td>
                                        <td><NavLink to={`/statistics/clients/${idUser}/order/${order.id}`}><RiEyeLine className='w-5 h-5 eye-icon'/></NavLink></td>
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
