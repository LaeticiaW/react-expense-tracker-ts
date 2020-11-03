import React from 'react'
import { renderWithStore, waitFor, screen } from 'testUtils'
import '@testing-library/jest-dom/extend-expect'
import AppHeader from './AppHeader.tsx'
import userEvent from '@testing-library/user-event'

describe('AppHeader.tsx', () => {

    const loggedInStoreState =  {
        user: {
            currentUser: {
                id: '1',
                firstName: 'First',
                lastName: 'Last',
            },
            loggedInUserId: '1',
            userName: 'First Last',
            userLetter: 'A'
        }
    }

    const loggedOutStoreState = {
        user: {
            currentUser: {
                id: '1',
                firstName: 'First',
                lastName: 'Last',
            },
            loggedInUserId: '',
            userName: 'First Last',
            userLetter: 'A'
        }
    }

    test('Renders app header with menu icon, title, and avatar icon, when user is logged in', () => {
        
        // Render the component
        renderWithStore(<AppHeader />, loggedInStoreState)

        // Verify app title exists
        expect(screen.queryByText('Expense Tracker')).toBeInTheDocument()

        // Verify side navigation menu button exists
        expect(screen.queryByTitle('Side Navigation')).toBeInTheDocument()

        // Verify avatar icon exists
        expect(screen.queryByTitle('First Last')).toBeInTheDocument()
    })

    test('Renders app header without menu and avatar icons, when user is NOT logged in', () => {
   
        // Render the component
        renderWithStore(<AppHeader />, loggedOutStoreState)

        // Verify app title exists
        expect(screen.queryByText('Expense Tracker')).toBeInTheDocument()

        // Verify side navigation menu button does not exist
        expect(screen.queryByTitle('Side Navigation')).not.toBeInTheDocument()

        // Verify avatar icon does not exist
        expect(screen.queryByTitle('First Last')).not.toBeInTheDocument()
    })

    test('Displays Side Navigation when nav menu clicked', async () => {
        
        // Render the component
        renderWithStore(<AppHeader />, loggedInStoreState)       

        // Click the side navigation menu button
        const menuButton = screen.getByTitle('Side Navigation')
        await userEvent.click(menuButton)
               
        // Verify that the side navigation drawer is displayed      
        expect(screen.getByTestId('side-nav-menu')).toBeInTheDocument()       
    })
})