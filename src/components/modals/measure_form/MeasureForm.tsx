import './MeasureForm.scss'
import { ErrorMessage, Field, Form, Formik, useFormik } from 'formik'
import { Measure } from '../../../models/Measure'
import { MeasureService } from '../../../services/Measure'
import { useDispatch } from 'react-redux'
import { loadMeasures } from '../../../state/actions/measureActions'
import * as Yup from 'yup'

interface Props {
    obj?: any,
    open: boolean,
    onClose: () => void
}
const MeasureForm = ({ obj: obj, open, onClose }: Props) => {
    if (!open) return null
    const measureService = new MeasureService()
    const dispatch = useDispatch()

    // form configuration
    const validationSchema = Yup.object({
        measure: Yup.string()
        .required("Measure name is required")
        .max(10)
    })
    // Crea o edita dependiendo si obj es pasado como prop
    const handleSubmit = (state: Measure) => {
        if(obj){
            measureService.updateObj(state)
            .then(() => {
                measureService.GetAll()
                .then(m => {
                    dispatch(loadMeasures(m))
                })
            })
            .finally(() => onClose())
        } else {
            measureService.newObj(state)
            .then(() => {
                measureService.GetAll()
                    .then(m => {
                        dispatch(loadMeasures(m))
                    })
            })
            .finally(() => onClose())
        }
    }

  return (
      <div className='overlay' onClick={() => onClose()}>
          <div className='modal-container' onClick={(e) => { e.stopPropagation() }}>
              <button onClick={onClose} className='exit-button'>X</button>
              <h3>{obj?'Edit Measure': 'New Measure'}</h3>
              <Formik
                initialValues={obj || {
                  measure: ""
                }}
                onSubmit={(state) => handleSubmit(state)}
                validationSchema={validationSchema}
              >
                <Form>
                    <div className="inputs-form">
                        <div className="field">
                            <label htmlFor='measure'>Measure Name</label>
                            <Field
                            name='measure'
                            type='text'
                            className={`select`}
                            error="measure"
                            />
                            <ErrorMessage name="measure">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                        </div>
                    </div>
                    <div className="buttons">
                        <button
                            type="submit"
                            className="btn btn-principal"
                        >Save</button>
                        <button className='btn btn-cancel' onClick={() => onClose()}>Cancel</button>
                    </div>
                </Form>
              </Formik>
          </div>
      </div>
  )
}

export default MeasureForm