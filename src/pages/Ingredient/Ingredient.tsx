import { useDispatch, useSelector } from 'react-redux'
import { ingredientSelector } from '../../state/selectors'
import { IngredientService } from '../../services/Ingredient'
import { loadIngredients } from '../../state/actions/ingredientActions'
import CrudCard from '../../components/crud_components/crud_card/CrudCard'
import { Ingredient } from '../../models/Ingredient'
import IngredientForm from '../../components/modals/ingredient_form/IngredientForm'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';

const Ingredient = () => {
  // selecciona el listados de ingredients del reducer
  const dispatch = useDispatch()
  const ingredients = useSelector(ingredientSelector)
  const ingredientService = new IngredientService()
  // dispatch de redux para disparar acciones que modifican el estado
 
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


  return (
    <div className="m-4">
      <CrudCreateButton Modal={IngredientForm} Title='Ingredients' />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Ingredients</h2>
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
            {ingredients.map((ingredient: Ingredient, i:number) => (
              <tr key={i}>
                <td>{ingredient.name}</td>
                <td>{ingredient.cost}</td>
                <td>{ingredient.stock}</td>
                <td>{ingredient.measure?.measure}</td>
                <td>
                  <div className='flex gap-2'>
                    <button><RiEyeLine className='w-5 h-5 eye-icon' /> </button>
                    <button><FiEdit2 className='w-5 h-5 edit-icon' /> </button>
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