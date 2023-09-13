import { useDispatch, useSelector } from 'react-redux'
import { ingredientSelector, measureSelector } from '../../state/selectors'
import { IngredientService } from '../../services/Ingredient'
import { loadIngredients } from '../../state/actions/ingredientActions'
import CrudCard from '../../components/crud_components/crud_card/CrudCard'
import { Ingredient } from '../../models/Ingredient'
import IngredientForm from '../../components/modals/ingredient_form/IngredientForm'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'
import { FiEdit2 } from 'react-icons/fi'
import { AiOutlineReload } from 'react-icons/ai'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';
import { useState, useEffect } from 'react'

const Ingredient = () => {
  // selecciona el listados de ingredients del reducer
  const dispatch = useDispatch()
  const ingredients = useSelector(ingredientSelector)
  const measures = useSelector(measureSelector)
  const ingredientService = new IngredientService()

  //modals states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Ingredient>();

  const handleDelete = (state: Ingredient) => {
    if (confirm(`You want to delete this item?`)) {
      ingredientService.deleteObj(state)
        .then(() => {
          ingredientService.GetAll()
            .then((res: Ingredient[]) => {
              dispatch(loadIngredients(res))
            })
        })
    }
  }

  const openEditModal = (i: Ingredient) => {
    setSelectedItem(i);
    setEditModalOpen(true)
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

  const ingredientsFilter = filterIngredients(ingredients)

  //Search
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
  const [sortedIngredients, setSortedIngredients] = useState([]);
  const [currentSorting, setCurrentSorting] = useState(1);

  const sortIngredients = (ingredients: any, sortOp: number) => {
    switch (sortOp) {
      case 1: setSortedIngredients(ingredients);
        break;

      case 2: setSortedIngredients(ingredients.sort((a: any, b: any) => a.stock > b.stock ? 1 : -1))
        break;

      case 3: setSortedIngredients(ingredients.sort((a: any, b: any) => a.stock < b.stock ? 1 : -1))
        break;

      case 4: setSortedIngredients(ingredients.sort((a: any, b: any) => a.cost > b.cost ? 1 : -1))
        break;

      case 5: setSortedIngredients(ingredients.sort((a: any, b: any) => a.cost < b.cost ? 1 : -1))
        break;

      case 6: setSortedIngredients(ingredients.sort((a: any, b: any) => a.name > b.name ? 1 : -1))
        break;

      case 7: setSortedIngredients(ingredients.sort((a: any, b: any) => a.name < b.name ? 1 : -1))
        break;
    }
  }

  const handleChangeSorting = (e: any) => {
    const sortOp = +e.target.value;
    setCurrentSorting(sortOp);
    sortIngredients(ingredientsFilter, sortOp);
  }


  useEffect(() => {
    sortIngredients(ingredientsFilter, currentSorting);
  }, [filters])

  return (
    <div className="m-4">
      <div className='flex gap-5'>
        <CrudCreateButton Modal={IngredientForm} Title='Ingredients' />
        <button className='btn btn-secondary'><AiOutlineReload/> Recargar Stock</button>
      </div>
      <IngredientForm
        obj={selectedItem}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
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
          <option selected value={1}>SORT BY: FEATURED</option>
          <option value={2}>SORT BY STOCK: LOW to HIGH</option>
          <option value={3}>SORT BY STOCK: HIGH to LOW</option>
          <option value={4}>SORT BY COST: LOW to HIGH</option>
          <option value={5}>SORT BY COST: HIGH to LOW</option>
          <option value={6}>SORT BY NAME: A - Z</option>
          <option value={7}>SORT BY NAME: Z - A</option>
        </select>
      </div>
      <div className="overflow-x-auto h-[35rem]">
        <table className="table table-xs table-pin-rows ">
          <thead>
            <tr>
              <th>Name</th>
              <th>Cost</th>
              <th>Stock</th>
              <th>Measure</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedIngredients.map((ingredient: Ingredient, i: number) => (
              <tr key={i}>
                <td>{ingredient.name}</td>
                <td>{ingredient.cost}</td>
                <td>{ingredient.stock}</td>
                <td>{ingredient.measure?.measure}</td>
                <td>
                  <div className='flex gap-2'>
                    <button><RiEyeLine className='w-5 h-5 eye-icon' /> </button>
                    <button onClick={() => openEditModal(ingredient)}><FiEdit2 className='w-5 h-5 edit-icon' /> </button>
                    <button onClick={() => handleDelete(ingredient)}><RiDeleteBin6Line className='w-5 h-5 delete-icon' /> </button>
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>
    // <div>
    //       <CrudCreateButton Modal={IngredientForm} Title="Ingredient"/>


    //       <div className="th-container">
    //           <span>Ingredient Name</span>
    //           <span>Stock</span>
    //           <span></span>
    //           <span>Cost</span>
    //           <span></span>
    //           <span>Measure</span>
    //       </div>
    //       {ingredients && ingredients[0] && ingredients.map((cat: Ingredient) => {
    //           return <CrudCard 
    //           key={cat.id} 
    //           obj={cat} 
    //           EditModal={IngredientForm}
    //           DeleteModal={CrudDeleteModal}
    //           loadAction={loadIngredients}
    //           apiServ={ingredientService}
    //             modelo='Ingredient'
    //           />
    //       })}
    // </div>
  )
}

export default Ingredient