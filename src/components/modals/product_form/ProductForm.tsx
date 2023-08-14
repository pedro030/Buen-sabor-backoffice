import React from 'react'
import { Product } from '../../../models/Product'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import './ProductForm.scss'
import { ProductService } from '../../../services/Product'
import { useDispatch, useSelector } from 'react-redux'
import { loadProducts } from '../../../state/actions/productActions'
import toast from 'react-hot-toast'
import { categoriesSelector, ingredientSelector, measureSelector } from '../../../state/selectors'
import { Category } from '../../../models/Category'
import ComboBoxModel from '../_ComboBoxModel/ComboBoxModel'
import * as Yup from 'yup';
import { Ingredient } from '../../../models/Ingredient'


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
    const categoriesOptions: Category[] = categories.filter((cat: Category) => cat.parentCategory?.name)
    const ingredients = useSelector(ingredientSelector)



    const handleOnSubmit = (state: any) => {
        // state = {
        //     ...state,
        //     subcategory: JSON.parse(state.subcategory)
        // }
        state.subcategory = JSON.parse(state.subcategory)
        state.active == 'true' ? state.active = true : state.active = false

        if (state?.id) {
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
                <button onClick={onClose} className="absolute btn btn-sm btn-circle btn-ghost right-3 top-2">✕</button>
                <h3>{obj ? 'Edit Product' : 'New Product'}</h3>
                <Formik
                    initialValues={
                        obj ? obj : {
                            name: "",
                            active: false,
                            cookingTime: 0,
                            image: "",
                            ingredients: [],
                            price: 0
                        }
                    }
                    validationSchema={validationSchema}
                    onSubmit={(state) => { handleOnSubmit(state) }}
                >
                    <Form>
                        <div className="inputs-form">
                            <div className="field">
                                <label htmlFor='name'>Name</label>
                                <Field name='name' type='text' className='input input-sm' />
                                <ErrorMessage name="name">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            <div className="field">
                                <label htmlFor='price'>Price</label>
                                <Field name='price' type='text' className='input input-sm' />
                                <ErrorMessage name="price">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            <div className="field">
                                <label htmlFor='image'>Image</label>
                                <Field name='image' type='text' className='input input-sm' />
                                <ErrorMessage name="image">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            <div className="field">
                                <label htmlFor='cookingTime'>Cooking Time</label>
                                <Field name='cookingTime' type='text' className='input input-sm' />
                                <ErrorMessage name="cookingTime">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>


                            <div className="field">
                                <label htmlFor='active'>Status</label>
                                <Field name='active' as='select' className="input input-sm">
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



                        </div>

                        <div className='flex flex-row'>

                            <button type='button' className='h-36 btn btn-primary btn-sm'>+</button>

                            <div className='flex flex-row justify-center w-[50%] border h-36 overflow-y-auto'>

                                <div className='flex flex-col gap-5 m-1'>
                                    <div className='flex flex-row w-full gap-5'>
                                        <div className='flex flex-col'>
                                            <ComboBoxModel
                                                list={categoriesOptions}
                                                name='subcategory'
                                                title='Subcategory'
                                                value='category'
                                            />
                                        </div>

                                        <div className="flex flex-col field">
                                            {/* <label htmlFor='active'>Amount</label> */}
                                            <Field name='cookingTime' type='number' className=' w-50 input input-sm' />
                                            <ErrorMessage name="cookingTime">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                                        </div>
                                    </div>
                                    <div className='flex flex-row w-full gap-5'>
                                        <div className='flex flex-col'>
                                            <ComboBoxModel
                                                list={categoriesOptions}
                                                name='subcategory'
                                                title='Subcategory'
                                                value='category'
                                            />
                                        </div>

                                        <div className="flex flex-col field">
                                            {/* <label htmlFor='active'>Amount</label> */}
                                            <Field name='cookingTime' type='number' className=' w-50 input input-sm' />
                                            <ErrorMessage name="cookingTime">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                                        </div>
                                    </div>

                                    <div className='flex flex-row w-full gap-5'>
                                        <div className='flex flex-col'>
                                            <ComboBoxModel
                                                list={categoriesOptions}
                                                name='subcategory'
                                                title='Subcategory'
                                                value='category'
                                            />
                                        </div>

                                        <div className="flex flex-col field">
                                            {/* <label htmlFor='active'>Amount</label> */}
                                            <Field name='cookingTime' type='number' className=' w-50 input input-sm' />
                                            <ErrorMessage name="cookingTime">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                                        </div>
                                    </div>

                                    <div className='flex flex-row w-full gap-5'>
                                        <div className='flex flex-col'>
                                            <ComboBoxModel
                                                list={categoriesOptions}
                                                name='subcategory'
                                                title='Subcategory'
                                                value='category'
                                            />
                                        </div>

                                        <div className="flex flex-col field">
                                            {/* <label htmlFor='active'>Amount</label> */}
                                            <Field name='cookingTime' type='number' className=' w-50 input input-sm' />
                                            <ErrorMessage name="cookingTime">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                                        </div>
                                    </div>
                                </div>

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

export default ProductForm