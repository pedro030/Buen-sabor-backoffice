import { ReactNode } from 'react'

export interface IProtectedRoute {
    isAllowed: boolean,
    children?: ReactNode
}