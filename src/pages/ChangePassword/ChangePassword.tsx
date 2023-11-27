// React
import { useEffect, useState } from 'react';

// Auth0
import { useAuth0 } from '@auth0/auth0-react';

// Formik & Yup
import { object, string, ref } from 'yup';
import { ErrorMessage, Field, Form, Formik, FormikHelpers} from 'formik'

// Services
import { updatePassword } from '../../services/Auth0Service';

// Sweet Alert 2
import Swal from 'sweetalert2';

const ChangePassword = () => {
    // User logged from Auth0
    const { user } = useAuth0();

    // State que establece si puede cambiar o no la contraseña
    const[canChange, setCanChange] = useState<boolean>(false);

    // Formik Validations
    const validationSchema = object({
        newPassword: string()
            .required('New password is required')
            .min(8, 'Your password is too short.')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])/, 'The password must have at least one uppercase and lowercase letter.')
            .matches(/(?=.*\d)/, 'The password must have at least one digit')
            .matches(/(?=.*[@$!%*?&#])/, 'The password must have a special character')
            .matches(/[A-Za-z\d@$!%*?&#]/, 'The password is invalid'),
        confirmPassword: string()
            .oneOf([ref('newPassword')], 'Passwords must match')
    })

    useEffect(()=>{
        if(user?.sub){
            setCanChange(user.sub?.split('|')[0] === "auth0");
        }
    },[])

    // Handle Submit Formik
    const handleSubmit = (state: { newPassword: string, confirmPassword: string }, action: FormikHelpers<any>) => {
        Swal.fire({
            title: 'Updating Password...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
            showCancelButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        })
        updatePassword(user?.sub || "", state.newPassword)
        .then(data => {
            if(data){
                Swal.fire({
                    icon: 'success',
                    title: `Password Updated`,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    showCancelButton: false,
                    confirmButtonColor: '#E73636'
                })
                action.resetForm();
            }else{
                Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })
                action.resetForm();
            }
        })
    }

    return (
        <div className='flex flex-col items-center justify-center h-full'>
            <h1 className="m-5 mb-10 text-xl tracking-widest text-center">CHANGE PASSWORD</h1>
            <div className="flex items-center justify-center ">
                <Formik
                    initialValues={{
                        newPassword:"",
                        confirmPassword:""
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    <Form className="flex flex-col gap-5 md:w-[80%]">
                        <div className="flex flex-col ">
                            <label className="label">
                                <span className="label-text">New Password</span>
                            </label>
                            <Field disabled={!canChange} type="password" name="newPassword" className="w-full input input-bordered" />
                            <ErrorMessage name="newPassword">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                        </div>
                        <div className="flex flex-col ">
                            <label className="label">
                                <span className="label-text">Repeat Password</span>
                            </label>
                            <Field disabled={!canChange} type="password" name="confirmPassword" className="w-full input input-bordered" />
                            <ErrorMessage name="confirmPassword">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                        </div>
                        <button disabled={!canChange} className="rounded-full btn btn-primary" type="submit">Save changes</button>
                        {canChange ? (<></>) : (
                            <div className="mb-10 alert alert-warning">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <span className='text-xs md:text-sm'>Warning: You can't change the password because you logged with google</span>
                            </div>)}
                    </Form>
                </Formik>
            </div>
        </div>
    )
}

export default ChangePassword