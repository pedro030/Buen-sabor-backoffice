// React
import { useState, useEffect } from 'react'

// Hook personalizado para gestionar la paginación de una lista de objetos.
// Recibe la lista de objetos que se va a paginar.
export const usePagination = <T>(objects : T[]) => {
    // State: Determina la pagina actual sobre la que está parado el usuario.
    const [currentPage, setCurrentPage] = useState(1)
    // State: Cantidad de objetos que tendrá cada página.
    const [objetsPerPage, setObjetsPerPage] = useState(10)
    // Calculo para obtener los objetos a mostrar por página.
    const lastIndex = currentPage * objetsPerPage
    const beginIndex = lastIndex - objetsPerPage
    const currentObjects = objects.slice(beginIndex, lastIndex)
    let pages = []

    // Cada vez que cambie el estado de los objetos se setea la pagina 1
    useEffect(() => {
        setCurrentPage(1);
    }, [objects])

    // Bucle para generar un array de números representando las páginas disponibles.
    for(let i = 1; i <= Math.ceil(objects.length / objetsPerPage); i++) pages.push(i)

    // Retorna un objeto que contiene datos relacionados con la paginación, como la página actual, cantidad de objetos por página, objetos actuales que tiene la pagina seleccionada y la cantidad de páginas disponibles.
    return { currentObjects, currentPage, objetsPerPage, pages, setCurrentPage }
}