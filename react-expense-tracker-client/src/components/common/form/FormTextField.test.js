import React from 'react'
import { render, screen } from 'testUtils'
import '@testing-library/jest-dom/extend-expect'
import FormTextField from './FormTextField'
import userEvent from '@testing-library/user-event'

describe('FormTextField.js', () => {    

    test('Renders text field with label and value', () => {
        const id = 'id'
        const label = 'Text Field Label'
        const value = 'Text Field Value'
        const onChange = jest.fn()
                        
        // Render the component
        render(<FormTextField id={id} label={label} value={value} onChange={onChange}/>)

        // Verify rendered text field has specified label
        expect(screen.queryByLabelText(label)).toBeInTheDocument()

        // Verify rendered text field has specified value
        expect(screen.getByLabelText(label)).toHaveValue(value)
        
        // Verify rendered text field is not focused
        expect(screen.getByLabelText(label)).not.toHaveFocus()
    })    

    test('Text field is focused when rendered', () => {
        const id = 'id'
        const label = 'Text Field Label'
        const value = 'Text Field Value'
        const onChange = jest.fn()        
        const focus = true
                
        // Render the component
        render(<FormTextField id={id} label={label} value={value} onChange={onChange} focus={focus}/>)       

        // Verify rendered text field is focused
        expect(screen.getByLabelText(label)).toHaveFocus()
    })    

    test('Text field calls onChange function on input', async () => {
        const id = 'id'
        const label = 'Text Field Label'
        const value = ''
        const onChange = jest.fn()
        const newValue = 'Changed Value' 
        
        // Render the component
        render(<FormTextField id={id} label={label} value={value} onChange={onChange}/>)  

        // Verify that the onChange function is called when the text field value changes
        const textField = screen.getByLabelText(label)               
        await userEvent.type(textField, newValue)     
        expect(onChange).toHaveBeenCalledTimes((newValue.length))                
    })
})