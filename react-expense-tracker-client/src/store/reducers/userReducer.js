import * as ActionTypes from '../actions/actionTypes'

function getUserLetter(user) {
    return user && user.id ? user.firstName.substr(0, 1).toUpperCase() : '' 
}

function getUserName(user) {
    return user && user.id ? user.firstName + ' ' + user.lastName : '' 
}

export default function(state = {}, action) {    
    switch (action.type) {       
        case ActionTypes.GET_CURRENT_USER:                          
            return { 
                ...state, 
                currentUser: action.payload.currentUser,
                userName: getUserName(action.payload.currentUser),
                userLetter:  getUserLetter(action.payload.currentUser),
                isUserInitialized: true,
                error: null                
            }
        case ActionTypes.GET_CURRENT_USER_ERROR:                          
            return { 
                ...state, 
                currentUser: null,
                userName: '',
                userLetter:  '',
                isUserInitialized: true,
                error: action.payload.error
            }    
        case ActionTypes.LOGIN:           
            localStorage.setItem('etLoginToken', action.payload.currentUser.id)            
            return { 
                ...state, 
                currentUser: action.payload.currentUser,
                userName: getUserName(action.payload.currentUser),
                userLetter:  getUserLetter(action.payload.currentUser),
                loggedInUserId: action.payload.currentUser.id,
                error: null             
            }
        case ActionTypes.LOGIN_ERROR:           
            localStorage.removeItem('etLoginToken')            
            return { 
                ...state, 
                currentUser: null,
                userName: '',
                userLetter:  '',                
                loggedInUserId: null,
                error: action.payload.error            
            }
        case ActionTypes.LOGOUT:
            localStorage.removeItem('etLoginToken')  
            return { 
                ...state,
                currentUser: null, 
                userName: '',
                userLetter:  '',
                loggedInUserId: null,
                error: null               
            }    
        default:
            return state
    }
}
