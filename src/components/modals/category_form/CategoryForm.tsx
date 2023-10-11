import React from 'react'
import { Category } from '../../../models/Category'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import './CategoryForm.scss'
import { CategoryService } from '../../../services/Category'
import { useDispatch, useSelector } from 'react-redux'
import { loadCategories } from '../../../state/actions/categoryActions'
import { categoriesSelector } from '../../../state/selectors'
import ComboBoxModel from '../_ComboBoxModel/ComboBoxModel'
import * as Yup from 'yup'
import { useCrudActions } from '../../../hooks/useCrudActions'


interface Props {
    obj?: Category,
    open: boolean,
    onClose: () => void
}
const CategoryForm = ({ obj, open, onClose }: Props) => {
    if (!open) return null
    const dispatch = useDispatch()
    const categories: Category[] = useSelector(categoriesSelector)
    const categoryService = new CategoryService();

    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Name is required"),
        subcategories: Yup.string()
    })

    const handleOnSubmit = (state: Category) => {
        (state.parentCategory === '') ? state.parentCategory = null : state.parentCategory = JSON.parse(state.parentCategory)

        if (state?.id) {
            const { updateObjectAlerts } = useCrudActions(state, categoryService, 'category', dispatch, loadCategories, onClose)
            updateObjectAlerts();
        } else {
            const { addObjectAlerts } = useCrudActions(state, categoryService, 'category', dispatch, loadCategories, onClose)
            addObjectAlerts();
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
                            <div className="field">
                                <label htmlFor='category'>Category</label>
                                <ComboBoxModel
                                    list={categories}
                                    name='parentCategory'
                                    title='Subcategory'
                                    value='category'
                                />
                            </div>
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