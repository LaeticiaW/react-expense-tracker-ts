import React, { useState, useEffect, useRef } from 'react'
import PageHeader from '../common/PageHeader'
import TableFilter from '../common/TableFilter'
import ExpenseSummaryTable from './ExpenseSummaryTable'
import CategoryService from '../../services/category'
import ExpenseService from '../../services/expense'
import DateRangeInput from '../common/DateRangeInput'
import CategorySelect from '../common/CategorySelect'
import SnackMsg from '../common/SnackMsg'
import dayjs from 'dayjs'
import { ExpenseFilter, ExpenseSummary, SelectCategory, SelectCategoryMap, SnackMsgComponent} from 'types'

interface State {
    selectCategories: SelectCategory[]
    expenseTotals: ExpenseSummary[]
    totalExpensesAmount: number
    categoryMap: SelectCategoryMap
    expandedRowIds: (string | number)[]
}

export default React.memo(function ExpenseSummary() {
    const snackRef = useRef<SnackMsgComponent>(null)

    const [filter, setFilter] = useState<ExpenseFilter>({
        categoryIds: [],
        startDate: dayjs().startOf('year').format('YYYY-MM-DD'),
        startDateMs: dayjs().startOf('year').valueOf(),
        endDate: dayjs().endOf('day').format('YYYY-MM-DD'),
        endDateMs: dayjs().endOf('day').valueOf()
    })
    const [state, setState] = useState<State>({
        selectCategories: [],
        expenseTotals: [],
        totalExpensesAmount: 0,
        categoryMap: {},
        expandedRowIds: []
    })

    // Update state
    const updateState = (newState: Partial<State>) => {
        setState(state => ({ ...state, ...newState }))
    }

    // Update filter state
    const updateFilter = (newFilter : Partial<ExpenseFilter>) => {
        setFilter(filter => ({ ...filter, ...newFilter }))
    }

    // Retrieve category select data on mount and whenever the user changes the filter
    useEffect(() => {
        const getCategorySelect = () => {
            CategoryService.getCategorySelect().then((selectCategories) => {
                const categoryMap = selectCategories.reduce((map : SelectCategoryMap, cat : SelectCategory) => {
                    map[cat.value] = cat.label
                    return map
                }, {})
                updateState({
                    selectCategories: selectCategories,
                    categoryMap: categoryMap
                })
            }).catch((error) => {
                console.error('Error retrieving category select:', error)
                snackRef!.current!.show(true, 'Error retrieving category select data')
            })
        }        
        getCategorySelect()
    }, [filter])

    // Retrieve the expense totals data on mount and whenever the user changes the filter
    useEffect(() => {
        const getExpenseTotals = () => {
            ExpenseService.getExpenseTotals(filter).then((expenseTotals : ExpenseSummary[]) => {                        
                updateState({
                    expenseTotals: expenseTotals,
                    totalExpensesAmount: expenseTotals.reduce((sum, cat) => sum + Number(cat.totalAmount), 0),
                    expandedRowIds: []
                })
            }).catch((error) => {
                console.error('Error retrieving expense totals:', error)
                snackRef!.current!.show(true, 'Error retrieving expense summary data')
            })
        }
        getExpenseTotals()
    }, [filter])

    // Update filter state when a filter date changes
    const handleDateChange = (startDate: string, startDateMs : number, endDate : string, endDateMs : number) => {
        updateFilter({            
            startDate: startDate,
            startDateMs: startDateMs,
            endDate: endDate,
            endDateMs: endDateMs
        })
    }

    // Update filter state when the filter category changes
    const handleCategoryChange = (categoryIds : string[]) => {
        updateFilter({ categoryIds: categoryIds })
    }

    // Render function for the filter inputs
    const renderFilterInputs = () => {
        return (
            <div>
                <DateRangeInput startDate={filter.startDate} endDate={filter.endDate} handleDateChange={handleDateChange} />
                <CategorySelect selectCategories={state.selectCategories} categoryMap={state.categoryMap} onChange={handleCategoryChange} />
            </div>
        )
    }

    return (
        <div>
            <PageHeader pageTitle="Expense Summary" />
            <TableFilter renderInputs={renderFilterInputs} />
            <ExpenseSummaryTable
                expenseTotals={state.expenseTotals}
                totalAmount={state.totalExpensesAmount}
                expandedRowIds={state.expandedRowIds} />
            <SnackMsg ref={snackRef} />
        </div>
    )
})