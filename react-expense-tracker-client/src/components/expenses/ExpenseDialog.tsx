import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@material-ui/core'
import CategoryService from '../../services/category'
import ExpenseService from '../../services/expense'
import FormTextField from '../common/form/FormTextField'
import FormSelect from '../common/form/FormSelect'
import { DatePicker } from '@material-ui/pickers'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import dayjs from 'dayjs'
import { Expense, Category, Subcategory, CategoryMap } from 'types'

const useStyles = makeStyles((theme : Theme) => createStyles({
    inputControl: {
        width: '200px'
    },
    dialogMsg: {
        color: 'red'
    }
}))

const defaultExpense = {
    trxDate: dayjs().format('YYYY-MM-DD'),
    description: '',
    categoryId: '',
    subcategoryId: '',
    amount: 0
} as Partial<Expense>

const defaultErrors = {
    trxDate: '',
    description: '',
    categoryId: '',
    subcategoryId: '',
    amount: ''
}

interface State {
    categories: Category[]
    subcategories: Subcategory[]
    categoryMap: CategoryMap
    formSaved: boolean
    expense: Partial<Expense>
    isCreate: boolean
}

interface Props {
    open: boolean,
    handleClose: (refresh: boolean ) => void
    dialogExpense: Partial<Expense>
}

export default React.memo(function ExpenseDialog({ open, handleClose, dialogExpense } : Props) {
    const classes = useStyles()

    const [state, setState] = useState<State>({
        categories: [],
        subcategories: [],
        categoryMap: {},
        formSaved: false,
        expense: { ...defaultExpense },
        isCreate: false
    }) 
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [dialogMsg, setDialogMsg] = useState('')
    
    // Update state
    const updateState = (newState : Partial<State>) => {
        setState((state : State) => ({ ...state, ...newState }))
    }

    // Get the default expense
    function getDefaultExpense() {
        return {
            ...defaultExpense,
            trxDate: dayjs().format('YYYY-MM-DD')
        }
    }

    // Initialize state whenever the dialog opens
    const handleOpen = () => {       
        let isCreate = dialogExpense === null
               
        let initialExpense = isCreate ? getDefaultExpense() : dialogExpense       
       
        // Initialize variables, temporarily set categoryId/subcategoryId to empty string until the
        // select values are retrieved (to prevent material-ui select warnings)                
        updateState({
            isCreate: isCreate, formSaved: false, categoryMap: {}, categories: [],
            subcategories: [], expense: { ...initialExpense, categoryId: '', subcategoryId: '' }
        })
       
        setErrors(defaultErrors)
        setDialogMsg('')

        // Retrieve the categories for the category and subcategory selects
        getCategories(initialExpense)
    }

    // Retrieve the categories
    const getCategories = (initialExpense : Partial<Expense>) => {
        CategoryService.getCategories().then((categories) => {
            const catMap = categories.reduce((map : CategoryMap, cat : Category) => {
                map[cat._id] = cat
                return map
            }, {})
            const newState = {
                categories: categories,
                categoryMap: catMap                
            } as Partial<State>

            // For update mode get the subcategory select list for the specified category
            if (!state.isCreate && initialExpense.categoryId) {
                const category = catMap[initialExpense.categoryId]
                // Reset the expense to populate the categoryId/subcategoryId
                newState.expense = initialExpense
                newState.subcategories = category.subcategories                
            }

            updateState(newState)
        }).catch((error) => {
            console.error('Error retrieving select categories:', error)
            setDialogMsg('Error retrieving category select data')
        })
    }

    // Update state when form values change   
    const handleChange = (value : string, name: string) => {   
        const newState : State = { ...state } 
        newState.expense = { ...newState.expense, [name] : value }          

        // if Category changed, get the subcategories
        if (name === 'categoryId' && value !== '') {
            const categoryId = value
            const category = state.categoryMap[categoryId]
            newState.subcategories = category.subcategories
        }
        updateState(newState)
        validateField(name, value)
    }

    // Update state when a date value changes
    const handleDateChange = (date : any) => {           
        const trxDate = dayjs(date).format('YYYY-MM-DD')
        updateState({ expense: { ...state.expense, trxDate: trxDate } })
    }

    // Validate a form field
    const validateField = (name : string, value : string | number | undefined | null) => {
        let error = ''
        if (value === '') {
            error = 'Value is required'
        }
        setErrors({ ...errors, [name]: error })
        return error
    }

    // Validate all form fields
    const validateAllFields = () => {
        let formErrors : Record<string, string> = {
            categoryId: '',
            subcategoryId: '',
            description: '',
            amount: ''
        }
        formErrors.description = validateField('description', state.expense.description)
        formErrors.categoryId = validateField('categoryId', state.expense.categoryId)
        formErrors.subcategoryId = validateField('subcategoryId', state.expense.subcategoryId)
        formErrors.amount = validateField('amount', state.expense.amount)
        setErrors(formErrors)

        let isValid = true
        for (const key in formErrors) {
            if (!!formErrors[key]) {
                isValid = false
            }
        }
        return isValid
    }

    // Save the expense
    const handleSave = () => {
        if (validateAllFields()) {            
            ExpenseService.saveExpense(state.expense).then(() => {
                // Close the dialog and refresh the expenses list
                handleClose(true)
            }).catch((error) => {
                console.error('Error saving expense:', error)
                setDialogMsg('Error saving the expense')
            })
        }
    }
        
    return (
        <Dialog open={open} onEnter={handleOpen} maxWidth="sm">
            <DialogTitle>{state.isCreate ? 'Add Expense' : 'Update Expense'}</DialogTitle>
            <Divider />
            <DialogContent>
                <div className={classes.dialogMsg}>{dialogMsg}</div>
                <form noValidate autoComplete="off">
                    <div className={classes.inputControl}>
                        <DatePicker value={state.expense.trxDate} onChange={handleDateChange}
                            label="Trx Date" format="YYYY-MM-DD" inputVariant="outlined" name="trxDate" id="trxDate"
                            autoOk={true} allowKeyboardControl={true} InputProps={{ margin: 'dense' }} />
                    </div>
                    <div className={classes.inputControl}>
                        <FormTextField id="description" value={state.expense.description} label="Description"
                            onChange={handleChange} error={Boolean(errors.description)} helperText={errors.description} />
                    </div>
                    <div>
                        <FormSelect id="categoryId" value={state.expense.categoryId} label="Category"
                            onChange={handleChange} selectList={state.categories} valueProp="_id" labelProp="name"
                            error={Boolean(errors.categoryId)} helperText={errors.categoryId} />
                    </div>
                    <div>
                        <FormSelect id="subcategoryId" value={state.expense.subcategoryId} label="Subcategory"
                            onChange={handleChange} selectList={state.subcategories} valueProp="id" labelProp="name"
                            error={Boolean(errors.subcategoryId)} helperText={errors.subcategoryId} />
                    </div>
                    <div>
                        <FormTextField id="amount" type="number" value={state.expense.amount} label="Amount"
                            onChange={handleChange} error={Boolean(errors.amount)} helperText={errors.amount} />
                    </div>
                </form>
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button onClick={() => handleClose(false)} color="default">Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    )
})
