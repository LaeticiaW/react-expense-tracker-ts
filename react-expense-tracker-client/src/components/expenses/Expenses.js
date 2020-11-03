import React, { useState, useEffect, useRef, useCallback } from 'react'
import PageHeader from '../common/PageHeader'
import TableFilter from '../common/TableFilter'
import ExpensesTable from './ExpensesTable'
import ExpenseDialog from './ExpenseDialog'
import { Fab } from '@material-ui/core'
import { Add as AddIcon } from '@material-ui/icons'
import CategoryService from '../../services/category'
import ExpenseService from '../../services/expense'
import DateRangeInput from '../common/DateRangeInput'
import CategorySelect from '../common/CategorySelect'
import SnackMsg from '../common/SnackMsg'
import dayjs from 'dayjs'

export default React.memo(function Expenses() {
    const snackRef = useRef(null)
    
    const [state, setState] = useState({
        expenses: [],
        selectCategories: [],
        categoryMap: {},
        dialogOpen: false,
        dialogExpense: null,
        refreshExpenses: false
    })
    const [filter, setFilter] = useState({
        categoryIds: [],
        startDate: dayjs().startOf('year').format('YYYY-MM-DD'),
        startDateMs: dayjs().startOf('year').valueOf(),
        endDate: dayjs().endOf('day').format('YYYY-MM-DD'),
        endDateMs: dayjs().endOf('day').valueOf()
    })
    
    // Update state
    const updateState = (newState) => {
        setState(state => ({ ...state, ...newState }))
    }

    // Update the filter state
    const updateFilter = (newFilter) => {
        setFilter(filter => ({ ...filter, ...newFilter }))
    }

    // Retrieve category select data on mount and whenever the user changes the filter
    useEffect(() => {        
        const getCategorySelect = () => {
            return CategoryService.getCategorySelect().then((selectCategories) => {
                const categoryMap = selectCategories.reduce((map, cat) => {
                    map[cat.value] = cat.label
                    return map
                }, {})
                updateState({ selectCategories: selectCategories, categoryMap: categoryMap })
            }).catch((error) => {
                console.error('Error retrieving select categories:', error)
                snackRef.current.show(true, 'Error retrieving category select data')
            })
        }
        getCategorySelect()
    }, [filter, state.refreshExpenses])

    // Retrieve the expense data on mount and whenever the user changes the filter criteria
    useEffect(() => {       
        const getExpenses = () => {
            return ExpenseService.getExpenses(filter, state.categoryMap).then((expenses) => {
                updateState({ expenses: expenses, refreshExpenses: false })
            }).catch((error) => {
                console.error('Error retrieving expenses:', error)
                snackRef.current.show(true, 'Error retrieving expenses')
            })
        }        
        getExpenses()        
    }, [filter, state.refreshExpenses])

    // Open the create expense dialog
    const handleOpenDialog = () => {
        updateState({ dialogExpense: null, dialogOpen: true })
    }

    // Close the create expense dialog
    const handleCloseDialog = useCallback((refresh) => {        
        updateState({ dialogOpen: false, refreshExpenses: refresh })
        if (refresh) {
            snackRef.current.show(false, 'Expense added successfully')            
        }
    }, [])

    // Update filter state when a date changes
    const handleDateChange = useCallback((startDate, startDateMs, endDate, endDateMs) => {
        updateFilter({
            startDate: startDate,
            startDateMs: startDateMs,
            endDate: endDate,
            endDateMs: endDateMs
        })
    }, [])

    // Update filter state when the category changes
    const handleCategoryChange = useCallback((categoryIds) => {
        updateFilter({ categoryIds: categoryIds })
    }, [])

    // Close the expense dialog after an expense is updated, and retrieve the expenses list again
    const handleUpdate = useCallback(() => {
        updateState({ dialogOpen: false, refreshExpenses: true })        
        snackRef.current.show(false, 'Expense updated successfully')        
    }, [])

    // Delete an expense
    const handleDelete = useCallback((expense) => {
        ExpenseService.deleteExpense(expense._id).then(() => {
            updateState({ refreshExpenses: true })
            snackRef.current.show(false, 'Expense deleted successfully')
        }).catch((error) => {
            console.error('Error deleting expense:', error)
            snackRef.current.show(true, 'Error deleting the expense')
        })
    }, [])

    // Render function for the filter inputs
    const renderFilterInputs = () => {
        return (
            <div>
                <DateRangeInput startDate={filter.startDate} endDate={filter.endDate} handleDateChange={handleDateChange} />
                <CategorySelect selectCategories={state.selectCategories} categoryMap={state.categoryMap} handleCategoryChange={handleCategoryChange} />
            </div>
        )
    }

    // Render function for the filter actions
    const renderFilterActions = () => {
        return (
            <div>
                <Fab size="small" color="primary" onClick={handleOpenDialog} className="add-expense-btn"
                    margin="dense" title="Add Expense" role="button">
                    <AddIcon />
                </Fab>
            </div>
        )
    }

    return (
        <div>
            <PageHeader pageTitle="Manage Expenses" />
            <TableFilter renderInputs={renderFilterInputs} renderActions={renderFilterActions} />
            <ExpensesTable expenses={state.expenses} handleUpdate={handleUpdate} handleDelete={handleDelete} />
            {state.dialogOpen &&
                <ExpenseDialog open={state.dialogOpen} handleClose={handleCloseDialog} dialogExpense={state.dialogExpense} />
            }
            <SnackMsg ref={snackRef} />
        </div>
    )
})
