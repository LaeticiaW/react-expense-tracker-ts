import { Dispatch, createContext } from 'react'
import { CategoryState } from 'components/categories/actions/categoryReducer'

export interface CategoryContextData {
    categoryState: CategoryState
    categoryDispatch: Dispatch<any>
}