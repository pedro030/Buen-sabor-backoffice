import { Product } from '../../../models/Product'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import './ProductForm.scss'
import { ProductService } from '../../../services/Product'
import { useDispatch, useSelector } from 'react-redux'
import { loadProducts } from '../../../state/actions/productActions'
import toast from 'react-hot-toast'
import { categoriesSelector, ingredientSelector } from '../../../state/selectors'
import { Category } from '../../../models/Category'
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'

interface Props {
    obj?: any,
    open: boolean,
    onClose: () => void
}
const ProductForm = ({ obj: obj, open, onClose }: Props) => {
    if (!open) return null
    const dispatch = useDispatch()
    const productService = new ProductService();
    const [imagen, setImagen] = useState<File | null>(null);
    const [subcategoryChange, setSubcategoryChange] = useState<Category>();

    const validationSchema = Yup.object({
        name: Yup.string().max(30).required("Product name is required"),
        price: Yup.number().required("Product price is required"),
        //subcategory: Yup.string().required("Category is required"),
        active: Yup.bool().required("Product status is required")
    })

    const categories = useSelector(categoriesSelector)
    //const categoriesOptions: Category[] = categories.filter((cat: Category) => cat.parentCategory?.name)
    const ingredientsOptions = useSelector(ingredientSelector)

    const handleImageChange = (e: any) => {
        setImagen(e.target.files[0])
    }

    const handleOnSubmit = (state: Product) => {
        if (state?.id) {
            Swal.fire({
                title: 'Updating...',
                allowEscapeKey: false,
                allowOutsideClick: false,
                showConfirmButton: false,
                showCancelButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            })

            productService.updateProduct(state, imagen)
            .then((response) => {
                if(response?.status === 200) {
                    onClose();
                    productService.GetAll()
                    .then((res: Product[]) => {
                        dispatch(loadProducts(res))
                    })
                    Swal.fire({
                        icon: 'success',
                        title: `The product was updated`,
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        showCancelButton: false,
                        confirmButtonColor: '#E73636'
                    })
                } else {
                    Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })
                }
            })
            
        } else {
            Swal.fire({
                title: 'Adding...',
                allowEscapeKey: false,
                allowOutsideClick: false,
                showConfirmButton: false,
                showCancelButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            })
    
            productService.newProduct(state, imagen)
                .then((response) => {
                    if(response?.status == 200) {
                        onClose();
                        productService.GetAll()
                            .then((res: Product[]) => {
                                dispatch(loadProducts(res))
                            })
                        Swal.fire({
                            icon: 'success',
                            title: `The product was added`,
                            allowEscapeKey: false,
                            allowOutsideClick: false,
                            showCancelButton: false,
                            confirmButtonColor: '#E73636'
                        })
                    } else Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })
                })

        }

    }

    const handleSelect = (event: any, index: number, values: any, setFieldValue: any) => {
        const selectedIngredient = JSON.parse(event.target.value);
        const updatedIngredients = values.ingredients.map((ingredient: any, i: any) =>
            i === index ? { ...ingredient, ingredient: selectedIngredient } : ingredient);
        setFieldValue('ingredients', updatedIngredients);
    }

    const handleAddIngredient = (values: any, setFieldValue: any) => {
        const newIngredient = { ingredient: { measure: { measure: '' } }, cant: 0 }; // Nuevo objeto de ingrediente vacío
        setFieldValue('ingredients', [...values.ingredients, newIngredient]);
    }

    const handleRemoveIngredient = (index: number, values: any, setFieldValue: any) => {
        const updatedIngredients = values.ingredients.filter((i: any, ind: any) => ind !== index);
        setFieldValue('ingredients', updatedIngredients);
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
                            subcategory: {},
                            image: '',
                            cost: 0,
                            ingredients: [],
                            price: 0
                        }
                    }
                    validationSchema={validationSchema}
                    onSubmit={(state) => { handleOnSubmit(state) }}
                >
                    {({ values, setFieldValue }) => (
                        <Form>
                            <div className="inputs-form">
                                <div className="field">
                                    <label htmlFor='name'>Name</label>
                                    <Field name='name' type='text' className='input input-sm' />
                                    <ErrorMessage name="name">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                                </div>

                                <div className="field">
                                    <label htmlFor='price'>Price</label>
                                    <Field name='price' type='number' className='input input-sm' />
                                    <ErrorMessage name="price">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                                </div>

                                <div className="field">
                                    <label htmlFor='image'>Image</label>
                                    <Field accept="image/*" name='images' type='file' className='input input-sm' onChange={(e: any) => handleImageChange(e)} />
                                    <ErrorMessage name="images">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                                </div>

                                <div className="field">
                                    <label htmlFor='cookingTime'>Cooking Time</label>
                                    <Field name='cookingTime' type='number' className='input input-sm' />
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
                                    <label htmlFor='active'>Category</label>
                                    <Field name="subcategory" as='select' className="input input-sm" value={JSON.stringify(values.subcategory)} onChange={(e: any) => {
                                        const selectedCategory = JSON.parse(e.target.value);
                                        setSubcategoryChange(selectedCategory)
                                        setFieldValue('subcategory', selectedCategory);
                                    }}>
                                        <option value='' label='Select Category' />
                                        {categories.filter((item: Category) => item?.parentCategory !== null).map((cat: Category, ind: number) => {
                                            return <option key={ind} value={JSON.stringify(cat)} label={cat.name} />
                                        })}
                                    </Field>
                                    <ErrorMessage name="subcategory">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                                </div>

                                {((subcategoryChange?.parentCategory?.name === "Bebidas") || (values.subcategory.parentCategory?.name === "Bebidas")) &&
                                    <div className="field">
                                        <label htmlFor='cost'>Cost</label>
                                        <Field name='cost' type='number' className='input input-sm' />
                                        <ErrorMessage name="cost">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                                    </div>
                                }


                            </div>


                            { /* INGREDIENTS */}
                            <div className='flex flex-col '>
                                <h1 className='tracking-widest text-center w-[60%] my-1'>Ingredients</h1>
                                <div className='flex flex-row'>

                                    <button type='button' className='h-36 btn btn-primary btn-sm' onClick={() => handleAddIngredient(values, setFieldValue)}>+</button>

                                    <div className='flex flex-row ml-5 w-[70%]  h-36 overflow-y-auto'>
                                        <div className='flex flex-col gap-5 m-1'>
                                            {values.ingredients.map((e: any, index: any) => {
                                                return <>
                                                    <div className='flex flex-row w-full gap-5'>
                                                        <div className='flex flex-col'>
                                                            <Field name={`ingredients[${index}].ingredient`} as='select' className="input input-sm" value={JSON.stringify(e.ingredient)} onChange={(e: any) => handleSelect(e, index, values, setFieldValue)}>
                                                                <option value='' label='Select Ingredient' />
                                                                {ingredientsOptions.map((i: any, ind: any) => {
                                                                    return <option key={ind} value={JSON.stringify(i)} label={i.name} />
                                                                })}
                                                            </Field>
                                                        </div>

                                                        <div className="flex flex-col field">
                                                            <Field name={`ingredients[${index}].cant`} type='number' className='w-16 input input-sm' value={e.cant} />
                                                            {/* <ErrorMessage name="cookingTime">{msg => <span className="error-message">{msg}</span>}</ErrorMessage> */}
                                                        </div>

                                                        <div className='flex flex-col'>
                                                            <label>{values.ingredients[index].ingredient.measure.measure}</label>
                                                        </div>

                                                        <button type='button' className='btn btn-primary btn-sm' onClick={() => handleRemoveIngredient(index, values, setFieldValue)}>-</button>
                                                    </div>
                                                </>
                                            })}

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
                        </Form>)}
                </Formik>
            </div>
        </div>
    )
}

export default ProductForm