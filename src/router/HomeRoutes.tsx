import { Route, Routes } from "react-router-dom"
import CategoriesCRUD from "../pages/CategoriesCRUD/CategoriesCRUD"
import Measure from "../pages/Measure/Measure"
import Ingredient from "../pages/Ingredient/Ingredient"
import Product from "../pages/Product/Product"
import Order from "../pages/Order/Order"

const homeRoutes = () => {
  return (
      <Routes>
          <Route path="/categories" element={<CategoriesCRUD />} />
          <Route path="/measures" element={<Measure />} />
          <Route path="/ingredients" element={<Ingredient />} />
          <Route path="/products" element={<Product />} />
          <Route path="/orders" element={<Order />} />
      </Routes>
  )
}

export default homeRoutes