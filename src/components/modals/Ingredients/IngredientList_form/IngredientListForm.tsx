// React
import { ChangeEvent } from 'react';

// Formik
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { ingredientSelector } from '../../../../state/selectors'
import { loadIngredients } from '../../../../state/actions/ingredientActions'

// Sweet Alert 2
import Swal from 'sweetalert2'

// Service
import { IngredientService } from '../../../../services/Ingredient'

// Types
import { Ingredient, IngredientInList, IngredientList } from '../../../../models/Ingredient'
import { IIngredientListFormModal } from '../../../../interfaces/IModalCRUDProps'

const IngredientListForm = ({ obj, open, onClose }: IIngredientListFormModal) => {
    // Si no está abierto el modal retorna null y no se muestra
    if (!open) return null;

    // Redux
    const dispatch = useDispatch()

    // Obtiene los ingredientes
    const ingredientsOptions = useSelector(ingredientSelector)

    // Service
    const ingredientService = new IngredientService()

    // Handle Submit
    const handleSubmit = (state: IngredientList) => {
        Swal.fire({
            title: 'Restocking...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
            showCancelButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        })

        ingredientService.repoIngredients(state)
            .then((response) => {
                if(response?.ok) {
                    onClose();
                    ingredientService.GetAll()
                        .then((res: Ingredient[]) => {
                            dispatch(loadIngredients(res))
                        })
                    Swal.fire({
                        icon: 'success',
                        title: `The restock was successful`,
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        showCancelButton: false,
                        confirmButtonColor: '#E73636'
                    })
                } else {
                    Swal.fire({ title: 'There was an error', icon: 'error', confirmButtonColor: '#E73636' })
                }
        })
    }

    const handleSelect = (event: ChangeEvent<HTMLSelectElement>, index: number, values: IngredientList, setFieldValue: FormikHelpers<IngredientList>['setFieldValue']) => {
        const selectedIngredient = JSON.parse(event.target.value);
        const updatedIngredients = values.ingredients.map((ingredient: IngredientInList, i: number) =>
            i === index ? { ...ingredient, ingredient: selectedIngredient } : ingredient);
        setFieldValue('ingredients', updatedIngredients);
    }

    const handleAddIngredient = (values: IngredientList, setFieldValue: FormikHelpers<IngredientList>['setFieldValue']) => {
        const newIngredient = { ingredient: { measure: { measure: '' } }, cant: 0 };
        setFieldValue('ingredients', [...values.ingredients, newIngredient]);
    }

    const handleRemoveIngredient = (index: number, values: IngredientList, setFieldValue: FormikHelpers<IngredientList>['setFieldValue']) => {
        const updatedIngredients = values.ingredients.filter((i: IngredientInList, ind: number) => ind !== index);
        setFieldValue('ingredients', updatedIngredients);
    }

    return (
        <div className='overlay' onClick={() => onClose()}>
            <div className='modal-container w-[80%] p-5' onClick={(e) => { e.stopPropagation() }}>
                <button onClick={onClose} className="absolute btn btn-sm btn-circle btn-ghost right-3 top-2">✕</button>
                <h3>Ingredient List</h3>
                <Formik
                    initialValues={
                        obj ? obj : {
                            ingredients: []
                        }
                    }
                    onSubmit={(state) => { handleSubmit(state) }}
                >
                    {({ values, setFieldValue }) => (
                        <Form>
                            <div className='flex flex-col '>
                                <div className='flex flex-row'>

                                    <button type='button' className='h-56 my-5 btn btn-primary btn-sm' onClick={() => handleAddIngredient(values, setFieldValue)}>+</button>

                                    <div className='flex flex-row w-full h-64 ml-5 overflow-y-auto'>
                                        <div className='flex flex-col gap-5 m-1'>
                                            <div className='grid grid-cols-[200px_150px_100px_130px_100px] text-center'>
                                                <h2>Ingrediet</h2>
                                                <h2>Amount</h2>
                                                <h2>Stock</h2>
                                                <h2>Minimum stock</h2>
                                                <h2>Measure </h2>
                                            </div>
                                            {values.ingredients.map((e: IngredientInList, index: number) => (
                                                <div key={index} className='grid grid-cols-[200px_150px_100px_130px_100px_100px] text-center'>
                                                    <div className='field'>
                                                        <Field name={`ingredients[${index}].ingredient`} as='select' className="input input-sm" value={JSON.stringify(e.ingredient)} onChange={(e: ChangeEvent<HTMLSelectElement>) => handleSelect(e, index, values, setFieldValue)}>
                                                            <option value='' label='Select Ingredient' />
                                                            {ingredientsOptions.map((i: Ingredient, ind: number) => {
                                                                return <option key={ind} value={JSON.stringify(i)} label={i.name} />
                                                            })}
                                                        </Field>
                                                    </div>

                                                    <div className="field">
                                                        <Field name={`ingredients[${index}].cant`} type='number' className='w-20 input input-sm' min={1} value={e.cant} />
                                                        <ErrorMessage name="cookingTime">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                                                    </div>

                                                    <label>{values.ingredients[index].ingredient.stock}</label>

                                                    <label>{values.ingredients[index].ingredient.stockMin}</label>

                                                    <label>{values.ingredients[index].ingredient.measure.measure}</label>

                                                    <div className='flex place-content-center'>
                                                        <button type='button' className='w-8 btn btn-primary btn-sm' onClick={() => handleRemoveIngredient(index, values, setFieldValue)}>-</button>
                                                    </div>
                                                </div>
                                            )
                                            )}

                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="flex justify-around gap-5 my-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-36 lg:btn-wide btn-md"
                                >Save</button>
                                <span className='btn btn-secondary w-36 lg:btn-wide btn-md' onClick={() => onClose()}>Cancel</span>
                            </div>
                        </Form>)}
                </Formik>
            </div>
        </div>
    )
}

export default IngredientListForm