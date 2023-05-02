import {
  createBrowserRouter,
} from "react-router-dom";
import ProductDetail from "../components/product_detail/ProductDetail";
import Login from "../pages/Login/Login"

const routes = createBrowserRouter([
  {
    path: "/detail",
    element: <ProductDetail/>,
  },
  {
    path: "/login",
    element: <Login/>
  }
]);

export default routes