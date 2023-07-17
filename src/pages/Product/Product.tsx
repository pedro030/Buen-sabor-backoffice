import { useSelector } from 'react-redux'
import { productSelector } from '../../state/selectors'
import { ProductService } from '../../services/Product'
import { loadProducts } from '../../state/actions/productActions'
import CrudCard from '../../components/crud_components/crud_card/CrudCard'
import { Product } from '../../models/Product'
import ProductForm from '../../components/modals/product_form/ProductForm'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';

const Product = () => {
    // selecciona el listados de products del reducer
    const products = useSelector(productSelector)
    const productService = new ProductService()

  return (
    <div className="m-4">
      <CrudCreateButton Modal={ProductForm} Title='Products' />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Products</h2>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product,i:number) => (
              <tr key={i}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.subcategory?.name}</td>
                <td>
                  <div className='flex gap-2'>
                    <RiEyeLine className='w-5 h-5 eye-icon' />
                    <FiEdit2 className='w-5 h-5 edit-icon' />
                    <RiDeleteBin6Line className='w-5 h-5 delete-icon' />
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>
    // <div>
    //       <CrudCreateButton Modal={ProductForm} Title="Product"/>
    //       <div className="th-container">
    //           <span>Product Name</span>
    //           <span>Price</span>
    //           <span></span>
    //           <span>Active</span>
    //           <span></span>
    //           <span>Category</span>
    //       </div>
    //       {products && products[0] && products.map((cat: Product) => {
    //           return <CrudCard 
    //           key={cat.id} 
    //           obj={cat} 
    //           EditModal={ProductForm}
    //           DeleteModal={CrudDeleteModal}
    //           loadAction={loadProducts}
    //           apiServ={productService}
    //             modelo='Product'
    //           />
    //       })}
    // </div>
  )
}

export default Product