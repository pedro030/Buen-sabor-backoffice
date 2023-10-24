// Formik & Yup
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { object, string, number } from 'yup'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { measureSelector } from '../../../../state/selectors'
import { loadIngredients } from '../../../../state/actions/ingredientActions'

// Services
import { IngredientService } from '../../../../services/Ingredient'

// Hooks
import { useCrudActions } from '../../../../hooks/useCrudActions'

// Components
import ComboBoxModel from '../../_ComboBoxModel/ComboBoxModel'

// Types
import { Ingredient } from '../../../../models/Ingredient'
import { IIngredientFormModal } from '../../../../interfaces/IModalCRUDProps'

const IngredientForm = ({ obj, open, onClose, watch }: IIngredientFormModal) => {
    // Si no está abierto el modal retorna null y no se muestra
    if (!open) return null

    // Redux
    const dispatch = useDispatch()

    // Service
    const ingredientService = new IngredientService()

    // Form Validation
    const validationSchema = object({
        name: string()
            .required("Ingredient name is required")
            .max(30),
        cost: number().required("Ingredient cost is required"),
        stock: number().required("Ingredient stock is required"),
        stockMin: number().required("Ingredient minimum stock is required")
    })

    // Handle Submit
    const handleSubmit = (state: Ingredient) => {
        if(typeof state.measure === "string") {
            state.measure = JSON.parse(state.measure);
        }

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
                            id: "",
                            name: "",
                            cost: 0,
                            stock: 0,
                            stockMin: 0,
                            measure: { id: "", measure: "" }
                        }
                    }
                    validationSchema={validationSchema}
                    onSubmit={(state) => handleSubmit(state as Ingredient)}
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