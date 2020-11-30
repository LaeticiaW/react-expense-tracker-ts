import * as ActionType from './actions/actionTypes'

// Global Store Types

export interface CurrentUserType {
    id: string,
    firstName: string
    lastName: string
}

export interface UserState {
    currentUser: CurrentUserType
    userName: string
    userLetter: string
    loggedInUserId: string
    isUserInitialized: boolean
    error: string | null
}

export interface GlobalState {
    user: UserState
}

// Action Types

type ActionType = typeof ActionType.GET_CURRENT_USER | typeof ActionType.GET_CURRENT_USER_ERROR |
    typeof ActionType.LOGIN | typeof ActionType.LOGIN_ERROR | typeof ActionType.LOGOUT

// Action Creator Types

type Action = GetCurrentUserAction | GetCurrentUserErrorAction | LoginAction | LoginErrorAction | LogoutAction

export interface GetCurrentUserAction {
    type: typeof ActionType.GET_CURRENT_USER
    payload: {
        currentUser: CurrentUserType
        error: string
    }
}

export interface GetCurrentUserErrorAction {
    type: typeof ActionType.GET_CURRENT_USER_ERROR
    payload: {
        currentUser: CurrentUserType
        error: string
    }
}

// export type GetCurrentUserAsyncAction : () => () => 

export interface LoginAction {
    type: typeof ActionType.LOGIN
    payload: {
        currentUser: CurrentUserType
        error: string
    }
}

export interface LoginErrorAction {
    type: typeof ActionType.LOGIN_ERROR
    payload: {
        currentUser: CurrentUserType
        error: string
    }
}

// export type LoginAsyncAction : () => () => 

export interface LogoutAction {
    type: typeof ActionType.LOGOUT
}
