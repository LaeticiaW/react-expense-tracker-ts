import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => createStyles({
    pageTitle: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        padding: '0px 8px 8px 0px',
        margin: '0px'
    }
}))

interface Props {
    pageTitle: string
}

export default React.memo(function PageHeader({ pageTitle } : Props) {
    const classes = useStyles()
   
    return (
        <h2 className={classes.pageTitle}>{pageTitle}</h2>
    )
})