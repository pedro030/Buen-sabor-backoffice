// React
import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { loadCategories } from "../../state/actions/categoryActions";
import { categoriesSelector } from "../../state/selectors";

//Services
import { CategoryService } from "../../services/Category";

// Hooks
import { useSortingStates } from "../../hooks/useSortingStates";
import { useSorting } from "../../hooks/useSorting";

// Components
import CategoryForm from "../../components/modals/category_form/CategoryForm";
import CrudCreateButton from "../../components/crud_components/crud_create_button/CrudCreateButton";

// Types
import { Category } from "../../models/Category";

// Assets
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line, RiEyeLine } from "react-icons/ri";
import { useCrudActions } from "../../hooks/useCrudActions";

function CategoriesCRUD() {
  // Redux
  const dispatch = useDispatch();

  // Obtiene todas las categorias
  const category: Category[] = useSelector(categoriesSelector);

  // Category Service
  const categoryService = new CategoryService();

  // Modal
  const [selectedItem, setSelectedItem] = useState<Category>();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [watchInfo, setWatchInfo] = useState<boolean>(false);

  //Filters
  const [filters, setFilters] = useState({
    search: "",
    parentCategory: "",
  });

  const filterCategories = (categories: Category[]) => {
    return categories.filter((c: Category) => {
      return (
        c.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        (filters.parentCategory === "" ||
          (c.parentCategory == null && "null") === filters.parentCategory)
      );
    });
  };

  const handleChangeSubcategory = (e: ChangeEvent<HTMLSelectElement>) => {
    const subcatOpc = +e.target.value;
    if (subcatOpc === 1) {
      setFilters((prevState) => ({
        ...prevState,
        parentCategory: "",
      }));
    } else if (subcatOpc === 2) {
      setFilters((prevState) => ({
        ...prevState,
        parentCategory: "null",
      }));
    }
  };

  const categories: Category[] = filterCategories(category);

  // Search
  const [search, setSearch] = useState<string>("");

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value;
    setSearch(s);

    if (s == "")
      setFilters((prevState) => ({
        ...prevState,
        search: "",
      }));
  };

  const searchOnEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFilters((prevState) => ({
        ...prevState,
        search: search,
      }));
    }
  };

  // Sorting
  const {
    sortedItems,
    setSortedItems,
    currentSorting,
    isAsc,
    handleChangeSorting,
  } = useSortingStates(categories, "id");

  useEffect(() => {
    setSortedItems(useSorting(categories, currentSorting, isAsc));
  }, [filters, category]);

  // Handlers
  const handleDelete = (category: Category) => {
    const { deleteObjectAlerts } = useCrudActions(
      category,
      categoryService,
      "category",
      dispatch,
      loadCategories,
      () => setEditModalOpen(false)
    );
    deleteObjectAlerts();
  };

  const handleEdit = (category: Category) => {
    setWatchInfo(false);
    setSelectedItem(category);
    setEditModalOpen(true);
  };

  const handleWatch = (category: Category) => {
    setWatchInfo(true);
    setSelectedItem(category);
    setEditModalOpen(true);
  };

  return (
    <div className='mx-4 mt-4'>
      <h2 className='my-2 text-xl font-bold text-center stat-title'>
          Categories
        </h2>
      {/* NEW CATEGORY BUTTON */}
      <CrudCreateButton Modal={CategoryForm} Title='Category' />
      {/* EDIT CATEGORY */}
      <CategoryForm
        obj={selectedItem}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        watch={watchInfo}
      />
      <div className=''>
        
        {/* FILTERS */}
        <details className='mb-10 dropdown lg:hidden'>
          <summary className='w-full mt-5 btn btn-primary btn-md'>
            Filter
          </summary>
          <ul className='p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-full  '>
            <li>
              <input
                type='text'
                placeholder='NAME'
                className=' input'
                onChange={handleChangeSearch}
                value={search}
                onKeyDown={searchOnEnter}
              />
            </li>
            <li>
              <select
                className='w-full h-full select select-bordered select-sm'
                onChange={handleChangeSorting}
              >
                <option value={"id true"}>
                  SORT BY: FEATURED
                </option>
                <option value={"name true"}>SORT BY NAME: A - Z</option>
                <option value={"name false"}>SORT BY NAME: Z - A</option>
              </select>
            </li>
            <li>
              <select
                className='w-full h-full select select-bordered select-sm'
                onChange={handleChangeSubcategory}
              >
                <option value={1}>
                  SUBCATEGORY: STANDARD
                </option>
                <option value={2}>SUBCATEGORY: EMPTY</option>
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
            value={search}
            onKeyDown={searchOnEnter}
          />
          <select
            className='w-full max-w-xs select select-bordered select-sm'
            onChange={handleChangeSorting}
          >
            <option value={"id true"}>
              SORT BY: FEATURED
            </option>
            <option value={"name true"}>SORT BY NAME: A - Z</option>
            <option value={"name false"}>SORT BY NAME: Z - A</option>
          </select>

          <select
            className='w-full max-w-xs select select-bordered select-sm'
            onChange={handleChangeSubcategory}
          >
            <option value={1}>
              SUBCATEGORY: STANDARD
            </option>
            <option value={2}>SUBCATEGORY: EMPTY</option>
          </select>
        </div>
        {/* CATEGORIES TABLE */}
        <div className='overflow-x-auto h-[35rem]'>
          <table className='z-0 table table-pin-rows '>
            <thead>
              <tr>
                <th>Name</th>
                <th>Subcategory</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((cat: Category, i: number) => (
                <tr key={i}>
                  <td>{cat.name}</td>
                  <td>{cat.parentCategory?.name}</td>
                  <td>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleWatch(cat)}
                        className='cursor-pointer'
                      >
                        <RiEyeLine className='w-5 h-5 eye-icon' />
                      </button>
                      <button
                        onClick={() => handleEdit(cat)}
                        className='cursor-pointer'
                      >
                        <FiEdit2 className='w-5 h-5 edit-icon' />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className='cursor-pointer'
                      >
                        <RiDeleteBin6Line className='w-5 h-5 delete-icon' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CategoriesCRUD;
