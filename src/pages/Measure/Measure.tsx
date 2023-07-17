import { useSelector } from 'react-redux'
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
    const measures = useSelector(measureSelector)
    const measureService = new MeasureService()

  return (
    <div className="m-4">
      <CrudCreateButton Modal={MeasureForm} Title='Measures' />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Measures</h2>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Measure</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {measures.map((measure: Measure) => (
              <tr>
                <td>{measure.measure}</td>
                <td>
                  <div className='flex gap-2'>
                    <RiEyeLine className='w-5 h-5 eye-icon' />
                    <FiEdit2 className='w-5 h-5 edit-icon' />
                    <RiDeleteBin6Line className='w-5 h-5 delete-icon' />
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>
    // <div>
    //       <CrudCreateButton Modal={MeasureForm} Title="Measure"/>
    //       <div className="th-container">
    //           <span>Measure Name</span>
    //       </div>
    //       {measures && measures[0] && measures.map((cat: Measure) => {
    //           return <CrudCard 
    //           key={cat.id} 
    //           obj={cat} 
    //           EditModal={MeasureForm}
    //           DeleteModal={CrudDeleteModal}
    //           loadAction={loadMeasures}
    //           apiServ={measureService}
    //             modelo='Measure'
    //           />
    //       })}
    // </div>
  )
}

export default Measure