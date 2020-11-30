import { Dispatch, createContext } from 'react'
import { CategoryState } from 'components/categories/actions/categoryReducer'
import { CategoryActions } from './actions/categoryActions'

export interface CategoryContextData {
    categoryState: CategoryState
    categoryDispatch: Dispatch<CategoryActions>
    getCategories: () => void
}

export const CategoryContext = createContext<CategoryContextData>(null!)