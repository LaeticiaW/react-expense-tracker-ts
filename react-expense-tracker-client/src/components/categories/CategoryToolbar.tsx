import React, { useState, useRef, useContext } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Toolbar, Menu, MenuItem, Divider, Fab } from '@material-ui/core'
import { MoreVert as MoreVertIcon } from '@material-ui/icons'
import AddCategoryDialog from './AddCategoryDialog'
import AddSubcategoryDialog from './AddSubcategoryDialog'
import CategoryService from '../../services/category'
import SnackMsg from '../common/SnackMsg'
import ConfirmDialog from '../common/ConfirmDialog'
import { CategoryActionCreators } from './actions/categoryActions'
import { Category, Subcategory } from 'types'
import { CategoryContext } from './context'

const useStyles = makeStyles((theme: Theme) => createStyles({
    toolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: '#d8ebf7',
        borderRadius: '5px',
        marginBottom: '16px',
        fontSize: '0.875rem'
    }
}))

export default React.memo(function CategoryToolbar() {
    const classes = useStyles()
    const snackRef = useRef<any>(null)
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLAnchorElement | null>(null)
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false)
    const { categoryState, categoryDispatch, getCategories } = useContext(CategoryContext)

    // Open the toolbar menu
    const handleClickMenu = (event : any) => {
        setMenuAnchorEl(event.currentTarget)
    }

    // Close the toolbar menu
    const handleCloseMenu = () => {
        setMenuAnchorEl(null)
    }

    // Show the add category dialog
    const showAddCategoryDialog = () => {
        handleCloseMenu()
        setOpenAddCategoryDialog(true)
    }

    // Show the add subcategory dialog
    const showAddSubcategoryDialog = () => {
        handleCloseMenu()
        categoryDispatch(CategoryActionCreators.showAddSubcategoryDialog())
    }

    // Close the add category dialog, select this category in the table, and retrieve the category list again
    const handleCloseAddCategoryDialog = (newCategory: Category | undefined) => {
        setOpenAddCategoryDialog(false)
        if (newCategory) {
            categoryDispatch(CategoryActionCreators.addCategory(newCategory))
            getCategories()
            snackRef.current.show(false, 'Category added successfully')
        }
    }

    // Close the add subcategory dialog and retrieve the category list again
    const handleCloseAddSubcategoryDialog = (newSubcategory: Subcategory | undefined) => {
        categoryDispatch(CategoryActionCreators.closeAddSubcategoryDialog())
        if (newSubcategory) {
            getCategories()
            if (!isExpanded(newSubcategory.parentCategoryId)) {
                if (newSubcategory.parentCategoryId) {
                    categoryDispatch(CategoryActionCreators.resetExpandedCategoryRows(newSubcategory.parentCategoryId))
                }
            }
            snackRef.current.show(false, 'Subcategory added successfully')
        }
    }

    // Determines if the specified category is currently expanded
    const isExpanded = (categoryId: string | undefined) => {
        if (categoryId) {
            return categoryState.expandedRowIds.filter(itemId => itemId === categoryId).length > 0
        }
        return false
    }

    // Expand all categories in the tree
    const handleExpandAll = () => {
        handleCloseMenu()
        categoryDispatch(CategoryActionCreators.expandAllCategories())
    }

    // Collapse all categories in the tree
    const handleCollapseAll = () => {
        handleCloseMenu()
        categoryDispatch(CategoryActionCreators.collapseAllCategories())
    }

    // Open the confirm delete dialog
    const confirmDelete = () => {
        handleCloseMenu()
        categoryDispatch(CategoryActionCreators.confirmDelete())
    }

    // Cancel the confirm delete dialog
    const handleCancelConfirm = () => {
        categoryDispatch(CategoryActionCreators.cancelConfirmDelete())
    }

    // Delete the selected Category or Subcategory   
    const handleDelete = () => {
        handleCancelConfirm()
        if (categoryState.selectedSubcategory) {
            deleteSubcategory()
        } else {
            deleteCategory()
        }
    }

    // Delete the selected Category   
    const deleteCategory = () => {
        if (categoryState.selectedCategory) {
            CategoryService.deleteCategory(categoryState.selectedCategory._id).then(() => {
                categoryDispatch(CategoryActionCreators.deleteCategory())
                getCategories()
                snackRef.current.show(false, 'Category deleted successfully')
            }).catch((error) => {
                console.error('Error deleting category:', error)
                if (error && error.data && error.data === 'Category in use') {
                    snackRef.current.show(true, 'Category cannot be deleted because it is already assigned to expenses')
                } else {
                    snackRef.current.show(true, 'Error deleting the category')
                }
            })
        }
    }

    // Delete the subcategory from the category object and then save the category    
    const deleteSubcategory = () => {        
        let idx = categoryState.categories.findIndex((cat : Category) => {
            if (categoryState.selectedSubcategory) {
                return cat.treeId === categoryState.selectedSubcategory.parentTreeId
            }
            return false
        })
        if (idx !== -1) {
            // Remove the subcategory from the category object
            const category = categoryState.categories[idx]
            idx = category.subcategories.findIndex((subcat : Subcategory) => {
                if (categoryState.selectedSubcategory) {
                    return subcat.treeId === categoryState.selectedSubcategory.treeId
                }
                return false                
            })
            if (idx !== -1) {
                category.subcategories.splice(idx, 1)
            }

            // Save the category to the db
            CategoryService.updateCategory(category).then((cat) => {
                categoryDispatch(CategoryActionCreators.deleteSubcategory(cat))
                getCategories()
                snackRef.current.show(false, "Subcategory deleted successfully")
            }).catch((error) => {
                console.error('Error deleting subcategory:', error)
                snackRef.current.show(true, 'Error deleting the subcategory')
            })
        }   
    }

    return (
        <>
            <Toolbar className={classes.toolbar}>
                <Fab size="small" color="primary" title="Menu" onClick={handleClickMenu}>
                    <MoreVertIcon />
                </Fab> 
                <Menu id="category-menu" anchorEl={menuAnchorEl} keepMounted
                    open={Boolean(menuAnchorEl)} onClose={handleCloseMenu}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <MenuItem key="1" onClick={showAddCategoryDialog}>Add Category</MenuItem>
                    <MenuItem key="2" onClick={showAddSubcategoryDialog}>Add Subcategory</MenuItem>
                    <MenuItem key="3" onClick={confirmDelete}>Delete</MenuItem>
                    <Divider />
                    <MenuItem key="4" onClick={handleExpandAll}>Expand All Categories</MenuItem>
                    <MenuItem key="5" onClick={handleCollapseAll}>Collapse All Categories</MenuItem>
                </Menu>
            </Toolbar>

            <AddCategoryDialog open={openAddCategoryDialog} onClose={handleCloseAddCategoryDialog} />

            { categoryState.selectedCategory &&
                <AddSubcategoryDialog open={categoryState.openAddSubcategoryDialog} onClose={handleCloseAddSubcategoryDialog}
                    category={categoryState.selectedCategory} />
            }    

            <ConfirmDialog open={categoryState.openConfirmDeleteDialog}
                title="Confirm Delete" msg="Are you sure you want to delete the selected item?"
                onCancel={handleCancelConfirm} onConfirm={handleDelete} />

            <SnackMsg ref={snackRef} />
        </>
    )
})
