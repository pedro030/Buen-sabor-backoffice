import './IngredientForm.scss'
import React from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { Ingredient } from '../../../models/Ingredient'
import { IngredientService } from '../../../services/Ingredient'
import { useDispatch } from 'react-redux'
import { loadIngredients } from '../../../state/actions/ingredientActions'
import * as Yup from 'yup'

interface Props {
    obj?: any,
    open: boolean,
    onClose: () => void
}
const IngredientForm = ({ obj: obj, open, onClose }: Props) => {
    if (!open) return null
    const ingredientService = new IngredientService()
    const dispatch = useDispatch()

    // configuracion de validacion
    const validationSchema = Yup.object({
        name: Yup.string()
        .required("Ingredient name is required")
        .max(30),
        cost: Yup.number().required("Ingredient cost is required"),
        stock: Yup.number().required("Ingredient stock is required")
    })

    // Crea o edita dependiendo si obj es pasado como prop
    const handleSubmit = (state: Ingredient) => {
        if(obj){
            ingredientService.updateObj(state)
            .then(() => {
                ingredientService.GetAll()
                .then(m => {
                    dispatch(loadIngredients(m))
                })
            })
            .finally(() => onClose())
        } else {
            ingredientService.newObj(state)
            .then(() => {
                ingredientService.GetAll()
                    .then(m => {
                        dispatch(loadIngredients(m))
                    })
            })
            .finally(() => onClose())
        }
    }

  return (
      <div className='overlay' onClick={() => onClose()}>
          <div className='modal-container' onClick={(e) => { e.stopPropagation() }}>
              <button onClick={onClose} className='exit-button'>X</button>
              <h3>{obj?'Edit Ingredient': 'New Ingredient'}</h3>
              <Formik
                initialValues={
                    obj || {
                        name: "",
                        cost: "",
                        stock:""
                    }
                }
                validationSchema={validationSchema}
                onSubmit={(state) => handleSubmit(state)}
              >
                <Form>
                    <div className="inputs-form">
                        <div className="field">
                            <label htmlFor='ingredient'>Ingredient Name</label>
                            <Field name='name' type='text' className='input-text' />
                            <ErrorMessage name="name">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                        </div>

                        <div className="field">
                            <label htmlFor='cost'>Cost</label>
                            <Field name='cost' type='number' className='input-text' />
                            <ErrorMessage name="cost">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                        </div>

                        <div className="field">
                            <label htmlFor='stock'>Stock</label>
                            <Field name='stock' type='number' className='input-text' />
                            <ErrorMessage name="stock">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                        </div>
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

export default IngredientForm