import React from 'react'
import { Category } from '../../../models/Category'
import { Field, Form, Formik } from 'formik'
import './CategoryForm.scss'
import { getCategories, newCategory, updateCategory } from '../../../services/Category'


interface Props{
    category?: Category,
    open: boolean,
    onClose: ()=>void
}
const CategoryForm = ({category, open, onClose}:Props) => {
    if (!open) return null

    const handleOnSubmit = (state:any) => {
        if(category?.id){
            updateCategory({
                ...category,
                name: state.name,
                active: state.status === 'true'
            }).then(()=>{
                getCategories().then(()=>{
                    onClose()
                })
            })
        }else{
            const randomInt = Math.floor(Math.random() * 100)
            const newCat: Category = {
                name: state.name,
                active: state.status === 'true',
                id: randomInt.toString()
            }
            newCategory(newCat).then(()=>{
                getCategories().then(() => {
                    onClose()
                })
            })
        }
        
    }

  return (
    <div className='overlay' onClick={()=>onClose()}>
        <div className='modal-container' onClick={(e)=>{e.stopPropagation()}}>
            <button onClick={onClose} className='exit-button'>X</button>
            <h3>New Category</h3>
            <Formik
                initialValues={{
                    name: category?.name || '',
                    status: category?.active || false,
                    macrocategory: category?.id_macrocategory || ''
                }}
                  onSubmit={(state) => { handleOnSubmit(state) }}
            >
                <Form>
                    <div className="inputs-form">
                        <div className="field">
                              <label htmlFor='name'>Name</label>
                              <Field name='name' type='text' className='input-text' />
                        </div>
                        <div className="field">
                            <label htmlFor='status'>Status</label>
                            <Field name="status" as="select">
                                <option value='true'>Active</option>
                                <option value='false'>Inactive</option>
                            </Field>
                        </div>
                        <div className="field">
                            <label htmlFor='macrocategory'>Macrocategory</label>
                            <Field name="macrocategory" as="select">
                                <option value='1'>Comida</option>
                                <option value='2'>Bebida</option>
                            </Field>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="button-login"
                    >Save</button>
                </Form>

            </Formik>
        </div>
    </div>
  )
}

export default CategoryForm