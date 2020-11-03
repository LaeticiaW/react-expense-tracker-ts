import dayjs from 'dayjs'

export default {

    /*
     * Copy the CSV record fields into an expense object and then normalize some of the data
     */
    normalizeExpense(fields, formFields) {
        const expense = {
            trxDate: fields[formFields.dateField - 1],
            description: fields[formFields.descriptionField - 1],
            amount: fields[formFields.amountField - 1],
            categoryId: null,
            subcategoryId: null
        }

        // Remove quotation marks from fields
        if (typeof expense.trxDate === 'string') {
            expense.trxDate = expense.trxDate.replace(/"/g, '')
        }
        if (typeof expense.description === 'string') {
            expense.description = expense.description.replace(/"/g, '')
        }
        if (typeof expense.amount === 'string') {
            expense.amount = expense.amount.replace(/"/g, '')
        }

        // If amount has parens, convert to minus sign
        if (typeof expense.amount === 'string' && expense.amount.substr(0, 1) === '(') {
            expense.amount.replace(/^\(/, '-')
            expense.amount.replace(/\)/g, '')
        }

        // Remove leading '$' from amount
        if (typeof expense.amount === 'string' && expense.amount.substr(0, 1) === '$') {
            expense.amount = expense.amount.substr(1)
        }

        // Convert amount to number
        expense.amount = Number(expense.amount)

        // Ensure expense amounts are positive
        if (formFields.negativeExpenses) {
            expense.amount *= -1
        }

        return expense
    },

      /*
     * Validate the expense object
     */
    validate(expense, formFields) {
        if (!this.isValidAmount(expense.amount)) {
            return false
        }
        if (!this.isValidDate(expense.trxDate, formFields.dateFormat)) {
            return false
        }
        return true
    },

    /*
     * Determine if an amount value is valid
     */
    isValidAmount(value) {
        if (value === undefined || value === null || value <= 0 || Number.isNaN(value)) {
            // console.warning('Invalid amount:', value)
            return false
        }
        return true
    },

    /*
     * Determine if a date value is valid
     */
    isValidDate(value, dateFormat) {
        if (!dayjs(value, dateFormat)) {
            console.error('Invalid date:', value, 'format:', dateFormat)
            return false
        }
        return true
    },

    /*
     * Convert the CSV record into an Expense object
     */
    getExpenseObject(record, formFields, categories, validate = true)  {
        const fields = record.split(',')     
        if (fields.length) {
            const expense = this.normalizeExpense(fields, formFields)
            
            if (this.validate && !this.validate(expense, formFields)) {
                return null
            }
           
            // Set the expense categoryId and subcategoryId if the expense description matches any subcategory matchText
            if (expense.description) {
                categories.forEach((cat) => {
                    if (cat.subcategories) {
                        cat.subcategories.forEach((subcat) => {
                            if (subcat.matchText) {
                                subcat.matchText.forEach((text) => {
                                    const regex = new RegExp(text, 'i')
                                    if (expense.description.match(regex)) {
                                        expense.categoryId = cat._id
                                        expense.subcategoryId = subcat.id
                                    }
                                })
                            }
                        })
                    }
                })
            }

            return expense
        }
        return null
    },

     /*
     * Read the records from the CSV file
     */
    readImportFile(formFields) {        
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.onload = () => {                
                const records = fileReader.result.split('\n')                
                resolve(records)
            }
            fileReader.onerror = () => {
                console.error(`Unable to read import file: ${fileReader.error}`)
                reject(`Unable to read import file: ${fileReader.error}`)
            }
            fileReader.readAsText(formFields.csvFile)
        })
    }    

}