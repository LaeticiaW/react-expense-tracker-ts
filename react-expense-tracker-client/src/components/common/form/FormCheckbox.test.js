import React from 'react'
import { render, fireEvent, screen } from 'testUtils'
import '@testing-library/jest-dom/extend-expect'
import FormCheckbox from './FormCheckbox'
import userEvent from '@testing-library/user-event'

describe('FormCheckbox.js', () => {    

    test('Renders checkbox with label and true value', () => {
        const id = 'id'
        const label = 'Checkbox Label'
        const value = true
        const onChange = jest.fn()
        
        // Render the component
        render(<FormCheckbox id={id} label={label} value={value} onChange={onChange}/>)

        // Verify rendered checkbox has specified label
        expect(screen.queryByLabelText(label)).toBeInTheDocument()

        // Verify rendered checkbox is checked for true value
        expect(screen.getByLabelText(label).checked).toEqual(true)
    })

    test('Renders checkbox with label and false value', () => {
        const id = 'id'
        const label = 'Checkbox Label'
        const value = false
        const onChange = jest.fn()
        
        // Render the component
        render(<FormCheckbox id={id} label={label} value={value} onChange={onChange}/>)

        // Verify rendered checkbox has specified label
        expect(screen.queryByLabelText(label)).toBeInTheDocument()

        // Verify rendered checkbox is not checked for false value       
        expect(screen.getByLabelText(label).checked).toEqual(false)
    })

    test('Checkbox calls onChange function when clicked', () => {
        const id = 'id'
        const label = 'Checkbox Label'
        const value = true
        const onChange = jest.fn()
        
        // Render the component
        render(<FormCheckbox id={id} label={label} value={value} onChange={onChange}/>)

        // Click on the checkbox and verify that the onChange function is called
        const checkbox = screen.getByLabelText(label)
        // fireEvent.click(checkbox)
        userEvent.click(checkbox)
        expect(onChange).toHaveBeenCalledTimes(1)
    })
})