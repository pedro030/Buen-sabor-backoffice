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
import { useState, useEffect } from "react"

function Location() {

  const dispatch = useDispatch()
  const location = useSelector(locationSelector)
  const locationService = new LocationService()

  // edit modal config
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [selectedLoc, setSelectedLoc] = useState<Location>()
  const openEditModal = (l: Location) => {
    setSelectedLoc(l);
    setEditModalOpen(true)
  }


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

  //Filters
  const [filters, setFilters] = useState({
    location: ""
  })

  const filterLocation = (locations: any) => {
    return locations.filter((l: any) => {
      return (
        (l.location.toLowerCase().includes(filters.location.toLowerCase()))
        )
    })
  }

  const locationsFilter = filterLocation(location)

  //Search
  const [locationSearch, setLocationSearch] = useState<string>('')

  const handleChangeLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const l = e.target.value
    setLocationSearch(l)

    if(e.target.value == '') setFilters((prevState: any) => ({
      ...prevState,
      location: ''
    }))
  }

  const searchLocationOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      setFilters((prevState: any) => ({
        ...prevState,
        location: locationSearch
      }))
    }
  }

  //Sorting
  const [sortedLocations, setSortedLocations] = useState([]);
  const [currentSorting, setCurrentSorting] = useState(1);

  const sortLocations = (locations: any, sortOp: number) => {
      switch (sortOp) {
          case 1: setSortedLocations(locations);
              break;
          
          case 2: setSortedLocations(locations.sort((a: any, b: any) => a.location > b.location ? 1 : -1))
              break;
          
          case 3: setSortedLocations(locations.sort((a: any, b: any) => a.location < b.location ? 1 : -1))
              break;
      }
  }

  const handleChangeSorting = (e: any) => {
      const sortOp = +e.target.value;
      setCurrentSorting(sortOp);
      sortLocations(locationsFilter, sortOp);
  }


  useEffect(() => {
    sortLocations(locationsFilter, currentSorting);
  }, [filters])

  return (
    <div className="m-4">
      <CrudCreateButton Modal={LocationForm} Title='Locations' />
      <LocationForm
        open={editModalOpen}
        obj={selectedLoc}
        onClose={()=> setEditModalOpen(false)}
      />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Locations</h2>
      <div className="flex items-center justify-center w-full gap-5 my-5">
        <input type="text" placeholder='LOCATION'  className=" input w-[60%] input-sm" onChange={handleChangeLocation} onKeyDown={searchLocationOnEnter}/>
        <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeSorting}>
          <option selected value={1}>SORT BY: FEATURED</option>
          <option value={2}>SORT BY NAME: A - Z</option>
          <option value={3}>SORT BY NAME: Z - A</option>
        </select>
      </div>
      <div className="overflow-x-auto h-[35rem]">
        <table className="table table-xs table-pin-rows ">
          <thead>
            <tr>
              <th>Location</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedLocations.map((locationItems: Location, i: number) => (
              <tr key={i}>
                <td>{locationItems.location}</td>
                <td>
                  <div className='flex gap-2'>
                    <RiEyeLine className='w-5 h-5 eye-icon hover:cursor-pointer' />
                    <button onClick={() => openEditModal(locationItems)}><FiEdit2 className='w-5 h-5 edit-icon hover:cursor-pointer' /></button>
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