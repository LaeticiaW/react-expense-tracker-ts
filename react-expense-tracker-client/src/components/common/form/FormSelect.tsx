import React, { ChangeEvent, ReactNode } from 'react'
import {TextField, MenuItem} from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme : Theme) => createStyles({
    select: {
        minWidth: '200px'
    },
    inputControl: {
        width: '300px'
    }
}))

interface Props {
    id: string
    label: string
    value?: string | number
    selectList: Array<any>
    onChange: ((event: ChangeEvent<{ name?: string | undefined; value: unknown; }>, child: ReactNode) => void)
    error: boolean
    helperText: string
    valueProp: string
    labelProp: string
}

export default React.memo(function FormSelect({ id, value, onChange, label, selectList, error, helperText, valueProp, labelProp } : Props) {
    const classes = useStyles()
    const selectValueProp = valueProp ? valueProp : 'value'
    const selectLabelProp = labelProp ? labelProp : 'value'    
    const onBlur: any = onChange
   
    return (
        <div className={classes.inputControl}>
            <TextField select fullWidth id={id} name={id} label={label}
                className={classes.select}
                SelectProps={{ value: value, onChange: onChange, onBlur: onBlur }}
                variant="outlined" margin="dense" error={error} helperText={helperText}>
                {selectList.map(item => (
                    <MenuItem key={item[selectValueProp]} value={item[selectValueProp]}>
                        {item[selectLabelProp]}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    )
})
