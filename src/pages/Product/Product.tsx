import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
    // dispatch de redux para disparar acciones que modifican el estado
    const dispatch = useDispatch()

    useEffect(() => {
        // hace llamado a la api y trae las unidades de medida
        productService.GetAll()
            .then((products) => {
                // guarda lo que trae de la api en el estado de redux
                dispatch(loadProducts(products))
            })
    }, [])

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