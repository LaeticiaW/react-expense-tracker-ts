import React, { useState, useEffect, useRef, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import SnackMsg from '../../common/SnackMsg'
import Dashlet from '../Dashlet'
import DateRangeInput from '../../common/DateRangeInput'
import dayjs from 'dayjs'
import ExpenseService from '../../../services/expense'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Util from '../../../services/util'

const useStyles = makeStyles(theme => ({
    contentContainer: {
        position: 'relative',
        height: '100%'
    },
    chartContainer: {
        position: 'relative',
        height: '100%',
        '& div[data-highcharts-chart]': {
            height: '100%'
        }
    }
}))

export default React.memo(function ExpensesOverTimeChart({ options }) {
    const classes = useStyles()
    const snackRef = useRef(null)

    const [chartOptions, setChartOptions] = useState({})
    const [filter, setFilter] = useState({
        startDate: dayjs().startOf('year').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        categoryIds: []
    })

  
    // Get the expense time series data    
    const getExpenseTimeSeries = useCallback(() => {
        ExpenseService.getExpenseTimeSeries(filter).then((series) => {
            setChartOptions(getChartOptions(series))
        }).catch((error) => {
            console.error('Error retrieving expense time series:', error)
            snackRef.current.show(true, 'Error retrieving data for Expenses Over Time dashlet')            
        })
    }, [filter])

    // Retrieve the time series data whenever the filter changes
    useEffect(() => {       
        getExpenseTimeSeries()
    }, [filter, getExpenseTimeSeries])
    
    // Get the Highcharts options for the time series line chart    
    const getChartOptions = (series) => {
        const options = {
            chart: {
                type: 'line'
            },
            time: {
                useUTC: false
            },
            title: {
                text: undefined
            },
            tooltip: {
                shared: true,
                valueDecimals: 2,
                headerFormat: '',
                useHTML: true,
                outside: true,
                backgroundColor: 'rgb(239, 239, 239, 1)', // use rgb so can set opacity
                formatter() {
                    return Util.formatTimeSeriesSharedTooltip(this)
                }
            },
            yAxis: {
                title: { text: 'Amount' }
            },
            xAxis: {
                type: 'datetime'
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                useHTML: true
            },
            series: series
        }
        return options
    }

    // Save the filter state when filter values change
    const handleDateChange = useCallback((startDate, startDateMs, endDate, endDateMs) => {
        setFilter(filter => ({
            ...filter,
            startDate: startDate,
            startDateMs: startDateMs,
            endDate: endDate,
            endDateMs: endDateMs
        }))
    }, [])

    // Renders the Dashlet actions
    const renderActions = () => {
        return (
            <DateRangeInput startDate={filter.startDate} endDate={filter.endDate} handleDateChange={handleDateChange} />
        )
    }
   
    return (
        <>
            <Dashlet options={options} renderActions={renderActions}>
                <div className={classes.contentContainer}>
                    <div className={classes.chartContainer}>
                        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                    </div>
                </div>
            </Dashlet>
            <SnackMsg ref={snackRef} />
        </>
    )
})
