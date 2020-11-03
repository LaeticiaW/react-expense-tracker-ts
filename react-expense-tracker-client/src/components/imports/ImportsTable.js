import React, { useState, useCallback } from 'react'
import { SortingState, IntegratedSorting } from '@devexpress/dx-react-grid'
import { Grid, TableHeaderRow, Table } from '@devexpress/dx-react-grid-material-ui'
import { makeStyles } from '@material-ui/core/styles'
import {Paper, IconButton} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import ActionCell from '../common/ActionCell'
import ConfirmDialog from '../common/ConfirmDialog'
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
        paddingLeft: '24px'
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
    { name: 'importDate', title: 'Date' },
    { name: 'fileName', title: 'File Name' },
    { name: 'description', title: 'Description' },
    { name: 'recordCount', title: 'Records' },
    { name: 'actions', title: 'Actions' }
]

const columnExtensions = [
    { columnName: 'importDate', width: '20%' },
    { columnName: 'fileName', width: '30%' },
    { columnName: 'description', width: '20%' },
    { columnName: 'recordCount', align: 'right', width: '15%' },
    { columnName: 'actions', align: 'center', width: '15%' }
]

const sortColumnExtensions = [
    { columnName: 'actions', sortingEnabled: false }
]

const defaultSorting = [
    { columnName: 'importDate', direction: 'desc' }
]

export default React.memo(function ImportsTable({ imports, handleDelete }) {
    const classes = useStyles()

    const [deleteImport, setDeleteImport] = useState({})
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

    // Open the delete confirmation dialog
    const confirmDelete = useCallback((importObj) => {
        setDeleteImport(importObj)
        setConfirmDialogOpen(true)
    }, [setDeleteImport, setConfirmDialogOpen])

    // Close the confirmation dialog and delete the import
    const handleDeleteImport = useCallback(() => {
        setConfirmDialogOpen(false)
        handleDelete(deleteImport)
        setDeleteImport({})
    }, [setConfirmDialogOpen, handleDelete, setDeleteImport, deleteImport])

    // Cancel the confirmation dialog
    const handleCancel = useCallback(() => {
        setConfirmDialogOpen(false)
    }, [setConfirmDialogOpen])

    // Table cell render function with custom actions cell
    const Cell = React.memo((props) => {
        const imp = props.row
        const columnName = props.column.name

        if (columnName === 'actions') {
            return (
                <ActionCell>
                    <IconButton size="small" onClick={() => confirmDelete(imp)}>
                        <DeleteIcon className={clsx(classes.icon, classes.defaultIcon)} />
                    </IconButton>
                </ActionCell>
            )
        }
        return <Table.Cell {...props} />
    })

    return (
        <div>
            <Paper className={classes.container} elevation={0}>
                <Grid rows={imports} columns={columns}>
                    <SortingState
                        defaultSorting={defaultSorting} columnExtensions={sortColumnExtensions} />
                    <IntegratedSorting />
                    <Table
                        height="auto" width="auto"
                        columnExtensions={columnExtensions} cellComponent={Cell} />
                    <TableHeaderRow showSortingControls />
                </Grid>
            </Paper>

            {/* Using div instead of TableFooter component here so that the footer is 'sticky' */}
            <div className={classes.tableFooter}>
                <div className={classes.numRows}>
                    Count: {imports.length}
                </div>
            </div>

            <ConfirmDialog open={confirmDialogOpen}
                title="Confirm Delete Import" msg="Are you sure you want to delete the import summary and all associated expenses?"
                onCancel={handleCancel} onConfirm={handleDeleteImport} />
        </div>
    )
}, (prevProps, nextProps) => {
    return prevProps.imports === nextProps.imports
})
