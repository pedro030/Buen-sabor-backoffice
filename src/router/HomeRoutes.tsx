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
import OrderDetail from "../pages/OrderDetail/OrderDetail"
import RankingsProducts from "../pages/Rankings/RankingsProducts/RankingsProducts"
import RankingsClients from "../pages/Rankings/RankingsClients/RankingsClients"
import Movements from "../pages/Rankings/Movements/Movements"
import { ProtectedRoute } from "./ProtectedRoute"
import { useState } from "react"
import { UserDetail } from "../pages/UserDetail/UserDetail"
import { UserOrderDetail } from "../pages/UserDetail/UserOrderDetail/UserOrderDetail"



const homeRoutes = () => {

  const [user, setUser] = useState({ user: 'Fulano', rol: 'SuperAdmin' });

  return (
    <Routes>
      {/* HOME */}
      <Route path="/" element={<HomePage />} />

      {/* PERSONAL INFO */}
      <Route path="/personal_info" element={<PersonalInfo />} />
      <Route path="/change_password" element={<ChangePassword />} />

      {/* CRUD */}
      <Route element={<ProtectedRoute
        isAllowed={
          user.rol.includes('SuperAdmin') ||
          user.rol.includes('Admin') ||
          user.rol.includes('Chef')
        } />}>
        <Route path="/categories" element={<CategoriesCRUD />} />
        <Route path="/ingredients" element={<Ingredient />} />
        <Route path="/products" element={<Product />} />
      </Route>

      <Route element={<ProtectedRoute
        isAllowed={
          user.rol.includes('SuperAdmin') ||
          user.rol.includes('Admin')
        } />}>
        <Route path="/employees" element={<Employees />} />
        <Route path="/users" element={<User />} />
      </Route>

      <Route element={<ProtectedRoute
        isAllowed={
          user.rol.includes('SuperAdmin') ||
          user.rol.includes('Admin') ||
          user.rol.includes('Cashier')
        } />}>
        <Route path="/bills" element={<Bill />} />
      </Route>


      <Route path="/status" element={<Status />} />
      <Route path="/measures" element={<Measure />} />
      <Route path="/sections" element={<Section />} />
      <Route path="/locations" element={<Location />} />
      <Route path="/addresses" element={<Address />} />

      {/* ORDER */}
      <Route element={<ProtectedRoute
        isAllowed={
          user.rol.includes('SuperAdmin') ||
          user.rol.includes('Cashier') ||
          user.rol.includes('Chef') ||
          user.rol.includes('Delivery')
        } />}>
        <Route path="/orders" element={<Order />} />
      </Route>

      <Route path="/orders/:idOrder" element={<OrderDetail />} />

      {/* STOCK */}
      <Route element={<ProtectedRoute
        isAllowed={
          user.rol.includes('SuperAdmin') ||
          user.rol.includes('Admin') ||
          user.rol.includes('Chef')
        } />}>
        <Route path="/stock" />
      </Route>

      {/* RANKINGS */}
      <Route element={<ProtectedRoute
        isAllowed={
          user.rol.includes('SuperAdmin') ||
          user.rol.includes('Admin')
        } />}>
        <Route path="/statistics/products" element={<RankingsProducts />} />
        <Route path="/statistics/clients" element={<RankingsClients />} />
        <Route path="/statistics/movements" element={<Movements />} />
      </Route>

      <Route path="/statistics/clients/:idUser" element={<UserDetail />} />
      <Route path="/statistics/clients/:idUser/order/:idOrder" element={<UserOrderDetail />} />
    </Routes>
  )
}

export default homeRoutes