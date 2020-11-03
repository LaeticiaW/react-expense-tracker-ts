import React from 'react'
import { render, fireEvent, waitFor, screen, within } from 'testUtils'
import { expenseTotalsSummaryData } from 'dataUtils'
import ExpenseSummaryTable from './ExpenseSummaryTable'

describe('ExpenseSummaryTable.js', () => {   
    
    test('Table displays with header, rows, and footer', async () => {

        const expenseTotalsSummary = expenseTotalsSummaryData   
        const expandedRowIds = []
        const totalAmount = 999

        // Render the component
        render(<ExpenseSummaryTable expenseTotals={expenseTotalsSummary} totalAmount={totalAmount} expandedRowIds={expandedRowIds} />)
               
        // Wait for the table to render
        await waitFor(() => {screen.getByRole('table')}) 

        // Verify table header columns       
        expect(screen.getByText('Category')).toBeInTheDocument()
        expect(screen.getByText('Amount')).toBeInTheDocument()
        expect(screen.getByText('Percent')).toBeInTheDocument()

        // Verify table footer shows correct count       
        await waitFor(() => expect(screen.getByText('Count: 3')).toBeInTheDocument())

        // Verify 4 table rows (1 header row, 3 data rows)
        expect(document.querySelectorAll('tr').length).toEqual(4)        
    })
   
    test('Expands detail row when expand button clicked', async () => {
        const expenseTotalsSummary = expenseTotalsSummaryData   
        const expandedRowIds = []
        const totalAmount = 999

        // Render the component
        render(<ExpenseSummaryTable expenseTotals={expenseTotalsSummary} totalAmount={totalAmount} expandedRowIds={expandedRowIds} />)
               
        // Wait for the table to render
        await waitFor(() => {screen.getByRole('table')}) 
 
        // Verify table footer shows correct count       
        await waitFor(() => expect(screen.getByText('Count: 3')).toBeInTheDocument())

         // Get first data row and click on it to expand
         let row = document.querySelectorAll('tr')
         expect (row.length).toEqual(4)
         const expandButton = row[1].querySelector('button')
         fireEvent.click(expandButton)

        // Verify that an additional detail row has been added to the table
        await waitFor(() => expect(document.querySelectorAll('tr').length).toEqual(5))            
    })
})