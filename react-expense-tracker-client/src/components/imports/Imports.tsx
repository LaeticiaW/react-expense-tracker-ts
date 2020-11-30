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
import { SnackMsgComponent, Import, ImportFilter } from 'types'

interface State {
    imports: Import[]
    dialogOpen: boolean
    refreshImports: boolean
}

export default React.memo(function Imports() {
    const snackRef = useRef<SnackMsgComponent>(null)

    const [state, setState] = useState<State>({
        imports: [],
        dialogOpen: false,
        refreshImports: false     
    })
    const [filter, setFilter] = useState<ImportFilter>({
        startDate: dayjs().startOf('year').format('YYYY-MM-DD'),
        startDateMs: dayjs().startOf('year').valueOf(),
        endDate: dayjs().endOf('day').format('YYYY-MM-DD'),
        endDateMs: dayjs().endOf('day').valueOf()
    })

    // Update state
    const updateState = useCallback((newState : Partial<State>) => {
        setState(state => ({ ...state, ...newState }))
    }, [setState])

    // Update filter state
    const updateFilter = (newFilter : Partial<ImportFilter>) => {
        setFilter(filter => ({ ...filter, ...newFilter }))
    }
   
    // Retrieve the imports list on mount and whenever the filter changes
    useEffect(() => {
        const getImports = () => {        
            ImportService.getImports(filter).then((imports : Import[]) => {
                updateState({ imports: imports, refreshImports: false })
            }).catch((error) => {
                console.error('Error retrieving imports:', error)
                snackRef!.current!.show(true, 'Error retrieving imports')            
            })
        }
        getImports()
    }, [filter, state.refreshImports, updateState])   
    
    // Delete the import summary and all associated expenses  
    const handleDelete = (importItem : Import) => {
        ExpenseService.deleteExpensesByImportId(importItem._id).then(() => {
            snackRef!.current!.show(false, 'Imported expenses deleted successfully')
            updateState({ refreshImports: true })
        }).catch((error) => {
            console.error('Error deleting imported expenses:', error)
            snackRef!.current!.show(true, 'Error deleting imported expense')
        })
    }

    // Open the import dialog
    const handleOpenDialog = useCallback(() => {
        updateState({ dialogOpen: true })
    }, [updateState])

    // Close the import dialog
    const handleCloseDialog = (refresh : boolean) => {
        updateState({ dialogOpen: false, refreshImports: true })
        if (refresh) {
            snackRef!.current!.show(false, 'Expenses imported successfully')           
        }        
    }

    // Save filter state when the filter dates change
    const handleDateChange = useCallback((startDate : string, startDateMs : number, endDate : string, endDateMs : number) => {
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
                    title="Import Expenses">
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
