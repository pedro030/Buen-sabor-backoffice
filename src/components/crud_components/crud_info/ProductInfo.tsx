import { Category } from "../../../models/Category";
import { Product } from "../../../models/Product";

interface props {
  obj: {
    id: string,
    name: string,
    price: number,
    active: boolean,
    subcategory?: Category
  }
}
const ProductInfo = ({ obj }: props) => {
  return (
    <>
      <span className='card-name'>{obj.name}</span>
      <span className='card-name'>{obj.price}</span>
      <span className='card-name'>{obj.active ? "true" : "false"}</span>
      <span className='card-name'>{obj.subcategory?.name}</span>
    </>
  )
}

export default ProductInfo