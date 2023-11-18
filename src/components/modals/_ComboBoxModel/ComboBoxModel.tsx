// Formik
import { Field } from "formik"

// Interface
import { IComboBoxModelProps } from "../../../interfaces/IComboBoxModelProps"

const ComboBoxModel = ({ list, name, title, value, watch}: IComboBoxModelProps) => {
    return (
        <>
            <Field name={name} as="select" className="input" disabled={watch}>
                <option value="-1" key={-1}>Select {value == 'category' ? 'category' : value}</option>
                {
                    list?.map((e, index) => (
                        <option value={JSON.stringify(e)} key={index}>
                            {value == 'address' ?
                                `${e.street} ${e.number}` :
                            e.firstName? e.firstName + ' ' + e.lastName: e.email?e.email: e.statusType? e.statusType : e.rol? e.rol: e.location ? e.location : e.name? e.name: e.measure? e.measure : e.id}
                        </option>
                    ))}
            </Field>
        </>
    )
}

export default ComboBoxModel