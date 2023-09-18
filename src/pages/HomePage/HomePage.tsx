import { useState } from "react"
import { NavLink } from "react-router-dom"

function HomePage() {

    const [rol, setRol] = useState('SuperAdmin')

    const cards: any = {
        'SuperAdmin': ['categories', 'ingredients', 'products', 'orders', 'bills', 'users', 'employees'],
        'Admin': ['categories', 'ingredients', 'products', 'bills', 'users', 'employees', 'stock'],
        'Cashier': ['orders', 'bills'],
        'Chef': ['categories', 'ingredients', 'products', 'orders', 'stock'],
        'Delivery': ['orders']
    }

    return (
        <div className="flex flex-row flex-wrap items-center justify-center gap-5 m-5">
            { cards[rol].map((i: any) => {
                return <NavLink className="flex items-center justify-center tracking-widest text-white transition-all bg-red-500 hover:shadow hover:bg-red-400 rounded-2xl w-72 h-52" to={i}>{i[0].toUpperCase() + i.substring(1)}</NavLink>
            })}
            { (rol === 'Admin' || rol === 'SuperAdmin') && <>
                <NavLink className="flex items-center justify-center tracking-widest text-white transition-all bg-red-500 hover:shadow hover:bg-red-400 rounded-2xl w-72 h-52" to="statistics/products">Products Ranking</NavLink>
                <NavLink className="flex items-center justify-center tracking-widest text-white transition-all bg-red-500 hover:shadow hover:bg-red-400 rounded-2xl w-72 h-52" to="statistics/clients">Clients Ranking</NavLink>
                <NavLink className="flex items-center justify-center tracking-widest text-white transition-all bg-red-500 hover:shadow hover:bg-red-400 rounded-2xl w-72 h-52" to="statistics/movements">Monetary Movements</NavLink>
            </>}
        </div>
    )
}

export default HomePage