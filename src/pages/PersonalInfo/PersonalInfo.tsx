import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { userSessionSelector } from '../../state/selectors';
import { User } from '../../models/User';
import { UserService } from '../../services/User';
import { sign_in } from '../../state/actions/userSessionAction';
import Swal from 'sweetalert2';

const PersonalInfo = () => {

    // Redux
    const dispatch = useDispatch();

    // Informacion del usuario en sesion
    const userInfo = useSelector(userSessionSelector)

    // Servicio de usuarios
    const userSrv = new UserService();

    // Regex para validar telefono
    const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    // Regex para validar nombres y apellido
    const nameRegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']+$/u

    // Validacion del formulario
    const validationSchema = Yup.object({
        firstName: Yup.string().required("Name is required")
        .matches(nameRegExp, 'Numbers are not allowed').max(55),
        email: Yup.string().email(),
        lastName: Yup.string().required("Lastname is required")
        .matches(nameRegExp, 'Numbers are not allowed').max(55),
        telephone: Yup.string().matches(
        phoneRegExp,
        "Phone number is not valid"
        ).max(14, "Phone number is too long"),
    });

  // Guardar cambios
  const onSubmitChanges = (state: any) => {
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
    if (userInfo.user){
        const updatedObj: User = {
            ...userInfo.user,
        firstName: state.firstName,
        lastName: state.lastName,
        telephone: state.telephone,
        };
        userSrv.updateObj(updatedObj)
        .then(() => {
          if(userInfo.user?.mail)
            userSrv.getUserByMail(userInfo.user?.mail)
          .then(updatedUser => {
            dispatch(sign_in(updatedUser))
            Swal.fire({
                icon: 'success',
                title: `The update was successful`,
                allowEscapeKey: false,
                allowOutsideClick: false,
                showCancelButton: false,
                confirmButtonColor: '#E73636'
            })
          })
        }).catch(() => { Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })})
    }
  };
  
  return (
    <div className=''>
      <h2 className='mb-5 text-center stat-title'>Account Info</h2>
      <Formik
        initialValues={ userInfo.user ? userInfo.user : {
          id: "",
          firstName: "",
          mail: "",
          lastName: "",
          telephone: 0,
          blacklist: "",
          orders: []
        }}
        onSubmit={onSubmitChanges}
        validationSchema={validationSchema}
      >
        <Form className='grid grid-cols-2 gap-4 max-md:grid-cols-1 place-content-center'>
          <div className='flex flex-col items-center justify-center'>
            <div>
              <label className='label' htmlFor='firstName'>
                <span className='label-text'>First Name</span>
              </label>
              <Field
                name='firstName'
                type='text'
                className='w-96 max-lg:w-72 input input-bordered input-primary'
              />
              <br />
              <ErrorMessage name="firstName">{msg => <span className="text-error">{msg}</span>}</ErrorMessage>
            </div>
            <div>
              <label className='label' htmlFor='lastName'>
                <span className='label-text'>Last Name</span>
              </label>
              <Field
                type='text'
                name='lastName'
                className='w-96 max-lg:w-72 input input-bordered input-primary'
              />
              <br />
              <ErrorMessage name="lastName">{msg => <span className="text-error">{msg}</span>}</ErrorMessage>
            </div>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <div>
              <label className='label' htmlFor='telephone'>
                <span className='label-text'>Phone Number</span>
              </label>
              <Field
                type='text'
                name='telephone'
                className='w-96 max-lg:w-72 input input-bordered input-primary'
              />
              <br />
              <ErrorMessage name="telephone">{msg => <span className="text-error">{msg}</span>}</ErrorMessage>
            </div>
            <div>
              <label className='label' htmlFor='mail'>
                <span className='label-text'>Email</span>
              </label>
              <Field
                disabled
                name='mail'
                type='email'
                className='w-96 max-lg:w-72 input input-bordered input-primary'
              />
            </div>
          </div>
          <div className='flex justify-center'>
            <button
              type='submit'
              className='w-full mb-10 rounded-full btn btn-primary max-md:w-72'
            >
              Save changes
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  )
}

export default PersonalInfo