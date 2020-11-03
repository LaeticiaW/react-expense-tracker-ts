import * as ActionTypes from './actionTypes'
import UserService from '../../services/user'

export function getCurrentUser(user) {    
    return {
        type: ActionTypes.GET_CURRENT_USER,
        payload: {
            currentUser: user,
            error: null
        }
    }
}

export function getCurrentUserError(error) {    
    return {
        type: ActionTypes.GET_CURRENT_USER_ERROR,
        payload: {
            currentUser: null,
            error: error
        }
    }
}

export function getCurrentUserAsync(userId) {
    return (dispatch) => {
        return UserService.getUser(userId).then(user => {
            dispatch(getCurrentUser(user))
        }).catch(error => {            
            dispatch(getCurrentUserError(error))
        })
    }
}

export function login(user) {
    return {
        type: ActionTypes.LOGIN,
        payload: {
            currentUser: user,
            error: null 
        }
    }
}

export function loginError(error) {
    return {
        type: ActionTypes.LOGIN_ERROR,
        payload: {
            currentUser: null,
            error: error
        }
    }
}

export function loginAsync(userId) {
    return (dispatch) => {
        return UserService.getUser(userId).then(user => {
            dispatch(login(user))        
        }).catch(error => {
            dispatch(loginError(error))
        })
    }   
}

export function logout() {
    return {
        type: ActionTypes.LOGOUT        
    }
}
