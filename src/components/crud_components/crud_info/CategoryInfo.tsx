import { Category } from "../../../models/Category";

interface props {
    obj: {
      name: string;
      // active:boolean;
      parentCategory?: Category;
      products?: any[];
    }
}
const CategoryInfo = ({obj}: props) => {
  return (
        <>
        <span className='card-name'>{obj.name}</span>
        {/* <span className='card-name'>{obj.active}</span> */}
        <span className='card-name'>{obj.parentCategory?.name}</span>
        </>
  )
}

export default CategoryInfo