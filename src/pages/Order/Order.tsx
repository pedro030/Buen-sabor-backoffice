import { useDispatch, useSelector } from 'react-redux'
import { orderSelector } from '../../state/selectors'
import { OrderService } from '../../services/Order'
import { loadOrders } from '../../state/actions/orderActions'
import CrudCard from '../../components/crud_components/crud_card/CrudCard'
import { Order as Order } from '../../models/Order'
import OrderForm from '../../components/modals/order_form/OrderForm'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';
import { NavLink } from 'react-router-dom'

const Order = () => {
    // selecciona el listados de orders del reducer
    const dispatch = useDispatch()
    const orders: Order[] = useSelector(orderSelector)
    const orderService = new OrderService()

    const handleDelete = (state: Order) => {
      if (confirm(`You want to delete this item?`)) {
        orderService.deleteObj(state)
          .then(() => {
            orderService.GetAll()
              .then((res: Order[]) => {
                dispatch(loadOrders(res))
              })
          })
      }
    }

  return (
    <div className="m-4">
      {/* <CrudCreateButton Modal={OrderForm} Title='Orders' /> */}
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Orders</h2>
      <div className="overflow-x-auto h-[35rem]">
        <table className="table table-xs table-pin-rows ">
          <thead>
            <tr>
              <th>Date</th>
              <th>Withdrawal Mode</th>
              <th>Status</th>
              <th>Total</th>
              <th>User</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order, i: number) => (
              <tr key={i}>
                <td>{order.date}</td>
                <td>{order.withdrawalMode}</td>
                <td>{order.statusOrder?.statusType}</td>
                <td>{order.totalPrice}</td>
                <td>{order.user?.id}</td>
                <td>
                  <div className='flex gap-2'>
                  <NavLink to={`${order.id}`} ><RiEyeLine className='w-5 h-5 eye-icon' /></NavLink>
                    {/* <button><FiEdit2 className='w-5 h-5 edit-icon' /> </button> */}
                    {/* <button onClick={() => alert('coming soon')}><RiDeleteBin6Line className='w-5 h-5 delete-icon' /> </button> */}
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Order