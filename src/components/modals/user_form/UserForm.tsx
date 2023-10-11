import React from 'react'
import { User } from '../../../models/User'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import './UserForm.scss'
import { UserService } from '../../../services/User'
import { useDispatch, useSelector } from 'react-redux'
import { loadUsers } from '../../../state/actions/userActions'
import toast from 'react-hot-toast'
import { rolSelector } from '../../../state/selectors'
import { Rol } from '../../../models/Rol'
import ComboBoxModel from '../_ComboBoxModel/ComboBoxModel'
import { registerUserAuth0 } from '../../../services/Auth0Service'
import * as Yup from 'yup'
import Swal from 'sweetalert2'

interface Props {
    obj?: any,
    open: boolean,
    onClose: () => void,
    employee: boolean,
    watch: boolean
}

const UserForm = ({ obj, open, onClose, employee, watch }: Props) => {
    if (!open) return null
    const dispatch = useDispatch()
    const userService = new UserService();
    const userEmployee = employee ? 'Employee' : 'User';

    const validationSchema = Yup.object({
        mail: Yup.string()
            .email("Invalid mail")
            .required("Mail is required"),
            password: Yup.string()
            .required('New password is required')
            .min(8, 'Your password is too short.')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])/, 'The password must have at least one uppercase and lowercase letter.')
            .matches(/(?=.*\d)/, 'The password must have at least one digit')
            .matches(/(?=.*[@$!%*?&#])/, 'The password must have a special character')
            .matches(/[A-Za-z\d@$!%*?&#]/, 'The password is invalid'),
    })

    const rolsOptions:Rol[] = employee ? useSelector(rolSelector).filter((item: Rol) => item.rol !== 'Client') : useSelector(rolSelector) // traer los registros de "rols" del Redux

    const handleOnSubmit = (state: any) => {
        state.rol = JSON.parse(state.rol)

        if (state?.id) {
            Swal.fire({
                title: 'Updating...',
                allowEscapeKey: false,
                allowOutsideClick: false,
                showConfirmButton: false,
                showCancelButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            })

            userService.updateObj(state)
            .then((response) => {
                if(response?.ok) {
                    onClose();
                    userService.GetAll()
                        .then((users: User[]) => {
                            dispatch(loadUsers(users))
                        })
                    Swal.fire({
                        icon: 'success',
                        title: `The ${userEmployee ? 'employee' : 'user'} was updated`,
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        showCancelButton: false,
                        confirmButtonColor: '#E73636'
                    })
                } else {
                    Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })
                }
            })
        } else {
            Swal.fire({
                title: 'Creating...',
                allowEscapeKey: false,
                allowOutsideClick: false,
                showConfirmButton: false,
                showCancelButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            })

            userService.newObj(state)
            .then((response) => {
                if(response?.ok) {
                    registerUserAuth0(state.mail, state.password)
                    .then((res) => {
                        if(res) {
                            onClose();
                            Swal.fire({
                                icon: 'success',
                                title: `The ${userEmployee ? 'employee' : 'user'} was created`,
                                allowEscapeKey: false,
                                allowOutsideClick: false,
                                showCancelButton: false,
                                confirmButtonColor: '#E73636'
                            })
                        } else Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })
                    })
                    userService.GetAll()
                        .then((res: User[]) => {
                            dispatch(loadUsers(res))
                        })
                } else {
                    Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })
                }
            })
        }

    }


    return (
        <div className='overlay' onClick={() => onClose()}>
            <div className='modal-container' onClick={(e) => { e.stopPropagation() }}>
            <button onClick={onClose} className="absolute btn btn-sm btn-circle btn-ghost right-3 top-2">✕</button>
                <h3>{watch ? `Info ${userEmployee}` : obj ? `Edit ${userEmployee}` : `New ${userEmployee}`}</h3>
                <Formik
                    initialValues={
                        obj ? {
                            ...obj ,
                            rol: JSON.stringify(obj.rol)
                        }
                        : {
                            firstName: String,
                            lastName: String,
                            mail: String,
                            password: String,
                            orders: [],
                            telephone:Number,
                            addresses: [],
                            blacklist: "Enabled"
                        }
                    }
                    validationSchema={validationSchema}
                    onSubmit={(state) => { handleOnSubmit(state) }}
                >
                    <Form>
                        <div className="inputs-form">

                            <div className="field">
                                <label htmlFor='firstName'>First Name</label>
                                <Field name='firstName' type='text' className='input input-sm' disabled={watch}/>
                            </div>

                            <div className="field">
                                <label htmlFor='lastName'>Last Name</label>
                                <Field name='lastName' type='text' className='input input-sm' disabled={watch}/>
                            </div>

                            <div className="field">
                                <label htmlFor='telephone'>telephone</label>
                                <Field name='telephone' type='number' className='input input-sm' disabled={watch}/>
                            </div>

                            <div className="field">
                                <label htmlFor='mail'>Mail</label>
                                <Field name='mail' type='text' className='input input-sm' disabled={watch}/>
                                <ErrorMessage name="mail">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            <div className="field">
                                <label htmlFor='password'>Password</label>
                                <Field name='password' type='text' className='input input-sm' disabled={watch}/>
                                <ErrorMessage name="password">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            <div className="field">
                            <label htmlFor='rol'>Rol</label>
                                <ComboBoxModel
                                    list={rolsOptions}
                                    name='rol'
                                    title='Rol'
                                    value='rol'
                                    watch={watch}
                                />
                            </div>
                        </div>
                        { !watch && <div className="flex justify-around my-3">
                            <button
                                type="submit"
                                className="btn btn-primary btn-wide btn-sm"
                            >Save</button>
                            <span className='btn btn-secondary btn-wide btn-sm' onClick={() => onClose()}>Cancel</span>
                        </div> }
                    </Form>
                </Formik>
            </div>
        </div>
    )
}

export default UserForm