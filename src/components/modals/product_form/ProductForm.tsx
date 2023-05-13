import React from 'react'
import { Product } from '../../../models/Product'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import './ProductForm.scss'
import { ProductService } from '../../../services/Product'
import { useDispatch, useSelector } from 'react-redux'
import { loadProducts } from '../../../state/actions/productActions'
import toast from 'react-hot-toast'
import { categoriesSelector } from '../../../state/selectors'
import { Category } from '../../../models/Category'
import ComboBoxModel from '../_ComboBoxModel/ComboBoxModel'
import * as Yup from 'yup';


interface Props {
    obj?: any,
    open: boolean,
    onClose: () => void
}
const ProductForm = ({ obj: obj, open, onClose }: Props) => {
    if (!open) return null
    const dispatch = useDispatch()
    const productService = new ProductService();

    const validationSchema = Yup.object({
        name: Yup.string().max(30).required("Product name is required"),
        price: Yup.number().required("Product price is required"),
        subcategory: Yup.string().required("Category is required"),
        active: Yup.bool().required("Product status is required")
    })

    const categories = useSelector(categoriesSelector)
    const categoriesOptions: Category[] = categories.filter((cat: Category) => cat.subcategories)

    const handleOnSubmit = (state: any) => {
        state = {
            ...state,
            subcategory: JSON.parse(state.subcategory)
        }
        if (obj?.id) {
            toast.promise(
                productService.updateObj(state)
                    .then(() => {
                        productService.GetAll().then((res: Product[]) => {
                            dispatch(loadProducts(res))
                        })
                    })
                    .finally(() => onClose())
                , {
                    loading: 'Loading',
                    success: 'Got the data',
                    error: 'Error when fetching',
                })
        } else {
            productService.newObj(state)
                .then(() => {
                    productService.GetAll()
                        .then((res: Product[]) => {
                            dispatch(loadProducts(res))
                            onClose()
                        })
                })
        }

    }

    return (
        <div className='overlay' onClick={() => onClose()}>
            <div className='modal-container' onClick={(e) => { e.stopPropagation() }}>
                <button onClick={onClose} className='exit-button'>X</button>
                <h3>{obj ? 'Edit Product' : 'New Product'}</h3>
                <Formik
                    initialValues={
                        obj ? obj : {
                            name: "",
                            active: false
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

                            <div className="field">
                                <label htmlFor='price'>Price</label>
                                <Field name='price' type='text' className='input-text' />
                                <ErrorMessage name="price">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            <div className="field">
                                <label htmlFor='active'>Status</label>
                                <Field name='active' as='select'>
                                    <option value="true">Active</option>
                                    <option value="false">Unactive</option>
                                </Field>
                                <ErrorMessage name="active">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            <div className="field">
                                <ComboBoxModel
                                    list={categoriesOptions}
                                    name='subcategory'
                                    title='Subcategory'
                                    value='category'
                                />
                                <ErrorMessage name="subcategory">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>


                            {/* <div className="field">
                              <label htmlFor='name'>Category</label>
                              <Field name='subcategory' type='text' className='input-text' />
                        </div> */}

                            {/* <div className="field">
                            <label htmlFor='macroproduct'>Macroproduct</label>
                            <Field name="macroproduct" as="select">
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

export default ProductForm