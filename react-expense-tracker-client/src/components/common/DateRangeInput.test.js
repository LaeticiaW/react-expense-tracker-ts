import React, { useState } from 'react'
import { render, screen } from 'testUtils'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import DateRangeInput from './DateRangeInput'
import dayjs from 'dayjs'
import { waitFor } from '../../utils/testUtils'

function TestDateRangeInputWrapper() {
    const [startDate, setStartDate] = useState('2020-10-05')
    const [endDate, setEndDate] = useState('2020-10-08')
    const handleDateChange = (startDateMs, endDateMs) => {
        let start = dayjs(startDateMs).format('YYYY-MM-DD')
        let end = dayjs(endDateMs).format('YYYY-MM-DD')
        setStartDate(start)       
        setEndDate(end)        
    }
    
    return <DateRangeInput startDate={startDate} endDate={endDate} handleDateChange={handleDateChange}/>
}

describe('DateRangeInput.js', () => {    

    test('Renders start and end date inputs and labels', () => {                                
        // Render the component
        render(<TestDateRangeInputWrapper/>)
        
        // Verify start and end date labels and inputs
        expect(screen.getAllByText('Start Date')[0]).toBeInTheDocument()
        expect(screen.getAllByText('End Date')[0]).toBeInTheDocument()
        expect(screen.getAllByRole('textbox').length).toEqual(2)      
        
        // Verify start and end date initial values
        expect(screen.getAllByRole('textbox')[0].value).toEqual('2020-10-05')
        expect(screen.getAllByRole('textbox')[1].value).toEqual('2020-10-08')
    }) 
    
    test.skip('New start date can be selected', async () => {
        // Render the component
        render(<TestDateRangeInputWrapper/>)

        // Get the start date
        let startDate = screen.getAllByRole('textbox')[0] 
        expect(startDate.value).toEqual('2020-10-05')       

        // Click on the start date to display the calendar       
        userEvent.click(startDate)       
        const okButton = screen.getByRole('button', {name: /OK/})
        expect(okButton).toBeInTheDocument()
        userEvent.click(okButton)

        // Verify start date input now contains January 1 (year can vary)
        // Get the start date
        startDate = screen.getAllByRole('textbox')[0]             
        await waitFor(() => { expect(startDate.value).toContain('01-01') })               
    })
})