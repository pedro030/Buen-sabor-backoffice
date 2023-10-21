// React Router
import { Route, Routes } from "react-router-dom"

// Redux
import { useSelector } from "react-redux"
import { userSessionSelector } from "../state/selectors"

// Components
import CategoriesCRUD from "../pages/CategoriesCRUD/CategoriesCRUD"
import Ingredient from "../pages/Ingredient/Ingredient"
import Product from "../pages/Product/Product"
import Order from "../pages/Order/Order"
import Bill from "../pages/Bill/Bill"
import User from "../pages/User/User"
import HomePage from "../pages/HomePage/HomePage"
import PersonalInfo from "../pages/PersonalInfo/PersonalInfo"
import ChangePassword from "../pages/ChangePassword/ChangePassword"
import Employees from "../pages/Employees/Employees"
import OrderDetail from "../pages/OrderDetail/OrderDetail"
import RankingsProducts from "../pages/Rankings/RankingsProducts/RankingsProducts"
import RankingsClients from "../pages/Rankings/RankingsClients/RankingsClients"
import Movements from "../pages/Rankings/Movements/Movements"
import { ProtectedRoute } from "./ProtectedRoute"
import { UserDetail } from "../pages/UserDetail/UserDetail"
import { UserOrderDetail } from "../pages/UserDetail/UserOrderDetail/UserOrderDetail"
import { BillOrderDetail } from "../pages/Bill/BillOrderDetail/BillOrderDetail"

const homeRoutes = () => {
  // En base al rol se dispondran unas u otras rutas y vistas
  const { rol } = useSelector(userSessionSelector)

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
          rol.includes('_superAdmin') ||
          rol.includes('_admin') ||
          rol.includes('_chef')
        } />}>
        <Route path="/categories" element={<CategoriesCRUD />} />
        <Route path="/ingredients" element={<Ingredient />} />
        <Route path="/products" element={<Product />} />
      </Route>

      <Route element={<ProtectedRoute
        isAllowed={
          rol.includes('_superAdmin') ||
          rol.includes('_admin')
        } />}>
        <Route path="/employees" element={<Employees />} />
        <Route path="/users" element={<User />} />
      </Route>

      <Route element={<ProtectedRoute
        isAllowed={
          rol.includes('_superAdmin') ||
          rol.includes('_admin') ||
          rol.includes('_cashier')
        } />}>
        <Route path="/bills" element={<Bill />} />
        <Route path="/bills/:idOrder" element={<BillOrderDetail/>} />
      </Route>

      {/* ORDER */}
      <Route element={<ProtectedRoute
        isAllowed={
          rol.includes('_superAdmin') ||
          rol.includes('_cashier') ||
          rol.includes('_chef') ||
          rol.includes('_delivery')
        } />}>
        <Route path="/orders" element={<Order />} />
        <Route path="/orders/:idOrder" element={<OrderDetail />} />
      </Route>

      {/* RANKINGS */}
      <Route element={<ProtectedRoute
        isAllowed={
          rol.includes('_superAdmin') ||
          rol.includes('_admin')
        } />}>
        <Route path="/statistics/products" element={<RankingsProducts />} />
        <Route path="/statistics/clients" element={<RankingsClients />} />
        <Route path="/statistics/movements" element={<Movements />} />
        <Route path="/statistics/clients/:idUser" element={<UserDetail />} />
        <Route path="/statistics/clients/:idUser/order/:idOrder" element={<UserOrderDetail />} />
      </Route>

    </Routes>
  )
}

export default homeRoutes