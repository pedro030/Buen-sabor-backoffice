import React from 'react'
import { Location } from '../../../models/Location'
import { Field, Form, Formik } from 'formik'
import './LocationForm.scss'
import { LocationService } from '../../../services/Location'
import { useDispatch, useSelector } from 'react-redux'
import { loadLocations } from '../../../state/actions/locationActions'
import toast from 'react-hot-toast'
import ComboBoxModel from '../_ComboBoxModel/ComboBoxModel'
import { sectionSelector } from '../../../state/selectors'


interface Props{
    obj?: any,
    open: boolean,
    onClose: ()=>void
}
const LocationForm = ({obj: obj, open, onClose}:Props) => {
    if (!open) return null
    const dispatch = useDispatch()
    const locationService = new LocationService();

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
            <button onClick={onClose} className='exit-button'>X</button>
            <h3>{obj?'Edit Location':'New Location'}</h3>
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
                              <label htmlFor='location'>Location</label>
                              <Field name='location' type='text' className='input-text' />
                        </div>


                        <div className="field">
                                <ComboBoxModel
                                    list={useSelector(sectionSelector)}
                                    name='section'
                                    title='Section'
                                    value='section'
                                />
                            </div>
                        {/* <div className="field">
                              <label htmlFor='section'>Section</label>
                              <Field name='section' type='text' className='input-text' />
                        </div> */}

                    
                        {/* <div className="field">
                            <label htmlFor='macrolocation'>Macrolocation</label>
                            <Field name="macrolocation" as="select">
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

export default LocationForm