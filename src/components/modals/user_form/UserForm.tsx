import React from 'react'
import { User } from '../../../models/User'
import { Field, Form, Formik } from 'formik'
import './UserForm.scss'
import { UserService } from '../../../services/User'
import { useDispatch } from 'react-redux'
import { loadUsers } from '../../../state/actions/userActions'
import toast from 'react-hot-toast'


interface Props{
    obj?: any,
    open: boolean,
    onClose: ()=>void
}
const UserForm = ({obj: obj, open, onClose}:Props) => {
    if (!open) return null
    const dispatch = useDispatch()
    const userService = new UserService();

    const handleOnSubmit = (state:any) => {
        if(obj?.id){
            toast.promise(
            userService.updateObj(state)
            .then(()=>{
                userService.GetAll().then((res:User[])=>{
                    dispatch(loadUsers(res))
                })
            })
            .finally(() => onClose())
            ,{
                    loading: 'Loading',
                    success: 'Got the data',
                    error: 'Error when fetching',
            })
        }else{
            userService.newObj(state)
                .then(()=>{
                    userService.GetAll()
                        .then((res: User[]) => {
                            dispatch(loadUsers(res))
                            onClose()
                        })
                })
        }
        
    }

  return (
    <div className='overlay' onClick={()=>onClose()}>
        <div className='modal-container' onClick={(e)=>{e.stopPropagation()}}>
            <button onClick={onClose} className='exit-button'>X</button>
            <h3>{obj?'Edit User':'New User'}</h3>
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
                              <label htmlFor='first_name'>First Name</label>
                              <Field name='first_name' type='text' className='input-text' />
                        </div>

                        <div className="field">
                              <label htmlFor='last_name'>Last Name</label>
                              <Field name='last_name' type='text' className='input-text' />
                        </div>

                        <div className="field">
                              <label htmlFor='mail'>Mail</label>
                              <Field name='mail' type='text' className='input-text' />
                        </div>

                        <div className="field">
                              <label htmlFor='password'>Password</label>
                              <Field name='password' type='text' className='input-text' />
                        </div>

                        <div className="field">
                              <label htmlFor='rol'>Rol</label>
                              <Field name='rol' type='text' className='input-text' />
                        </div>
                      

                    
                        {/* <div className="field">
                            <label htmlFor='macrouser'>Macrouser</label>
                            <Field name="macrouser" as="select">
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

export default UserForm