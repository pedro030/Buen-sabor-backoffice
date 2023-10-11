import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { categoriesSelector, productSelector } from '../../state/selectors'
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
import { useSorting } from '../../hooks/useSorting'
import Pagination from '../../components/pagination/Pagination'
import { useSortingStates } from '../../hooks/useSortingStates'
import { useCrudActions } from '../../hooks/useCrudActions'

const Product = () => {
  // selecciona el listados de products del reducer
  const dispatch = useDispatch()
  const products: Product[] = useSelector(productSelector)
  const categories = useSelector(categoriesSelector)
  const productService = new ProductService()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product>();

  //Filters
  const [filters, setFilters] = useState({
    category: 0,
    price: 0,
    search: "",
    status: ''
  })

  const filterProducts = (products: any) => {
    return products.filter((p: any) => {
      return (
        (
          p.price >= filters.price
        )
        &&
        (
          filters.category === 0 ||
          p.subcategory.id === filters.category
        )
        &&
        (
          p.name.toLowerCase().includes(filters.search.toLowerCase())
        )
        &&
        (
          filters.status === '' ||
          p.active === filters.status
        )
      )
    })
  }

  const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const op = +e.target.value

    if(op === 1) {
      setFilters((prevState: any) => ({
      ...prevState,
      status: ''
      })) 
    } else if (op === 2){
      setFilters((prevState: any) => ({
        ...prevState,
        status: true
      })) 
    } else if (op === 3){
      setFilters((prevState: any) => ({
        ...prevState,
        status: false
      }))
    }
  }

  const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const op = +e.target.value

    setFilters((prevState: any) => ({
      ...prevState,
      category: op
    }))
  }

  const productsFilter: Product[] = filterProducts(products)

  //Search
  const [search, setSearch] = useState<string>('')
  const [price, setPrice] = useState<number>(0)

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value
    setSearch(s)

    if(s == '') setFilters((prevState: any) => ({
      ...prevState,
      search: ''
    }))
  }
  
  const searchOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      setFilters((prevState: any) => ({
        ...prevState,
        search: search
      }))
    }
  }

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const s = +e.target.value
    setPrice(s)

    if(e.target.value == '') setFilters((prevState: any) => ({
      ...prevState,
      price: 0
    }))
  }

  const searchPriceOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      setFilters((prevState: any) => ({
        ...prevState,
        price: price
      }))
    }
  }

  //Sorting
  const { sortedItems, setSortedItems, currentSorting, isAsc, handleChangeSorting } = useSortingStates(productsFilter, 'id');

  //Pagination
  const { currentObjects, currentPage, objetsPerPage, pages, setCurrentPage } = usePagination(sortedItems)

  useEffect(() => {
    setCurrentPage(1);
    setSortedItems(useSorting(productsFilter, currentSorting, isAsc));
  }, [filters, products])

  const openEditModal = (p: Product) => {
    setSelectedItem(p);
    setIsEditModalOpen(true)
  }


  const handleDelete = (product: Product) => {
    const { deleteObjectAlerts } = useCrudActions(product, productService, 'product', dispatch, loadProducts, () => setIsEditModalOpen(false))
    deleteObjectAlerts();
  }


  return (
    <div className="m-4 h-[90vh]">
      <CrudCreateButton Modal={ProductForm} Title='Products' />

      <ProductForm
        obj={selectedItem}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
      
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Products</h2>

      <div className="flex items-center justify-center w-full gap-5 my-2">
        <input type="text" placeholder='NAME'  className=" input w-[60%] input-sm" onChange={handleChangeSearch} onKeyDown={searchOnEnter}/>
        <input type="number" placeholder='PRICE MIN' className='input input-sm' onChange={handleChangePrice} onKeyDown={searchPriceOnEnter}/>
        <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeStatus}>
          <option selected value={1}>STATUS: ALL</option>
          <option value={2}>STATUS: ACTIVE</option>
          <option value={3}>STATUS: NO ACTIVE</option>
        </select>
        <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeCategory}>
          <option selected value={0}>CATEGORY: ALL</option>
          {categories.map((c: any) => {
            return <option value={c.id}>CATEGORY: {c.name.toUpperCase()}</option>
          })}
        </select>
        <select className="w-full max-w-xs select select-bordered select-sm" onChange={handleChangeSorting}>
          <option selected value={'id true'}>SORT BY: FEATURED</option>
          <option value={'price true'}>SORT BY PRICE: LOW to HIGH</option>
          <option value={'price false'}>SORT BY PRICE: HIGH to LOW</option>
          <option value={'name true'}>SORT BY NAME: A - Z</option>
          <option value={'name false'}>SORT BY NAME: Z - A</option>
        </select>
      </div>
      
      <div className="overflow-x-auto h-[35rem]">
        <table className="table table-xs table-pin-rows ">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentObjects.map((product: Product, i: number) => (
              <tr key={i}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.subcategory?.name}</td>
                <td><div className={`${product.active ? 'badge badge-success text-white' : 'badge badge-primary'}`}>{product.active ? "Active" : "No Active"}</div></td>
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
            <Pagination items={sortedItems} currentPage={currentPage} setCurrentPage={setCurrentPage} pages={pages} objetsPerPage={objetsPerPage}/>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default Product