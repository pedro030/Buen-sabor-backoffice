import { useDispatch, useSelector } from 'react-redux'
import { ingredientSelector, measureSelector } from '../../state/selectors'
import { IngredientService } from '../../services/Ingredient'
import { loadIngredients } from '../../state/actions/ingredientActions'
import CrudCard from '../../components/crud_components/crud_card/CrudCard'
import { Ingredient } from '../../models/Ingredient'
import IngredientForm from '../../components/modals/Ingredients/ingredient_form/IngredientForm'
import IngredientListForm from '../../components/modals/Ingredients/IngredientList_form/IngredientListForm'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'
import { FiEdit2 } from 'react-icons/fi'
import { AiOutlineReload } from 'react-icons/ai'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';
import { useState, useEffect } from 'react'
import { useCrudActions } from '../../hooks/useCrudActions'
import { useSortingStates } from '../../hooks/useSortingStates'
import { useSorting } from '../../hooks/useSorting'

const Ingredient = () => {
  // selecciona el listados de ingredients del reducer
  const dispatch = useDispatch()
  const ingredients: Ingredient[] = useSelector(ingredientSelector)
  const measures = useSelector(measureSelector)
  const ingredientService = new IngredientService()

  //modals states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Ingredient>();
  const [watchInfo, setWatchInfo] = useState<boolean>(false);

  const handleDelete = (ingredient: Ingredient) => {
    const { deleteObjectAlerts } = useCrudActions(ingredient, ingredientService, 'ingredient', dispatch, loadIngredients, () => setEditModalOpen(false));
    deleteObjectAlerts();
  }

  const openEditModal = (i: Ingredient) => {
    setSelectedItem(i);
    setEditModalOpen(true)
  }

  const handleWatch = (ingredient: Ingredient) => {
    setWatchInfo(true);
    setSelectedItem(ingredient);
    setEditModalOpen(true);
  }

  //Filters
  const [filters, setFilters] = useState({
    search: "",
    stock: 0,
    measure: 0
  })

  const filterIngredients = (ingredients: any) => {
    return ingredients.filter((i: any) => {
      return (
        (i.name.toLowerCase().includes(filters.search.toLowerCase()))
        &&
        (i.stock >= filters.stock)
        &&
        (filters.measure === 0 || i.measure.id === filters.measure)
      )
    })
  }

  const handleChangeMeasure = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const op = +e.target.value

    setFilters((prevState: any) => ({
      ...prevState,
      measure: op
    }))
  }

  const ingredientsFilter: Ingredient[] = filterIngredients(ingredients)

  //Search By Name and Stock
  const [search, setSearch] = useState<string>('')
  const [stock, setStock] = useState<number>(0)

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value
    setSearch(s)

    if (s == '') setFilters((prevState: any) => ({
      ...prevState,
      search: ''
    }))
  }

  const searchOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setFilters((prevState: any) => ({
        ...prevState,
        search: search
      }))
    }
  }

  const handleChangeStock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const s = +e.target.value
    setStock(s)

    if (e.target.value == '') setFilters((prevState: any) => ({
      ...prevState,
      stock: 0
    }))
  }

  const searchStockOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setFilters((prevState: any) => ({
        ...prevState,
        stock: stock
      }))
    }
  }

  //Sorting
  const { sortedItems, setSortedItems, currentSorting, isAsc, handleChangeSorting } = useSortingStates(ingredientsFilter, 'id');

  useEffect(() => {
    setSortedItems(useSorting(ingredientsFilter, currentSorting, isAsc));
  }, [filters, ingredients])

  return (
    <div className="mx-4 mt-4">
      <div className='flex gap-5'>
        <CrudCreateButton Modal={IngredientForm} Title='Ingredients' />
        <CrudCreateButton Modal={IngredientListForm} Title='Recargar Stock' />
      </div>
      <IngredientForm
        obj={selectedItem}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        watch={watchInfo}
      />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Ingredients</h2>
      <div className="flex items-center justify-center w-full gap-5 my-2">
        <input type="text" placeholder='NAME' className=" input w-[60%] input-sm" value={search} onKeyDown={searchOnEnter} onChange={handleChangeSearch} />
        <input type="number" placeholder='STOCK MIN.' className='input input-sm ' onKeyDown={searchStockOnEnter} onChange={handleChangeStock} />
        <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeMeasure}>
          <option selected value={0}>MEASURE: ALL</option>
          {
            measures.map((m: any) => {
              return <option value={m.id}>MEASURE: {m.measure.toUpperCase()}</option>
            })
          }
        </select>
        <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeSorting}>
          <option selected value="id true">SORT BY: FEATURED</option>
          <option value="stock true">SORT BY STOCK: LOW to HIGH</option>
          <option value="stock false">SORT BY STOCK: HIGH to LOW</option>
          <option value="cost true">SORT BY COST: LOW to HIGH</option>
          <option value="cost false">SORT BY COST: HIGH to LOW</option>
          <option value="name true">SORT BY NAME: A - Z</option>
          <option value="name false">SORT BY NAME: Z - A</option>
        </select>
      </div>
      <div className="overflow-x-auto h-[35rem]">
        <table className="table table-xs table-pin-rows ">
          <thead>
            <tr>
              <th>Name</th>
              <th>Cost</th>
              <th>Stock</th>
              <th>Stock Min.</th>
              <th>Measure</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((ingredient: Ingredient, i: number) => {
              return (
                <tr key={i} className={`${ingredient.stock < (ingredient.stockMin * 1.2) && ingredient.stock >= ingredient.stockMin ? 'bg-yellow-200' : ingredient.stock < ingredient.stockMin && 'bg-red-200'}`}>
                  <td>{ingredient.name}</td>
                  <td>{ingredient.cost}</td>
                  <td>{ingredient.stock}</td>
                  <td>{ingredient.stockMin}</td>
                  <td>{ingredient.measure?.measure}</td>
                  <td>
                    <div className='flex gap-2'>
                      <button onClick={() => handleWatch(ingredient)}><RiEyeLine className='w-5 h-5 eye-icon' /> </button>
                      <button onClick={() => openEditModal(ingredient)}><FiEdit2 className='w-5 h-5 edit-icon' /> </button>
                      <button onClick={() => handleDelete(ingredient)}><RiDeleteBin6Line className='w-5 h-5 delete-icon' /> </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Ingredient