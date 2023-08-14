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
import { useState } from 'react'

const Measure = () => {
    // selecciona el listados de measures del reducer
    const measures = useSelector(measureSelector)
    const measureService = new MeasureService()
    //modals states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Measure>();

    console.log(measures)

    const openEditModal = (m: Measure) => {
      setSelectedItem(m);
      setIsEditModalOpen(true)
    }

  return (
    <div className="m-4">
      <CrudCreateButton Modal={MeasureForm} Title='Measures' />

      <MeasureForm
        obj={selectedItem}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
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
                    <RiEyeLine className='w-5 h-5 eye-icon'/>
                    <FiEdit2 className='w-5 h-5 edit-icon cursor-pointer' onClick={() => openEditModal(measure)} />
                    <RiDeleteBin6Line className='w-5 h-5 delete-icon'/>
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