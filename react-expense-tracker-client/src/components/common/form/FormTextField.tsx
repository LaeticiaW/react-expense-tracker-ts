import React, { ChangeEvent, FocusEvent } from 'react'
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
    value?: string | number
    onChange: (value: string, name: string) => void
    error: boolean
    helperText: string
    type?: string
    focus?: boolean
}

export default React.memo(function FormTextField({ id, label, value, onChange, error, helperText, type, focus } : Props) {
    const classes = useStyles()
    const fieldType = type ? type : 'text'
    const fieldFocus = focus ? (input: HTMLInputElement) => input && input.focus() : () => {} 
    
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value, event.target.name)    
    }

    const handleBlur = (event : FocusEvent<HTMLInputElement>) => {
        onChange(event.target.value, event.target.name)   
    }
       
    return (
        <div className={classes.inputControl}>
            <TextField variant="outlined" type={fieldType} margin="dense" id={id} name={id} label={label}
                value={value} onChange={handleChange} onBlur={handleBlur} fullWidth
                error={error} helperText={helperText} inputRef={fieldFocus}/>
        </div>
    )
})
