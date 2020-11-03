import React, { useState, useEffect, useRef, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import SnackMsg from '../../common/SnackMsg'
import Dashlet from '../Dashlet'
import DateRangeInput from '../../common/DateRangeInput'
import dayjs from 'dayjs'
import ExpenseService from '../../../services/expense'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import drilldown from 'highcharts/modules/drilldown'
import Util from '../../../services/util'

drilldown(Highcharts)

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
    },
    chartBottomText: {
        position: 'absolute',
        bottom: '4px',
        right: '0px',
        zIndex: '5',
        opacity: 1,
        backgroundColor: '#ffffff'
    }
}))

export default React.memo(function CategoryExpensesChart({ options }) {
    const classes = useStyles()
    const snackRef = useRef(null)

    const [chartOptions, setChartOptions] = useState({})
    const [filter, setFilter] = useState({
        startDate: dayjs().startOf('year').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        categoryIds: []
    })
    
    // Get the Highcharts options for the time series line chart   
    const getChartOptions = useCallback((categoryTotals) => {
        const totalExpenses = categoryTotals.reduce((sum, cat) => sum + Number(cat.totalAmount), 0)

        const options = {
            chart: { type: 'pie' },
            title: { text: '' },
            tooltip: {
                useHTML: true,
                formatter() {
                    const hdr = '<span style="font-size:11px">' + this.series.name + '</span><br>'
                    const amt = Util.formatAmount(this.point.y)
                    const pct = ` (${Util.formatAmount(this.point.percentage)}%)`
                    return hdr + `${this.point.name}: <b>$${amt}${pct}</b>`
                }
            },
            plotOptions: {
                series: {
                    states: {
                        inactive: { opacity: 1 }
                    }
                },
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                        distance: 25
                    },
                    showInLegend: true,
                    series: {
                        states: {
                            inactive: { opacity: 1 }
                        }
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                useHTML: true
            },
            series: [{
                name: 'Categories',
                data: formatSeriesData(categoryTotals)
            }],
            drilldown: {
                drillUpButton: {
                    position: { y: 0, x: 32 }
                },
                series: formatDrillDownSeries(categoryTotals)
            },
            // Custom property 
            totalExpensesAmount: totalExpenses
        }
        return options
    }, [])
    
    // Retrieve the expense amounts grouped by categories and subcategory for a year or month duration   
    const getExpenseTotals = useCallback(() => {
        ExpenseService.getExpenseTotals(filter).then((categoryTotals) => {
            setChartOptions(getChartOptions(categoryTotals))
        }).catch((error) => {
            console.error('Error retrieving expense totals:', error)
            snackRef.current.show(true, 'Error retrieving data for Expenses by Category dashlet')
        })
    }, [filter, getChartOptions, setChartOptions])


    // Retrieve the expense totals whenever the filter changes
    useEffect(() => {
        // Retrieve the expense totals
        getExpenseTotals()
    }, [filter, getExpenseTotals])
    
     //Format the expense data for a Highcharts time series chart   
    const formatSeriesData = (categoryTotals) => {
        const series = categoryTotals.map((item) => ({
            name: item.categoryName || 'Unknown',
            y: item.totalAmount,
            drilldown: item.categoryName || 'Unknown'
        }))
        return series
    }
    
     // Format the expense data for the drilldown to subcategory level   
    const formatDrillDownSeries = (categoryTotals) => {
        const series = categoryTotals.map((item) => ({
            name: item.categoryName,
            id: item.categoryName,
            data: item.subcategoryTotals.map((subcat) => [subcat.subcategoryName || 'Unknown', subcat.totalAmount])
        }))
        return series
    }

    // Save the filter state when a filter date changes
    const handleDateChange = useCallback((startDate, startDateMs, endDate, endDateMs) => {
        setFilter(filter => ({
            ...filter,
            startDate: startDate,
            startDateMs: startDateMs,
            endDate: endDate,
            endDateMs: endDateMs
        }))
    }, [])

    // Render component for the dashlet actions
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
                    <div className={classes.chartBottomText}>Total Expenses: {Util.formatAmount(chartOptions.totalExpensesAmount)}</div>
                </div>
            </Dashlet>
            <SnackMsg ref={snackRef} />
        </>
    )
})