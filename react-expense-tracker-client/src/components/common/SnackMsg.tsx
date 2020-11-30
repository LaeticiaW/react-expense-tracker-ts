import React, { RefObject } from 'react'
import {Snackbar, SnackbarContent, IconButton} from '@material-ui/core'
import {Close as CloseIcon} from '@material-ui/icons'
import { withStyles, Theme } from '@material-ui/core/styles'
import { SnackMsgComponent } from 'types'

const useStyles = (theme : Theme) => ({
    snackbar: {
        backgroundColor: theme.palette.primary.main
    },
    snackbarError: {
        backgroundColor: theme.palette.error.main
    },
    close: {
        color: '#ffffff'
    }
})

interface Props {
    ref: RefObject<SnackMsgComponent>   
}

interface State {
    error: boolean
    open: boolean
    msg: string
}

class SnackMsg extends React.PureComponent<Props, State> {
    constructor(props : Props) {
        super(props)
       
        this.state = {
            error: false as boolean,
            open: false as boolean,
            msg: '' as string
        } 
        
        this.handleClose = this.handleClose.bind(this)  
        this.show = this.show.bind(this)      
    }   

    // Close the snack message
    handleClose() {
        this.setState({ open: false })      
    }

    // Show the snack message.
    // Note: This message can be called via a ref from a parent component
    show(error : boolean, msg : string) {
        this.setState({
            error: error,
            msg: msg,
            open: true
        })       
    }

    render() {
        const { classes } : any = this.props

        return (
            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
                open={this.state.open} key={this.state.msg}
                autoHideDuration={2000} onClose={this.handleClose}>
                <SnackbarContent message={this.state.msg} className={this.state.error ? classes.snackbarError : classes.snackbar}
                    action={[
                        <IconButton key="close" className={classes.close} onClick={this.handleClose}>
                            <CloseIcon />
                        </IconButton>
                    ]} />
            </Snackbar>
        )
    }
}

export default withStyles(useStyles)(SnackMsg)
