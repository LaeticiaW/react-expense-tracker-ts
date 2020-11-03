import React, { ChangeEvent } from 'react'
import { TextField, IconButton, InputAdornment } from '@material-ui/core'
import { AttachFile as AttachFileIcon } from '@material-ui/icons'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme : Theme) => createStyles({
    inputControl: {
        width: '300px'
    },
    fileInput: {
        display: 'flex'
    },
    inputRoot: {
        paddingLeft: '0px'
    }
}))

interface Props {
    id: string
    label: string
    value?: File
    onChange: (event : ChangeEvent<HTMLInputElement>) => void
    error: boolean
    helperText: string  
}

export default React.memo(function CategorySelect({ id, value, onChange, label, error, helperText } : Props) {
    const classes = useStyles()
    const onBlur: any = onChange

    return (
        <div className={classes.inputControl}>
            <div className={classes.fileInput}>
                <TextField variant="outlined" margin="dense" id={id} name={id} label={label}
                    value={value ? value.name : ''} onBlur={onBlur} fullWidth
                    error={error} helperText={helperText}
                    InputProps={{
                        classes: { root: classes.inputRoot },
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconButton component="label">
                                    <AttachFileIcon />
                                    <input type="file" hidden onChange={onChange} />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </div>
        </div>
    )
})
