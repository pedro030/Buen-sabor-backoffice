// React
import { useState, useEffect } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { categoriesSelector, productSelector } from "../../state/selectors";
import { loadProducts } from "../../state/actions/productActions";

// Services
import { ProductService } from "../../services/Product";

// Hooks
import { useSorting } from "../../hooks/useSorting";
import { useSortingStates } from "../../hooks/useSortingStates";
import { usePagination } from "../../hooks/usePagination";
import { useCrudActions } from "../../hooks/useCrudActions";

// Components
import ProductForm from "../../components/modals/product_form/ProductForm";
import Pagination from "../../components/pagination/Pagination";
import CrudCreateButton from "../../components/crud_components/crud_create_button/CrudCreateButton";

// Types
import { Product } from "../../models/Product";

// Assets
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line, RiEyeLine } from "react-icons/ri";
import { AiOutlineBars } from "react-icons/ai";

const Product = () => {
  // Redux
  const dispatch = useDispatch();

  // Obtiene los productos y las categorias
  const products: Product[] = useSelector(productSelector);
  const categories = useSelector(categoriesSelector);

  // Product Service
  const productService = new ProductService();

  // Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product>();
  const [watchInfo, setWatchInfo] = useState<boolean>(false);

  //Filters
  const [filters, setFilters] = useState({
    category: 0,
    price: 0,
    search: "",
    status: "",
  });

  const filterProducts = (products: Product[]) => {
    return products.filter((p: Product) => {
      return (
        p.price >= filters.price &&
        (filters.category === 0 || +p.subcategory.id === filters.category) &&
        p.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        (filters.status === "" || p.active.toString() === filters.status)
      );
    });
  };

  // Handler Change Status
  const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const op = +e.target.value;

    if (op === 1) {
      setFilters((prevState) => ({
        ...prevState,
        status: "",
      }));
    } else if (op === 2) {
      setFilters((prevState) => ({
        ...prevState,
        status: "true",
      }));
    } else if (op === 3) {
      setFilters((prevState) => ({
        ...prevState,
        status: "false",
      }));
    }
  };

  // Handle Change Category
  const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const op = +e.target.value;

    setFilters((prevState) => ({
      ...prevState,
      category: op,
    }));
  };

  const productsFilter: Product[] = filterProducts(products);

  //Search
  const [search, setSearch] = useState<string>("");
  const [price, setPrice] = useState<number>(0);

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value;
    setSearch(s);

    if (s == "")
      setFilters((prevState) => ({
        ...prevState,
        search: "",
      }));
  };

  const searchOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFilters((prevState) => ({
        ...prevState,
        search: search,
      }));
    }
  };

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const s = +e.target.value;
    setPrice(s);

    if (e.target.value == "")
      setFilters((prevState) => ({
        ...prevState,
        price: 0,
      }));
  };

  const searchPriceOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFilters((prevState) => ({
        ...prevState,
        price: price,
      }));
    }
  };

  //Sorting
  const {
    sortedItems,
    setSortedItems,
    currentSorting,
    isAsc,
    handleChangeSorting,
  } = useSortingStates(productsFilter, "id");

  //Pagination
  const { currentObjects, currentPage, objetsPerPage, pages, setCurrentPage } =
    usePagination(sortedItems);

  useEffect(() => {
    setCurrentPage(1);
    setSortedItems(useSorting(productsFilter, currentSorting, isAsc));
  }, [filters, products]);

  // Handlers
  const openEditModal = (p: Product) => {
    setWatchInfo(false);
    setSelectedItem(p);
    setIsEditModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    const { deleteObjectAlerts } = useCrudActions(
      product,
      productService,
      "product",
      dispatch,
      loadProducts,
      () => setIsEditModalOpen(false)
    );
    deleteObjectAlerts();
  };

  const handleWatch = (product: Product) => {
    setWatchInfo(true);
    setSelectedItem(product);
    setIsEditModalOpen(true);
  };

  return (
    <div className='m-4 h-[90vh]'>
       <h2 className='my-2 text-xl font-bold text-center stat-title'>
        Products
      </h2>
      {/* NEW PRODUCT */}
      <CrudCreateButton Modal={ProductForm} Title='Products' />
      {/* EDIT PRODUCT */}
      <ProductForm
        obj={selectedItem}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        watch={watchInfo}
      />

     
      {/* FILTERS */}
      <details className='mt-3 mb-10 dropdown lg:hidden'>
        <summary className='w-full btn btn-primary btn-md'>
          Filter
        </summary>
        <ul className='p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box  w-full  '>
          <li>
          <input
            type='text'
            placeholder='NAME'
            className=' input'
            onChange={handleChangeSearch}
            onKeyDown={searchOnEnter}
          />
</li>
          <li>
            <input
              type='number'
              placeholder='PRICE MIN'
              className='input '
              onChange={handleChangePrice}
              onKeyDown={searchPriceOnEnter}
            />
          </li>
          <select
            className='w-full h-full select select-bordered '
            onChange={handleChangeStatus}
          >
            <option selected value={1}>
              STATUS: ALL
            </option>
            <option value={2}>STATUS: ACTIVE</option>
            <option value={3}>STATUS: NO ACTIVE</option>
          </select>
          <li>
            <select
              className='w-full h-full select select-bordered select-sm'
              onChange={handleChangeCategory}
            >
              <option defaultValue={0}>
                CATEGORY: ALL
              </option>
              {categories.map((c: any) => {
                return (
                  <option value={c.id}>CATEGORY: {c.name.toUpperCase()}</option>
                );
              })}
            </select>
          </li>
          <li>
            <select
              className='w-full h-full select select-bordered select-sm'
              onChange={handleChangeSorting}
            >
              <option selected value={"id true"}>
                SORT BY: FEATURED
              </option>
              <option value={"price true"}>SORT BY PRICE: LOW to HIGH</option>
              <option value={"price false"}>SORT BY PRICE: HIGH to LOW</option>
              <option value={"name true"}>SORT BY NAME: A - Z</option>
              <option value={"name false"}>SORT BY NAME: Z - A</option>
            </select>
          </li>
        </ul>
      </details>

      <div className='flex items-center justify-center w-full gap-5 my-2 max-lg:hidden'>
        <input
          type='text'
          placeholder='NAME'
          className=' input w-[60%] input-sm'
          onChange={handleChangeSearch}
          onKeyDown={searchOnEnter}
        />
        <input
          type='number'
          placeholder='PRICE MIN'
          className='input input-sm'
          onChange={handleChangePrice}
          onKeyDown={searchPriceOnEnter}
        />
        <select
          className='w-full max-w-xs select select-bordered select-sm'
          onChange={handleChangeStatus}
        >
          <option selected value={1}>
            STATUS: ALL
          </option>
          <option value={2}>STATUS: ACTIVE</option>
          <option value={3}>STATUS: NO ACTIVE</option>
        </select>
        <select
          className='w-full max-w-xs select select-bordered select-sm'
          onChange={handleChangeCategory}
        >
          <option selected value={0}>
            CATEGORY: ALL
          </option>
          {categories.map((c: any) => {
            return (
              <option value={c.id}>CATEGORY: {c.name.toUpperCase()}</option>
            );
          })}
        </select>
        <select
          className='w-full max-w-xs select select-bordered select-sm'
          onChange={handleChangeSorting}
        >
          <option selected value={"id true"}>
            SORT BY: FEATURED
          </option>
          <option value={"price true"}>SORT BY PRICE: LOW to HIGH</option>
          <option value={"price false"}>SORT BY PRICE: HIGH to LOW</option>
          <option value={"name true"}>SORT BY NAME: A - Z</option>
          <option value={"name false"}>SORT BY NAME: Z - A</option>
        </select>
      </div>
      {/* PRODUCTS TABLE */}
      <div className='overflow-x-auto h-[35rem]'>
        <table className='z-0 table table-pin-rows'>
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
                <td>
                  <div
                    className={`${
                      product.active
                        ? "badge badge-success text-white  "
                        : "badge badge-primary"
                    }`}
                  >
                    {product.active ? "Active" : "No Active"}
                  </div>
                </td>
                <td>
                  <div className='dropdown dropdown-end md:hidden'>
                    <label tabIndex={0} className='hover:shadow-sm btn btn-link btn-sm '>
                      <AiOutlineBars />
                    </label>
                    <ul
                      tabIndex={0}
                      className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
                    >
                      <li>
                        <button onClick={() => handleWatch(product)}>
                          <RiEyeLine className='w-5 h-5 eye-icon' />
                          {" View "}
                        </button>
                      </li>
                      <li>
                        <button onClick={() => openEditModal(product)}>
                          <FiEdit2 className='w-5 h-5 edit-icon' />
                          {" Edit "}
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleDelete(product)}>
                          <RiDeleteBin6Line className='w-5 h-5 delete-icon' />
                          {" Delete "}
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className='flex gap-2 max-md:hidden'>
                    <button onClick={() => handleWatch(product)}>
                      <RiEyeLine className='w-5 h-5 eye-icon' />{" "}
                    </button>
                    <button onClick={() => openEditModal(product)}>
                      <FiEdit2 className='w-5 h-5 edit-icon' />{" "}
                    </button>
                    <button onClick={() => handleDelete(product)}>
                      <RiDeleteBin6Line className='w-5 h-5 delete-icon' />{" "}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          {/* PAGINATION */}
          <tfoot>
            <Pagination
              items={sortedItems}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pages={pages}
              objetsPerPage={objetsPerPage}
            />
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Product;
