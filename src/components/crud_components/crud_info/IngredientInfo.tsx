import { Measure } from "../../../models/Measure";

interface props {
    obj: {
      name: string;
      cost: number;
      stock: number;
      measure: Measure;
    }
}
const IngredientInfo = ({obj}: props) => {
  return (
        <>
        <span className='card-name'>{obj.name}</span>
        <span className='card-name'>{obj.stock}</span>
        <span className='card-name'>{obj.measure.name}</span>
        </>
  )
}

export default IngredientInfo