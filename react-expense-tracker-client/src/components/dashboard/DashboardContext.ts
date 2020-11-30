import React from 'react'
import { DashletOptions } from 'types'

export interface DashboardContextData {
    minimize: (options : DashletOptions) => void
    maximize: (options : DashletOptions) => void 
}

const DashboardContext = React.createContext({
    minimize: (options: DashletOptions) => { },
    maximize: (options: DashletOptions) => { }
})

export default DashboardContext