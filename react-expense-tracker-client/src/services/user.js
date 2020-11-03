import axios from 'axios'

export default {
    userUrl: 'http://localhost:3000/user/',

    /*
     * Retrieve the user list
     */
    getUsers() {
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
    getUser(userId) {
        return axios.get(this.userUrl + userId).then(response => response.data)
            .catch((error) => {
                console.error('UserService.getUser error:', error.response ? error.response : error)
                return Promise.reject(error.response)
            })
    },

    /*
     * Get the logged in userId from local storage and then retrieve the user object     
     */
    getCurrentUser() {        
        let userId = localStorage.getItem('etLoginToken')              
        if (userId) {            
            return this.getUser(userId).then(user => {                                          
                return user
            }).catch(error => { 
                console.error('UserService.getCurrentUser error:', error)
                return Promise.reject({})                       
            })
        } else {
            return {}
        }            
    },

    /*
     * Login the user
     */
    login(userId) {        
        return this.getUser(userId).then(user => {           
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
    logout() {
        localStorage.removeItem('etLoginToken')       
    }

}
