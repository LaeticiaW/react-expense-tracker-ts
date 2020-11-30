import dayjs from 'dayjs'
import { ImportExpense, ImportFormData, Category } from 'types'

export default {

    /*
     * Copy the CSV record fields into an expense object and then normalize some of the data
     */
    normalizeExpense(fields : string[], formFields: ImportFormData) : ImportExpense {
        const expense: ImportExpense = {
            trxDate: fields[Number(formFields.dateField) - 1],
            description: fields[Number(formFields.descriptionField) - 1],
            amount: 0,
            categoryId: undefined,
            subcategoryId: undefined
        }      

        // Remove quotation marks from fields
        if (typeof expense.trxDate === 'string') {
            expense.trxDate = expense.trxDate.replace(/"/g, '')
        }
        if (typeof expense.description === 'string') {
            expense.description = expense.description.replace(/"/g, '')
        }

          // Process the amount value        
          let amount : string = fields[Number(formFields.amountField) - 1]          
          amount = amount.replace(/"/g, '')
       
        // If amount has parens, convert to minus sign
        if (amount.substr(0, 1) === '(') {
            amount.replace(/^\(/, '-')
            amount.replace(/\)/g, '')
        }

        // Remove leading '$' from amount
        if (amount.substr(0, 1) === '$') {
            amount = amount.substr(1)
        }

        // Convert amount to number and add to expense object
        expense.amount = Number(amount)

        // Ensure expense amounts are positive
        if (formFields.negativeExpenses) {
            expense.amount *= -1
        }        

        return expense
    },

      /*
     * Validate the expense object
     */
    validate(expense : ImportExpense, formFields : ImportFormData) {
        if (expense.amount === undefined || !this.isValidAmount(expense.amount)) {
            return false
        }
        if (expense.trxDate === undefined || !this.isValidDate(expense.trxDate, formFields.dateFormat)) {
            return false
        }
        return true
    },

    /*
     * Determine if an amount value is valid
     */
    isValidAmount(value? : string | number) {
        if (value === undefined || value === null) {
            return false
        }
        const val : number = typeof value === 'string' ? parseFloat(value) : value
        if (val <= 0 || Number.isNaN(val)) {
            // console.warning('Invalid amount:', value)
            return false
        }
        return true
    },

    /*
     * Determine if a date value is valid
     */
    isValidDate(value : string, dateFormat : string) {      
        if (!dayjs(value, dateFormat as string)) {
            console.error('Invalid date:', value, 'format:', dateFormat)
            return false
        }
        return true
    },

    /*
     * Convert the CSV record into an Expense object
     */
    getExpenseObject(record : string, formFields: ImportFormData, categories : Category[], validate = true) : ImportExpense | null  {
        const fields = record.split(',') 
       
        if (fields.length && fields[0]) {
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
                                    if (expense.description && expense.description.match(regex)) {
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
    readImportFile(formFields : ImportFormData) : Promise<string[]> {        
        return new Promise((resolve, reject) => {
            const fileReader : FileReader = new FileReader()
            fileReader.onload = () => { 
                if (fileReader.result && typeof fileReader.result === 'string') {              
                    const records : string[] = fileReader.result.split('\n')                
                    resolve(records)
                } else {
                    console.error('No import file results read')
                }
            }
            fileReader.onerror = () => {
                console.error(`Unable to read import file: ${fileReader.error}`)
                reject(`Unable to read import file: ${fileReader.error}`)
            }
            fileReader.readAsText(formFields.csvFile!)
        })
    }   
}
