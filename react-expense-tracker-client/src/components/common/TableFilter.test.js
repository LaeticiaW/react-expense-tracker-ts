import React from 'react'
import { render, screen } from 'testUtils'
import '@testing-library/jest-dom/extend-expect'
import TableFilter from './TableFilter'

describe('TableFilter.js', () => {    

    test('Renders the table filter with specified inputs and actions', () => {

        let onChange = jest.fn()
        
        const renderInputs = () => {
            return (<input type="text" value="Custom Input" onChange={onChange}/>)
        }
        const renderActions = () => {
            return (<div>Custom Action</div>)
        }
                        
        // Render the component
        render(<TableFilter renderInputs={renderInputs} renderActions={renderActions}/>)

        // Verify input gets rendered
        expect(screen.getByRole('textbox')).toHaveValue('Custom Input')

        // Verify action gets rendered
        expect(screen.getByText('Custom Action')).toBeInTheDocument()
    })   
})