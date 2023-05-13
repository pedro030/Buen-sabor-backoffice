import './IngredientForm.scss'
import React from 'react'
import { Field, Form, Formik } from 'formik'
import { Ingredient } from '../../../models/Ingredient'
import { IngredientService } from '../../../services/Ingredient'
import { useDispatch, useSelector } from 'react-redux'
import { loadIngredients } from '../../../state/actions/ingredientActions'
import ComboBoxModel from '../_ComboBoxModel/ComboBoxModel'
import { measureSelector } from '../../../state/selectors'

interface Props {
    obj?: any,
    open: boolean,
    onClose: () => void
}
const IngredientForm = ({ obj: obj, open, onClose }: Props) => {
    if (!open) return null
    const ingredientService = new IngredientService()
    const dispatch = useDispatch()

    // Crea o edita dependiendo si obj es pasado como prop
    const handleSubmit = (state: any) => {
        state = {
            ...state,
            measure: JSON.parse(state.measure)
        }
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
                        ingredient: ""
                    }
                }
                onSubmit={(state) => handleSubmit(state)}
              >
                <Form>
                    <div className="inputs-form">
                        <div className="field">
                            <label htmlFor='ingredient'>Ingredient Name</label>
                            <Field name='name' type='text' className='input-text' />
                        </div>

                        <div className="field">
                            <label htmlFor='ingredient2'>Cost</label>
                            <Field name='cost' type='text' className='input-text' />
                        </div>

                        <div className="field">
                            <label htmlFor='ingredient3'>Stock</label>
                            <Field name='stock' type='text' className='input-text' />
                        </div>

                        <div className="field">
                                <ComboBoxModel
                                    list={useSelector(measureSelector)}
                                    name='measure'
                                    title='Measure'
                                    value='measure'
                                />
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