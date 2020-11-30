import axios from 'axios'
import { User } from 'types'

export default {
    userUrl: 'http://localhost:3000/user/',

    /*
     * Retrieve the user list
     */
    getUsers() : Promise<User[]> {
        return axios.get(this.userUrl).then(response => response.data)            
            .catch((error) => {
                console.error('UserService.getUsers error:', error.response ? error.response : error)
                return Promise.reject(error.response)
            })
    },

    /*
     * Retrieve a specific user by user id
     * @param {number} userId - user id
     */
    getUser(userId : string) : Promise<User> {
        return axios.get(this.userUrl + userId).then(response => response.data)
            .catch((error) => {
                console.error('UserService.getUser error:', error.response ? error.response : error)
                return Promise.reject(error.response)
            })
    },

    /*
     * Get the logged in userId from local storage and then retrieve the user object     
     */
    getCurrentUser() : Promise<User> {        
        let userId = localStorage.getItem('etLoginToken')              
        if (userId) {            
            return this.getUser(userId).then((user : User) => {                                          
                return user
            }).catch(error => { 
                console.error('UserService.getCurrentUser error:', error)
                return Promise.reject({})                       
            })
        } else {
            return new Promise((resolve, reject) => {
                Promise.resolve({id: '', firstName: '', lastName: ''})
            })
        }            
    },

    /*
     * Login the user
     */
    login(userId : string) : Promise<User> {        
        return this.getUser(userId).then((user : User)  => {           
            localStorage.setItem('etLoginToken', user.id)  
            return user                         
        }).catch(error => {
            console.error('UserService.login error:', error)
                return Promise.reject({})   
        })
    },

    /*
     * Logout the user
     */
    logout() : void {
        localStorage.removeItem('etLoginToken')       
    }

}
