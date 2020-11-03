import React, { useState, ChangeEvent } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@material-ui/core'
import CategoryService from '../../services/category'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import FormTextField from '../common/form/FormTextField'
import { v4 as uuidv4 } from 'uuid'
import Util from '../../services/util'
import { Category, Subcategory } from 'types'

const useStyles = makeStyles((theme: Theme) => createStyles({
    dialogMsg: {
        color: 'red'
    }
}))

interface Props {
    open: boolean
    onClose: (subcategory?: Subcategory) => void
    category: Category
}

interface State {
    subcategoryName: string
    errors: { subcategoryName: string }
    dialogMsg: string
    focus: boolean
    isSaving: boolean
}

export default React.memo(function AddSubcategoryDialog({ open, onClose, category }: Props) {
    const classes = useStyles()

    const [state, setState] = useState<State>({
        subcategoryName: '',
        errors: { subcategoryName: '' },
        dialogMsg: '',
        focus: true,
        isSaving: false
    })

    // Update state
    const updateState = (newState: Partial<State>) => {
        setState(state => ({ ...state, ...newState }))
    }

    // Initialize state every time the dialog opens
    const handleOpen = () => {
        updateState({
            dialogMsg: '', subcategoryName: '', errors: { subcategoryName: '' }, focus: true
        })
    }

    // Turn off field focus after dialog is opened
    const turnOffFocus = () => {
        updateState({ focus: false })
    }

    // Update state and validate the form data as the user enters values
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newState: Partial<State> = { subcategoryName: event.target.value }
        validate(newState)
        updateState(newState)
    }

    // Close the dialog
    const handleCancel = () => {
        onClose()
    }

    // Save the category and close the dialog
    const handleSave = () => {
        if (validate()) {
            updateState({ isSaving: true })
            const newCategory = JSON.parse(JSON.stringify(category))
            const newSubcategory = {
                id: uuidv4(),
                name: state.subcategoryName,
                matchText: [],
                parentCategoryId: category._id
            }
            newCategory.subcategories.push(newSubcategory)

            Util.sortArray(newCategory.subcategories, 'name')

            CategoryService.updateCategory(newCategory).then(() => {
                // Close the dialog
                onClose(newSubcategory)
            }).catch((error) => {
                console.error('Error creating subcategory:', error)
                updateState({ dialogMsg: 'Error creating the Subcategory' })
            }).finally(() => {
                updateState({ isSaving: false })
            })
        }
    }

    // Validate the form data
    const validate = (newState: Partial<State> = state) => {
        updateState({ dialogMsg: '', errors: { subcategoryName: '' } })

        if (!newState.subcategoryName) {
            updateState({ errors: { subcategoryName: "Value is required" } })
            return false
        }

        const isDuplicate = category.subcategories.some(sub => {
            if (newState.subcategoryName) {
                return sub.name.toLowerCase() === newState.subcategoryName.toLowerCase()
            }
            return false
        })
        if (isDuplicate) {
            updateState({ dialogMsg: 'Duplicate subcategory name' })
            return false
        }

        return true
    }

    return (
        <div>
            <Dialog open={open} onEnter={handleOpen} onEntered={turnOffFocus} maxWidth="sm">
                <DialogTitle>Add Subcategory</DialogTitle>
                <Divider />
                <DialogContent>
                    <div className={classes.dialogMsg}>{state.dialogMsg}</div>
                    <form noValidate autoComplete="off">
                        <FormTextField id="category" value={state.subcategoryName} label="Subcategory"
                            onChange={handleChange} error={Boolean(state.errors.subcategoryName)}
                            helperText={state.errors.subcategoryName} focus={state.focus} />
                    </form>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={handleCancel} color="default">Cancel</Button>
                    <Button onClick={handleSave} color="primary" disabled={state.isSaving}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
})
