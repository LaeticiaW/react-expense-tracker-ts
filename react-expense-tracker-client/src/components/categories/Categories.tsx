import React, { useEffect, useRef, useCallback, useReducer, useMemo } from 'react'
import PageHeader from '../common/PageHeader'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import CategoryService from '../../services/category'
import SnackMsg from '../common/SnackMsg'
import { Paper } from '@material-ui/core'
import CategoryDetails from './CategoryDetails'
import SubcategoryDetails from './SubcategoryDetails'
import CategoryTable from './CategoryTable'
import CategoryToolbar from './CategoryToolbar'
import CategoryReducer, { CategoryInitialState } from './actions/categoryReducer'
import { setCategoryData } from './actions/categoryActions'
import { SnackMsgComponent } from 'types'
import { CategoryContext } from './CategoryContext'

const useStyles = makeStyles((theme : Theme) => createStyles({
    container: {
        display: 'flex',
        position: 'relative',
        height: 'calc(100vh - 140px)'
    },
    tree: {
        flex: '0 0 320px',
        height: '100%',
        overflow: 'auto'
    },
    details: {
        height: 'calc(100vh - 140px)',
        marginLeft: '20px',
        width: '100%'
    }
}))

export default React.memo(function Categories() {
    const classes = useStyles()
    const snackRef = useRef<SnackMsgComponent>(null)    
    const [categoryState, categoryDispatch] = useReducer(CategoryReducer, CategoryInitialState)     
      
    // Retrieve the category data
    const getCategories = useCallback(() => {             
        CategoryService.getCategoryInfo().then(({ categories, categoryMap, subcategoryMap }) => { 
            categoryDispatch(setCategoryData(categories, categoryMap, subcategoryMap))             
        }).catch((error) => {
            console.error('Error retrieving categories:', error)           
            snackRef!.current!.show(true, 'Error retrieving categories')                              
        })
    }, [])

    // Create the Category Context data
    const contextData = useMemo(() => { 
        return { categoryState, categoryDispatch, getCategories }
    }, [categoryState, categoryDispatch, getCategories])      

    // Retrieve the categories when component first mounted
    useEffect(() => {        
        getCategories()
    }, [getCategories])
        
    return (
        <CategoryContext.Provider value={contextData}>
            <PageHeader pageTitle="Categories" />
            <div className={classes.container}>
                {/* Left hand side panel with category tree */}
                <Paper elevation={2} className={classes.tree}>
                    <CategoryToolbar/>                       
                    <CategoryTable/>                       
                </Paper>
                {/* Right hand side panel with category/subcategory details */}
                <div className={classes.details}>
                    {categoryState.selectedCategory &&
                        <CategoryDetails category={categoryState.selectedCategory} /> }

                    {categoryState.selectedSubcategory && categoryState.selectedSubcategory.parentCategoryId &&
                        <SubcategoryDetails 
                            subcategory={categoryState.selectedSubcategory} 
                            parentCategory={categoryState.categoryMap[categoryState.selectedSubcategory.parentCategoryId]} />}
                </div>
            </div>
            <SnackMsg ref={snackRef} />
        </CategoryContext.Provider>
    )
})
