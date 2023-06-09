import React from 'react'
import { Category } from '../../../models/Category'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import './CategoryForm.scss'
import { CategoryService } from '../../../services/Category'
import { useDispatch, useSelector } from 'react-redux'
import { loadCategories } from '../../../state/actions/categoryActions'
import toast from 'react-hot-toast'
import { categoriesSelector } from '../../../state/selectors'
import ComboBoxModel from '../_ComboBoxModel/ComboBoxModel'
import * as Yup from 'yup'


interface Props {
    obj?: any,
    open: boolean,
    onClose: () => void
}
const CategoryForm = ({ obj: obj, open, onClose }: Props) => {
    if (!open) return null
    const dispatch = useDispatch()
    // el warning es generado por el useSelector, por ahora no encuentro solucion 
    const categories = useSelector(categoriesSelector)
    const categoryService = new CategoryService();
    const categoriesOptions: Category[] = categories.filter((cat: Category) => !cat.subcategories)

    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Name is required"),
        subcategories: Yup.string()
    })

    const handleOnSubmit = (state: any) => {
        let category = {
            ...state,
            subcategories: state.subcategories?JSON.parse(state.subcategories):""
        }
        if (obj?.id) {
            toast.promise(
                categoryService.updateObj(category)
                    .then(() => {
                        categoryService.GetAll().then((res: Category[]) => {
                            dispatch(loadCategories(res))
                        })
                    })
                    .finally(() => onClose())
                , {
                    loading: 'Loading',
                    success: 'Got the data',
                    error: 'Error when fetching',
                })
        } else {
            categoryService.newObj(category)
                .then(() => {
                    categoryService.GetAll()
                        .then((res: Category[]) => {
                            dispatch(loadCategories(res))
                            onClose()
                        })
                })
        }

    }

    return (
        <div className='overlay' onClick={() => onClose()}>
            <div className='modal-container' onClick={(e) => { e.stopPropagation() }}>
                <button onClick={onClose} className='exit-button'>X</button>
                <h3>{obj ? 'Edit Category' : 'New Category'}</h3>
                <Formik
                    initialValues={
                        obj ?
                            {
                                ...obj,
                                subcategories: JSON.stringify(obj.subcategories)
                            } : {
                                name: "",
                                subcategories: ""
                            }
                    }
                    validationSchema={validationSchema}
                    onSubmit={(state) => { handleOnSubmit(state) }}
                >
                    <Form>
                        <div className="inputs-form">
                            <div className="field">
                                <label htmlFor='name'>Name</label>
                                <Field name='name' type='text' className='input-text' />
                                <ErrorMessage name="name">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            {/* <div className="field">
                              <label htmlFor='subcategories'>Subcategory</label>
                              <Field name='subcategories' type='text' className='input-text' />
                        </div> */}

                            <div className="field">
                                <ComboBoxModel
                                list={categoriesOptions}
                                name='subcategories'
                                title='Subcategory'
                                value='category'
                            />
                            </div>



                            {/* <div className="field">
                            <label htmlFor='subcategories'>Subcategories</label>
                            <Field name="subcategories" as="select">
                                <option value="">Seleccionar categoria</option>
                                {categoriesOptions.map((cat,index) => (
                                    <option value={JSON.stringify(cat)} key={index}>{cat.name}</option>
                                ))}
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