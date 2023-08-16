import { Field } from "formik"

interface Props {
    list: any[],
    name: string,
    title: string,
    value: string,
}

const ComboBoxModel = ({ list, name, title, value}: Props) => {

const handleSelect = (e:any) => {
    console.log(e.target.value)
}

    return (
        <>
            {/* <label htmlFor={name}>{title}</label> */}
            <Field name={name} as="select" className="input input-sm">
                <option onChange={handleSelect} value="-1">Select {value}</option>
                {
                    list.map((e, index) => (
                        <option value={JSON.stringify(e)} key={index}>
                            {value == 'address' ?
                                `${e.street} ${e.number}` :
                            e.firstName? e.firstName + '  ' + e.lastName: e.email?e.email: e.statusType? e.statusType : e.rol? e.rol: e.location ? e.location : e.name? e.name: e.id}
                        </option>
                    ))}
            </Field>
        </>
    )
}



export default ComboBoxModel