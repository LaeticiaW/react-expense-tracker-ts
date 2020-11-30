
export interface Category {
    _id: string
    name: string
    subcategories: Subcategory[]   
    treeId?: number
    parentTreeId?: number
}

export type NewCategory = Omit<Category, "_id" | "treeId" | "parentTreeId">

export interface CategorySelectItem {
    _id: string | undefined
    name: string
}

export interface SelectCategory {
    value: string
    label: string
}

export interface Subcategory {
    id: string
    parentCategoryId?: string
    treeId?: number
    parentTreeId?: number
    name: string
    matchText: string[]    
}

export interface CategoryMap {
    [categoryId: string] : Category
} 

export interface SelectCategoryMap {
    [value: string] : string
}

export interface SubcategoryMap {
    [subcategoryId: string] : Subcategory
}

export interface CategoryInfo {
    categories: Category[]
    selectCategories: CategorySelectItem[]
    categoryMap: CategoryMap
    subcategories: Subcategory[]
    subcategoryMap: SubcategoryMap
}

export type CategoryOrSubcategory = Category | Subcategory

export type CategoryOrSubcategoryArray = CategoryOrSubcategory[]
