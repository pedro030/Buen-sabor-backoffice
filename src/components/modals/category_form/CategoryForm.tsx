import React from 'react'
import { Category } from '../../../models/Category'
import { Field, Form, Formik } from 'formik'
import './CategoryForm.scss'
import { CategoryService } from '../../../services/Category'
import { useDispatch } from 'react-redux'
import { loadCategories } from '../../../state/actions/categoryActions'
import toast from 'react-hot-toast'


interface Props{
    obj?: any,
    open: boolean,
    onClose: ()=>void
}
const CategoryForm = ({obj: obj, open, onClose}:Props) => {
    if (!open) return null
    const dispatch = useDispatch()
    const categoryService = new CategoryService();

    const handleOnSubmit = (state:any) => {
        if(obj?.id){
            toast.promise(
            categoryService.updateObj(state)
            .then(()=>{
                categoryService.GetAll().then((res:Category[])=>{
                    dispatch(loadCategories(res))
                })
            })
            .finally(() => onClose())
            ,{
                    loading: 'Loading',
                    success: 'Got the data',
                    error: 'Error when fetching',
            })
        }else{
            categoryService.newObj(state)
                .then(()=>{
                    categoryService.GetAll()
                        .then((res: Category[]) => {
                            dispatch(loadCategories(res))
                            onClose()
                        })
                })
        }
        
    }

  return (
    <div className='overlay' onClick={()=>onClose()}>
        <div className='modal-container' onClick={(e)=>{e.stopPropagation()}}>
            <button onClick={onClose} className='exit-button'>X</button>
            <h3>{obj?'Edit Category':'New Category'}</h3>
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
                              <label htmlFor='name'>Name</label>
                              <Field name='name' type='text' className='input-text' />
                        </div>

                        <div className="field">
                              <label htmlFor='subcategories'>Subcategory</label>
                              <Field name='subcategories' type='text' className='input-text' />
                        </div>
                        {/* <div className="field">
                            <label htmlFor='macrocategory'>Macrocategory</label>
                            <Field name="macrocategory" as="select">
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

export default CategoryForm