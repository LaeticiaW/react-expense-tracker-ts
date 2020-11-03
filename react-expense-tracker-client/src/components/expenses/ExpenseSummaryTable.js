import React from 'react'
import { SortingState, IntegratedSorting, RowDetailState, DataTypeProvider } from '@devexpress/dx-react-grid'
import { Grid, TableHeaderRow, Table, TableRowDetail } from '@devexpress/dx-react-grid-material-ui'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Util from '../../services/util'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
    container: {
        height: 'calc(100vh - 260px)',
        '& > *': {            // for react grid virtualization when want table to fill container
            height: '100%'
        },
        border: 'solid 1px #efefef',
        borderBottom: 'none'
    },
    row: {
        display: 'flex',
        width: '100%'
    },
    column: {
        width: '40%',
        paddingLeft: '72px'
    },
    columnAmount: {
        width: '30%'
    },
    alignRight: {
        textAlign: 'right'
    },
    tableFooter: {
        padding: '8px 0px 8px 0px',
        fontWeight: 'bold',
        fontSize: '0.75rem',
        display: 'flex',
        backgroundColor: '#ffffff',
        border: 'solid 1px #efefef'
    },
    numRows: {
        width: '40%',
        paddingLeft: '52px'
    },
    totalAmount: {
        width: '30%',
        textAlign: 'right',
        paddingRight: '20px'
    },
    noSubcategories: {
        paddingLeft: '72px'
    }
}))

const columns = [
    { name: 'categoryName', title: 'Category' },
    { name: 'totalAmount', title: 'Amount' },
    { name: 'percent', title: 'Percent' }
]

const columnExtensions = [
    { columnName: 'category', width: '30%' },
    { columnName: 'totalAmount', align: 'right', width: '30%' },
    { columnName: 'percent', align: 'right', width: '30%' }
]

const defaultSorting = [
    { columnName: 'categoryName', direction: 'asc' }
]

const decimalColumns = ['percent', 'totalAmount']
const categoryColumns = ['categoryName']

export default React.memo(function ExpenseSummaryTable({ expenseTotals, totalAmount, expandedRowIds }) {
    const classes = useStyles()

    // Sort method for the subcategory totals
    const subcatSort = (a, b) => {
        if (a.subcategoryName.toLowerCase() < b.subcategoryName.toLowerCase()) {
            return -1
        } else if (a.subcategoryName.toLowerCase() > b.subcategoryName.toLowerCase()) {
            return 1
        } else {
            return 0
        }
    }

    // Table cell decimal formatter
    const DecimalFormatter = ({ value }) => (Util.formatAmount(value))
    const DecimalTypeProvider = props => (
        <DataTypeProvider formatterComponent={DecimalFormatter} {...props} />
    )

    // Table cell category formatter
    const CategoryFormatter = ({ value }) => (value || 'Unknown')
    const CategoryTypeProvider = props => (
        <DataTypeProvider formatterComponent={CategoryFormatter} {...props} />
    )

    // Render function for the expanded row detail
    const RowDetail = ({ row }) => {
        const expenseTotal = row

        return (
            <>
                {expenseTotal.subcategoryTotals.length ? (
                    expenseTotal.subcategoryTotals.sort(subcatSort).map((subcat) => (
                        <div className={classes.row} key={subcat.categoryid + subcat.subcategoryId}>
                            <div className={classes.column}>{subcat.subcategoryName}</div>
                            <div className={clsx(classes.columnAmount, classes.alignRight)}>{Util.formatAmount(subcat.totalAmount)}</div>
                        </div>
                    ))) : (
                        <div className={classes.noSubcategories}>No Subcategory Data</div>
                    )}
            </>
        )
    }
    
    return (
        <div>
            <Paper className={classes.container} elevation={0}>
                <Grid rows={expenseTotals} columns={columns}>
                    <SortingState defaultSorting={defaultSorting} />
                    <IntegratedSorting />
                    <DecimalTypeProvider for={decimalColumns} />
                    <CategoryTypeProvider for={categoryColumns} />
                    <RowDetailState />
                    <Table height="auto" width="auto" columnExtensions={columnExtensions} />
                    <TableHeaderRow showSortingControls />
                    <TableRowDetail
                        contentComponent={RowDetail}
                        defaultExpandedRowIds={expandedRowIds}
                        expandedRowIds={expandedRowIds}
                    />
                </Grid>
            </Paper>

            {/* Using div instead of TableFooter component here so that the footer is 'sticky' */}
            <div className={classes.tableFooter}>
                <div className={classes.numRows}>
                    Count: {expenseTotals.length}
                </div>
                <div className={classes.totalAmount}>
                    {expenseTotals.length ? <span>Sum: {Util.formatAmount(totalAmount)}</span> : ''}
                </div>
            </div>
        </div>
    )
}, (prevProps, nextProps) => {
    return ((prevProps.expenseTotals === nextProps.expenseTotals) &&
        (prevProps.totalAmount === nextProps.totalAmount) &&
        (prevProps.expandedRowIds === nextProps.expandedRowIds))
})
