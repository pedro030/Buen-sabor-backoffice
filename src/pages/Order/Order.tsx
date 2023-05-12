import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { orderSelector } from '../../state/selectors'
import { OrderService } from '../../services/Order'
import { loadOrders } from '../../state/actions/orderActions'
import CrudCard from '../../components/crud_components/crud_card/CrudCard'
import { Order as Order } from '../../models/Order'
import OrderForm from '../../components/modals/order_form/OrderForm'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'

const Order = () => {
    // selecciona el listados de orders del reducer
    const orders = useSelector(orderSelector)
    const orderService = new OrderService()
    // dispatch de redux para disparar acciones que modifican el estado
    const dispatch = useDispatch()

    useEffect(() => {
        // hace llamado a la api y trae las unidades de medida
        orderService.GetAll()
            .then((orders) => {
                // guarda lo que trae de la api en el estado de redux
                dispatch(loadOrders(orders))
            })
    }, [])

  return (
    <div>
          <CrudCreateButton Modal={OrderForm} Title="Order"/>
          <div className="th-container">
              <span></span>
              <span>Date</span>
              <span></span>
              <span>With...</span>
              <span>Address</span>
              <span>Status</span>
              <span></span>
              <span>User</span>
              
          </div>
          {orders && orders[0] && orders.map((cat: Order) => {
              return <CrudCard 
              key={cat.id} 
              obj={cat} 
              EditModal={OrderForm}
              DeleteModal={CrudDeleteModal}
              loadAction={loadOrders}
              apiServ={orderService}
                modelo='Order'
              />
          })}
    </div>
  )
}

export default Order