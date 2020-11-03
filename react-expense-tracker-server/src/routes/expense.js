let express = require('express')
let router = express.Router()
let Expense = require('../models/expense.model')
let Import = require('../models/import.model')
let Category = require('../models/category.model')
let moment = require('moment')
let util = require('util')
let helper = require('../helper')

/*
 * Summarize expense amounts by categoryId and subcategoryId over a year or month
 */
router.get('/expense/totals', (req, res) => {
    if (!req.query || !req.query.startDate || !req.query.endDate) {
        console.error('Missing startDate and/or endDate parameter')
        res.status(400).send('Missing startDate and/or endDate parameter')
        return
    }

    let filter = req.query
    let search = {
        trxDate: {
            $gte: filter.startDate,
            $lte: filter.endDate
        }
    }

    if (filter.categoryIds && filter.categoryIds.length) {
        search.categoryId = { $in: filter.categoryIds }
    }

    Expense.aggregate([{
            $match: search
        }, {
            $group: {
                _id: {
                    categoryId: '$categoryId',
                    subcategoryId: '$subcategoryId'
                },
                totalAmount: { $sum: '$amount' }
            }
        }, {
            $project: {
                categoryId: '$_id.categoryId',
                subcategoryId: '$_id.subcategoryId',
                totalAmount: '$totalAmount'
            }
        }, {
            $sort: {
                categoryId: 1,
                subcategoryId: 1
            }
        }
    ]).then(expenseTotals => {
        Category.find({}).then(categories => {
            helper.addCategoryToExpenses(expenseTotals, categories)
            res.status(200).json(expenseTotals)
        }).catch(err => {
            console.error(`Get categories after get expense totals error: ${err}`)
            res.json(err)
        })
    }).catch(error => {
        console.error('Error in expense/totals route: ' + util.inspect(error, { depth: null }))
        res.status(500).json(error)
    })
})

/*
 * Get expense amounts by categories by month for a date range
 */
router.get('/expense/timeseries', (req, res) => {
    if (!req.query || !req.query.startDate|| !req.query.endDate) {
        console.error('Missing startDate and/or endDate parameter')
        res.status(400).send('Missing startDate and/or endDate parameter')
        return
    }

    let filter = req.query
    let search = {
        trxDate: {
            $gte: filter.startDate,
            $lte: filter.endDate
        }
    }

    Expense.aggregate([{
        $match: search
    }, {
        $group: {
            _id: {
                categoryId: '$categoryId',
                trxYear: '$trxYear',
                trxMonth: '$trxMonth'
            },
            totalAmount: { $sum: '$amount' }
        }
    }, {
        $project: {
            categoryId: '$_id.categoryId',
            trxYear: '$_id.trxYear',
            trxMonth: '$_id.trxMonth',
            totalAmount: '$totalAmount'
        }
    }, {
        $sort: {
            categoryId: 1,
            trxYear: 1,
            trxMonth: 1
        }
    }]).then(expenseTimeSeries => {
        Category.find({}).then(categories => {
            helper.addCategoryToExpenses(expenseTimeSeries, categories)
            res.status(200).json(expenseTimeSeries)
        }).catch(err => {
            console.error(`Get categories after get expense time series error: ${err}`)
            res.json(err)
        })
    }).catch(error => {
        console.error('Error in expense/timeseries route: ' + util.inspect(error, { depth: null }))
        res.status(500).json(error)
    })
})

/*
 * Get an expense document by id
 */
router.get('/expense/:id', (req, res) => {
    if (id === undefined || id === null) {
        console.error('Missing id parameter')
        res.status(400).send('Missing id parameter')
        return
    }

    Expense.findOne({ _id: id }).then(doc => {
        res.json(doc)
    }).catch(err => {
        res.json(err)
    })
})

/*
 * Get a list of expenses for a date range
 */
router.get('/expense', (req, res) => {
    if (!req.query || !req.query.startDate || !req.query.endDate) {
        console.error('Missing startDate and/or endDate parameter')
        res.status(400).send('Missing startDate and/or endDate parameter')
        return
    }

    let filter = req.query
    let search = {}
    if (filter.categoryIds && filter.categoryIds.length) {
        search.categoryId = { $in: filter.categoryIds }
    }
    if (filter.startDate && filter.endDate) {
        search.trxDate = {

            $gte: filter.startDate,
            $lte: filter.endDate
        }
    }

    Expense.find(search).sort({ trxDate: -1 }).lean().then(expenses => {
        Category.find({}).then(categories => {
            helper.addCategoryToExpenses(expenses, categories)
            res.status(200).json(expenses)
        }).catch(err => {
            console.error(`Get categories after get expenses error: ${err}`)
            res.json(err)
        })
    }).catch(err => {
        console.error(`Get expenses error: ${err}`)
        res.json(err)
    })
})

/*
 * Create a new expense
 */
router.post('/expense', (req, res) => {
    if (!req.body || !req.body.trxDate || !req.body.categoryId || !req.body.subcategoryId || !req.body.amount) {
        console.error('Missing expense data')
        res.status(400).send('Missing expense data')
        return
    }

    // Populate the expense model
    let expense = new Expense(req.body)
    expense.trxYear = moment(expense.trxDate).year()
    expense.trxMonth = moment(expense.trxDate).month() + 1 // month is zero based so add 1

    expense.save().then(doc => {
        if (!doc) {
            res.status(500).send(doc)
        }
        res.status(200).json(doc)
    }).catch(err => {
        console.error(`Create expense error: ${err}`)
        res.status(500).json(err)
    })
})

/*
 * Update an expense doc by id
 */
router.put('/expense/:id', (req, res) => {
    if (!req.params.id) {
        console.error('Missing expense id parameter')
        res.status(400).send('Missing expense id param')
        return
    }

    Expense.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true
    }).then(doc => {
        res.json(doc)
    }).catch(err => {
        console.error(`Update expense error: ${err}`)
        res.status(500).json(err)
    })
})

/*
 * Delete an expense doc by id
 */
router.delete('/expense/:id', (req, res) => {
    if (!req.params.id) {
        console.error('Missing expense id parameter')
        res.status(400).send('Missing expense id param')
        return
    }

    Expense.findOneAndRemove({
        _id: req.params.id
    }).then(doc => {
        res.json(doc)
    }).catch(err => {
        console.error(`Delete expense error: ${err}`)
        res.status(500).json(err)
    })
})

/*
 * Delete expenses by import id
 */
router.delete('/expense/import/:id', (req, res) => {
    if (!req.params.id) {
        res.status(400).send('Missing import id param')
        return
    }

    Expense.deleteMany({
        importId: req.params.id
    }).then(doc => {
        // Now remove the import summary doc
        Import.findOneAndRemove({
            _id: req.params.id
        }).then(importDoc => {
            res.status(200).json(importDoc)
        }).catch(err => {
            console.error(`Error deleting import summary: ${err}`)
            res.status(500).json(err)
        })
    }).catch(err => {
        console.error(`Error deleting expenses by import id: ${err}`)
        res.status(500).json(err)
    })
})

/*
 * Insert imported expenses into the expenses collection, and also insert an import summary doc into the imports collection
 */
router.post('/expense/import', (req, res) => {
    if (!req.body || !req.body.importDetails || !req.body.expenses) {
        console.error('Missing import details and/or expenses')
        res.status(400).send('Missing import details and/or expenses')
        return
    }

    // Insert an import summary doc
    let imp = new Import(req.body.importDetails)
    let importId
    imp.save().then(doc => {
        if (!doc) {
            res.status(500).send(doc)
        }
        importId = doc._id

        // Insert the imported expenses
        let expenses = req.body.expenses
        expenses.forEach(exp => {
            exp.trxYear = exp.trxDate.substr(0, 4)
            exp.trxMonth = exp.trxDate.substr(5, 2)
            exp.importId = importId
        })

        Expense.insertMany(expenses, { ordered: true }, function (err, docs) {
            if (err) {
                console.error(err);
                // If importing expenses fails, also remove the import summary document
                Import.findOneAndRemove({ _id: importId }).then(doc => {
                    res.status(500).json(err)
                }).catch(err => {
                    console.error(`Error deleting import summary: ${error}`)
                    res.status(500).json(err)
                })
            } else {
                return res.status(200).send('Success')
            }
        })
    }).catch(err => {
        console.error(`Create import error: ${err}`)
        res.status(500).json(err)
    })
})

module.exports = router

