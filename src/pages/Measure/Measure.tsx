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
import { useState, useEffect } from 'react'

const Measure = () => {
    // selecciona el listados de measures del reducer
    const dispatch = useDispatch()
    const measures = useSelector(measureSelector)
    const measureService = new MeasureService()
    //modals states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Measure>();

    //Filters
  const [filters, setFilters] = useState({
    search: ""
  })

  const filterCategories = (measures: any) => {
    return measures.filter((m: any) => {
      return (m.measure.toLowerCase().includes(filters.search.toLowerCase()))
    })
  }

  const measuresFilter = filterCategories(measures)

  //Search
  const [search, setSearch] = useState('')

  const handleChangeSearch = (e:any) => {
    const s = e.target.value
    setSearch(s)

    if(s == '') setFilters((prevState: any) => ({
      ...prevState,
      search: ''
    }))
  }
  
  const searchOnEnter = (e : any) => {
    if(e.key === 'Enter') {
      setFilters((prevState: any) => ({
        ...prevState,
        search: search
      }))
    }
  }

  //Sorting
  const [sortedMeasures, setSortedMeasures] = useState([]);
  const [currentSorting, setCurrentSorting] = useState(1);

  const sortMeasures = (measures: any, sortOp: number) => {
      switch (sortOp) {
          case 1: setSortedMeasures(measures);
              break;

          case 2: setSortedMeasures(measures.sort((a: any, b: any) => a.measure > b.measure ? 1 : -1))
              break;

          case 3: setSortedMeasures(measures.sort((a: any, b: any) => a.measure < b.measure ? 1 : -1))
              break;
      }
  }

  const handleChangeSorting = (e: any) => {
      const sortOp = +e.target.value;
      setCurrentSorting(sortOp);
      sortMeasures(measuresFilter, sortOp);
  }


  useEffect(() => {
    sortMeasures(measuresFilter, currentSorting);
  }, [filters])

    const openEditModal = (m: Measure) => {
      setSelectedItem(m);
      setIsEditModalOpen(true)
    }
  
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

      <MeasureForm
        obj={selectedItem}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Measures</h2>
      <div className="flex items-center justify-center w-full gap-5 my-2">
        <input type="text" placeholder='NAME'  className=" input w-[60%] input-sm" onChange={handleChangeSearch} value={search} onKeyDown={searchOnEnter}/>
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
              <th>Measure</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedMeasures.map((measure: Measure, index:number) => (
              <tr key={index}>
                <td>{measure.measure}</td>
                <td>
                  <div className='flex gap-2'>
                    <button><RiEyeLine className='w-5 h-5 eye-icon' /> </button>
                    <button onClick={() => openEditModal(measure)}><FiEdit2 className='w-5 h-5 edit-icon' /> </button>
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