import { useEffect } from "react"
import LocationForm from "../../components/modals/location_form/LocationForm"
import { Location } from "../../models/Location"
import { useDispatch, useSelector } from "react-redux"
import { loadLocations } from "../../state/actions/locationActions"
import { locationSelector } from "../../state/selectors"
import CrudCard from "../../components/crud_components/crud_card/CrudCard"
import { LocationService } from '../../services/Location'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'

function Location() {

  const location = useSelector(locationSelector)
  const locationService = new LocationService()
  const dispatch = useDispatch()

  useEffect(() => {
    locationService.GetAll()
    .then((locations) => {
      dispatch(loadLocations(locations))
    })
  }, [])

  return (
    <>
          {/* <CrudHead/> */}
          <CrudCreateButton Modal={LocationForm} Title='Location'/>
          <div className="th-container">
            <span>Location Name</span>
            <span>Section</span>
            
          </div>
          { location && location[0] && location.map((cat:Location) => {
            return <CrudCard
            key={cat.id}
            obj={cat}
            EditModal={LocationForm}
            loadAction={loadLocations}
            apiServ={locationService}
            DeleteModal={CrudDeleteModal}
            modelo='Location'
            />
          })}
    </>
  )
}

export default Location