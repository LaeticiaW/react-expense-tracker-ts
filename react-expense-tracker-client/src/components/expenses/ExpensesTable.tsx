import React, { useState, useCallback } from 'react'
import { Paper, IconButton } from '@material-ui/core'
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons'
import { Grid, TableHeaderRow, VirtualTable, Table, TableSummaryRow } from '@devexpress/dx-react-grid-material-ui'
import { SortingState, IntegratedSorting, SummaryState, IntegratedSummary, Sorting, 
    DataTypeProvider, DataTypeProviderProps, Column, SummaryItem } from '@devexpress/dx-react-grid'
import ConfirmDialog from '../common/ConfirmDialog'
import ExpenseDialog from './ExpenseDialog'
import ActionCell from '../common/ActionCell'
import Util from '../../services/util'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Expense, SelectCategory, CategoryMap } from 'types'

const useStyles = makeStyles((theme : Theme) => createStyles({
    container: {
        height: 'calc(100vh - 240px)',
        '& > *': {            // for react grid virtualization when want table to fill container
            height: '100%'          
        },
        border: 'solid 1px #efefef'
    }
}))

const columns : Column[] = [
    { name: 'trxDate', title: 'Date' },
    { name: 'description', title: 'Description' },
    { name: 'categoryName', title: 'Category' },
    { name: 'subcategoryName', title: 'Subcategory' },
    { name: 'amount', title: 'Amount' },
    { name: 'actions', title: 'Actions' }
]

const columnExtensions : VirtualTable.ColumnExtension[] = [
    { columnName: 'trxDate' },
    { columnName: 'description', width: 300 },
    { columnName: 'categoryName' },
    { columnName: 'subcategoryName' },
    { columnName: 'amount', align: 'right' },
    { columnName: 'actions', align: 'center' }
]

const sortColumnExtensions : SortingState.ColumnExtension[] = [
    { columnName: 'actions', sortingEnabled: false }
]

const defaultSorting : Sorting[] = [
    { columnName: 'trxDate', direction: 'desc' }
]

const summaryItems : SummaryItem[] = [
    { columnName: 'trxDate', type: 'count' }
]

const decimalColumns : string[] = ['amount']

interface State {
    confirmDialogOpen: boolean
    expenseDialogOpen: boolean
    dialogExpense: Partial<Expense>
    selectCategories: SelectCategory[]
    categoryMap: CategoryMap
}

interface Props {
    expenses: Expense[]
    handleDelete: (expense : Partial<Expense>) => void
    handleUpdate: (refresh: boolean) => void
}

export default React.memo(function ExpensesTable({ expenses, handleDelete, handleUpdate } : Props) {
    const classes = useStyles()

    const [state, setState] = useState<State>({
        confirmDialogOpen: false,
        expenseDialogOpen: false,
        dialogExpense: {},
        selectCategories: [],
        categoryMap: {}
    })    

    // Update state
    const updateState = useCallback((newState : Partial<State>) => {
        setState(state => ({ ...state, ...newState }))
    }, [setState])

    // Get the table row id
    const getRowId = (expense : Expense) : string => expense._id

    // Decimal formatter for a table cell
    const DecimalFormatter : React.FC<DataTypeProvider.ValueFormatterProps> = ({ value }) => {
        return (<span>{Util.formatAmount(value)}</span>)
    }
    const DecimalTypeProvider = (props : DataTypeProviderProps) => (
        <DataTypeProvider formatterComponent={DecimalFormatter} {...props} />
    )

    // Open the confirm delete dialog
    const confirmDelete = (expense : Expense) => {
        updateState({ dialogExpense: expense, confirmDialogOpen: true })
    }

    // Show the update expense dialog
    const showExpenseDialog = (expense : Expense) => {
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
    const handleCloseDialog = useCallback((refresh : boolean) => {
        if (refresh) {
            handleUpdate(refresh)
        }
        updateState({ expenseDialogOpen: false })
    }, [handleUpdate, updateState])

    // Cell component for the table, including a custom actions cell
    const Cell = (props : Table.DataCellProps) => {
        const expense = props.row
        const columnName = props.column.name

        if (columnName === 'actions') {
            return (
                <ActionCell>
                    <IconButton size="small" onClick={() => showExpenseDialog(expense)}>
                        <EditIcon color="primary"/>
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
                        height="auto" 
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
