import React from 'react'
import { render, screen } from 'testUtils'
import '@testing-library/jest-dom/extend-expect'
import PageHeader from './PageHeader'

describe('PageHeader.js', () => {    

    test('Renders page header with title', () => {
        const pageTitle = 'This is the page title'
                        
        // Render the component
        render(<PageHeader pageTitle={pageTitle}/>)

        // Verify rendered text field has specified title
        expect(screen.getByText(pageTitle)).toBeInTheDocument()
    })   
})