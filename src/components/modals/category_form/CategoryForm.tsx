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
    obj?: Category,
    open: boolean,
    onClose: () => void
}
const CategoryForm = ({ obj: obj, open, onClose }: Props) => {
    if (!open) return null
    const dispatch = useDispatch()
    // el warning es generado por el useSelector, por ahora no encuentro solucion 
    const categories = useSelector(categoriesSelector)
    const categoryService = new CategoryService();
    const categoriesOptions: Category[] = categories.filter((cat: Category) => !cat.parentCategory)

    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Name is required"),
        subcategories: Yup.string()
    })


    const handleOnSubmit = (state: any) => {
        // let category = {
        //     ...state,
        //     subcategories: state.subcategories?JSON.parse(state.subcategories):""
        // }
        (state.parentCategory === "") ? state.parentCategory = null : state.parentCategory = JSON.parse(state.parentCategory)

        if (state?.id) {
            toast.promise(
                categoryService.updateObj(state)
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
            categoryService.newObj(state)
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
                <button onClick={onClose} className="absolute btn btn-sm btn-circle btn-ghost right-3 top-2">✕</button>

                <h3>{obj ? 'Edit Category' : 'New Category'}</h3>
                <Formik
                    initialValues={
                        obj ? {
                            ...obj,
                            parentCategory: JSON.stringify(obj.parentCategory)
                        } :
                        {
                            name: "",
                            parentCategory: ""
                        }
                    }
                    validationSchema={validationSchema}
                    onSubmit={(state) => { handleOnSubmit(state) }}
                >
                    <Form>
                        <div className="inputs-form">
                            <div className="field">
                                <label htmlFor='name'>Name</label>
                                <Field name='name' type='text' className='w-full max-w-xs input input-sm' />
                                <ErrorMessage name="name">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            {/* <div className="field">
                              <label htmlFor='subcategories'>Subcategory</label>
                              <Field name='subcategories' type='text' className='input-text' />
                        </div> */}

                            <div className="field">
                                <label htmlFor='category'>Category</label>

                                <ComboBoxModel
                                    list={categoriesOptions.filter(item => item.parentCategory === null)}
                                    name='parentCategory'
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
                        <div className="flex items-baseline justify-around my-3">
                            <button
                                type="submit"
                                className="btn btn-primary btn-sm btn-wide "
                            >Save</button>
                            <span className='btn btn-secondary btn-sm btn-wide ' onClick={() => onClose()}>Cancel</span>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}

export default CategoryForm