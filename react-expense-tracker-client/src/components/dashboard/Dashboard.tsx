import React, { useRef } from 'react'
import PageHeader from '../common/PageHeader'
import { Responsive, WidthProvider } from 'react-grid-layout'
import CategoryExpensesChart from './dashlets/CategoryExpensesChart'
import ExpensesOverTimeChart from './dashlets/ExpensesOverTimeChart'
import DashboardContext from './DashboardContext'
import { DashletOptions } from 'types'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './Dashboard.css'

const ResponsiveGridLayout: any = WidthProvider(Responsive)

const defaultSize = {
    w: 6, h: 4, minH: 3, minW: 4
}

export default React.memo(function Dashboard() {
    const dbRef = useRef<HTMLDivElement>(null)

    // Render function for the Category Expenses chart
    const renderCategoryExpensesChart = (options: DashletOptions) => {
        return <CategoryExpensesChart options={options} />
    }

    // Render function for the Expenses Over Time chart
    const renderExpensesOverTimeChart = (options: DashletOptions) => {
        return <ExpensesOverTimeChart options={options} />
    }

    // Dashboard layout config
    const dashboardLayout = [
        { x: 0, y: 0, i: '0', ...defaultSize, component: renderCategoryExpensesChart, dashletTitle: 'Expenses By Category' },
        { x: 6, y: 0, i: '1', ...defaultSize, component: renderExpensesOverTimeChart, dashletTitle: 'Expenses Over Time' }
    ]

    // Dashboard options
    const dashboardOptions = {
        cols: { lg: 12, md: 12, sm: 6, xs: 6, xxs: 6 },
        rowHeight: 80,
        layouts: { lg: dashboardLayout },
        margin: [24, 24, 24, 24],
        draggableHandle: '.draggableHandle',
        draggableCancel: '.draggableCancel',
        onResize: onResize
    }

    // Maximize the specified dashlet - make it full screen size    
    const maximizeDashlet = (dashletOptions: DashletOptions) => {
        if (dbRef.current) {
            // Set the'hide' class on all grid items except for the one that is maximized
            const elList: HTMLElement[] = Array.from(dbRef.current.querySelectorAll('.react-grid-item'))
            elList.forEach((el: HTMLElement) => {
                el.classList.add('hide')
            })
            // Remove the 'hide' class and add the 'maximize' class to the dashlet 
            const dashletEl = dbRef.current.querySelector(`.react-grid-item[id="${dashletOptions.i}"]`)
            if (dashletEl) {
                dashletEl.classList.remove('hide')
                dashletEl.classList.add('maximize')
            }
            triggerWindowResize()
        }
    }

    // Minimize the dashlet    
    const minimizeDashlet = () => {
        if (dbRef.current) {  
            // Remove the 'hide' and 'maximize' classes from all dashlets          
            const elList: HTMLElement[] = Array.from(dbRef.current.querySelectorAll('.react-grid-item'))
            elList.forEach((el: HTMLElement) => {
                el.classList.remove('hide')
                el.classList.remove('maximize')
            })
            triggerWindowResize()
        }
    }

    // Trigger a window resize event.  This is used to fix chart rendering issues.
    const triggerWindowResize = () => {
        setTimeout(() => {
            // For Chrome, Firefox, and IE > 11               
            window.dispatchEvent(new Event('resize'))
        }, 0)
    }

    // When the dashboard is resized, trigger the window resize event
    function onResize() {
        triggerWindowResize()
    }

    // Dashboard context with minimize and maximize dashlet functions
    const dashboardContext = {
        minimize: minimizeDashlet,
        maximize: maximizeDashlet
    }

    return (
        <div ref={dbRef}>
            <PageHeader pageTitle="Dashboard" />

            <DashboardContext.Provider value={dashboardContext}>
                <ResponsiveGridLayout {...dashboardOptions}>
                    {dashboardLayout.map((item) => (
                        <div key={item.i} id={item.i}>{item.component(item)}</div>
                    ))}
                </ResponsiveGridLayout>
            </DashboardContext.Provider>
        </div>
    )
})