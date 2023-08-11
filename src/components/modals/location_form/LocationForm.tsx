import React from 'react'
import { Location } from '../../../models/Location'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import './LocationForm.scss'
import { LocationService } from '../../../services/Location'
import { useDispatch, useSelector } from 'react-redux'
import { loadLocations } from '../../../state/actions/locationActions'
import toast from 'react-hot-toast'
import ComboBoxModel from '../_ComboBoxModel/ComboBoxModel'
import { sectionSelector } from '../../../state/selectors'
import * as Yup from 'yup';


interface Props{
    obj?: any,
    open: boolean,
    onClose: ()=>void
}
const LocationForm = ({obj: obj, open, onClose}:Props) => {
    if (!open) return null
    const dispatch = useDispatch()
    const locationService = new LocationService();

    // validation form
    const validationSchema = Yup.object({
        name: Yup.string().required("Location name required"),
        section: Yup.string().required("Location section is required")
    })

    const handleOnSubmit = (state:any) => {
        state = {
            ...state,
            section: JSON.parse(state.section)
        }
        if(obj?.id){
            toast.promise(
            locationService.updateObj(state)
            .then(()=>{
                locationService.GetAll().then((res:Location[])=>{
                    dispatch(loadLocations(res))
                })
            })
            .finally(() => onClose())
            ,{
                    loading: 'Loading',
                    success: 'Got the data',
                    error: 'Error when fetching',
            })
        }else{
            locationService.newObj(state)
                .then(()=>{
                    locationService.GetAll()
                        .then((res: Location[]) => {
                            dispatch(loadLocations(res))
                            onClose()
                        })
                })
        }
        
    }

  return (
    <div className='overlay' onClick={()=>onClose()}>
        <div className='modal-container' onClick={(e)=>{e.stopPropagation()}}>
        <button onClick={onClose} className="absolute btn btn-sm btn-circle btn-ghost right-3 top-2">✕</button>
            <h3>{obj?'Edit Location':'New Location'}</h3>
            <Formik
                initialValues={
                    obj?obj:{
                        name:""
                    }
                }
                validationSchema={validationSchema}
                onSubmit={(state) => { handleOnSubmit(state) }}
            >
                <Form>
                    <div className="inputs-form">
                        
                        <div className="field">
                              <label htmlFor='name'>Location</label>
                              <Field name='name' type='text' className='input input-sm' />
                              <ErrorMessage name="name">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                        </div>
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

export default LocationForm