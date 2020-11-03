import React from 'react'
import { render, screen } from 'testUtils'
import '@testing-library/jest-dom/extend-expect'
import FormSelect from './FormSelect'
import userEvent from '@testing-library/user-event'

describe('FormSelect.js', () => {    

    test('Renders select with label and value', () => {
        const id = 'id1'
        const label = 'Select Label'
        const value = 'Two'
        const onChange = jest.fn()
        const selectList = [
            { value: 'One' },
            { value: 'Two' },
            { value: 'Three' }
        ]
                        
        // Render the component
        render(<FormSelect id={id} label={label} value={value} selectList={selectList} onChange={onChange}/>)
        
        // Verify rendered select has specified label
        expect(screen.queryByLabelText(label)).toBeInTheDocument()

        // Verify rendered select has specified value
        expect(screen.queryByText('One')).not.toBeInTheDocument()
        expect(screen.queryByText('Two')).toBeInTheDocument()
        expect(screen.queryByText('Three')).not.toBeInTheDocument()       
    })  
  
    test('Select calls onChange function on selection change', async () => {
        const id = 'id2'
        const label = 'Select Label'
        const value = ''
        const onChange = jest.fn()
        const selectList = [
            { value: 'One' },
            { value: 'Two' },
            { value: 'Three' }
        ]
        
        // Render the component
        render(<FormSelect id={id} label={label} value={value} onChange={onChange} selectList={selectList}/>)  

        // Verify that the onChange function is called when the text field value changes
        const select = screen.getByLabelText(label)
        // Click on the select to display the select options
        await userEvent.click(select)         
        // Get option 'Two' and click on it
        const option = screen.getByText('Two') 
        await userEvent.click(option)    
        expect(onChange).toHaveBeenCalledTimes(1)        
    })

    test('Renders selectList with custom property names', () => {
        const id = 'id3'
        const label = 'Select Label'
        const value = '2'
        const onChange = jest.fn()
        const valueProp = 'id'
        const labelProp = 'name'       
        const selectList = [
            { id: '1', name: 'One' },
            { id: '2', name: 'Two' },
            { id: '3', name: 'Three' }
        ]
                        
        // Render the component
        render(<FormSelect id={id} label={label} value={value} selectList={selectList} 
                           onChange={onChange} labelProp={labelProp} valueProp={valueProp}/>)
        
        // Verify rendered select has specified label
        expect(screen.queryByLabelText(label)).toBeInTheDocument()

        // Verify rendered select has specified value
        expect(screen.queryByText('One')).not.toBeInTheDocument()
        expect(screen.queryByText('Two')).toBeInTheDocument()
        expect(screen.queryByText('Three')).not.toBeInTheDocument()       
    })  
})