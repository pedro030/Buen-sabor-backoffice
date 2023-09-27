import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik, FormikHelpers} from 'formik'
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { updatePassword } from '../../services/Auth0Service';

const ChangePassword = () => {
    const {user} = useAuth0();
    const[canChange, setCanChange] = useState<boolean>(false);
    const validationSchema = Yup.object({
        // oldPassword: Yup.string().required('Old password is required'),
        newPassword: Yup.string()
            .required('New password is required')
            .min(8, 'Your password is too short.')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])/, 'The password must have at least one uppercase and lowercase letter.')
            .matches(/(?=.*\d)/, 'The password must have at least one digit')
            .matches(/(?=.*[@$!%*?&#])/, 'The password must have a special character')
            .matches(/[A-Za-z\d@$!%*?&#]/, 'The password is invalid'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    })
    useEffect(()=>{
        if(user?.sub){
            setCanChange(user.sub?.split('|')[0] === "auth0");
        }
    },[])

    const handleSubmit = (state: any, action: FormikHelpers<any>) =>{
        updatePassword(user?.sub || "", state.newPassword)
        .then(data => {
            if(data){
                alert("Password update success")
                action.resetForm();
            }else{
                alert("An error ocurr updating password, please try later");
                action.resetForm();
            }
        })
    }
    return (
        <>
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
                    <Form className="flex flex-col items-center justify-center gap-x-5">
                        <div className="w-full max-w-xs form-control">
                            <label className="label">
                                <span className="label-text">New Password</span>
                            </label>
                            <Field disabled={!canChange} type="password" name="newPassword" className="w-full max-w-xs input input-bordered" />
                            <ErrorMessage name="newPassword">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            <label className="label">
                            </label>
                        </div>
                        <div className="w-full max-w-xs form-control">
                            <label className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <Field disabled={!canChange} type="password" name="confirmPassword" className="w-full max-w-xs input input-bordered" />
                            <ErrorMessage name="confirmPassword">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            <label className="label">
                            </label>
                        </div>
                        <button disabled={!canChange} type="submit" className="w-full mt-5 btn btn-primary btn-md max-w-xs">Save!</button>
                        { canChange?(<></>):(<span>You can't change the password because you logged with google</span>)}
                    </Form>
                </Formik>
            </div>
        </>
    )

}

export default ChangePassword