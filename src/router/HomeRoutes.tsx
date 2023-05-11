import { Route, Routes } from "react-router-dom"
import CategoriesCRUD from "../pages/CategoriesCRUD/CategoriesCRUD"
import Measure from "../pages/Measure/Measure"
import Ingredient from "../pages/Ingredient/Ingredient"

const homeRoutes = () => {
  return (
      <Routes>
          <Route path="/categories" element={<CategoriesCRUD />} />
          <Route path="/measures" element={<Measure />} />
          <Route path="/ingredients" element={<Ingredient />} />
      </Routes>
  )
}

export default homeRoutes