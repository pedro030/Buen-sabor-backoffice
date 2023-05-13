import React from 'react'
import { Bill } from '../../../models/Bill'
import { Field, Form, Formik } from 'formik'
import './BillForm.scss'
import { BillService } from '../../../services/Bill'
import { useDispatch, useSelector } from 'react-redux'
import { loadBills } from '../../../state/actions/billActions'
import toast from 'react-hot-toast'
import { orderSelector } from '../../../state/selectors'
import ComboBoxModel from '../_ComboBoxModel/ComboBoxModel'


interface Props{
    obj?: any,
    open: boolean,
    onClose: ()=>void
}
const BillForm = ({obj: obj, open, onClose}:Props) => {
    if (!open) return null
    const dispatch = useDispatch()
    const billService = new BillService();

    const handleOnSubmit = (state:any) => {
        state = {
            ...state,
            order: JSON.parse(state.order)
        }
        if(obj?.id){
            toast.promise(
            billService.updateObj(state)
            .then(()=>{
                billService.GetAll().then((res:Bill[])=>{
                    dispatch(loadBills(res))
                })
            })
            .finally(() => onClose())
            ,{
                    loading: 'Loading',
                    success: 'Got the data',
                    error: 'Error when fetching',
            })
        }else{
            billService.newObj(state)
                .then(()=>{
                    billService.GetAll()
                        .then((res: Bill[]) => {
                            dispatch(loadBills(res))
                            onClose()
                        })
                })
        }
        
    }

  return (
    <div className='overlay' onClick={()=>onClose()}>
        <div className='modal-container' onClick={(e)=>{e.stopPropagation()}}>
            <button onClick={onClose} className='exit-button'>X</button>
            <h3>{obj?'Edit Bill':'New Bill'}</h3>
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
                                <ComboBoxModel
                                    list={useSelector(orderSelector)}
                                    name='order'
                                    title='Order'
                                    value='order'
                                />
                            </div>

                    
                        {/* <div className="field">
                            <label htmlFor='macrobill'>Macrobill</label>
                            <Field name="macrobill" as="select">
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

export default BillForm