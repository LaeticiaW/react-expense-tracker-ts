import React, { ReactNode } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'

const useStyles = makeStyles((theme : Theme) => createStyles({   
    toolbar: {
        display: 'flex',
        alignItems: 'space-between',
        backgroundColor: '#d8ebf7',       
        borderRadius: '5px',
        marginBottom: '16px'  
    },   
    rightItems: {
        marginLeft: 'auto'
    }
}))

interface Props {
    renderInputs: () => ReactNode
    renderActions: () => ReactNode
}

export default React.memo(function TableFilter({renderInputs, renderActions} : Props) {
  const classes = useStyles()
    
  return (         
        <Toolbar className={classes.toolbar} role="toolbar">  
            <div>
                {renderInputs()}   
            </div>                     
            <div className={classes.rightItems}>
                {renderActions ? renderActions() : ''}
            </div>                   
          </Toolbar>        
  )
})
