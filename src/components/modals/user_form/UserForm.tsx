// Formik & Yup
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { object, string } from 'yup'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { rolSelector } from '../../../state/selectors'
import { loadUsers } from '../../../state/actions/userActions'

// Services
import { UserService } from '../../../services/User'
import { registerUserAuth0 } from '../../../services/Auth0Service'

// Components
import ComboBoxModel from '../_ComboBoxModel/ComboBoxModel'

// Sweet Alert 2
import Swal from 'sweetalert2'

// Types
import { User } from '../../../models/User'
import { Rol } from '../../../models/Rol'
import { IUserFormModal } from '../../../interfaces/IModalCRUDProps'

const UserForm = ({ obj, open, onClose, employee, watch }: IUserFormModal) => {
    // Si no está abierto el modal retorna null y no se muestra
    if (!open) return null

    // Redux
    const dispatch = useDispatch();

    // Obtiene los Roles
    const rolsOptions: Rol[] = employee ? useSelector(rolSelector)?.filter((item: Rol) => item.rol !== 'Client') : useSelector(rolSelector);

    // Service
    const userService = new UserService();

    // Const que contiene un string indicando si es Empleado o Usuario
    const userEmployee = employee ? 'Employee' : 'User';
    
    // Regex para validar nombres y apellido
    const nameRegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']+$/u
    // Regex para validar números de teléfono
    const phoneRegExp = /^[0-9]+$/;
    // Form Validation crear usuario
    const validationSchemaCreate = object({
        mail: string()
            .email("Invalid mail")
            .required("Mail is required"),
        password: string()
            .required('New password is required')
            .min(8, 'Your password is too short.')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])/, 'The password must have at least one uppercase and lowercase letter.')
            .matches(/(?=.*\d)/, 'The password must have at least one digit')
            .matches(/(?=.*[@$!%*?&#])/, 'The password must have a special character')
            .matches(/[A-Za-z\d@$!%*?&#]/, 'The password is invalid'),
        telephone: string().matches(
            phoneRegExp,
            "Phone number is not valid"
        ).max(14, "Phone number is too long"),
        lastName: string()
            .matches(nameRegExp, 'Numbers are not allowed').max(55),
        firstName: string()
            .matches(nameRegExp, 'Numbers are not allowed').max(55),
    })


    // Validacion del formulario
    const validationSchemaEdit = object({
        firstName: string()
            .matches(nameRegExp, 'Numbers are not allowed').max(55),
        mail: string().email().required("Email is required"),
        lastName: string()
            .matches(nameRegExp, 'Numbers are not allowed').max(55),
        telephone: string().matches(
            phoneRegExp,
            "Phone number is not valid"
        ).max(14, "Phone number is too long"),
    });


    // Handle Submit
    const handleOnSubmit = (state: User) => {
        if(typeof state.rol === "string") {
            state.rol = JSON.parse(state.rol)
        }

        if (obj) {
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
            const updatedObj: User = {
                ...obj,
                firstName: state.firstName,
                lastName: state.lastName,
                telephone: state.telephone,
                rol: state.rol,
                id: obj.id,
                mail: obj.mail,
                password: obj.password,
                blacklist: obj.blacklist,
                orders: [],
                addresses: []
            };
            userService.updateObj(updatedObj)
            .then((response) => {
                if(response?.ok) {
                    onClose();
                    userService.getAllWP()
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
            }).catch(() => {
                Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })
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
            const newUser: User = {
                id: "0",
                mail: state.mail,
                firstName: state.firstName,
                lastName: state.lastName,
                password: state.password,
                telephone: state.telephone ? state.telephone:0,
                blacklist: "Enabled",
                rol: state.rol,
                addresses:[],
                orders:[]
            }

            userService.newObj(newUser)
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
                    userService.getAllWP()
                        .then((res: User[]) => {
                            dispatch(loadUsers(res))
                        })
                } else {
                    Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })
                }
            })
            .catch(() => {
                Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })
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
                            id: "",
                            firstName: "",
                            lastName: "",
                            mail: "",
                            password: "",
                            rol: { id: "", rol: "" },
                            blacklist: "Enabled",
                            orders: [],
                            telephone: 0,
                            addresses: [],
                        }
                    }
                    validationSchema={obj?validationSchemaEdit:validationSchemaCreate}
                    onSubmit={(state) => { handleOnSubmit(state as User) }}
                >
                    <Form>
                        <div className="inputs-form">

                            <div className="field">
                                <label htmlFor='firstName'>First Name</label>
                                <Field name='firstName' type='text' className='input input-sm' disabled={watch}/>
                                <ErrorMessage name="firstname">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            <div className="field">
                                <label htmlFor='lastName'>Last Name</label>
                                <Field name='lastName' type='text' className='input input-sm' disabled={watch}/>
                                <ErrorMessage name="lastname">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            <div className="field">
                                <label htmlFor='telephone'>telephone</label>
                                <Field name='telephone' type='number' className='input input-sm' disabled={watch}/>
                                <ErrorMessage name="telephone">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            <div className="field">
                                <label htmlFor='mail'>Mail</label>
                                <Field name='mail' type='text' className='input input-sm' disabled={watch}/>
                                <ErrorMessage name="mail">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            {obj? <></>:
                            <div className="field">
                                <label htmlFor='password'>Password</label>
                                <Field name='password' type='text' className='input input-sm' disabled={watch}/>
                                <ErrorMessage name="password">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>}

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