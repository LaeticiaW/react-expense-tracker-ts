import React, { useState, useCallback } from 'react'
import { Paper, IconButton } from '@material-ui/core'
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons'
import { Grid, TableHeaderRow, VirtualTable, TableSummaryRow } from '@devexpress/dx-react-grid-material-ui'
import { SortingState, IntegratedSorting, SummaryState, IntegratedSummary, DataTypeProvider } from '@devexpress/dx-react-grid'
import ConfirmDialog from '../common/ConfirmDialog'
import ExpenseDialog from './ExpenseDialog'
import ActionCell from '../common/ActionCell'
import Util from '../../services/util'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    container: {
        height: 'calc(100vh - 240px)',
        '& > *': {            // for react grid virtualization when want table to fill container
            height: '100%'          
        },
        border: 'solid 1px #efefef'
    }
}))

const columns = [
    { name: 'trxDate', title: 'Date' },
    { name: 'description', title: 'Description' },
    { name: 'categoryName', title: 'Category' },
    { name: 'subcategoryName', title: 'Subcategory' },
    { name: 'amount', title: 'Amount' },
    { name: 'actions', title: 'Actions' }
]

const columnExtensions = [
    { columnName: 'trxDate' },
    { columnName: 'description', width: 300 },
    { columnName: 'categoryName' },
    { columnName: 'subcategoryName' },
    { columnName: 'amount', align: 'right' },
    { columnName: 'actions', align: 'center' }
]

const sortColumnExtensions = [
    { columnName: 'actions', sortingEnabled: false }
]

const defaultSorting = [
    { columnName: 'trxDate', direction: 'desc' }
]

const summaryItems = [
    { columnName: 'trxDate', type: 'count' }
]

const decimalColumns = ['amount']

export default React.memo(function ExpensesTable({ expenses, handleDelete, handleUpdate }) {
    const classes = useStyles()

    const [state, setState] = useState({
        confirmDialogOpen: false,
        expenseDialogOpen: false,
        dialogExpense: {},
        selectCategories: [],
        categoryMap: {}
    })    

    // Update state
    const updateState = useCallback((newState) => {
        setState(state => ({ ...state, ...newState }))
    }, [setState])

    // Get the table row id
    const getRowId = expense => expense._id

    // Decimal formatter for a table cell
    const DecimalFormatter = ({ value }) => (Util.formatAmount(value))
    const DecimalTypeProvider = props => (
        <DataTypeProvider formatterComponent={DecimalFormatter} {...props} />
    )

    // Open the confirm delete dialog
    const confirmDelete = (expense) => {
        updateState({ dialogExpense: expense, confirmDialogOpen: true })
    }

    // Show the update expense dialog
    const showExpenseDialog = (expense) => {
        updateState({ dialogExpense: expense, expenseDialogOpen: true })
    }

    // Clean up after an expense is deleted
    const handleDeleteExpense = () => {
        handleDelete(state.dialogExpense)
        updateState({ dialogExpense: {}, confirmDialogOpen: false })
    }

    // Cancel the confirm delete dialog
    const handleCancel = () => {
        updateState({ confirmDialogOpen: false })
    }

    // Close the expense dialog
    const handleCloseDialog = useCallback((refresh) => {
        if (refresh) {
            handleUpdate(refresh)
        }
        updateState({ expenseDialogOpen: false })
    }, [handleUpdate, updateState])

    // Cell component for the table, including a custom actions cell
    const Cell = (props) => {
        const expense = props.row
        const columnName = props.column.name

        if (columnName === 'actions') {
            return (
                <ActionCell>
                    <IconButton size="small" onClick={() => showExpenseDialog(expense)}>
                        <EditIcon color="primary" className={classes.icon} />
                    </IconButton>
                    <IconButton size="small" onClick={() => confirmDelete(expense)}>
                        <DeleteIcon />
                    </IconButton>
                </ActionCell>
            )
        }
        return <VirtualTable.Cell {...props} />
    }
 
    return (
        <div>
            <Paper className={classes.container} elevation={0}>
                <Grid rows={expenses} columns={columns} getRowId={getRowId}>
                    <SortingState defaultSorting={defaultSorting} columnExtensions={sortColumnExtensions} />
                    <IntegratedSorting />
                    <DecimalTypeProvider for={decimalColumns} />
                    <SummaryState totalItems={summaryItems} />
                    <IntegratedSummary />
                    <VirtualTable
                        height="auto" width="auto"
                        columnExtensions={columnExtensions} cellComponent={Cell} />
                    <TableHeaderRow showSortingControls />
                    <TableSummaryRow />
                </Grid>
            </Paper>

            <ConfirmDialog open={state.confirmDialogOpen}
                title="Confirm Delete Expense" msg="Are you sure you want to delete the expense?"
                onCancel={handleCancel} onConfirm={handleDeleteExpense} />

            {state.expenseDialogOpen &&
                <ExpenseDialog open={state.expenseDialogOpen} handleClose={handleCloseDialog}
                    dialogExpense={state.dialogExpense} />
            }
        </div>
    )
})
