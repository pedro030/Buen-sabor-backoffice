// React
import { useEffect, useState } from "react";

// Redux
import store from "../../../state/store/store";

// React Date Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Types
import { Product } from "../../../models/Product";

// Hooks
import { usePagination } from "../../../hooks/usePagination";

// Components
import Pagination from "../../../components/pagination/Pagination";

// Functions
import { dateToString } from "../rankingFunctions";
import { ExportCSV } from "../ExportCSV";

const RankingsProducts = () => {
  // Token y Api URL para hacer los fetch
  const token: string = store.getState().userSession.token;
  const apiURL = import.meta.env.VITE_REACT_APP_API_URL;

  // Product Ranking States
  const [products, setProducts] = useState<Array<Product>>([]);
  const [initialRanking, setInitialRanking] = useState<Array<Product>>([]);

  // Show Drinks or Food Ranking State
  const [foodRanking, setFoodRanking] = useState<boolean>(true);

  // Date States
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Fetch Product Ranking / Si no se le pasan fechas se inicializa para filtrar desde que se creo el negocio hasta la actualidad
  const fetchProductRanking = async (
    stDate: string = "2023-01-01",
    edDate: string | null = dateToString(new Date(Date.now()))
  ) => {
    // Si startDate y endDate son distintos de null se los convierte a string sino obtiene los parametros por defecto
    const endURL =
      startDate && endDate
        ? `${dateToString(startDate)}&${dateToString(endDate)}`
        : `${stDate}&${edDate}`;

    // Fetch
    fetch(`${apiURL}/products/getProductsByQuantity/${endURL}`, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
      },
    })
      .then((res) => res.json())
      // Si el rankingInicial es igual a 0 setea los datos ya que significa que es la primera vez que se produce el fetch
      .then((data) => {
        setProducts(data);
        initialRanking.length != 0 ? "" : setInitialRanking(data);
      })
      .catch((error) => console.error(error));
  };

  // Handle Change DatePicker
  const handleChangeDate = (range: [Date, Date]) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);

    // Si startDate y endDate son null, se setea el ranking inicial
    if (!startDate && !endDate) setProducts(initialRanking);
  };

  // Si startDate y endDate no son null se produce el fetch
  const handleClickGetRankingByDate = () => {
    if (startDate && endDate) fetchProductRanking();
  };

  // Pagination
  const { currentObjects, currentPage, objetsPerPage, pages, setCurrentPage } =
    usePagination(products);

  // Cuando carga el componente se realiza el fetch para obtener el ranking
  useEffect(() => {
    fetchProductRanking();
  }, []);

  // Cuando cambian los productos o la vista de comidas a bebidas se setea la pagina inicial
  useEffect(() => {
    setCurrentPage(1);
  }, [products, foodRanking]);

  return (
    <div className='h-[100vh] overflow-y-auto'>
      <h1 className='my-5 text-xl font-semibold tracking-widest text-center uppercase'>
        Product Ranking
      </h1>
      <hr />

      <div>
        {/* FOOD RANKING or DRINKS RANKING */}
        <div className='flex justify-center mt-5'>
          <div className='grid grid-cols-2 w-[80%] join'>
            <input
              className='rounded join-item btn'
              type='radio'
              name='ranking'
              aria-label='FOOD RANKING'
              onClick={() => {
                setFoodRanking(true);
              }}
              defaultChecked={foodRanking ? true : false}
            />
            <input
              className='rounded-full join-item btn'
              type='radio'
              name='ranking'
              aria-label='DRINKS RANKING'
              onClick={() => {
                setFoodRanking(false);
              }}
              defaultChecked={!foodRanking ? true : false}
            />
          </div>
        </div>
        <h1 className='mt-5 text-lg tracking-widest text-center '>
          {foodRanking ? "FOOD RANKING" : "DRINKS RANKING"}
        </h1>

        <details className='mb-10 dropdown md:hidden'>
          <summary className='m-1 btn btn-primary btn-wide btn-sm'>
            Filter
          </summary>
          <ul className='p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-80 gap-5 '>
            <li>
              <DatePicker
                isClearable
                withPortal
                selectsRange
                selected={startDate}
                startDate={startDate}
                endDate={endDate}
                onChange={handleChangeDate}
                placeholderText='Date: From - To'
                dateFormat='yyyy/MM/dd'
                className='cursor-pointer input input-sm input-bordered'
                maxDate={new Date(Date.now())}
              />
            </li>
            <li>
              <button
                className='btn btn-primary btn-sm'
                onClick={handleClickGetRankingByDate}
              >
                Get Ranking by Date
              </button>
            </li>
            <li>
              <ExportCSV
                csvData={products}
                rankingType={"Product Ranking"}
                rankingOpc={1}
                startDate={startDate}
                endDate={endDate}
              />
            </li>
          </ul>
        </details>

        <div className='flex justify-center gap-5 my-2 max-md:hidden'>
          <div>
            <DatePicker
              isClearable
              withPortal
              selectsRange
              selected={startDate}
              startDate={startDate}
              endDate={endDate}
              onChange={handleChangeDate}
              placeholderText='Date: From - To'
              dateFormat='yyyy/MM/dd'
              className='cursor-pointer input input-sm input-bordered'
              maxDate={new Date(Date.now())}
            />
          </div>
          <div>
            <button
              className='btn btn-primary btn-sm'
              onClick={handleClickGetRankingByDate}
            >
              Get Ranking by Date
            </button>
          </div>
          <ExportCSV
            csvData={products}
            rankingType={"Product Ranking"}
            rankingOpc={1}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        {/* FOOD RANKING TABLE */}
        {foodRanking ? (
          <>
            <table className='table table-xs'>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>CATEGORY</th>
                  <th>QTY. SOLD</th>
                  <th>ACTIVE</th>
                  <th>PRICE</th>
                </tr>
              </thead>
              <tbody>
                {currentObjects
                  .filter(
                    (product: Product) =>
                      product.subcategory_fk?.name !== "Bebidas" &&
                      product.subcategory_fk?.parentCategory?.name !== "Bebidas"
                  )
                  .map((product: Product, index: number) => (
                    <tr key={index}>
                      <th>{product.name}</th>
                      <th>{product.subcategory_fk?.name}</th>
                      <th className='text-center'>{product.quantity_sold}</th>
                      <th>
                      <div
                    className={`${
                      product.active
                        ? "badge badge-success text-white  "
                        : "badge badge-primary"
                    } text-[7px] sm:text-[10px] min-w-full max:lg:badge-lg`}
                  >
                    {product.active ? "Active" : "No Active"}
                  </div>
                      </th>
                      <th className='text-center'>{product.price}</th>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <Pagination
                  items={products}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  pages={pages}
                  objetsPerPage={objetsPerPage}
                />
              </tfoot>
            </table>
          </>
        ) : (
          <>
            {/* DRINKS RANKING TABLE */}
            <table className='table table-xs'>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>CATEGORY</th>
                  <th>QTY. SOLD</th>
                  <th>ACTIVE</th>
                  <th>PRICE</th>
                </tr>
              </thead>
              <tbody>
                {currentObjects
                  .filter(
                    (product: Product) =>
                      product.subcategory_fk?.name === "Bebidas" ||
                      product.subcategory_fk?.parentCategory?.name === "Bebidas"
                  )
                  .map((product: Product, index: number) => (
                    <tr key={index}>
                      <th>{product.name}</th>
                      <th>{product.subcategory_fk?.name}</th>
                      <th className='text-center'>{product.quantity_sold}</th>
                      <th>
                      <div
                    className={`${
                      product.active
                        ? "badge badge-success text-white  "
                        : "badge badge-primary"
                    } text-[7px] sm:text-[10px] min-w-full max:lg:badge-lg`}
                  >
                    {product.active ? "Active" : "No Active"}
                  </div>
                      </th>
                      <th className='text-center'>{product.price}</th>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <Pagination
                  items={products}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  pages={pages}
                  objetsPerPage={objetsPerPage}
                />
              </tfoot>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default RankingsProducts;
