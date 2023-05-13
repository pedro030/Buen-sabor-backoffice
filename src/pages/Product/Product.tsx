import { useSelector } from 'react-redux'
import { productSelector } from '../../state/selectors'
import { ProductService } from '../../services/Product'
import { loadProducts } from '../../state/actions/productActions'
import CrudCard from '../../components/crud_components/crud_card/CrudCard'
import { Product } from '../../models/Product'
import ProductForm from '../../components/modals/product_form/ProductForm'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'

const Product = () => {
    // selecciona el listados de products del reducer
    const products = useSelector(productSelector)
    const productService = new ProductService()

  return (
    <div>
          <CrudCreateButton Modal={ProductForm} Title="Product"/>
          <div className="th-container">
              <span>Product Name</span>
              <span>Price</span>
              <span></span>
              <span>Active</span>
              <span></span>
              <span>Category</span>
          </div>
          {products && products[0] && products.map((cat: Product) => {
              return <CrudCard 
              key={cat.id} 
              obj={cat} 
              EditModal={ProductForm}
              DeleteModal={CrudDeleteModal}
              loadAction={loadProducts}
              apiServ={productService}
                modelo='Product'
              />
          })}
    </div>
  )
}

export default Product