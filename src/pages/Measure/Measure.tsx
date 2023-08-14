import { useDispatch, useSelector } from 'react-redux'
import { measureSelector } from '../../state/selectors'
import { MeasureService } from '../../services/Measure'
import { loadMeasures } from '../../state/actions/measureActions'
import CrudCard from '../../components/crud_components/crud_card/CrudCard'
import { Measure } from '../../models/Measure'
import MeasureForm from '../../components/modals/measure_form/MeasureForm'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';

const Measure = () => {
    // selecciona el listados de measures del reducer
    const dispatch = useDispatch()
    const measures = useSelector(measureSelector)
    const measureService = new MeasureService()
  
    const handleDelete = (state: Measure) => {
      if (confirm(`You want to delete this item?`)) {
        measureService.deleteObj(state)
          .then(() => {
            measureService.GetAll()
              .then((res: Measure[]) => {
                dispatch(loadMeasures(res))
              })
          })
      }
    }
  
    return (
    <div className="m-4">
      <CrudCreateButton Modal={MeasureForm} Title='Measures' />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Measures</h2>
      <div className="overflow-x-auto h-[35rem]">
        <table className="table table-xs table-pin-rows ">
          <thead>
            <tr>
              <th>Measure</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {measures.map((measure: Measure, index:number) => (
              <tr key={index}>
                <td>{measure.measure}</td>
                <td>
                  <div className='flex gap-2'>
                    <button><RiEyeLine className='w-5 h-5 eye-icon' /> </button>
                    <button><FiEdit2 className='w-5 h-5 edit-icon' /> </button>
                    <button onClick={() => handleDelete(measure)}><RiDeleteBin6Line className='w-5 h-5 delete-icon' /> </button>
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Measure