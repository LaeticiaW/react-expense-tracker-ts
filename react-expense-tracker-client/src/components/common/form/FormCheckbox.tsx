import React, { ChangeEvent } from 'react'
import { Checkbox, FormControlLabel} from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme : Theme) => createStyles({
    inputControl: {
        width: '300px'
    }
}))

interface Props {
    id: string
    label: string
    value?: boolean
    onChange: (value: boolean, name: string) => void
}

export default React.memo(function FormCheckbox({ id, label, value, onChange } : Props) {
    const classes = useStyles()

    const handleChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        onChange(checked, event.target.name)
    }

    return (
        <div className={classes.inputControl}>
            <FormControlLabel label={label}
                control={
                    <Checkbox checked={value} onChange={handleChange}
                        id={id} name={id} color="primary" />
                }
            />
        </div>
    )
})
