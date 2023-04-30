import loginJpg from '../../assets/login.jpg'
import './Login.scss';
import { sign_in } from '../../state/actions/userSessionAction';
import { Field, Form, Formik } from 'formik';

const Login = () => {
    return (
            <div className="login-page">
                <img src={loginJpg} alt="Login-image" />
                <div className="login-form">
                    <h2>El buen Sabor</h2>
                    <h3>Login into your account</h3>
                    <p className='welcome-message'>Welcome back, please enter your details</p>
                    <div className="inputs-login">
                        <button className="button-google">Google</button>
                        <p className='or'>Or</p>
                        <Formik
                            initialValues={{
                                email: '',
                                password: '',
                                rememberMe: false
                            }}
                            onSubmit={(state)=>{console.log(state.email)}}
                        >
                            <Form>
                                <label htmlFor="email">Email</label>
                                <Field name="email" type="email" className="input-text" />
                                <label htmlFor="password">Password</label>
                                <Field name="password" type="password" className="input-text" />
                                <Field type="checkbox" name="rememberMe" /><span className='remember-me'>Remember me</span>
                                <span className='forgot-password'>Forgot password?</span>
                                <button
                                    type="submit"
                                    className="button-login"
                                >Log in</button>
                                <p>Don't have an account? <u>Sign up</u></p>
                            </Form>

                        </Formik>
                    </div>
                </div>
            </div>
    )
}

export default Login