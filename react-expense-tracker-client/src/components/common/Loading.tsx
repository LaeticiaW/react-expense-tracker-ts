import React from 'react'
import {LinearProgress, Fade} from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme : Theme) => createStyles({
    loading: {
        height: '6px',
        marginTop: '-12px',
        marginBottom: '6px'
    }
}))

interface Props {
    isLoading: boolean
}

export default React.memo(function Loading({ isLoading } : Props) {
    const classes = useStyles()

    return (
        <div className={classes.loading}>
            <Fade in={isLoading} style={{ transitionDelay: isLoading ? '800ms' : '0ms', }} unmountOnExit>
                <LinearProgress />
            </Fade>
        </div>
    )
})