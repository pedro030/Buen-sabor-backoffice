import { Route, Routes } from "react-router-dom"
import CategoriesCRUD from "../pages/CategoriesCRUD/CategoriesCRUD"
import Measure from "../pages/Measure/Measure"
import Ingredient from "../pages/Ingredient/Ingredient"
import Product from "../pages/Product/Product"
import Order from "../pages/Order/Order"
import Bill from "../pages/Bill/Bill"
import User  from "../pages/User/User"
import Section from "../pages/Section/Section"

const homeRoutes = () => {
  return (
      <Routes>
          <Route path="/categories" element={<CategoriesCRUD />} />
          <Route path="/measures" element={<Measure />} />
          <Route path="/ingredients" element={<Ingredient />} />
          <Route path="/products" element={<Product />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/bills" element={<Bill />} />
          <Route path="/users" element={<User />} />
          <Route path="/sections" element={<Section />} />
      </Routes>
  )
}

export default homeRoutes