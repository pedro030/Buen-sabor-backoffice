import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ingredientSelector } from '../../state/selectors'
import { IngredientService } from '../../services/Ingredient'
import { loadIngredients } from '../../state/actions/ingredientActions'
import CrudCard from '../../components/crud_components/crud_card/CrudCard'
import { Ingredient } from '../../models/Ingredient'
import IngredientForm from '../../components/modals/ingredient_form/IngredientForm'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'

const Ingredient = () => {
    // selecciona el listados de ingredients del reducer
    const ingredients = useSelector(ingredientSelector)
    const ingredientService = new IngredientService()
    // dispatch de redux para disparar acciones que modifican el estado
    const dispatch = useDispatch()

    useEffect(() => {
        // hace llamado a la api y trae las unidades de medida
        ingredientService.GetAll()
            .then((ingredients) => {
                // guarda lo que trae de la api en el estado de redux
                dispatch(loadIngredients(ingredients))
            })
    }, [])

  return (
    <div>
          <CrudCreateButton Modal={IngredientForm} Title="Ingredient"/>

          
          <div className="th-container">
              <span>Ingredient Name</span>
              <span>Stock</span>
              <span>Cost</span>
              <span>Measure</span>
          </div>
          {ingredients && ingredients[0] && ingredients.map((cat: Ingredient) => {
              return <CrudCard 
              key={cat.id} 
              obj={cat} 
              EditModal={IngredientForm}
              DeleteModal={CrudDeleteModal}
              loadAction={loadIngredients}
              apiServ={ingredientService}
                modelo='Ingredient'
              />
          })}
    </div>
  )
}

export default Ingredient