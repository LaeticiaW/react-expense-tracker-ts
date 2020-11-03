import React, {useState} from 'react'
import { render, screen, waitFor } from 'testUtils'
import '@testing-library/jest-dom/extend-expect'
import Loading from './Loading'

describe('Loading.js', () => {    

    test('Display loading indicator', async () => {
        let isLoading = true        
                        
        // Render the component
        render(<Loading isLoading={isLoading}/>)

        // Verify rendered loading indicator
        expect(screen.queryByRole('progressbar')).toBeInTheDocument()
    }) 
    
    test('Hide loading indicator', async () => {
        let isLoading = false      
                        
        // Render the component
        render(<Loading isLoading={isLoading}/>)

        // Verify rendered loading indicator
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })   
})