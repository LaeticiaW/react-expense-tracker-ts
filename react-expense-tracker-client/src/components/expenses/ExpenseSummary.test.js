import React from 'react'
import { render, fireEvent, waitFor, screen, within } from 'testUtils'
import { categoriesData, expenseTotalsData } from 'dataUtils'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import ExpenseService from 'expense'
import ExpenseSummary from './ExpenseSummary'

describe('ExpenseSummary.js', () => {

    const categories = categoriesData
    const expenseTotals = expenseTotalsData

    const server = setupServer(
        rest.get(/category/, (req, res, ctx) => {
            return res(ctx.json(categories))
        }),
        rest.get(/expense\/totals/, (req, res, ctx) => {
            return res(ctx.json(expenseTotals))
        })
    )

    beforeAll(() => { server.listen() })
    afterEach(() => { server.resetHandlers() })
    afterAll(() => server.close())

    test('Renders page title, filter, and summary table', async () => {

        // Render the component
        render(<ExpenseSummary />)

        // Verify page title exists
        expect(screen.getByText('Expense Summary')).toHaveTextContent('Expense Summary')

        // Verify filter fields exists
        let toolbar = within(screen.getByRole('toolbar'))       
        await waitFor(() => expect(toolbar.getAllByText('Start Date')[0]).toBeInTheDocument())
        expect(toolbar.getAllByText('End Date')[0]).toBeInTheDocument()
        expect(toolbar.getAllByText('Category')[0]).toBeInTheDocument()

        // Verify table headers   
        const table = within(screen.getByRole('table'))      
        await waitFor(() => expect(table.getByText('Category')).toBeInTheDocument())
        expect(table.getByText('Amount')).toBeInTheDocument()
        expect(table.getByText('Percent')).toBeInTheDocument()

        // Verify table footer shows correct row count and sum
        await waitFor(() => expect(screen.getByText('Count: 3')).toBeInTheDocument())
        expect(screen.getByText('Sum: 841.02')).toBeInTheDocument()
    })

    test('Retrieves the data again when the filter changes', async (done) => {

        const expenseTotalsSpy = jest.spyOn(ExpenseService, 'getExpenseTotals')

        // Render the component
        render(<ExpenseSummary />)

        // Verify page title exists
        expect(screen.getByText('Expense Summary')).toHaveTextContent('Expense Summary')

        // Verify the data has been retrieved once
        expect(expenseTotalsSpy).toHaveBeenCalledTimes(1)

        // Click on the category select
        await waitFor(() => screen.getAllByText('Category'))
        const categorySelect = within(screen.getAllByText('Category')[0].parentNode)              
        const selectButton = categorySelect.getByRole('button')
              
        // Click on the category select 
        fireEvent.mouseDown(selectButton)

        // Wait for the select options to display
        await waitFor(() => screen.getByRole('listbox'))
        const listbox = within(screen.getByRole('listbox'))

        // Get the Auto Option
        const autoOption = listbox.getByText('Auto')
        
        // Click on the Auto option to select it       
        fireEvent.click(autoOption)

        await waitFor(() => expect(expenseTotalsSpy).toHaveBeenCalledTimes(2))        

        // Verify the data has been retrieved again with Auto filter
        expect(expenseTotalsSpy).toHaveBeenCalledTimes(2)
        expect(expenseTotalsSpy).toHaveBeenCalledWith(expect.objectContaining({categoryIds: ["1"]}))

        expenseTotalsSpy.mockRestore()

        // Let settle
        setTimeout(() => {done()}, 0)
    })
})