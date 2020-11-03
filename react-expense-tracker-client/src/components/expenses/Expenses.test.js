import React from 'react'
import { render, fireEvent, waitFor, screen, within } from 'testUtils'
import { categoriesData, expensesData } from 'dataUtils'
import '@testing-library/jest-dom/extend-expect'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import Expenses from './Expenses'

describe('Expenses.js', () => {

    const categories = categoriesData
    const expenses = expensesData

    const server = setupServer(
        rest.get(/category/, (req, res, ctx) => {
            return res(ctx.json(categories))
        }),
        rest.get(/expense/, (req, res, ctx) => {
            return res(ctx.json(expenses))
        })
    )

    beforeAll(() => { server.listen() })
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    test('Renders page title, filter, and data table', async () => {

        // Render the component
        render(<Expenses />)

        // Verify page title exists
        expect(screen.getByText('Manage Expenses')).toHaveTextContent('Manage Expenses')

        // Verify filter fields exists
        let toolbar = within(screen.getByRole('toolbar'))
        await waitFor(() => expect(toolbar.getAllByText('Start Date')[0]).toBeInTheDocument())
        expect(toolbar.getAllByText('End Date')[0]).toBeInTheDocument()
        expect(toolbar.getAllByText('Category')[0]).toBeInTheDocument()

        // Verify table headers 
        // Note there is a known issue with react-grid VirtualTable displaying all columns in Jest, so only checking two
        const table = within(screen.getAllByRole('table')[0])
        await waitFor(() => expect(table.getByText('Date')).toBeInTheDocument())
        expect(table.getByText('Description')).toBeInTheDocument()

        // Verify table footer shows correct count
        await waitFor(() => expect(screen.getByText('Count: 3')).toBeInTheDocument())
    })

    test('Displays Add Expense dialog when add button in toolbar is clicked', async (done) => {

        // Render the component
        render(<Expenses />)

        // Verify page title exists
        expect(screen.getByText('Manage Expenses')).toHaveTextContent('Manage Expenses')

        // Wait for table to render with retrieved data
        await waitFor(() => screen.getByText('Count: 3'))

        // Find and click the add button
        const toolbar = within(screen.getByRole('toolbar'))
        const addButton = toolbar.getAllByRole('button')[1]
        fireEvent.click(addButton)

        // Verify the Add Expense dialog is displayed
        const dialog = within(screen.getByRole('dialog'))
        await waitFor(() => dialog.getAllByText('Amount'))
        expect(dialog.getByText('Add Expense')).toBeInTheDocument()        

        // Let settle
        setTimeout(() => { done() }, 0)
    })
})