// React
import { useState, useEffect } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { ingredientSelector, measureSelector } from "../../state/selectors";
import { loadIngredients } from "../../state/actions/ingredientActions";

// Hooks
import { useSorting } from "../../hooks/useSorting";
import { useSortingStates } from "../../hooks/useSortingStates";
import { useCrudActions } from "../../hooks/useCrudActions";

// Services
import { IngredientService } from "../../services/Ingredient";

// Components
import IngredientForm from "../../components/modals/Ingredients/ingredient_form/IngredientForm";
import IngredientListForm from "../../components/modals/Ingredients/IngredientList_form/IngredientListForm";
import CrudCreateButton from "../../components/crud_components/crud_create_button/CrudCreateButton";

// Types
import { Ingredient, IngredientList } from "../../models/Ingredient";
import { Measure } from "../../models/Measure";

// Assets
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line, RiEyeLine } from "react-icons/ri";
import { AiOutlineBars, AiOutlineReload } from "react-icons/ai";

const Ingredient = () => {
  // Redux
  const dispatch = useDispatch();

  // Obtiene los Ingredients y Measures
  const ingredients: Ingredient[] = useSelector(ingredientSelector);
  const measures = useSelector(measureSelector);

  // Ingredient Service
  const ingredientService = new IngredientService();

  // Modal
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [reStockModalOpen, setReStockModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Ingredient>();
  const [reStockItems, setReStockItems] = useState<IngredientList>();
  const [watchInfo, setWatchInfo] = useState<boolean>(false);

  // Handlers
  const handleDelete = (ingredient: Ingredient) => {
    const { deleteObjectAlerts } = useCrudActions(
      ingredient,
      ingredientService,
      "ingredient",
      dispatch,
      loadIngredients,
      () => setEditModalOpen(false)
    );
    deleteObjectAlerts();
  };

  const openEditModal = (i: Ingredient) => {
    setSelectedItem(i);
    setEditModalOpen(true);
  };

  const handleWatch = (ingredient: Ingredient) => {
    setWatchInfo(true);
    setSelectedItem(ingredient);
    setEditModalOpen(true);
  };

  //Filters
  const [filters, setFilters] = useState({
    search: "",
    stock: 0,
    measure: 0,
  });

  const filterIngredients = (ingredients: Ingredient[]) => {
    return ingredients.filter((i: Ingredient) => {
      return (
        i.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        i.stock >= filters.stock &&
        (filters.measure === 0 || +i.measure.id === filters.measure)
      );
    });
  };

  const handleChangeMeasure = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const op = +e.target.value;

    setFilters((prevState) => ({
      ...prevState,
      measure: op,
    }));
  };

  const ingredientsFilter: Ingredient[] = filterIngredients(ingredients);

  // Search
  const [search, setSearch] = useState<string>("");
  const [stock, setStock] = useState<number>(0);

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

  const handleChangeStock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const s = +e.target.value;
    setStock(s);

    if (e.target.value == "")
      setFilters((prevState) => ({
        ...prevState,
        stock: 0,
      }));
  };

  const searchStockOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFilters((prevState) => ({
        ...prevState,
        stock: stock,
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
  } = useSortingStates(ingredientsFilter, "id");

  useEffect(() => {
    const ingredientList: IngredientList = {
      ingredients: ingredients.filter((i: Ingredient) => i.stock <= i.stockMin).map((i: Ingredient) => {
        return {
          ingredient: { ...i },
          cant: 0,
        };
      }),
    };
    setReStockItems(ingredientList);
    setSortedItems(useSorting(ingredientsFilter, currentSorting, isAsc));
  }, [filters, ingredients]);

  return (
    <div className='mx-4 mt-4'>
      {/* NEW INGREDIENT & RE-STOCK */}
      <div className='flex gap-5'>
        <CrudCreateButton Modal={IngredientForm} Title='Ingredients' />
        <button className='btn btn-primary' onClick={() => setReStockModalOpen(true)}>
          <AiOutlineReload className="w-5 h-5" />Re - Stock
        </button>
      </div>
      {/* EDIT INGREDIENT */}
      <IngredientForm
        obj={selectedItem}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        watch={watchInfo}
      />
      <IngredientListForm
        obj={reStockItems}
        open={reStockModalOpen}
        onClose={() => setReStockModalOpen(false)}
      />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>
        Ingredients
      </h2>
      <details className='mb-10 dropdown lg:hidden'>
        {/* FILTERS */}
        <summary className='m-1 btn btn-primary btn-wide btn-sm'>
          Filter
        </summary>
        <ul className='p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-80  '>
          <li>
            <input
              type='text'
              placeholder='NAME'
              className=' input input-sm'
              value={search}
              onKeyDown={searchOnEnter}
              onChange={handleChangeSearch}
            />
          </li>
          <li>
            <input
              type='number'
              placeholder='STOCK MIN.'
              className='input input-sm '
              onKeyDown={searchStockOnEnter}
              onChange={handleChangeStock}
            />
          </li>
          <li>
            <select
              className='w-full h-full select select-bordered select-sm'
              onChange={handleChangeMeasure}
            >
              <option selected value={0}>
                MEASURE: ALL
              </option>
              {measures.map((m: Measure) => {
                return (
                  <option value={m.id}>
                    MEASURE: {m.measure.toUpperCase()}
                  </option>
                );
              })}
            </select>
          </li>
          <li>
            <select
              className='w-full h-full select select-bordered select-sm'
              onChange={handleChangeSorting}
            >
              <option selected value='id true'>
                SORT BY: FEATURED
              </option>
              <option value='stock true'>SORT BY STOCK: LOW to HIGH</option>
              <option value='stock false'>SORT BY STOCK: HIGH to LOW</option>
              <option value='cost true'>SORT BY COST: LOW to HIGH</option>
              <option value='cost false'>SORT BY COST: HIGH to LOW</option>
              <option value='name true'>SORT BY NAME: A - Z</option>
              <option value='name false'>SORT BY NAME: Z - A</option>
            </select>
          </li>
        </ul>
      </details>
      <div className='flex items-center justify-center w-full gap-5 my-2 max-lg:hidden'>
        <input
          type='text'
          placeholder='NAME'
          className=' input w-[60%] input-sm'
          value={search}
          onKeyDown={searchOnEnter}
          onChange={handleChangeSearch}
        />
        <input
          type='number'
          placeholder='STOCK MIN.'
          className='input input-sm '
          onKeyDown={searchStockOnEnter}
          onChange={handleChangeStock}
        />
        <select
          className='w-full max-w-xs select select-bordered select-sm'
          onChange={handleChangeMeasure}
        >
          <option selected value={0}>
            MEASURE: ALL
          </option>
          {measures.map((m: Measure) => {
            return (
              <option value={m.id}>MEASURE: {m.measure.toUpperCase()}</option>
            );
          })}
        </select>
        <select
          className='w-full max-w-xs select select-bordered select-sm'
          onChange={handleChangeSorting}
        >
          <option selected value='id true'>
            SORT BY: FEATURED
          </option>
          <option value='stock true'>SORT BY STOCK: LOW to HIGH</option>
          <option value='stock false'>SORT BY STOCK: HIGH to LOW</option>
          <option value='cost true'>SORT BY COST: LOW to HIGH</option>
          <option value='cost false'>SORT BY COST: HIGH to LOW</option>
          <option value='name true'>SORT BY NAME: A - Z</option>
          <option value='name false'>SORT BY NAME: Z - A</option>
        </select>
      </div>
      {/* INGREDIENTS TABLE */}
      <div className='overflow-x-auto h-[35rem]'>
        <table className='z-0 table table-xs table-pin-rows'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Cost</th>
              <th>Stock</th>
              <th>Stock Min.</th>
              <th>Measure</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((ingredient: Ingredient, i: number) => {
              return (
                <tr
                  key={i}
                  className={`${
                    ingredient.stock < ingredient.stockMin * 1.2 &&
                    ingredient.stock >= ingredient.stockMin
                      ? "bg-yellow-200"
                      : ingredient.stock < ingredient.stockMin && "bg-red-200"
                  }`}
                >
                  <td>{ingredient.name}</td>
                  <td>{ingredient.cost}</td>
                  <td>{ingredient.stock}</td>
                  <td>{ingredient.stockMin}</td>
                  <td>{ingredient.measure?.measure}</td>
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
                        <button onClick={() => handleWatch(ingredient)}>
                          <RiEyeLine className='w-5 h-5 eye-icon' />
                          {" View "}
                        </button>
                      </li>
                      <li>
                        <button onClick={() => openEditModal(ingredient)}>
                          <FiEdit2 className='w-5 h-5 edit-icon' />
                          {" Edit "}
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleDelete(ingredient)}>
                          <RiDeleteBin6Line className='w-5 h-5 delete-icon' />
                          {" Delete "}
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className='flex gap-2 max-md:hidden'>
                    <button onClick={() => handleWatch(ingredient)}>
                      <RiEyeLine className='w-5 h-5 eye-icon' />{" "}
                    </button>
                    <button onClick={() => openEditModal(ingredient)}>
                      <FiEdit2 className='w-5 h-5 edit-icon' />{" "}
                    </button>
                    <button onClick={() => handleDelete(ingredient)}>
                      <RiDeleteBin6Line className='w-5 h-5 delete-icon' />{" "}
                    </button>
                  </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ingredient;
