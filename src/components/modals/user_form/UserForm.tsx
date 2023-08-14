import React from 'react'
import { User } from '../../../models/User'
import { Field, Form, Formik } from 'formik'
import './UserForm.scss'
import { UserService } from '../../../services/User'
import { useDispatch, useSelector } from 'react-redux'
import { loadUsers } from '../../../state/actions/userActions'
import toast from 'react-hot-toast'
import { rolSelector } from '../../../state/selectors'
import { Rol } from '../../../models/Rol'
import ComboBoxModel from '../_ComboBoxModel/ComboBoxModel'


interface Props {
    obj?: any,
    open: boolean,
    onClose: () => void
}

const UserForm = ({ obj: obj, open, onClose }: Props) => {
    if (!open) return null
    const dispatch = useDispatch()
    const userService = new UserService();

    const rolsOptions:Rol[] = useSelector(rolSelector) // traer los registros de "rols" del Redux

    const handleOnSubmit = (state: any) => {
        // state = {
        //     ...state,
        //     rol: JSON.parse(state.rol)
        // }

        state.rol = JSON.parse(state.rol)

        if (state?.id) {
            toast.promise(
                userService.updateObj(state)
                    .then(() => {
                        userService.GetAll().then((res: User[]) => {
                            dispatch(loadUsers(res))
                        })
                    })
                    .finally(() => onClose())
                , {
                    loading: 'Loading',
                    success: 'Got the data',
                    error: 'Error when fetching',
                })
        } else {
            userService.newObj(state)
                .then(() => {
                    userService.GetAll()
                        .then((res: User[]) => {
                            dispatch(loadUsers(res))
                            onClose()
                        })
                })
        }

    }


    return (
        <div className='overlay' onClick={() => onClose()}>
            <div className='modal-container' onClick={(e) => { e.stopPropagation() }}>
            <button onClick={onClose} className="absolute btn btn-sm btn-circle btn-ghost right-3 top-2">✕</button>
                <h3>{obj ? 'Edit User' : 'New User'}</h3>
                <Formik
                    initialValues={
                        obj ? obj : {
                            firstName: "",
                            lastName: "",
                            mail: "",
                            password: "",
                            orders: [],
                            telephone:0,
                            addresses: [],
                            blacklist: "Enabled"
                        }
                    }
                    onSubmit={(state) => { handleOnSubmit(state) }}
                >
                    <Form>
                        <div className="inputs-form">

                            <div className="field">
                                <label htmlFor='firstName'>First Name</label>
                                <Field name='firstName' type='text' className='input input-sm' />
                            </div>

                            <div className="field">
                                <label htmlFor='lastName'>Last Name</label>
                                <Field name='lastName' type='text' className='input input-sm' />
                            </div>

                            <div className="field">
                                <label htmlFor='mail'>Mail</label>
                                <Field name='mail' type='text' className='input input-sm' />
                            </div>

                            <div className="field">
                                <label htmlFor='password'>Password</label>
                                <Field name='password' type='text' className='input input-sm' />
                            </div>

                            <div className="field">
                                <ComboBoxModel
                                    list={rolsOptions}
                                    name='rol'
                                    title='Rol'
                                    value='rol'
                                />
                            </div>


                            {/* <div className="field">
                              <label htmlFor='rol'>Rol</label>
                              <Field name='rol' type='text' className='input-text' />
                        </div> */}



                            {/* <div className="field">
                            <label htmlFor='macrouser'>Macrouser</label>
                            <Field name="macrouser" as="select">
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

export default UserForm