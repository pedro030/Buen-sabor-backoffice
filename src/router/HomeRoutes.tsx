import { Route, Routes } from "react-router-dom"
import CategoriesCRUD from "../pages/CategoriesCRUD/CategoriesCRUD"
import Measure from "../pages/Measure/Measure"
import Ingredient from "../pages/Ingredient/Ingredient"
import Product from "../pages/Product/Product"
import Order from "../pages/Order/Order"
import Bill from "../pages/Bill/Bill"
import User from "../pages/User/User"
import Section from "../pages/Section/Section"
import Location from "../pages/Location/Location"
import Address from "../pages/Address/Address"
import HomePage from "../pages/HomePage/HomePage"
import PersonalInfo from "../pages/PersonalInfo/PersonalInfo"
import ChangePassword from "../pages/ChangePassword/ChangePassword"
import Employees from "../pages/Employees/Employees"
import Status from "../pages/Status/Status"



const homeRoutes = () => {
  return (
    <Routes>
      {/* HOME */}
      <Route path="/" element={<HomePage />} />

      {/* PERSONAL INFO */}
      <Route path="/personal_info" element={<PersonalInfo />} />
      <Route path="/change_password" element={<ChangePassword />} />

      {/* CRUD */}
      <Route path="/categories" element={<CategoriesCRUD />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/status" element={<Status />} />
      <Route path="/measures" element={<Measure />} />
      <Route path="/ingredients" element={<Ingredient />} />
      <Route path="/products" element={<Product />} />
      <Route path="/orders" element={<Order />} />
      <Route path="/bills" element={<Bill />} />
      <Route path="/users" element={<User />} />
      <Route path="/sections" element={<Section />} />
      <Route path="/locations" element={<Location />} />
      <Route path="/addresses" element={<Address />} />
    </Routes>
  )
}

export default homeRoutes