import * as ActionTypes from './categoryActionType'
import { Category, CategoryMap, Subcategory, SubcategoryMap } from 'types'

export type CategoryActions = AddCategoryAction | CancelConfirmDeleteAction | CloseAddSubcategoryDialogAction |
    CollapseAllCategoriesAction | CollapseCategoryWithSelectedSubcategoryAction | ConfirmDeleteAction |
    DeleteCategoryAction | DeleteSubcategoryAction | ExpandAllCategoriesAction | ExpandCategoryRowsAction |
    InitialSelectCategoryAction | ResetExpandedCategoryRowsAction | ResetSelectedCategoryAction |
    ResetSelectedSubcategoryAction | SelectCategoryAction | SelectSubcategoryAction | SetCategoryDataAction |
    ShowAddSubcategoryDialogAction

export const CategoryActionCreators = {
    addCategory,
    cancelConfirmDelete,
    closeAddSubcategoryDialog,
    collapseAllCategories,
    collapseCategoryWithSelectedSubcategory,
    confirmDelete,
    deleteCategory,
    deleteSubcategory,
    expandAllCategories,
    expandCategoryRows,
    initialSelectCategory,
    resetExpandedCategoryRows,
    resetSelectedCategory,
    resetSelectedSubcategory,
    selectCategory,
    selectSubcategory,
    setCategoryData,
    showAddSubcategoryDialog
}

export interface AddCategoryAction {
    type: typeof ActionTypes.ADD_CATEGORY
    payload: {
        category: Category
    }
}

export function addCategory(category: Category) {
    return {
        type: ActionTypes.ADD_CATEGORY,
        payload: {
            category
        }
    } as AddCategoryAction
}

export interface CancelConfirmDeleteAction {
    type: typeof ActionTypes.CANCEL_CONFIRM_DELETE
}

export function cancelConfirmDelete() {
    return {
        type: ActionTypes.CANCEL_CONFIRM_DELETE
    } as CancelConfirmDeleteAction
}

export interface CloseAddSubcategoryDialogAction {
    type: typeof ActionTypes.CLOSE_ADD_SUBCATEGORY_DIALOG
}

export function closeAddSubcategoryDialog() {
    return {
        type: ActionTypes.CLOSE_ADD_SUBCATEGORY_DIALOG
    } as CloseAddSubcategoryDialogAction
}

export interface CollapseAllCategoriesAction {
    type: typeof ActionTypes.COLLAPSE_ALL_CATEGORIES
}

export function collapseAllCategories() {
    return {
        type: ActionTypes.COLLAPSE_ALL_CATEGORIES
    } as CollapseAllCategoriesAction
}

export interface CollapseCategoryWithSelectedSubcategoryAction {
    type: typeof ActionTypes.COLLAPSE_CATEGORY_WITH_SELECTED_SUBCATEGORY
}

export function collapseCategoryWithSelectedSubcategory() {
    return {
        type: ActionTypes.COLLAPSE_CATEGORY_WITH_SELECTED_SUBCATEGORY
    } as CollapseCategoryWithSelectedSubcategoryAction
}

export interface ConfirmDeleteAction {
    type: typeof ActionTypes.CONFIRM_DELETE
}

export function confirmDelete() {
    return {
        type: ActionTypes.CONFIRM_DELETE
    } as ConfirmDeleteAction
}

export interface DeleteCategoryAction {
    type: typeof ActionTypes.DELETE_CATEGORY
}

export function deleteCategory() {
    return {
        type: ActionTypes.DELETE_CATEGORY
    } as DeleteCategoryAction
}

export interface DeleteSubcategoryAction {
    type: typeof ActionTypes.DELETE_SUBCATEGORY
    payload: {
        category: Category
    }
}

export function deleteSubcategory(category: Category) {
    return {
        type: ActionTypes.DELETE_SUBCATEGORY,
        payload: {
            category
        }
    } as DeleteSubcategoryAction
}

export interface ExpandAllCategoriesAction {
    type: typeof ActionTypes.EXPAND_ALL_CATEGORIES
}

export function expandAllCategories() {
    return {
        type: ActionTypes.EXPAND_ALL_CATEGORIES
    } as ExpandAllCategoriesAction
}

export interface ExpandCategoryRowsAction {
    type: typeof ActionTypes.EXPAND_CATEGORY_ROWS
    payload: {
        expandedRowIds: string[]
    }
}

export function expandCategoryRows(expandedRowIds: (string | number)[]) {
    return {
        type: ActionTypes.EXPAND_CATEGORY_ROWS,
        payload: {
            expandedRowIds
        }
    } as ExpandCategoryRowsAction
}

export interface InitialSelectCategoryAction {
    type: typeof ActionTypes.INITIAL_SELECT_CATEGORY
    payload: {
        category: Category
    }
}

export function initialSelectCategory(category: Category) {
    return {
        type: ActionTypes.INITIAL_SELECT_CATEGORY,
        payload: {
            category
        }
    } as InitialSelectCategoryAction
}

export interface ResetExpandedCategoryRowsAction {
    type: typeof ActionTypes.RESET_EXPANDED_CATEGORY_ROWS
    payload: {
        categoryId: string
    }
}

export function resetExpandedCategoryRows(categoryId: string) {
    return {
        type: ActionTypes.RESET_EXPANDED_CATEGORY_ROWS,
        payload: {
            categoryId
        }
    } as ResetExpandedCategoryRowsAction
}

export interface ResetSelectedCategoryAction {
    type: typeof ActionTypes.RESET_SELECTED_CATEGORY
}

export function resetSelectedCategory() {
    return {
        type: ActionTypes.RESET_SELECTED_CATEGORY
    } as ResetSelectedCategoryAction
}

export interface ResetSelectedSubcategoryAction {
    type: typeof ActionTypes.RESET_SELECTED_SUBCATEGORY
}

export function resetSelectedSubcategory() {
    return {
        type: ActionTypes.RESET_SELECTED_SUBCATEGORY
    } as ResetSelectedSubcategoryAction
}

export interface SelectCategoryAction {
    type: typeof ActionTypes.SELECT_CATEGORY,
    payload: {
        category: Category
    }
}

export function selectCategory(category: Category) {
    return {
        type: ActionTypes.SELECT_CATEGORY,
        payload: {
            category
        }
    } as SelectCategoryAction
}

export interface SelectSubcategoryAction {
    type: typeof ActionTypes.SELECT_SUBCATEGORY
    payload: {
        subcategory: Subcategory
    }
}

export function selectSubcategory(subcategory: Subcategory) {
    return {
        type: ActionTypes.SELECT_SUBCATEGORY,
        payload: {
            subcategory
        }
    } as SelectSubcategoryAction
}

export interface SetCategoryDataAction {
    type: typeof ActionTypes.SET_CATEGORY_DATA
    payload: {
        categories: Category[]
        categoryMap: CategoryMap
        subcategoryMap: SubcategoryMap
    }
}

export function setCategoryData(categories: Category[], categoryMap: CategoryMap, subcategoryMap: SubcategoryMap) {
    return {
        type: ActionTypes.SET_CATEGORY_DATA,
        payload: {
            categories,
            categoryMap,
            subcategoryMap
        }
    } as SetCategoryDataAction
}

export interface ShowAddSubcategoryDialogAction {
    type: typeof ActionTypes.SHOW_ADD_SUBCATEGORY_DIALOG
}

export function showAddSubcategoryDialog() {
    return {
        type: ActionTypes.SHOW_ADD_SUBCATEGORY_DIALOG
    } as ShowAddSubcategoryDialogAction
}
