import { Field } from "formik"

interface Props {
    list: any[],
    name: string,
    title: string,
    value: string
}

const ComboBoxModel = ({ list, name, title, value }: Props) => {
    return (
        <>
            <label htmlFor={name}>{title}</label>
            <Field name={name} as="select">
                <option value="">Select {value}</option>
                {
                    list.map((e, index) => (
                        <option value={JSON.stringify(e)} key={index}>{e.id}</option>
                    ))}
            </Field>
        </>
    )
}



export default ComboBoxModel