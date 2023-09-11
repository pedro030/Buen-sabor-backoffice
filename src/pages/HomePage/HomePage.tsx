import { NavLink } from "react-router-dom"

function HomePage() {

    return (
        <div className="flex flex-row flex-wrap items-center justify-center gap-5 m-5">
            <NavLink className="flex items-center justify-center tracking-widest text-white transition-all bg-red-500 hover:shadow hover:bg-red-400 rounded-2xl w-72 h-52" to="employees">Employees</NavLink>
            <NavLink className="flex items-center justify-center tracking-widest text-white transition-all bg-red-500 hover:shadow hover:bg-red-400 rounded-2xl w-72 h-52" to="users">Clients</NavLink>
            <NavLink className="flex items-center justify-center tracking-widest text-white transition-all bg-red-500 hover:shadow hover:bg-red-400 rounded-2xl w-72 h-52" to="products">Products</NavLink>
            <NavLink className="flex items-center justify-center tracking-widest text-white transition-all bg-red-500 hover:shadow hover:bg-red-400 rounded-2xl w-72 h-52" to="categories">Categories</NavLink>
            <NavLink className="flex items-center justify-center tracking-widest text-white transition-all bg-red-500 hover:shadow hover:bg-red-400 rounded-2xl w-72 h-52" to="statistics/products">Products Ranking</NavLink>
            <NavLink className="flex items-center justify-center tracking-widest text-white transition-all bg-red-500 hover:shadow hover:bg-red-400 rounded-2xl w-72 h-52" to="statistics/client">Clients Ranking</NavLink>
            <NavLink className="flex items-center justify-center tracking-widest text-white transition-all bg-red-500 hover:shadow hover:bg-red-400 rounded-2xl w-72 h-52" to="statistics/movements">Monetary Movements</NavLink>            
        </div>
    )
}

export default HomePage