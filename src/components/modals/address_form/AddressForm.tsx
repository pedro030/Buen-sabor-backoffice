import React from 'react'
import { Address } from '../../../models/Address'
import { Field, Form, Formik } from 'formik'
import './AddressForm.scss'
import { AddressService } from '../../../services/Address'
import { useDispatch, useSelector } from 'react-redux'
import { loadAddresses } from '../../../state/actions/addressActions'
import toast from 'react-hot-toast'
import { locationSelector, userSelector } from '../../../state/selectors'
import ComboBoxModel from '../_ComboBoxModel/ComboBoxModel'


interface Props {
    obj?: any,
    open: boolean,
    onClose: () => void
}
const AddressForm = ({ obj: obj, open, onClose }: Props) => {
    if (!open) return null
    const dispatch = useDispatch()
    const addressService = new AddressService();

    const handleOnSubmit = (state: any) => {
        state = {
            ...state,
            location: JSON.parse(state.location),
            user: JSON.parse(state.user)
        }
        if (obj?.id) {
            toast.promise(
                addressService.updateObj(state)
                    .then(() => {
                        addressService.GetAll().then((res: Address[]) => {
                            dispatch(loadAddresses(res))
                        })
                    })
                    .finally(() => onClose())
                , {
                    loading: 'Loading',
                    success: 'Got the data',
                    error: 'Error when fetching',
                })
        } else {
            addressService.newObj(state)
                .then(() => {
                    addressService.GetAll()
                        .then((res: Address[]) => {
                            dispatch(loadAddresses(res))
                            onClose()
                        })
                })
        }

    }

    return (
        <div className='overlay' onClick={() => onClose()}>
            <div className='modal-container' onClick={(e) => { e.stopPropagation() }}>
                <button onClick={onClose} className="absolute btn btn-sm btn-circle btn-ghost right-3 top-2">✕</button>
                <h3>{obj ? 'Edit Address' : 'New Address'}</h3>
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
                                <label htmlFor='streat'>Street</label>
                                <Field name='streat' type='text' className='input input-sm' />
                            </div>

                            <div className="field">
                                <label htmlFor='number'>Number</label>
                                <Field name='number' type='text' className='input input-sm' />
                            </div>
                    

                            <div className="field">
                                <ComboBoxModel
                                    list={useSelector(locationSelector)}
                                    name='location'
                                    title='Location'
                                    value='location'
                                />
                            </div>

                            <div className="field">
                                <ComboBoxModel
                                    list={useSelector(userSelector)}
                                    name='user'
                                    title='User'
                                    value='user'
                                />
                            </div>


                            {/* <div className="field">
                              <label htmlFor='location'>Location</label>
                              <Field name='location' type='text' className='input-text' />
                        </div> */}

                            {/* <div className="field">
                                <label htmlFor='user'>User</label>
                                <Field name='user' type='text' className='input-text' />
                            </div> */}


                            {/* <div className="field">
                            <label htmlFor='macroaddress'>Macroaddress</label>
                            <Field name="macroaddress" as="select">
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

export default AddressForm