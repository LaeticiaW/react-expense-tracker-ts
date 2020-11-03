import React, { useState, MouseEvent } from 'react'
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import * as Actions from '../../store/actions/actions'
import { AppBar, Toolbar, Avatar, Menu, MenuItem } from '@material-ui/core'
import NavDrawer from './NavDrawer'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { GlobalState, UserState } from 'store/types'

const useStyles = makeStyles((theme : Theme) => createStyles({
    appTitle: {
        flexGrow: 1,
        fontSize: '1.25rem'
    },
    avatar: {
        color: theme.palette.primary.main,
        backgroundColor: '#ffffff',
        width: theme.spacing(4),
        height: theme.spacing(4),
    }
}))

const AppHeader = () => {
    const classes = useStyles()    
    const userState = useSelector((state: GlobalState) : UserState => state.user, shallowEqual)
    const dispatch = useDispatch()
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
    
    // Open the avatar menu
    const handleOpenMenu = (event: MouseEvent<HTMLElement>) : void => {
        setMenuAnchorEl(event.currentTarget)
    }

    // Close the avatar menu
    const handleCloseMenu = () => {
        setMenuAnchorEl(null)
    };

    // Logout the user
    const handleLogout = () => {
        handleCloseMenu()              
        dispatch(Actions.logout())
    }

    return (
        <header>
            <AppBar position="fixed" className="app-header">
                <Toolbar>
                    <NavDrawer />
                    <h3 className={classes.appTitle}>Expense Tracker</h3>                  
                    {userState.loggedInUserId &&
                        <>
                            <Avatar className={classes.avatar} onClick={handleOpenMenu} title={userState.userName}>
                                {userState.userLetter}
                            </Avatar>
                            <Menu id="menu" anchorEl={menuAnchorEl} keepMounted
                                open={Boolean(menuAnchorEl)} onClose={handleCloseMenu}
                                getContentAnchorEl={null}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    }
                </Toolbar>
            </AppBar>
        </header>
    )
}

export default AppHeader
