// Redux
import { useSelector } from "react-redux"
import { userSessionSelector } from "../../state/selectors"

// React Router
import { NavLink } from "react-router-dom"

// Types
import { IButtonsByRol } from "../../interfaces/IButtonsByRol"

function HomePage() {
    // Obtiene el Rol del Empleado para cargarlo unas u otras cards
    const { rol } = useSelector(userSessionSelector)

    // Las cards que se le deben aparecer a cada Rol
    const cards: IButtonsByRol = {
        _superAdmin: ['categories', 'ingredients', 'products', 'orders', 'bills', 'users', 'employees'],
        _admin: ['categories', 'ingredients', 'products', 'bills', 'users', 'employees'],
        _cashier: ['orders'],
        _chef: ['categories', 'ingredients', 'products', 'orders'],
        _delivery: ['orders']
    }

    return (
        <div className="flex flex-row flex-wrap items-center justify-center gap-5 p-5">
            { cards[rol].map((element: string, index:number) => (
             <NavLink key={index} className="flex items-center justify-center w-full h-10 tracking-widest text-white transition-all sm:w-56 sm:h-32 bg-primary hover:shadow hover:opacity-70 rounded-2xl" to={element}>{element[0].toUpperCase() + element.substring(1)}</NavLink>
            )
            )}
            { (rol === '_admin' || rol === '_superAdmin') && <>
                <NavLink className="flex items-center justify-center w-full h-10 tracking-widest text-white transition-all sm:w-56 sm:h-32 bg-primary hover:shadow hover:opacity-70 rounded-2xl" to="statistics/products">Products Ranking</NavLink>
                <NavLink className="flex items-center justify-center w-full h-10 tracking-widest text-white transition-all sm:w-56 sm:h-32 bg-primary hover:shadow hover:opacity-70 rounded-2xl" to="statistics/clients">Clients Ranking</NavLink>
                <NavLink className="flex items-center justify-center w-full h-10 tracking-widest text-white transition-all sm:w-56 sm:h-32 bg-primary hover:shadow hover:opacity-70 rounded-2xl" to="statistics/movements">Monetary Movements</NavLink>
            </>}
        </div>
    )
}

export default HomePage