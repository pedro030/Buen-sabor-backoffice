import React from 'react'
import { Ingredient } from '../../../../models/Ingredient'
import { IngredientService } from '../../../../services/Ingredient'
import { loadIngredients } from '../../../../state/actions/ingredientActions'
import ComboBoxModel from '../../_ComboBoxModel/ComboBoxModel'
import { ingredientSelector, measureSelector } from '../../../../state/selectors'
import Measure from '../../../../pages/Measure/Measure'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import * as Yup from 'yup';
import { useState, useEffect } from 'react';

interface Props {
    obj?: Ingredient,
    open: boolean,
    onClose: () => void
}
const IngredientListForm = ({ obj: obj, open, onClose }: Props) => {
    if (!open) return null
    const ingredientsOptions = useSelector(ingredientSelector)
    const ingredientService = new IngredientService()
    const dispatch = useDispatch()



    const handleSubmit = (state: any) => {
        
        ingredientService.repoIngredients(state.ingredients)
            .then(() => {
                ingredientService.GetAll()
                    .then(m => {
                        dispatch(loadIngredients(m))
                    })
            })
            .finally(() => onClose())
    }

    const handleSelect = (event: any, index: number, values: any, setFieldValue: any) => {
        const selectedIngredient = JSON.parse(event.target.value);
        const updatedIngredients = values.ingredients.map((ingredient: any, i: any) =>
            i === index ? { ...ingredient, ingredient: selectedIngredient } : ingredient);
        setFieldValue('ingredients', updatedIngredients);
    }

    const handleAddIngredient = (values: any, setFieldValue: any) => {
        const newIngredient = { ingredient: { measure: { measure: '' } }, cant: 0 };
        setFieldValue('ingredients', [...values.ingredients, newIngredient]);
    }

    const handleRemoveIngredient = (index: number, values: any, setFieldValue: any) => {
        const updatedIngredients = values.ingredients.filter((i: any, ind: any) => ind !== index);
        setFieldValue('ingredients', updatedIngredients);
    }



    return (
        <div className='overlay' onClick={() => onClose()}>
            <div className='modal-container w-[60vw]' onClick={(e) => { e.stopPropagation() }}>
                <button onClick={onClose} className="absolute btn btn-sm btn-circle btn-ghost right-3 top-2">✕</button>
                <h3>Ingredient List</h3>
                <Formik
                    initialValues={
                        obj ? obj : {
                            ingredients: [],
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
                                            <div className='grid grid-cols-[200px_100px_100px_130px_100px] text-center'>
                                                <h2>Ingrediet</h2>
                                                <h2>Amount</h2>
                                                <h2>Stock</h2>
                                                <h2>Minimum stock</h2>
                                                <h2>Measure </h2>
                                            </div>
                                            {values.ingredients.map((e: any, index: any) => (
                                                <div key={index} className='grid grid-cols-[200px_100px_100px_130px_100px_100px] text-center'>
                                                    <div className='field'>
                                                        <Field name={`ingredients[${index}].ingredient`} as='select' className="input input-sm" value={JSON.stringify(e.ingredient)} onChange={(e: any) => handleSelect(e, index, values, setFieldValue)}>
                                                            <option value='' label='Select Ingredient' />
                                                            {ingredientsOptions.map((i: Ingredient, ind: any) => {
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

export default IngredientListForm