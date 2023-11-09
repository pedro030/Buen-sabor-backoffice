// React
import { ChangeEvent, useState } from 'react';

// Formik & Yup
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import { object, string, number, mixed } from 'yup';

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { categoriesSelector, ingredientSelector } from '../../../state/selectors'
import { loadProducts } from '../../../state/actions/productActions'

// Service
import { ProductService } from '../../../services/Product'

// Sweet Alert 2
import Swal from 'sweetalert2'

// Types
import { Product, ProductIngredient } from '../../../models/Product'
import { Category } from '../../../models/Category'
import { IProductFormModal } from '../../../interfaces/IModalCRUDProps'
import { Ingredient } from '../../../models/Ingredient';

const ProductForm = ({ obj: obj, open, onClose, watch }: IProductFormModal) => {
    // Si no está abierto el modal retorna null y no se muestra
    if (!open) return null

    // Redux
    const dispatch = useDispatch()

    // Se obtienen las categorias y los ingredientes
    const categories = useSelector(categoriesSelector)
    const ingredientsOptions = useSelector(ingredientSelector)

    // Service
    const productService = new ProductService();

    // Imagen a cargar en el producto, en principio es null
    const [imagen, setImagen] = useState<File | null>(null);

    // Sirve para saber si la subCategory es bebida o no
    const [subcategoryChange, setSubcategoryChange] = useState<Category | null>(null);

    // Form Validation
    const validationSchema = object({
        name: string().required("Product name is required").max(30),
        price: number().required("Product price is required").moreThan(0, "Price must be greather than 0"),
        subcategory: mixed()
        .test("isRequired", "Please select a category", function (value: any) {
          if (value === "") {
            return false;
          } else if (value && value.id === undefined && value.name === undefined && value.parentCategory === null) {
            return false;
          }
          return true;
        }),
        cookingTime: number().when("subcategory", {
            is: () => findParentCategory(subcategoryChange) == null,
            then: () => number().required("Cooking time is required").moreThan(0, "Cooking time must be greather than 0"),
        }),
        cost: number().when("subcategory", {
            is: () => findParentCategory(subcategoryChange) != null,
            then: () => number().required("Cost is required").moreThan(0, "Cost must be greather than 0"),
        }),
    })

    // Handler Change Image
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImagen(e.target.files[0]);
          }
    }

    // Handle Submit
    const handleOnSubmit = (state: Product) => {
        if(findParentCategory(subcategoryChange) != null) { state.ingredients = []; state.cookingTime = 0; }
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
                    } else Swal.fire({ title: 'There was an error.', text: "Make sure all the data is there, including the image.", icon: 'error', confirmButtonColor: '#E73636' })
                })

        }

    }

    const handleSelect = (event: ChangeEvent<HTMLSelectElement>, index: number, values: Product, setFieldValue: FormikHelpers<Product>['setFieldValue']) => {
        const selectedIngredient = JSON.parse(event.target.value);
        const updatedIngredients = values.ingredients.map((ingredient: ProductIngredient, i: number) =>
            i === index ? { ...ingredient, ingredient: selectedIngredient } : ingredient);
        setFieldValue('ingredients', updatedIngredients);
    }

    const handleAddIngredient = (values: Product, setFieldValue: FormikHelpers<Product>['setFieldValue']) => {
        const newIngredient = { ingredient: { measure: { measure: '' } }, cant: 0 };
        setFieldValue('ingredients', [...values.ingredients, newIngredient]);
    }

    const handleRemoveIngredient = (index: number, values: Product, setFieldValue: FormikHelpers<Product>['setFieldValue']) => {
        const updatedIngredients = values.ingredients.filter((i: ProductIngredient, ind: number) => ind !== index);
        setFieldValue('ingredients', updatedIngredients);
    }

    // Se determina recursivamente si la Parent Category final es "Bebidas"
    const findParentCategory = (category: Category | null): Category | null => {
        if(!category) return null;
        if(category.name === "Bebidas") return category;

        return findParentCategory(category.parentCategory)
    }

    return (
        <div className='overlay' onClick={() => onClose()}>
            <div className='modal-container' onClick={(e) => { e.stopPropagation() }}>
                <button onClick={onClose} className="absolute btn btn-sm btn-circle btn-ghost right-3 top-2">✕</button>
                <h3>{watch ? `Info Product` : obj ? 'Edit Product' : 'New Product'}</h3>
                <Formik
                    initialValues={
                        obj ? obj : {
                            id: "",
                            name: "",
                            active: false,
                            cookingTime: 0,
                            subcategory: {id: "", name: "", parentCategory: null},
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
                                    <Field name='name' type='text' className='input input-sm' disabled={watch}/>
                                    <ErrorMessage name="name">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                                </div>

                                <div className="field">
                                    <label htmlFor='price'>Price</label>
                                    <Field name='price' type='number' className='input input-sm' disabled={watch}/>
                                    <ErrorMessage name="price">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                                </div>

                                <div className="field">
                                    <label htmlFor='image'>Image</label>
                                    <Field accept="image/*" name='images' type='file' className='input input-sm' onChange={(e: ChangeEvent<HTMLInputElement>) => handleImageChange(e)} disabled={watch}/>
                                    <ErrorMessage name="images">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                                </div>

                                {!findParentCategory(subcategoryChange) &&
                                    <div className="field">
                                        <label htmlFor='cookingTime'>Cooking Time</label>
                                        <Field name='cookingTime' type='number' className='input input-sm' disabled={watch}/>
                                        <ErrorMessage name="cookingTime">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                                    </div>
                                }

                                <div className="field">
                                    <label htmlFor='active'>Status</label>
                                    <Field name='active' as='select' className="input input-sm" disabled={watch}>
                                        <option value="true">Active</option>
                                        <option value="false">Unactive</option>
                                    </Field>
                                    <ErrorMessage name="active">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                                </div>

                                <div className="field">
                                    <label htmlFor='active'>Category</label>
                                    <Field name="subcategory" as='select' className="input input-sm" value={JSON.stringify(values.subcategory)} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        const selectedValue = e.target.value;
                                        if(selectedValue != "") {
                                            const selectedCategory = JSON.parse(e.target.value);
                                            setSubcategoryChange(selectedCategory)
                                            setFieldValue('subcategory', selectedCategory);
                                        } else {
                                            setSubcategoryChange(null);
                                            setFieldValue('subcategory', {id: "", name: "", parentCategory: null});
                                        }
                                    }} disabled={watch}>
                                        <option value="" label='Select Category' />
                                        {categories.filter((cat: Category) => cat.parentCategory !== null).map((cat: Category, ind: number) => {
                                            return <option key={ind} value={JSON.stringify(cat)} label={cat.name} />
                                        })}
                                    </Field>
                                    <ErrorMessage name="subcategory">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                                </div>

                                {findParentCategory(subcategoryChange) &&
                                    <div className="field">
                                        <label htmlFor='cost'>Cost</label>
                                        <Field name='cost' type='number' className='input input-sm' disabled={watch}/>
                                        <ErrorMessage name="cost">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                                    </div>
                                }
                            </div>

                            { /* INGREDIENTS */}
                            { !findParentCategory(subcategoryChange) &&
                                <div className='flex flex-col '>
                                    <h1 className='tracking-widest text-center w-[60%] my-1'>Ingredients</h1>
                                    <div className='flex flex-row'>

                                        <button type='button' className='h-36 btn btn-primary btn-sm' onClick={() => handleAddIngredient(values, setFieldValue)} disabled={watch}>+</button>

                                        <div className='flex flex-row ml-5 w-[70%]  h-36 overflow-y-auto'>
                                            <div className='flex flex-col gap-5 m-1'>
                                                {values.ingredients.map((e: ProductIngredient, index: number) => {
                                                    return <>
                                                        <div className='flex flex-row w-full gap-5'>
                                                            <div className='flex flex-col'>
                                                                <Field name={`ingredients[${index}].ingredient`} as='select' className="input input-sm" value={JSON.stringify(e.ingredient)} onChange={(e: ChangeEvent<HTMLSelectElement>) => handleSelect(e, index, values, setFieldValue)}>
                                                                    <option value='' label='Select Ingredient' disabled={watch}/>
                                                                    {ingredientsOptions.map((i: Ingredient, ind: number) => {
                                                                        return <option key={ind} value={JSON.stringify(i)} label={i.name} />
                                                                    })}
                                                                </Field>
                                                            </div>

                                                            <div className="flex flex-col field">
                                                                <Field name={`ingredients[${index}].cant`} type='number' className='w-16 input input-sm' value={e.cant} disabled={watch}/>
                                                            </div>

                                                            <div className='flex flex-col'>
                                                                <label>{values.ingredients[index].ingredient.measure.measure}</label>
                                                            </div>

                                                            <button type='button' className='btn btn-primary btn-sm' onClick={() => handleRemoveIngredient(index, values, setFieldValue)} disabled={watch}>-</button>
                                                        </div>
                                                    </>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            }

                            { !watch && <div className="flex justify-around my-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-wide btn-sm"
                                >Save</button>
                                <span className='btn btn-secondary btn-wide btn-sm' onClick={() => onClose()}>Cancel</span>
                            </div> }
                        </Form>)}
                </Formik>
            </div>
        </div>
    )
}

export default ProductForm