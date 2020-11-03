import moxios from 'moxios'
import UserService from './user'

describe('User Service Tests', () => {
    const userUrl = 'http://localhost:3000/user/'

    const user = {
        _id:"5f4d376abec280c42b1749ce",
        id:"admin1",
        firstName:"Admin",
        lastName:"One"
    }

    const userList = [
        {"_id":"5f4d376abec280c42b1749ce","id":"admin1","firstName":"Admin","lastName":"One"},
        {"_id":"5f4d376abec280c42b1749cf","id":"guest1","firstName":"Guest","lastName":"One"},
        {"_id":"5f4d376abec280c42b1749d0","id":"guest2","firstName":"Guest","lastName":"Two"}
    ]

    beforeEach(function () {
        moxios.install()
    })

    afterEach(function () {
        moxios.uninstall()
    })
    
    describe('Fetch/ Data Tests', () => {

        test('Get a user by id', async () => {
            expect.hasAssertions()

            // Stub the request
            moxios.stubRequest(userUrl + 'admin1', {
                status: 200,
                response: user
            })

            // Return the promise to make the test wait for it to resolve
            const userData = await UserService.getUser('admin1')

            // Verify the returned data
            expect(userData).toEqual(user)
        })

        test('Get a list of users', async () => {
            expect.hasAssertions()

            // Stub the request
            moxios.stubRequest(userUrl, {
                status: 200,
                response: userList
            })

            const data = await UserService.getUsers()

            // Verify the returned data
            expect(data.length).toEqual(3)
            expect(data[0]).toEqual(userList[0])
            expect(data[1]).toEqual(userList[1])
            expect(data[2]).toEqual(userList[2])
        })

        test('Get the current user, using userId from local storage', async () => {
            expect.hasAssertions()

            // Create a spy on localStorage.getItem that returns the userId admin1
            const spy = jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => {
                return 'admin1'
            })

            // Stub the request
            moxios.stubRequest(userUrl + 'admin1', {
                status: 200,
                response: user
            })
            
            // Call the service
            const userData = await UserService.getCurrentUser()

            // Verify the returned data
            expect(userData).toEqual(user)

            spy.mockRestore()
        })
    })

    describe('Login and Logout Tests', () => {

        test('Login the user', async () => {
            expect.hasAssertions()

            // Create a spy on localStorage.setItem
            const spy = jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {})
          
            // Stub the request
            moxios.stubRequest(userUrl + 'admin1', {
                status: 200,
                response: user
            })
            
            let userData = await UserService.login('admin1')

            // Verify the user data was returned
            expect(userData).toEqual(user)
            // Verify localStorage.setItem was called with the userId
            expect(spy).toHaveBeenCalledWith('etLoginToken', 'admin1')

            spy.mockRestore()
        })

        test('Logout the user', () => {
            expect.hasAssertions()

            // Create a spy on localStorage.setItem
            const spy = jest.spyOn(window.localStorage.__proto__, 'removeItem').mockImplementation(() => {})
           
            UserService.logout()

            // Verify that localStorage.remoteItem was called
            expect(spy).toHaveBeenCalledWith('etLoginToken')
        })
    })
    
    describe('Error Handling Tests', () => {

        test('Handle error when retrieving a user by id', (done) => {
            expect.hasAssertions()

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

            // Stub the request
            moxios.stubRequest(userUrl + 'admin1', {
                status: 500,
                response: { response: {} }
            })            
           
            UserService.getUser('admin1').catch(() => {
                expect(consoleSpy).toHaveBeenCalledWith('UserService.getUser error:', expect.anything())               
                consoleSpy.mockRestore()
                done()
            })            
        })

        test('Handle error when retrieving a list of users', (done) => {
            expect.hasAssertions()

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

            // Stub the request
            moxios.stubRequest(userUrl, {
                status: 500,
                response: { response: {} }
            })            
           
            UserService.getUsers().catch(() => {
                expect(consoleSpy).toHaveBeenCalledWith('UserService.getUsers error:', expect.anything())               
                consoleSpy.mockRestore()
                done()
            })            
        })

        test('Handle error when retrieving the current user', (done) => {
            expect.hasAssertions()

            let consoleSpy = jest.spyOn(console, 'error').mockImplementation()
           
            // Create a spy on localStorage.getItem that returns the userId admin1
            const spy = jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => {
                return 'admin1'
            })

            // Stub the request
            moxios.stubRequest(userUrl + 'admin1', {
                status: 500,
                response: { response: {} }
            })
                             
            UserService.getCurrentUser('admin1').catch(() => {                
                expect(consoleSpy).toHaveBeenCalledWith('UserService.getCurrentUser error:', expect.anything())
                consoleSpy.mockRestore()
                spy.mockRestore()
                done()
            })
        })

        test('Handle error when logging in the user', (done) => {
            expect.hasAssertions()

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

            // Stub the request
            moxios.stubRequest(userUrl + 'admin1', {
                status: 500,
                response: { response: {} }
            })            
           
            UserService.login('admin1').catch(() => {
                expect(consoleSpy).toHaveBeenCalledWith('UserService.getUser error:', expect.anything())               
                consoleSpy.mockRestore()
                done()
            })            
        })
        
    })    
})
