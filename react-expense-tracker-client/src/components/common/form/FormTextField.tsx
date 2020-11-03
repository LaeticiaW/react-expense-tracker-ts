import React, { ChangeEvent } from 'react'
import TextField from '@material-ui/core/TextField'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme : Theme) => createStyles({
    inputControl: {
        width: '300px'
    }
}))

interface Props {
    id: string
    label: string
    value?: string
    onChange: (event : ChangeEvent<HTMLInputElement>) => void
    error: boolean
    helperText: string
    type?: string
    focus?: boolean
}

export default React.memo(function FormTextField({ id, label, value, onChange, error, helperText, type, focus } : Props) {
    const classes = useStyles()
    const fieldType = type ? type : 'text'
    const fieldFocus = focus ? (input: HTMLInputElement) => input && input.focus() : () => {} 
    const onBlur: any = onChange
       
    return (
        <div className={classes.inputControl}>
            <TextField variant="outlined" type={fieldType} margin="dense" id={id} name={id} label={label}
                value={value} onChange={onChange} onBlur={onBlur} fullWidth
                error={error} helperText={helperText} inputRef={fieldFocus}/>
        </div>
    )
})
