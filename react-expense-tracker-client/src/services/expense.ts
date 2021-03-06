import axios from 'axios'
import dayjs from 'dayjs'
import numeral from 'numeral'
import { Expense, NewExpense, ExpenseFilter, ExpenseSummary, ExpenseSummaryRaw, ExpenseTimeseries, 
    ImportExpense, ImportDetails, Series, SeriesData } from 'types'

export default {
    expenseUrl: 'http://localhost:3000/expense/',

    /*
     * Retrieve the expense list
     * @param {object} filter - filter values to use when retrieving the expenses
     */
    getExpenses(filter : ExpenseFilter) {
        return axios.get(this.expenseUrl, {
            params: {
                startDate: filter.startDate,
                endDate: filter.endDate,
                categoryIds: filter.categoryIds
            }
        }).then((response) => {
            const expenses = response.data
            return expenses
        }).catch((error) => {
            console.error('ExpenseService.getExpenses error:', error.response ? error.response : error)
            return Promise.reject(error.response)
        })
    },

    /*
     * Save an expense, either via create or update
     * @param {object} expense - expense object to save
     */
    saveExpense(expense : Partial<Expense>) {
        if ('_id' in expense) {
            return this.updateExpense(expense as Expense)
        }             
        return this.createExpense(expense as NewExpense)
    },

    /*
     * Create a new expense
     * @param {object} expense - expense object to save
     */
    createExpense(expense : NewExpense) {
        return axios({
            url: this.expenseUrl,
            method: 'POST',
            data: expense
        }).then((response) => response.data).catch((error) => {
            console.error('ExpenseService.createExpense error', error.response ? error.response : error)
            return Promise.reject(error.response)
        })
    },

    /*
     * Update an existing expense
     * @param {object} expense - expense object to update
     */
    updateExpense(expense : Expense) {
        return axios({
            url: this.expenseUrl + expense._id,
            method: 'PUT',
            data: expense
        }).then((response) => response.data).catch((error) => {
            console.error('ExpenseService.updateExpense error', error.response ? error.response : error)
            return Promise.reject(error.response)
        })
    },

    /*
     * Delete an expense
     * @param {string} expenseId - id of expense to delete
     */
    deleteExpense(expenseId : number) {
        return axios({
            url: this.expenseUrl + expenseId,
            method: 'DELETE'
        }).then((response) => response.data).catch((error) => {
            console.error('ExpenseService.deleteExpense error', error.response ? error.response : error)
            return Promise.reject(error.response)
        })
    },

    /*
     * Get expense totals by categories and subcategory
     * @param {object} filter - filter values to use when retrieving the expense totals
     */
    getExpenseTotals(filter : ExpenseFilter) {
        return axios.get(`${this.expenseUrl}totals`, {
            params: {
                startDate: filter.startDate,
                endDate: filter.endDate,
                categoryIds: filter.categoryIds ? filter.categoryIds : null
            }
        }).then((response) => {
            const subcatTotals = response.data

            // Reformat the list, calculating the total for each category, and moving the subcategory totals to an object
            let prevCatId = ''
            let totalExpensesAmount = 0
            const expenseTotals = []
            let categoryRecord : ExpenseSummary = null!
            subcatTotals.forEach((record : ExpenseSummaryRaw) => {
                const { categoryId, subcategoryId } = record._id
                const { categoryName, subcategoryName, totalAmount } = record
                    
                if (categoryId !== prevCatId) {
                    if (prevCatId !== '') {
                        expenseTotals.push(JSON.parse(JSON.stringify(categoryRecord)))
                    }
                    categoryRecord = {
                        categoryId,
                        categoryName,
                        totalAmount,
                        subcategoryTotals: []
                    }
                    prevCatId = categoryId
                } else {
                    categoryRecord.totalAmount += totalAmount
                }

                if (subcategoryId && subcategoryName) {
                    categoryRecord.subcategoryTotals.push({
                        subcategoryId,
                        subcategoryName,
                        totalAmount
                    })
                }

                totalExpensesAmount += totalAmount
            })

            if (categoryRecord) {
                expenseTotals.push(JSON.parse(JSON.stringify(categoryRecord)))
            }

            // Calculate the percent for each total Amount
            expenseTotals.forEach((exp) => {
                exp.percent = exp.totalAmount / totalExpensesAmount * 100
            })
                    
            return expenseTotals
        }).catch((error) => {
            console.error('ExpenseService.getExpenseTotals error:', error.response ? error.response : error)
            return Promise.reject(error.response)
        })
    },

    /*
     * Get expense totals by categories and subcategory
     * @param {object} filter - filter values to use when retrieving the expense time series data
     */
    getExpenseTimeSeries(filter : ExpenseFilter) {
        return axios.get(`${this.expenseUrl}timeseries`, {
            params: {
                startDate: filter.startDate,
                endDate: filter.endDate,
                categoryIds: filter.categoryIds ? filter.categoryIds : null
            }
        }).then((response) => {
            const expenses = response.data

            // Convert to Highcharts time series format, one time series per categories
            const series : Series[] = []
            let seriesObj : Series
            let prevCatId : string = '-1' 
            let prevCatName = ''
            let data : SeriesData = []
            let dt : number

            expenses.forEach((exp : ExpenseTimeseries) => {                                       
                if (exp.categoryId === null) {
                    exp.categoryId = ''                    
                }               
                if (exp.categoryId !== prevCatId && prevCatId !== '-1') {
                    seriesObj = {
                        name: prevCatName,
                        data: data
                    }
                    series.push(seriesObj)
                    data = []
                }
                if (exp.trxYear) {
                   dt = dayjs(`${exp.trxYear.toString()}-${numeral(exp.trxMonth).format('00')}-01`, 'YYYY-MM-DD').valueOf()
                   data.push([dt, Number(exp.totalAmount.toFixed(2))])
                }

                prevCatId = exp.categoryId
                prevCatName = exp.categoryName || 'Unknown'
            })
            if (expenses.length) {
                seriesObj = {
                    name: prevCatName,
                    data: data
                }
                series.push(seriesObj)
            }           
            return series
        }).catch((error) => {
            console.error('ExpenseService.getExpenseTimeSeries error:', error.response ? error.response : error)
            return Promise.reject(error.response)
        })
    },

    /*
     * Import expenses uploaded from a csv file
     * @param {array} expenses - array of expense objects
     * @param {object} importDetails - details of the import
     */
    importExpenses(expenses : ImportExpense[], importDetails : ImportDetails) {
        // Normalize the trxDate to 'YYYY-MM-DD' and remove $ from amount
        expenses.forEach((exp : ImportExpense) => {            
            exp.trxDate = dayjs(exp.trxDate, importDetails.dateFormat).format('YYYY-MM-DD')

            // if (typeof exp.amount === 'string' && exp.amount.substr(0, 1) === '$') {
            //     exp.amount = exp.amount.substr(1)
            // }
        })

        return axios.post(`${this.expenseUrl}import`, {
            expenses,
            importDetails
        }).then(() => {

        }).catch(error => {
            console.error('Error importing expenses:', error.response ? error.response : error)
            return Promise.reject(error.response)
        })
    },

    /*
     * Delete expenses by import id
     * @param {string} importId - import id
     */
    deleteExpensesByImportId(importId : string) {
        return axios({
            url: `${this.expenseUrl}import/${importId}`,
            method: 'DELETE'
        }).then((response) => response.data).catch((error) => {
            console.error('ExpenseService.deleteExpensesByImportId error', error.response ? error.response : error)
            return Promise.reject(error.response)
        })
    }
}
