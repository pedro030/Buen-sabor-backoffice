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
import { usePagination } from '../../hooks/usePagination'

const Product = () => {
  // selecciona el listados de products del reducer
  const dispatch = useDispatch()
  const products = useSelector(productSelector)
  const productService = new ProductService()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product>();

  //Filters
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: 0,
    maxPrice: 20000,
    search: ""
  })

  const filterProducts = (products: any) => {
    return products.filter((p: any) => {
      return (
        (
          p.price >= filters.minPrice &&
          p.price <= filters.maxPrice
        )
        &&
        (
          filters.category === "all" ||
          p.subcategory.parentCategory.name == filters.category
        )
        &&
        (
          p.name.toLowerCase().includes(filters.search.toLowerCase())
        )
      )
    })
  }

  const [sortedProducts, setSortedProducts] = useState([]);
  const [currentSorting, setCurrentSorting] = useState(1);

  const sortProducts = (products: any, sortOp: number) => {
      switch (sortOp) {
          case 1: setSortedProducts(products);
              break;

          case 2: setSortedProducts(products.sort((a: any, b: any) => a.price > b.price ? 1 : -1))
              break;

          case 3: setSortedProducts(products.sort((a: any, b: any) => a.price < b.price ? 1 : -1))
              break;

          case 4: setSortedProducts(products.sort((a: any, b: any) => a.name > b.name ? 1 : -1))
              break;

          case 5: setSortedProducts(products.sort((a: any, b: any) => a.name < b.name ? 1 : -1))
              break;
      }
  }


  const handleChangeSorting = (e: any) => {
      const sortOp = +e.target.value;
      console.log(sortOp);
      setCurrentSorting(sortOp);
      sortProducts(products, sortOp);
      console.log(products);
  }

  const [currentObjects, currentPage, objetsPerPage, pages, setCurrentPage] = usePagination(products)

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

      <div className="flex items-center justify-center w-full gap-5 my-2">
        <input type="text" placeholder='NAME'  className=" input w-[60%] input-sm input-disabled" />
        <input type="number" placeholder='PRICE' className='input input-sm input-disabled' />
        <select className="w-full max-w-xs select select-bordered select-sm" /*onChange={handleChangeSorting}*/>
                                    <option selected value={1}>SORT BY: FEATURED</option>
                                    <option value={2}>SORT BY PRICE: LOW to HIGH</option>
                                    <option value={3}>SORT BY PRICE: HIGH to LOW</option>
                                    <option value={4}>SORT BY NAME: A - Z</option>
                                    <option value={5}>SORT BY NAME: Z - A</option>
                                </select>
      </div>
      
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
            {currentObjects.map((product: Product, i: number) => (
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
          <tfoot>
            {
              (products.length > 0) && <div className='mt-5 join'>
                <button className="join-item btn btn-sm max-lg:btn-xs" onClick={() => currentPage > 1 ? setCurrentPage(currentPage - 1) : ''}>«</button>
                {pages.map((page: any, index: any) => {
                  return <input key={index} className="join-item btn btn-sm max-lg:btn-xs btn-square" type="radio" name="options" aria-label={index + 1} onClick={() => setCurrentPage(page)} checked={currentPage === page} />
                })}
                <button className="join-item btn btn-sm max-lg:btn-xs" onClick={() => currentPage < Math.ceil(products.length / objetsPerPage) ? setCurrentPage(currentPage + 1) : ''}>»</button>
              </div>
            }
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default Product