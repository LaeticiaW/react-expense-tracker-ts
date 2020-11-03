import React, { ReactNode } from 'react'
import TableCell from '@material-ui/core/TableCell'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme : Theme) => createStyles({
    cell: {
      whiteSpace: 'nowrap',
      textAlign: 'center',
      fontSize: '16px'      
    }
}))

interface Props {
    children: ReactNode
}

export default React.memo(function ActionCell(props : Props) {
  const classes = useStyles()

  return (
    <TableCell {...props} className={classes.cell} >      
      {props.children}      
    </TableCell>
  )
})
