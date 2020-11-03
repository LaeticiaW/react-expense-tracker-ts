import React from 'react'
import { render } from '@testing-library/react'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DayjsUtils from "@date-io/dayjs"
import { initialState } from '../store/store'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import rootReducer from '../store/reducers'
import { createBrowserHistory } from "history"
import { Router } from "react-router-dom"

let store

const AllTheProviders = ({ children }) => {
  return (
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      <div style={{ height: '1000px', width: '1000px' }}>
        {children}
      </div>
    </MuiPickersUtilsProvider>
  )
}

const AllTheProvidersWithStore = ({ children }) => {
  const history = createBrowserHistory()
  return (
    <Provider store={store}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Router history={history}>
          <div style={{ height: '1000px', width: '1000px' }}>
            {children}
          </div>
        </Router>
      </MuiPickersUtilsProvider>
    </Provider>
  )
}

const customRender = (ui, options) => {
  render(ui, { wrapper: AllTheProviders, ...options })
}

const customRenderWithStore = (ui, state, options) => {
  // Create store
  store = createTestStore(state)

  // Render component 
  render(ui, { wrapper: AllTheProvidersWithStore, ...options })

  return store
}

export const createTestStore = (state = { user: {} }) => {
  const initState = JSON.parse(JSON.stringify(initialState))
  let userState = Object.assign({}, initState.user, state.user)
  initState.user = userState
  return createStore(rootReducer, initState, applyMiddleware(thunk))
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
export { customRenderWithStore as renderWithStore } 
