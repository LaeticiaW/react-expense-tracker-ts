import React, { useEffect, useContext } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { TreeDataState, CustomTreeData, SelectionState, Column } from '@devexpress/dx-react-grid'
import { Grid, Table, TableTreeColumn, TableSelection } from '@devexpress/dx-react-grid-material-ui'
import { IconButton } from '@material-ui/core'
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons'
import ActionCell from '../common/ActionCell'
import { CategoryActionCreators } from './actions/categoryActions'
import { Category, Subcategory } from 'types'
import { CategoryContext } from './CategoryContext'

const useStyles = makeStyles((theme : Theme) => createStyles({
    icon: {
        fontSize: '16px !important'
    }
}))

const getChildRows = (row: Category, rootRows : Category[]) => (row ? row.subcategories : rootRows)
const getRowId = (row : Category & {id: string}) => row.parentTreeId ? row.id : row._id

const columns : Column[] = [
    { name: 'name' },
    { name: 'actions' }
]

const columnExtensions :  Table.ColumnExtension[] = [
    { columnName: 'name', width: 250 },
    { columnName: 'actions', width: 50 }
]

export default React.memo(function CategoryTable() {
    const classes = useStyles()
    const prevSelectedItemId : string | null = null
    const { categoryState, categoryDispatch } = useContext(CategoryContext);

    // When the category list is first retrieved, set the selected category.  Every time the category list
    // changes, reset the selected category and subcategory to the current data.
    useEffect(() => {
        if (categoryState.categories.length && !categoryState.selectedCategory && !categoryState.selectedSubcategory) {
            categoryDispatch(CategoryActionCreators.initialSelectCategory(categoryState.categories[0]))           
        } else {
            // Reset the selected category and subcategory so that the reference matches the categories list
            if (categoryState.selectedCategory) {
                categoryDispatch(CategoryActionCreators.resetSelectedCategory())                               
            }
            if (categoryState.selectedSubcategory) {
                categoryDispatch(CategoryActionCreators.resetSelectedSubcategory())                
            }
        }
    }, [categoryDispatch, categoryState.categories, categoryState.selectedCategory, categoryState.selectedSubcategory])

    
    // Determine if the specified item is a category or a subcategory     
    const isSubcategory = (item : Subcategory | Category) : item is Subcategory => {
        if (item.parentTreeId !== undefined) {
            return true
        }
        return false
    }

    // When an item is selected in the category tree, set the selected category or subcategory
    const handleItemSelected = (selectedItemIds : (string | number)[]) => {
        let selectedItemId : string | number | null = prevSelectedItemId
        if (selectedItemIds.length) {
            selectedItemId = selectedItemIds[selectedItemIds.length - 1]
        }

        let selectedItem : Category | Subcategory = undefined!
        if (selectedItemId) {
            selectedItem = categoryState.categoryMap[selectedItemId]|| 
                categoryState.subcategoryMap[selectedItemId]
        }

        if (selectedItem) {
            if (isSubcategory(selectedItem)) {                
                categoryDispatch(CategoryActionCreators.selectSubcategory(selectedItem))                
            } else {
                categoryDispatch(CategoryActionCreators.selectCategory(selectedItem))                
            }
        }
    }

    // Maintain the expanded row ids when the user expands or collapses a category.  If the current selected item
    // is a subcategory, but the user is collapsing the parent category, change the selection to the parent category 
    const handleExpandedRowsChange = (expandedRowIds : (string | number)[]) => {
        if (categoryState.selectedSubcategory && categoryState.selectedSubcategory.parentCategoryId) {
            if (!expandedRowIds.includes(categoryState.selectedSubcategory.parentCategoryId)) {
                categoryDispatch(CategoryActionCreators.collapseCategoryWithSelectedSubcategory())                
            }
        }
        setExpandedRowIds(expandedRowIds)
    }

    // Show the add subcategory dialog
    const showAddSubcategoryDialog = () => {
        categoryDispatch(CategoryActionCreators.showAddSubcategoryDialog())        
    }

    // Set the expanded row ids
    const setExpandedRowIds = (expandedRowIds: (string | number)[]) => {
        categoryDispatch(CategoryActionCreators.expandCategoryRows(expandedRowIds))        
    }

    // Open the Confirm Delete dialog
    const confirmDelete = () => {
        categoryDispatch(CategoryActionCreators.confirmDelete())       
    }

    // Cell component with custom Actions cell
    const Cell = (props : Table.DataCellProps) => {
        const columnName = props.column.name
        const item = props.row
        const isCategory = !!item._id

        let isSelectedItem: boolean = false
        if (isCategory && categoryState.selectedCategory) {
            isSelectedItem = item._id === categoryState.selectedCategory._id
        } else if (categoryState.selectedSubcategory) {
            isSelectedItem = item.id === categoryState.selectedSubcategory.id
        }

        if (columnName === 'actions') {
            return (
                <ActionCell>
                    {isSelectedItem && isCategory &&
                        <IconButton size="small" onClick={showAddSubcategoryDialog}>
                            <AddIcon color="primary" className={classes.icon} />
                        </IconButton>
                    }
                    {isSelectedItem &&
                        <IconButton size="small" onClick={confirmDelete}>
                            <DeleteIcon className={classes.icon} />
                        </IconButton>
                    }
                </ActionCell >
            )
        }
        return <Table.Cell {...props} />
    }
    
    return (
        <Grid rows={categoryState.categories} columns={columns} getRowId={getRowId}>
            <SelectionState selection={categoryState.selectedItemIds} onSelectionChange={handleItemSelected} />
            <TreeDataState expandedRowIds={categoryState.expandedRowIds} onExpandedRowIdsChange={handleExpandedRowsChange} />
            <CustomTreeData getChildRows={getChildRows} />
            <Table columnExtensions={columnExtensions} cellComponent={Cell} />
            <TableSelection selectByRowClick highlightRow showSelectionColumn={false} />
            <TableTreeColumn for="name" />
        </Grid>
    )
})
