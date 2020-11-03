import React from 'react'

const DashboardContext = React.createContext({
    minimize: () => { },
    maximize: () => { }
})

export default DashboardContext