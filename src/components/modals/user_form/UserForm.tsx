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


interface Props {
    obj?: any,
    open: boolean,
    onClose: () => void
}

const UserForm = ({ obj: obj, open, onClose }: Props) => {
    if (!open) return null
    const dispatch = useDispatch()
    const userService = new UserService();

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
                    registerUserAuth0(state.mail, state.password)
                    .then(res => {
                        if(res) alert("Create user success")
                        else alert("Error to create user")
                    })
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
                                <Field name='firstName' type='text' className='input input-sm' />
                            </div>

                            <div className="field">
                                <label htmlFor='lastName'>Last Name</label>
                                <Field name='lastName' type='text' className='input input-sm' />
                            </div>

                            <div className="field">
                                <label htmlFor='telephone'>telephone</label>
                                <Field name='telephone' type='number' className='input input-sm' />
                            </div>

                            <div className="field">
                                <label htmlFor='mail'>Mail</label>
                                <Field name='mail' type='text' className='input input-sm' />
                                <ErrorMessage name="mail">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            <div className="field">
                                <label htmlFor='password'>Password</label>
                                <Field name='password' type='text' className='input input-sm' />
                                <ErrorMessage name="password">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            <div className="field">
                            <label htmlFor='rol'>Rol</label>

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