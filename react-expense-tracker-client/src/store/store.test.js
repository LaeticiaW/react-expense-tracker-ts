import { getCurrentUser, getCurrentUserError, getCurrentUserAsync, login, loginError, loginAsync } from './actions/actions'
import { initialState } from './store'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

// Testing action creators and reducer together with store.dispatch
describe('User Action Creators and User Reducer', () => {

    const user = {
        id: '1',
        firstName: 'First',
        lastName: 'Last'
    }    
  
    // Mock server requests
    const server = setupServer(
        rest.get(/user\/1/, (req, res, ctx) => {
            return res(ctx.json(user))
        }), 
        rest.get(/user\/2/, (req, res, ctx) => {
            return res(ctx.status(500, 'Error Status'), ctx.json(user))
        })      
    )

    let store   
    beforeEach(() => {
        // Create new store before each test
        store = createStore(rootReducer, initialState, applyMiddleware(thunk))              
    })

    // Setup server
    beforeAll(() => { server.listen() })
    afterEach(() => { server.resetHandlers() })
    afterAll(() => server.close())

    test('Dispatch the getCurrentUser action', () => {
        store.dispatch(getCurrentUser(user))
        
        const userState = store.getState().user
               
        expect(userState.currentUser.id).toEqual(user.id)
        expect(userState.currentUser.firstName).toEqual(user.firstName)
        expect(userState.currentUser.lastName).toEqual(user.lastName)
        expect(userState.userLetter).toEqual('F')
        expect(userState.userName).toEqual(user.firstName + ' ' + user.lastName)
        expect(userState.isUserInitialized).toEqual(true)
        expect(userState.error).toBeNull()        
    })

    test('Dispatch the getCurrentUserError action', () => {
        const error = 'This is the error'
        store.dispatch(getCurrentUserError(error))
        
        const userState = store.getState().user
                
        expect(userState.currentUser).toBeNull()      
        expect(userState.userLetter).toEqual('')
        expect(userState.userName).toEqual('')
        expect(userState.isUserInitialized).toEqual(true)
        expect(userState.error).toEqual(error)
    })

    test('Dispatch the getCurrentUserAsync thunk action', async () => {
        await store.dispatch(getCurrentUserAsync(user.id))

        const userState = store.getState().user
                       
        expect(userState.currentUser.id).toEqual(user.id)
        expect(userState.currentUser.firstName).toEqual(user.firstName)
        expect(userState.currentUser.lastName).toEqual(user.lastName)
        expect(userState.userLetter).toEqual('F')
        expect(userState.userName).toEqual(user.firstName + ' ' + user.lastName)
        expect(userState.isUserInitialized).toEqual(true)
        expect(userState.error).toBeNull()
    })

    test('Dispatch the getCurrentUserAsync thunk action error', async () => {  
        // mock console.error to prevent error output when testing error path
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })

        await store.dispatch(getCurrentUserAsync('2'))
        
        const userState = store.getState().user
                
        expect(userState.currentUser).toBeNull()      
        expect(userState.userLetter).toEqual('')
        expect(userState.userName).toEqual('')
        expect(userState.isUserInitialized).toEqual(true)
        expect(userState.error.status).toEqual(500)

        consoleSpy.mockRestore()
    })

    test('Dispatch the login action', () => {

        store.dispatch(login(user))
        
        const userState = store.getState().user
               
        expect(userState.currentUser.id).toEqual(user.id)
        expect(userState.currentUser.firstName).toEqual(user.firstName)
        expect(userState.currentUser.lastName).toEqual(user.lastName)
        expect(userState.userLetter).toEqual('F')
        expect(userState.userName).toEqual(user.firstName + ' ' + user.lastName)        
        expect(userState.error).toBeNull()        
    })

    test('Dispatch the loginError action', () => {
        const error = 'This is the error'
        store.dispatch(loginError(error))
        
        const userState = store.getState().user
                
        expect(userState.currentUser).toBeNull()      
        expect(userState.userLetter).toEqual('')
        expect(userState.userName).toEqual('')        
        expect(userState.error).toEqual(error)
    })

    test('Dispatch the loginAsync thunk action', async () => {
        await store.dispatch(loginAsync(user.id))

        const userState = store.getState().user
                       
        expect(userState.currentUser.id).toEqual(user.id)
        expect(userState.currentUser.firstName).toEqual(user.firstName)
        expect(userState.currentUser.lastName).toEqual(user.lastName)
        expect(userState.userLetter).toEqual('F')
        expect(userState.userName).toEqual(user.firstName + ' ' + user.lastName)        
        expect(userState.error).toBeNull()
    })

    test('Dispatch the loginAsync thunk action error', async () => {  
        // mock console.error to prevent error output when testing error path
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })

        await store.dispatch(loginAsync('2'))
        
        const userState = store.getState().user
                
        expect(userState.currentUser).toBeNull()      
        expect(userState.userLetter).toEqual('')
        expect(userState.userName).toEqual('')        
        expect(userState.error.status).toEqual(500)

        consoleSpy.mockRestore()
    })
})