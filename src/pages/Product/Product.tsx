import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
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
  const dispatch = useDispatch()
  const products = useSelector(productSelector)
  const productService = new ProductService()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product>();

  const openEditModal = (p: Product) => {
    setSelectedItem(p);
    setIsEditModalOpen(true)
  }


  const handleDelete = (state: Product) => {
    if (confirm(`You want to delete this item?`)) {
      productService.deleteObj(state)
        .then(() => {
          productService.GetAll()
            .then((res: Product[]) => {
              dispatch(loadProducts(res))
            })
        })
    }
  }


  return (
    <div className="m-4">
      <CrudCreateButton Modal={ProductForm} Title='Products' />

      <ProductForm
        obj={selectedItem}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
      
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Products</h2>
      <div className="overflow-x-auto h-[35rem]">
        <table className="table table-xs table-pin-rows ">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product, i: number) => (
              <tr key={i}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.subcategory?.name}</td>
                <td>
                  <div className='flex gap-2'>
                    <button><RiEyeLine className='w-5 h-5 eye-icon' /> </button>
                    <button onClick={() => openEditModal(product)}><FiEdit2 className='w-5 h-5 edit-icon' /> </button>
                    <button onClick={() => handleDelete(product)}><RiDeleteBin6Line className='w-5 h-5 delete-icon' /> </button>
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Product