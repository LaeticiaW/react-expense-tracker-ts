import React, { MouseEvent } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme : Theme) => createStyles({
    content: {
        padding: '16px 0px'
    }
}))

interface Props {
    open: boolean,
    title: string,
    msg: string | JSX.Element,
    onConfirm: (event : MouseEvent<HTMLButtonElement>) => void,
    onCancel: () => void
}

export default React.memo(function ConfirmDialog (props : Props) {
    const { open, title, msg, onConfirm, onCancel } = props
    const classes = useStyles()

    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            <Divider />
            <DialogContent>
                <div className={classes.content}>{msg}</div>
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button onClick={onCancel} color="default">Cancel</Button>
                <Button onClick={onConfirm} color="primary">OK</Button>
            </DialogActions>
        </Dialog>
    )
})
