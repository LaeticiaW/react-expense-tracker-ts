import React, { useState, useContext, ReactNode } from 'react'
import { Fab, Toolbar, Divider, Paper } from '@material-ui/core'
import { Fullscreen as FullScreenIcon, FullscreenExit as FullScreenExitIcon } from '@material-ui/icons'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import DashboardContext from './DashboardContext'
import clsx from 'clsx'
import { DashletOptions } from 'types'

const useStyles = makeStyles((theme : Theme) => createStyles({
    dashlet: {
        position: 'relative',
        height: '100%',
        overflow: 'visible',
        minWidth: '440px'
    },
    dashletTitle: {
        fontSize: '1em',
        flexGrow: 1,
        marginTop: '0px',
        marginBottom: '0px',
        paddingTop: '18px',
        paddingBottom: '18px'
    },
    dashletContent: {
        padding: '0px 24px 0px 12px',
        height: 'calc(100% - 64px)',
        overflow: 'visible'
    }
}))

interface Props {
    options: DashletOptions
    renderActions: () => ReactNode,
    children: ReactNode
}

export default React.memo(function Dashlet({ options, renderActions, children } : Props) {
    const classes = useStyles()
    const dashboardContext = useContext(DashboardContext)

    const [expanded, setExpanded] = useState(false)
    
    // Maximize the dashlet
    const handleMaximize = () => {
        setExpanded(true)
        dashboardContext.maximize(options)
    }

    // Minimize the dashlet
    const handleMinimize = () => {
        setExpanded(false)
        dashboardContext.minimize(options)
    }

    // Render function for the standard Maximize/Minimize buttons
    const renderStandardButtons = () => {
        return (
            <div>
                {!expanded &&
                    <Fab size="small" color="primary" onClick={handleMaximize} title="Maximize">
                        <FullScreenIcon />
                    </Fab>
                }
                {expanded &&
                    <Fab size="small" color="primary" onClick={handleMinimize} title="Minimize">
                        <FullScreenExitIcon />
                    </Fab>
                }
            </div>
        )
    }

    return (
        <Paper className={classes.dashlet} elevation={2}>
            <Toolbar>
                <h3 className={clsx(classes.dashletTitle, 'draggableHandle')}>{options.dashletTitle}</h3>
                <div className="draggableCancel">{renderActions()}</div>
                <div className="draggableCancel">{renderStandardButtons()}</div>
            </Toolbar>
            <Divider />
            <div className={classes.dashletContent}>
                {children}
            </div>
        </Paper>
    )
})