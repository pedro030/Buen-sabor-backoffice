import { useState } from "react"
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import { userSessionSelector } from "../../state/selectors"

function HomePage() {

    const { rol } = useSelector(userSessionSelector)

    const cards: any = {
        '_superAdmin': ['categories', 'ingredients', 'products', 'orders', 'bills', 'users', 'employees'],
        '_admin': ['categories', 'ingredients', 'products', 'bills', 'users', 'employees'],
        '_cashier': ['orders', 'bills'],
        '_chef': ['categories', 'ingredients', 'products', 'orders'],
        '_delivery': ['orders']
    }

    return (
        <div className="flex flex-row flex-wrap items-center justify-center gap-5 m-5">
            { cards[rol].map((element: any, index:number) => (
             <NavLink key={index} className="flex items-center justify-center tracking-widest text-white transition-all bg-red-500 hover:shadow hover:bg-red-400 rounded-2xl w-72 h-52" to={element}>{element[0].toUpperCase() + element.substring(1)}</NavLink>
            )
            )}
            { (rol === '_admin' || rol === '_superAdmin') && <>
                <NavLink className="flex items-center justify-center tracking-widest text-white transition-all bg-red-500 hover:shadow hover:bg-red-400 rounded-2xl w-72 h-52" to="statistics/products">Products Ranking</NavLink>
                <NavLink className="flex items-center justify-center tracking-widest text-white transition-all bg-red-500 hover:shadow hover:bg-red-400 rounded-2xl w-72 h-52" to="statistics/clients">Clients Ranking</NavLink>
                <NavLink className="flex items-center justify-center tracking-widest text-white transition-all bg-red-500 hover:shadow hover:bg-red-400 rounded-2xl w-72 h-52" to="statistics/movements">Monetary Movements</NavLink>
            </>}
        </div>
    )
}

export default HomePage