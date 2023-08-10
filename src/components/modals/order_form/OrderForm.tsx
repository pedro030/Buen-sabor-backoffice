import React from 'react'
import { Order } from '../../../models/Order'
import { Field, Form, Formik } from 'formik'
import './OrderForm.scss'
import { OrderService } from '../../../services/Order'
import { useDispatch, useSelector } from 'react-redux'
import { loadOrders } from '../../../state/actions/orderActions'
import toast from 'react-hot-toast'
import ComboBoxModel from '../_ComboBoxModel/ComboBoxModel'
import { addressSelector, orderSelector, statusSelector, userSelector } from '../../../state/selectors'


interface Props {
    obj?: any,
    open: boolean,
    onClose: () => void
}
const OrderForm = ({ obj: obj, open, onClose }: Props) => {
    if (!open) return null
    const dispatch = useDispatch()
    const orderService = new OrderService();

    const handleOnSubmit = (state: any) => {
        state = {
            ...state,
            user: JSON.parse(state.user),
            status: JSON.parse(state.status),
            address: JSON.parse(state.address)
        }
        if (obj?.id) {
            toast.promise(
                orderService.updateObj(state)
                    .then(() => {
                        orderService.GetAll().then((res: Order[]) => {
                            dispatch(loadOrders(res))
                        })
                    })
                    .finally(() => onClose())
                , {
                    loading: 'Loading',
                    success: 'Got the data',
                    error: 'Error when fetching',
                })
        } else {
            orderService.newObj(state)
                .then(() => {
                    orderService.GetAll()
                        .then((res: Order[]) => {
                            dispatch(loadOrders(res))
                            onClose()
                        })
                })
        }

    }

    console.log(useSelector(orderSelector))
    
    
    return (
        <div className='overlay' onClick={() => onClose()}>
            <div className='modal-container' onClick={(e) => { e.stopPropagation() }}>
                <button onClick={onClose} className='exit-button'>X</button>
                <h3>{obj ? 'Edit Order' : 'New Order'}</h3>
                <Formik
                    initialValues={
                        obj ? obj : {
                            name: ""
                        }
                    }
                    onSubmit={(state) => { handleOnSubmit(state) }}
                >
                    <Form>
                        <div className="inputs-form">
                            <div className="field">
                                <label htmlFor='date'>Date</label>
                                <Field name='date' type='text' className='input input-sm' />
                            </div>

                            <div className="field">
                                <label htmlFor='withdrawal_mode'>withdrawal_mode</label>
                                <Field name='withdrawal_mode' type='text' className='input input-sm' />
                            </div>

                            <div className="field">
                                <ComboBoxModel
                                    list={useSelector(userSelector)}
                                    name='user'
                                    title='User'
                                    value='user'
                                />
                            </div>

                            <div className="field">
                                <ComboBoxModel
                                    list={useSelector(statusSelector)}
                                    name='status'
                                    title='Status'
                                    value='status'
                                />
                            </div>

                            <div className="field">
                                <ComboBoxModel
                                    list={useSelector(addressSelector)}
                                    name='address'
                                    title='Address'
                                    value='address'
                                />
                            </div>

                            {/* <div className="field">
                            <label htmlFor='macroorder'>Macroorder</label>
                            <Field name="macroorder" as="select">
                                <option value='1'>Comida</option>
                                <option value='2'>Bebida</option>
                            </Field>
                        </div> */}
                        </div>
                        <div className="flex justify-around my-3">
                            <button
                                type="submit"
                                className="btn btn-primary btn-wide btn-sm"
                            >Save</button>
                            <span className='btn btn-secondary btn-wide btn-sm' onClick={() => onClose()}>Cancel</span>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}

export default OrderForm