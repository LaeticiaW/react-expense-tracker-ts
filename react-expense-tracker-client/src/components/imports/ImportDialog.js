import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@material-ui/core'
import { Card, CardContent, CardHeader } from '@material-ui/core'
import CategoryService from '../../services/category'
import ExpenseService from '../../services/expense'
import ImportUtil from '../../services/importUtil'
import { makeStyles } from '@material-ui/core/styles'
import dayjs from 'dayjs'
import FormSelect from '../common/form/FormSelect'
import FormTextField from '../common/form/FormTextField'
import FormFileInput from '../common/form/FormFileInput'
import FormCheckbox from '../common/form/FormCheckbox'
import ConfirmDialog from '../common/ConfirmDialog'

const useStyles = makeStyles(theme => ({
    dialogContent: {
        width: '735px',
        padding: '16px 24px 24px 24px'
    },
    dialogMsg: {
        color: 'red',
        minHeight: '15px'
    },
    formRow: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    card: {
        height: '100%'
    },
    cardTitle: {
        fontSize: '1rem',
        fontWeight: 'bold'
    },
    cardHeaderRoot: {
        backgroundColor: theme.palette.secondary.main
    }
}))

const fieldPositions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' }
]

const dateFormats = [
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
    { value: 'MM-DD-YYYY', label: 'MM-DD-YYYY' }
]
const defaultErrors = {
    csvFile: '',
    description: '',
    dateFormat: '',
    negativeExpenses: '',
    dateField: '',
    amountField: '',
    descriptionField: ''
}

const defaultFormValues = {
    csvFile: '',
    description: '',
    dateFormat: '',
    negativeExpenses: false,
    hasHeaderRow: true,
    dateField: '',
    amountField: '',
    descriptionField: ''
}

export default React.memo(function ImportDialog({ open, handleClose }) {
    const classes = useStyles()

    const [categories, setCategories] = useState([])
    const [expenses, setExpenses] = useState([])
    const [dialogMsg, setDialogMsg] = useState()
    const [formData, setFormData] = useState({ ...defaultFormValues })
    const [errors, setErrors] = useState({ ...defaultErrors })
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [confirmImportMsg, setConfirmImportMsg] = useState('')
    const [importRecords, setImportRecords] = useState([])
    const [loading, setLoading] = useState(false)

    // Initialize state whenever the dialog opens
    const handleOpen = () => {
        // Initialize variables       
        setDialogMsg('')
        setFormData({ ...defaultFormValues })
        setErrors({ ...defaultErrors })

        // Retrieve the categories
        getCategories()
    }

    // Retrieve the list of categories
    const getCategories = () => {
        CategoryService.getCategories().then((categories) => {
            setCategories(categories)
        }).catch((error) => {
            console.error('Error retrieving select categories:', error)
            setDialogMsg('Error retrieving category select data')
        })
    }

    // Formulate the confirmation message that displays the parsed first expense record
    const getImportConfirmationMsg = (parsedExpense) => {
        return (
            <div>
                <p>Parsed fields from the first record are displayed below.  Are you sure you want to continue the import?</p>
                <p><label style={{ fontWeight: 'bold' }}>Date: </label><span>{parsedExpense.trxDate}</span></p>
                <p><label style={{ fontWeight: 'bold' }}>Amount: </label><span>{parsedExpense.amount}</span></p>
                <p><label style={{ fontWeight: 'bold' }}>Desc: </label><span>{parsedExpense.description}</span></p>
            </div>
        )
    }
    
    // Import the expenses from the CSV file   
    const handleConfirmImport = async () => {
        setDialogMsg(null)
        setExpenses([])
       
        if (validateAllFields()) {
            // Read the records from the import file
            let impRecords = []
            await ImportUtil.readImportFile(formData).then((records) => {
                impRecords = records
                setImportRecords(records)
            }).catch((error) => {
                console.error('Error importing file:', error)
                setDialogMsg('Unable to import the file')
            })

            if (!impRecords.length) {
                setDialogMsg('No records to import')
                return
            }

            // Parse out the first record of the file for the confirmation dialog           
            let parsedExpense = ImportUtil.getExpenseObject(impRecords[formData.hasHeaderRow ? 1 : 0],
                formData, categories, false)
            if (parsedExpense) {
                // Create the confirmation message and ask the user to confirm the import record parsing               
                setConfirmImportMsg(getImportConfirmationMsg(parsedExpense))
                setConfirmDialogOpen(true)
            } else {
                setDialogMsg('Unable to parse first import file record')
            }
        }
    }

    // Import the expenses
    const handleImport = () => {
        setLoading(true)

        // Create expense objects for each import file record
        importRecords.forEach((rec, idx) => {
            if (!formData.hasHeaderRow || idx > 0) {
                const exp = ImportUtil.getExpenseObject(rec, formData, categories)
                if (exp) {
                    expenses.push(exp)
                }
            }
        })

        // Create an import details summary object
        const importDetails = {
            importDate: dayjs().format('YYYY-MM-DD'),
            fileName: formData.csvFile.name,
            description: formData.description,
            recordCount: expenses.length,
            dateFormat: formData.dateFormat
        }

        // Store the expenses and the import details in the db
        ExpenseService.importExpenses(expenses, importDetails).then(() => {
            setConfirmDialogOpen(false)
            handleClose(true)
        }).catch((error) => {
            console.error('Error importing expenses:', error)
            setDialogMsg('Error importing expenses')
        }).finally(() => {
            setLoading(false)
        })
    }

    // Update state when the form data changes
    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.type === "checkbox" ? event.target.checked : event.target.value
        setFormData({ ...formData, [name]: value })
        validateField(name, value)
    }

    // Update state when the input csv file changes
    const handleFileChange = (event) => {
        const name = 'csvFile'
        const value = event.target.files ? event.target.files[0] : formData.csvFile
        setFormData({ ...formData, [name]: value })
        validateField(name, value)
    }

    // Validate a form field
    const validateField = (name, value) => {
        let error = ''
        if (name !== 'negativeExpenses' && value === '') {
            error = 'Value is required'
        }
        setErrors({ ...errors, [name]: error })
        return error
    }

    // Validate all form fields
    const validateAllFields = () => {
        let formErrors = {}
        formErrors.csvFile = validateField('csvFile', formData.csvFile)
        formErrors.description = validateField('description', formData.description)
        formErrors.dateFormat = validateField('dateFormat', formData.dateFormat)
        formErrors.dateField = validateField('dateField', formData.dateField)
        formErrors.amountField = validateField('amountField', formData.amountField)
        formErrors.descriptionField = validateField('descriptionField', formData.descriptionField)
        setErrors(formErrors)

        let isValid = true
        for (const name in formErrors) {
            if (!!formErrors[name]) {
                isValid = false
            }
        }
        return isValid
    }

    // Cancel/close the dialog
    const handleCancelDialog = () => {
        handleClose(false)
    }

    // Cancel/close the confirmation dialog
    const handleCancelConfirm = () => {
        setConfirmDialogOpen(false)
    }
   
    return (
        <div>
            <Dialog open={open} onEnter={handleOpen} maxWidth="md" BackdropProps={{ style: { backgroundColor: "transparent" } }}>
                <DialogTitle className={classes.dialogTitle}>Import Expenses</DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <div className={classes.dialogMsg}>{dialogMsg}</div>
                    <form className={classes.form} noValidate autoComplete="off">
                        <div className={classes.formRow}>
                            <div className={classes.formColumn}>
                                <Card className={classes.card}>
                                    <CardHeader title="File Info" classes={{ title: classes.cardTitle, root: classes.cardHeaderRoot }} />
                                    <CardContent className={classes.cardContent}>
                                        <FormFileInput id="csvFile" value={formData.csvFile} label="File Name" onChange={handleFileChange}
                                            error={Boolean(errors.csvFile)} helperText={errors.csvFile} />
                                        <FormTextField id="description" value={formData.description} label="Description" onChange={handleChange}
                                            error={Boolean(errors.description)} helperText={errors.description} />
                                        <FormSelect id="dateFormat" value={formData.dateFormat} label="Date Format"
                                            onChange={handleChange} selectList={dateFormats}
                                            error={Boolean(errors.dateFormat)} helperText={errors.dateFormat} />
                                        <FormCheckbox id="negativeExpenses" value={formData.negativeExpenses}
                                            label="Expenses are Negative" onChange={handleChange} />
                                    </CardContent>
                                </Card>
                            </div>
                            <div className={classes.formColumn}>
                                <Card className={classes.card}>
                                    <CardHeader title="File Structure" classes={{ title: classes.cardTitle, root: classes.cardHeaderRoot }} />
                                    <CardContent className={classes.cardContent}>
                                        <FormSelect id="dateField" value={formData.dateField} label="Date Field Position"
                                            onChange={handleChange} selectList={fieldPositions}
                                            error={Boolean(errors.dateField)} helperText={errors.dateField} />
                                        <FormSelect id="amountField" value={formData.amountField} label="Amount Field Position"
                                            onChange={handleChange} selectList={fieldPositions}
                                            error={Boolean(errors.amountField)} helperText={errors.amountField} />
                                        <FormSelect id="descriptionField" value={formData.descriptionField} label="Description Field Position"
                                            onChange={handleChange} selectList={fieldPositions}
                                            error={Boolean(errors.descriptionField)} helperText={errors.descriptionField} />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={handleCancelDialog} color="default">Cancel</Button>
                    <Button onClick={handleConfirmImport} color="primary" disabled={loading}>Import</Button>
                </DialogActions>
            </Dialog>
            <ConfirmDialog open={confirmDialogOpen}
                title="Confirm Import" msg={confirmImportMsg}
                onCancel={handleCancelConfirm} onConfirm={handleImport} />
        </div>)
}, (prevProps, nextProps) => {
    return prevProps.open === nextProps.open
})
