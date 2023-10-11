import './IngredientForm.scss'
import React from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { Ingredient } from '../../../../models/Ingredient'
import { IngredientService } from '../../../../services/Ingredient'
import { useDispatch, useSelector } from 'react-redux'
import { loadIngredients } from '../../../../state/actions/ingredientActions'
import * as Yup from 'yup'
import ComboBoxModel from '../../_ComboBoxModel/ComboBoxModel'
import { measureSelector } from '../../../../state/selectors'
import Measure from '../../../../pages/Measure/Measure'
import { useCrudActions } from '../../../../hooks/useCrudActions'

interface Props {
    obj?: Ingredient,
    open: boolean,
    onClose: () => void,
    watch: boolean
}
const IngredientForm = ({ obj, open, onClose, watch }: Props) => {
    if (!open) return null
    const ingredientService = new IngredientService()
    const dispatch = useDispatch()

    // configuracion de validacion
    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Ingredient name is required")
            .max(30),
        cost: Yup.number().required("Ingredient cost is required"),
        stock: Yup.number().required("Ingredient stock is required"),
        stockMin: Yup.number().required("Ingredient minimum stock is required")
    })

    // Crea o edita dependiendo si obj es pasado como prop
    const handleSubmit = (state: Ingredient) => {
        state.measure = JSON.parse(state.measure);

        if (state.id) {
            const { updateObjectAlerts } = useCrudActions(state, ingredientService, 'ingredient', dispatch, loadIngredients, onClose);
            updateObjectAlerts();
        } else {
            const { addObjectAlerts } = useCrudActions(state, ingredientService, 'ingredient', dispatch, loadIngredients, onClose);
            addObjectAlerts();
        }
    }

    return (
        <div className='overlay' onClick={() => onClose()}>
            <div className='modal-container' onClick={(e) => { e.stopPropagation() }}>
                <button onClick={onClose} className="absolute btn btn-sm btn-circle btn-ghost right-3 top-2">✕</button>
                <h3>{watch ? `Info Ingredient` : obj ? 'Edit Ingredient' : 'New Ingredient'}</h3>
                <Formik
                    initialValues={
                        obj?
                        {
                            ...obj,
                            measure: JSON.stringify(obj.measure)
                        }
                        : {
                            name: "",
                            cost: "",
                            stock: "",
                            stockMin: ""
                        }
                    }
                    validationSchema={validationSchema}
                    onSubmit={(state) => handleSubmit(state)}
                >

                    <Form>
                        <div className="gap-2 inputs-form">
                            <div className="field">
                                <label htmlFor='ingredient'>Ingredient Name</label>
                                <Field name='name' type='text' className='input input-sm' disabled={watch}/>
                                <ErrorMessage name="name">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            <div className="field">
                                <label htmlFor='cost'>Cost</label>
                                <Field name='cost' type='number' className='input input-sm' disabled={watch}/>
                                <ErrorMessage name="cost">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            <div className="field">
                                <label htmlFor='stock'>Stock</label>
                                <Field name='stock' type='number' className='input input-sm' disabled={watch}/>
                                <ErrorMessage name="stock">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            <div className="field">
                                <label htmlFor='stockMin'>Stock Min.</label>
                                <Field name='stockMin' type='number' className='input input-sm' disabled={watch}/>
                                <ErrorMessage name="stockMin">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>

                            <div className="field">
                                <label htmlFor='measure'>Measure</label>
                                <ComboBoxModel
                                    list={useSelector(measureSelector)}
                                    name='measure'
                                    title='Measure'
                                    value='measure'
                                    watch={watch}
                                />
                            </div>
                        </div>
                        { !watch && <div className="flex justify-around my-3">
                            <button
                                type="submit"
                                className="btn btn-primary btn-wide btn-sm"
                            >Save</button>
                            <span className='btn btn-secondary btn-wide btn-sm' onClick={() => onClose()}>Cancel</span>
                        </div> }
                    </Form>
                </Formik>
            </div>
        </div>
    )
}

export default IngredientForm