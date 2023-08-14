import LocationForm from "../../components/modals/location_form/LocationForm"
import { Location } from "../../models/Location"
import { useDispatch, useSelector } from "react-redux"
import { loadLocations } from "../../state/actions/locationActions"
import { locationSelector } from "../../state/selectors"
import CrudCard from "../../components/crud_components/crud_card/CrudCard"
import { LocationService } from '../../services/Location'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'
import { RiDeleteBin6Line, RiEyeLine } from "react-icons/ri"
import { FiEdit2 } from "react-icons/fi"

function Location() {

  const dispatch = useDispatch()
  const location = useSelector(locationSelector)
  const locationService = new LocationService()


  const handleDelete = (state: Location) => {
    if (confirm(`You want to delete this item?`)) {
      locationService.deleteObj(state)
        .then(() => {
          locationService.GetAll()
            .then((res: Location[]) => {
              dispatch(loadLocations(res))
            })
        })
    }
  }

  return (
    <div className="m-4">
      <CrudCreateButton Modal={LocationForm} Title='Locations' />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Locations</h2>
      <div className="overflow-x-auto h-[35rem]">
        <table className="table table-xs table-pin-rows ">
          <thead>
            <tr>
              <th>Location</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {location.map((locationItems: Location, i: number) => (
              <tr key={i}>
                <td>{locationItems.location}</td>
                <td>
                  <div className='flex gap-2'>
                    <RiEyeLine className='w-5 h-5 eye-icon hover:cursor-pointer' />
                    <FiEdit2 className='w-5 h-5 edit-icon hover:cursor-pointer' />
                    <button onClick={() => handleDelete(locationItems)}><RiDeleteBin6Line className='w-5 h-5 delete-icon hover:cursor-pointer'/></button>
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>
    // <>
    //       {/* <CrudHead/> */}
    //       <CrudCreateButton Modal={LocationForm} Title='Location'/>
    //       <div className="th-container">
    //         <span>Location Name</span>
    //         <span>Section</span>
            
    //       </div>
    //       { location && location[0] && location.map((cat:Location) => {
    //         return <CrudCard
    //         key={cat.id}
    //         obj={cat}
    //         EditModal={LocationForm}
    //         loadAction={loadLocations}
    //         apiServ={locationService}
    //         DeleteModal={CrudDeleteModal}
    //         modelo='Location'
    //         />
    //       })}
    // </>
  )
}

export default Location