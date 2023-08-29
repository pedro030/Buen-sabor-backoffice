import { useState, useEffect } from 'react'

export const usePagination = (objects : []) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [objetsPerPage, setObjetsPerPage] = useState(10)
    const lastIndex = currentPage * objetsPerPage
    const beginIndex = lastIndex - objetsPerPage
    const currentObjects = objects.slice(beginIndex, lastIndex)
    let pages = []

    useEffect(() => {
        setCurrentPage(1);
    }, [objects])

    for(let i = 1; i <= Math.ceil(objects.length / objetsPerPage); i++) pages.push(i)

    return [currentObjects, currentPage, objetsPerPage, pages, setCurrentPage]
}