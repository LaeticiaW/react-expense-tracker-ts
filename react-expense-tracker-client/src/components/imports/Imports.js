import React, { useState, useEffect, useRef, useCallback } from 'react'
import PageHeader from '../common/PageHeader'
import TableFilter from '../common/TableFilter'
import SnackMsg from '../common/SnackMsg'
import DateRangeInput from '../common/DateRangeInput'
import dayjs from 'dayjs'
import ImportService from '../../services/import'
import ExpenseService from '../../services/expense'
import Fab from '@material-ui/core/Fab'
import ImportDialog from './ImportDialog'
import ImportsTable from './ImportsTable'
import PublishIcon from '@material-ui/icons/Publish'

export default React.memo(function Imports() {
    const snackRef = useRef(null)

    const [state, setState] = useState({
        imports: [],
        dialogOpen: false,
        refreshImports: false     
    })
    const [filter, setFilter] = useState({
        startDate: dayjs().startOf('year').format('YYYY-MM-DD'),
        startDateMs: dayjs().startOf('year').valueOf(),
        endDate: dayjs().endOf('day').format('YYYY-MM-DD'),
        endDateMs: dayjs().endOf('day').valueOf()
    })

    // Update state
    const updateState = useCallback((newState) => {
        setState(state => ({ ...state, ...newState }))
    }, [setState])

    // Update filter state
    const updateFilter = (newFilter) => {
        setFilter(filter => ({ ...filter, ...newFilter }))
    }
   
    // Retrieve the imports list on mount and whenever the filter changes
    useEffect(() => {
        const getImports = () => {        
            ImportService.getImports(filter).then((imports) => {
                updateState({ imports: imports, refreshImports: false })
            }).catch((error) => {
                console.error('Error retrieving imports:', error)
                snackRef.current.show(true, 'Error retrieving imports')            
            })
        }
        getImports()
    }, [filter, state.refreshImports, updateState])   
    
    // Delete the import summary and all associated expenses  
    const handleDelete = (importItem) => {
        ExpenseService.deleteExpensesByImportId(importItem._id).then(() => {
            snackRef.current.show(false, 'Imported expenses deleted successfully')
            updateState({ refreshImports: true })
        }).catch((error) => {
            console.error('Error deleting imported expenses:', error)
            snackRef.current.show(true, 'Error deleting imported expense')
        })
    }

    // Open the import dialog
    const handleOpenDialog = useCallback(() => {
        updateState({ dialogOpen: true })
    }, [updateState])

    // Close the import dialog
    const handleCloseDialog = (refresh) => {
        updateState({ dialogOpen: false, refreshImports: true })
        if (refresh) {
            snackRef.current.show(false, 'Expenses imported successfully')           
        }        
    }

    // Save filter state when the filter dates change
    const handleDateChange = useCallback((startDate, startDateMs, endDate, endDateMs) => {
        updateFilter({
            startDate: startDate,
            startDateMs: startDateMs,
            endDate: endDate,
            endDateMs: endDateMs
        })
    }, [])

    // Render function for the filter inputs
    const renderFilterInputs = () => {
        return (
            <div>
                <DateRangeInput startDate={filter.startDate} endDate={filter.endDate} handleDateChange={handleDateChange} />
            </div>
        )
    }

    // Render function for the filter actions
    const renderFilterActions = () => {
        return (
            <>
                <Fab size="small" color="primary" onClick={handleOpenDialog} className="import-expenses-btn"
                    margin="dense" title="Import Expenses">
                    <PublishIcon />
                </Fab>
                <ImportDialog open={state.dialogOpen} handleClose={handleCloseDialog} />
            </>
        )
    }
    
    return (
        <div>            
            <PageHeader pageTitle="Imports" />
            <TableFilter renderInputs={renderFilterInputs} renderActions={renderFilterActions}/>           
            <ImportsTable imports={state.imports} handleDelete={handleDelete} />
            <SnackMsg ref={snackRef} />
        </div>
    )
})
