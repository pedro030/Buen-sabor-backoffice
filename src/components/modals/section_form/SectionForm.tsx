import React from 'react'
import { Section } from '../../../models/Section'
import { Field, Form, Formik } from 'formik'
import './SectionForm.scss'
import { SectionService } from '../../../services/Section'
import { useDispatch } from 'react-redux'
import { loadSections } from '../../../state/actions/sectionActions'
import toast from 'react-hot-toast'


interface Props{
    obj?: any,
    open: boolean,
    onClose: ()=>void
}
const SectionForm = ({obj: obj, open, onClose}:Props) => {
    if (!open) return null
    const dispatch = useDispatch()
    const sectionService = new SectionService();

    const handleOnSubmit = (state:any) => {
        if(obj?.id){
            toast.promise(
            sectionService.updateObj(state)
            .then(()=>{
                sectionService.GetAll().then((res:Section[])=>{
                    dispatch(loadSections(res))
                })
            })
            .finally(() => onClose())
            ,{
                    loading: 'Loading',
                    success: 'Got the data',
                    error: 'Error when fetching',
            })
        }else{
            sectionService.newObj(state)
                .then(()=>{
                    sectionService.GetAll()
                        .then((res: Section[]) => {
                            dispatch(loadSections(res))
                            onClose()
                        })
                })
        }
        
    }

  return (
    <div className='overlay' onClick={()=>onClose()}>
        <div className='modal-container' onClick={(e)=>{e.stopPropagation()}}>
        <button onClick={onClose} className="absolute btn btn-sm btn-circle btn-ghost right-3 top-2">✕</button>
            <h3>{obj?'Edit Section':'New Section'}</h3>
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
                              <label htmlFor='name'>Section</label>
                              <Field name='name' type='text' className='input-text' />
                        </div>

                    
                        {/* <div className="field">
                            <label htmlFor='macrosection'>Macrosection</label>
                            <Field name="macrosection" as="select">
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

export default SectionForm