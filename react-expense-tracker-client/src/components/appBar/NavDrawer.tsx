import React, { useState } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton } from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'
import { NavRoutes } from '../../routes'
import { Link } from 'react-router-dom'
import { GlobalState, UserState } from 'store/types'

const useStyles = makeStyles((theme : Theme) => createStyles({
    root: {
        flexGrow: 1
    },
    flex: {
        flex: 1
    },
    drawerPaper: {
        position: "relative",
        width: 240
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
        color: '#ffffff'
    },
    toolbarMargin: theme.mixins.toolbar,
    aboveDrawer: {
        zIndex: theme.zIndex.drawer + 1
    },
    listIcon: {
        width: '50px !important',
        maxWidth: '50px !important',
        minWidth: '50px !important'
    },
    listText: {
        fontSize: '0.875rem',
        fontWeight: 500       
    }
}))

const NavDrawer = () => {
    const classes = useStyles()   
    const userState = useSelector((state : GlobalState) : UserState => state.user, shallowEqual)

    const [drawerOpen, setDrawerOpen] = useState(false)

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen)
    }

    const list = () => {
        const routeList = NavRoutes.map(route => {
            if (!route.meta.hidden) {
                return (
                    <ListItem button component={Link} to={route.path} key={route.name} onClick={toggleDrawer}>
                        {route.meta.icon &&
                            <ListItemIcon className={classes.listIcon}>{route.meta.icon()}</ListItemIcon>
                        }
                        <ListItemText disableTypography={true} className={classes.listText}>{route.name}</ListItemText>
                    </ListItem>
                )
            }
            return ''
        })

        return (
            <nav className="nav-drawer-list"  data-testid="side-nav-menu">
                <List>
                    {routeList}
                </List>
            </nav>
        )
    }

    return (
        <div className="nav-drawer">
            {userState.loggedInUserId &&
                <>
                    <IconButton onClick={toggleDrawer} className={classes.menuButton} title="Side Navigation"><MenuIcon /></IconButton>
                    <Drawer open={drawerOpen} classes={{ paper: classes.drawerPaper }} BackdropProps={{ invisible: true }}>
                        {list()}
                    </Drawer>
                </>
            }
        </div>
    )
}

export default NavDrawer
