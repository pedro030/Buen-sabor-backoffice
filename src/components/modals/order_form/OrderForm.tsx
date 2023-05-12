import React from 'react'
import { Order } from '../../../models/Order'
import { Field, Form, Formik } from 'formik'
import './OrderForm.scss'
import { OrderService } from '../../../services/Order'
import { useDispatch } from 'react-redux'
import { loadOrders } from '../../../state/actions/orderActions'
import toast from 'react-hot-toast'


interface Props{
    obj?: any,
    open: boolean,
    onClose: ()=>void
}
const OrderForm = ({obj: obj, open, onClose}:Props) => {
    if (!open) return null
    const dispatch = useDispatch()
    const orderService = new OrderService();

    const handleOnSubmit = (state:any) => {
        if(obj?.id){
            toast.promise(
            orderService.updateObj(state)
            .then(()=>{
                orderService.GetAll().then((res:Order[])=>{
                    dispatch(loadOrders(res))
                })
            })
            .finally(() => onClose())
            ,{
                    loading: 'Loading',
                    success: 'Got the data',
                    error: 'Error when fetching',
            })
        }else{
            orderService.newObj(state)
                .then(()=>{
                    orderService.GetAll()
                        .then((res: Order[]) => {
                            dispatch(loadOrders(res))
                            onClose()
                        })
                })
        }
        
    }

  return (
    <div className='overlay' onClick={()=>onClose()}>
        <div className='modal-container' onClick={(e)=>{e.stopPropagation()}}>
            <button onClick={onClose} className='exit-button'>X</button>
            <h3>{obj?'Edit Order':'New Order'}</h3>
            <Formik
                initialValues={
                    obj?obj:{
                        name:""
                    }
                }
                  onSubmit={(state) => { handleOnSubmit(state) }}
            >
                <Form>
                    <div className="inputs-form">
                        <div className="field">
                              <label htmlFor='date'>Date</label>
                              <Field name='date' type='text' className='input-text' />
                        </div>

                        <div className="field">
                              <label htmlFor='withdrawal_mode'>withdrawal_mode</label>
                              <Field name='withdrawal_mode' type='text' className='input-text' />
                        </div>

                        <div className="field">
                              <label htmlFor='address'>Address</label>
                              <Field name='address' type='text' className='input-text' />
                        </div>

                        <div className="field">
                              <label htmlFor='status'>Status</label>
                              <Field name='status' type='Status' className='input-text' />
                        </div>

                        <div className="field">
                              <label htmlFor='user'>User</label>
                              <Field name='user' type='text' className='input-text' />
                        </div>
                        {/* <div className="field">
                            <label htmlFor='macroorder'>Macroorder</label>
                            <Field name="macroorder" as="select">
                                <option value='1'>Comida</option>
                                <option value='2'>Bebida</option>
                            </Field>
                        </div> */}
                    </div>
                    <div className="buttons">
                        <button
                            type="submit"
                            className="btn btn-principal"
                        >Save</button>
                        <span className='btn btn-cancel' onClick={() => onClose()}>Cancel</span>
                    </div>
                </Form>
            </Formik>
        </div>
    </div>
  )
}

export default OrderForm