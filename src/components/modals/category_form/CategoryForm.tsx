// Formik & Yup
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { object, string } from 'yup'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { categoriesSelector } from '../../../state/selectors'
import { loadCategories } from '../../../state/actions/categoryActions'

// Hooks
import { useCrudActions } from '../../../hooks/useCrudActions'

// Services
import { CategoryService } from '../../../services/Category'

// Components
import ComboBoxModel from '../_ComboBoxModel/ComboBoxModel'

// Types
import { Category } from '../../../models/Category'
import { ICategoryFormModal } from '../../../interfaces/IModalCRUDProps'

const CategoryForm = ({ obj, open, onClose, watch }: ICategoryFormModal) => {
    // Si no está abierto el modal retorna null y no se muestra
    if (!open) return null

    // Redux
    const dispatch = useDispatch()

    // Obtiene las categorias para seleccionar a una como Parent Category si asi se desea
    const categories: Category[] = useSelector(categoriesSelector)

    // Service
    const categoryService = new CategoryService();

    // Form Validation
    const validationSchema = object({
        name: string()
            .required("Name is required"),
        subcategories: string()
    })

    // Handle Submit
    const handleOnSubmit = (state: Category) => {
        if (typeof state.parentCategory === "string" && state.parentCategory === "-1") {
            state.parentCategory = null;
        } else if(typeof state.parentCategory === "string") {
            state.parentCategory = JSON.parse(state.parentCategory);
        }

        if (state?.id) {
            const { updateObjectAlerts } = useCrudActions(state, categoryService, 'category', dispatch, loadCategories, onClose)
            updateObjectAlerts();
        } else {
            const { addObjectAlerts } = useCrudActions(state, categoryService, 'category', dispatch, loadCategories, onClose)
            addObjectAlerts();
        }

    }

    return (
        <div className='overlay' onClick={() => onClose()}>
            <div className='modal-container' onClick={(e) => { e.stopPropagation() }}>
                <button onClick={onClose} className="absolute btn btn-sm btn-circle btn-ghost right-3 top-2">✕</button>
                <h3>{watch ? `Info Category` : obj ? 'Edit Category' : 'New Category'}</h3>
                <Formik
                    initialValues={
                        obj ? {
                            ...obj,
                            parentCategory: JSON.stringify(obj.parentCategory)
                        } :
                        {
                            id: "",
                            name: "",
                            parentCategory: null
                        }
                    }
                    validationSchema={validationSchema}
                    onSubmit={(state) => { handleOnSubmit(state as Category) }}
                >
                    <Form>
                        <div className=" inputs-form w-96">
                            <div className="field ">
                                <label htmlFor='name'>Name</label>
                                <Field name='name' type='text' className='w-full max-w-xs input ' disabled={watch}/>
                                <ErrorMessage name="name">{msg => <span className="error-message">{msg}</span>}</ErrorMessage>
                            </div>
                            <div className="field">
                                <label htmlFor='category'>Category</label>
                                <ComboBoxModel
                                    list={categories}
                                    name='parentCategory'
                                    title='Subcategory'
                                    value='category'
                                    watch={watch}
                                />
                            </div>
                        </div>
                        { !watch && <div className="flex items-baseline justify-around my-3">
                            <button
                                type="submit"
                                className="btn btn-primary btn-sm w-[10rem] "
                            >Save</button>
                            <span className='btn btn-secondary btn-sm w-[10rem]' onClick={() => onClose()}>Cancel</span>
                        </div> }
                    </Form>
                </Formik>
            </div>
        </div>
    )
}

export default CategoryForm