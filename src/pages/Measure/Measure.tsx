import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { measureSelector } from '../../state/selectors'
import { MeasureService } from '../../services/Measure'
import { loadMeasures } from '../../state/actions/measureActions'
import CrudCard from '../../components/crud_components/crud_card/CrudCard'
import { Measure } from '../../models/Measure'
import MeasureForm from '../../components/modals/measure_form/MeasureForm'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'

const Measure = () => {
    // selecciona el listados de measures del reducer
    const measures = useSelector(measureSelector)
    const measureService = new MeasureService()
    // dispatch de redux para disparar acciones que modifican el estado
    const dispatch = useDispatch()

    useEffect(() => {
        // hace llamado a la api y trae las unidades de medida
        measureService.GetAll()
            .then((measures) => {
                // guarda lo que trae de la api en el estado de redux
                dispatch(loadMeasures(measures))
            })
    }, [])

  return (
    <div>
          <CrudCreateButton Modal={MeasureForm} Title="Measure"/>
          <div className="th-container">
              <span>Measure Name</span>
          </div>
          {measures && measures[0] && measures.map((cat: Measure) => {
              return <CrudCard 
              key={cat.id} 
              obj={cat} 
              EditModal={MeasureForm}
              DeleteModal={CrudDeleteModal}
              loadAction={loadMeasures}
              apiServ={measureService}/>
          })}
    </div>
  )
}

export default Measure