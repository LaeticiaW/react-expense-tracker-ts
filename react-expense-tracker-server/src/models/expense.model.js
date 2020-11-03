const mongoose = require('mongoose')

/*
 * Expense Model
 */
var ExpenseSchema = new mongoose.Schema({
        trxDate: {
            type: String,
            required: 'Trx Date is required'
        },
        trxYear: {
            type: Number,
            required: 'Trx Year is required'
        },
        trxMonth: {
            type: Number,
            required: 'Trx Month is required'
        },
        description: {
            type: String
        },
        categoryId: {
            type: String
        },
        subcategoryId: {
            type: String
        },
        amount: {
            type: Number,
            required: 'Amount is required'
        },
        importId: {
            type: String
        }
    },
    {
        collection: 'expenses'
    });

module.exports = mongoose.model('ExpenseModel', ExpenseSchema);
