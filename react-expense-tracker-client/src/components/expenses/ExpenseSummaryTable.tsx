import React, { useEffect, useState, FC } from 'react'
import { SortingState, IntegratedSorting, RowDetailState, DataTypeProvider, Sorting, DataTypeProviderProps, Column } from '@devexpress/dx-react-grid'
import { Grid, TableHeaderRow, Table, TableRowDetail } from '@devexpress/dx-react-grid-material-ui'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Util from '../../services/util'
import clsx from 'clsx'
import { ExpenseSummary, SubcategoryTotal } from 'types'

const useStyles = makeStyles((theme: Theme) => createStyles({
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

const columns: Column[] = [
    { name: 'categoryName', title: 'Category' },
    { name: 'totalAmount', title: 'Amount' },
    { name: 'percent', title: 'Percent' }
]

const columnExtensions: Table.ColumnExtension[] = [
    { columnName: 'category', width: '30%' },
    { columnName: 'totalAmount', align: 'right', width: '30%' },
    { columnName: 'percent', align: 'right', width: '30%' }
]

const defaultSorting: Sorting[] = [
    { columnName: 'categoryName', direction: 'asc' }
]

const decimalColumns: string[] = ['percent', 'totalAmount']
const categoryColumns: string[] = ['categoryName']

interface Props {
    expenseTotals: ExpenseSummary[]
    totalAmount: number
    expandedRowIds: (string | number)[]
}

export default React.memo(function ExpenseSummaryTable({ expenseTotals, totalAmount, expandedRowIds }: Props) {
    const classes = useStyles()

    const [expRowIds, setExpRowIds] = useState<(string | number)[]>(expandedRowIds);

    // Keep the expanded row ids updated when the prop changes
    useEffect(() => {
        setExpRowIds(expandedRowIds)
    }, [expandedRowIds])

    // Sort method for the subcategory totals
    const subcatSort = (a: SubcategoryTotal, b: SubcategoryTotal) => {
        if (a.subcategoryName.toLowerCase() < b.subcategoryName.toLowerCase()) {
            return -1
        } else if (a.subcategoryName.toLowerCase() > b.subcategoryName.toLowerCase()) {
            return 1
        } else {
            return 0
        }
    }

    // Table cell decimal formatter
    const DecimalFormatter: FC<DataTypeProvider.ValueFormatterProps> = ({ value }) => {
        return (<span>{Util.formatAmount(value)}</span>)
    }

    const DecimalTypeProvider = (props: DataTypeProviderProps) => (
        <DataTypeProvider formatterComponent={DecimalFormatter} {...props} />
    )

    // Table cell category formatter
    const CategoryFormatter: FC<DataTypeProvider.ValueFormatterProps> = ({ value }) => {
        return (<span>{value || 'Unknown'}</span>)
    }
    const CategoryTypeProvider = (props: DataTypeProviderProps) => (
        <DataTypeProvider formatterComponent={CategoryFormatter} {...props} />
    )

    const onExpandedRowIdsChange = (rowIds: (string | number)[]) => {      
        setExpRowIds(rowIds)
    }

    // Render function for the expanded row detail
    const RowDetail: FC<TableRowDetail.ContentProps> = ({ row }) => {
        const expenseTotal = row

        return (
            <>
                {expenseTotal.subcategoryTotals.length ? (
                    expenseTotal.subcategoryTotals.sort(subcatSort).map((subcat: SubcategoryTotal) => (
                        <div className={classes.row} key={expenseTotal.categoryid + subcat.subcategoryId}>
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
                    <RowDetailState
                        defaultExpandedRowIds={expRowIds}
                        expandedRowIds={expRowIds} 
                        onExpandedRowIdsChange={onExpandedRowIdsChange}/>
                    <Table columnExtensions={columnExtensions} />
                    <TableHeaderRow showSortingControls />
                    <TableRowDetail contentComponent={RowDetail} />
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
