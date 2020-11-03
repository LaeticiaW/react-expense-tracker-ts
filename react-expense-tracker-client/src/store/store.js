import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

export const initialState = {
    user: {
      currentUser: {
        id: '',
        firstName: '',
        lastName: ''      
      },  
      userName: '',
      userLetter: '',
      loggedInUserId: localStorage.getItem('etLoginToken'),
      isUserInitialized: false,
      error: null  
    }
  }
  
  const globalStore = createStore(rootReducer, initialState, applyMiddleware(thunk))
  // const unsubscribe = globalStore.subscribe(() => console.log('STATE CHANGE: ' + JSON.stringify(globalStore.getState())))
  
  export default globalStore