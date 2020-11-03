let express = require('express')
let router = express.Router()
let Import = require('../models/import.model')
let moment = require('moment')
let util = require('util')

/*
 * Get list of import summaries for a date range
 */
router.get('/import', (req, res) => {
    if (!req.query || !req.query.startDate || !req.query.endDate) {
        res.status(400).send('Missing startDate and/or endDate params')
        return
    }

    // Create the find expression
    let filter = req.query
    let search = {}
    if (filter.startDate && filter.endDate) {
        search.importDate = {
            $gte: filter.startDate,
            $lte: filter.endDate
        }
    }

    // Retrieve the import summaries from the db
    Import.find(search).sort({ importDate: -1 }).then(imports => {
        res.status(200).json(imports)
    }).catch(err => {
        console.error(`Get imports error: ${err}`)
        res.json(err)
    })
})

/*
 * Create a new import summary doc
 */
router.post('/import', (req, res) => {
    if (!req.body || !req.body.importDate || !req.body.description || !req.body.fileName) {
        console.error('Missing import fields')
        res.status(400).send('Missing import fields')
        return
    }

    // Populate the import model
    let imp = new Import(req.body)

    // Save the import to the db
    imp.save().then(doc => {
        res.status(200).json(doc)
    }).catch(err => {
        console.error(`Create import error: ${err}`)
        res.status(500).json(err)
    })
})

/*
 * Update the import summary doc
 */
router.put('/import/:id', (req, res) => {
    if (!req.params.id) {
        console.error('Missing import id param')
        res.status(400).send('Missing import id param')
        return
    }

    // Update the import summary in the db
    Expense.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true
    }).then(doc => {
        res.json(doc)
    }).catch(err => {
        console.error(`Error updating import summary: ${err}`)
        res.status(500).json(err)
    })
})

/*
 * Delete the import summary doc by id
 */
router.delete('/import/:id', (req, res) => {
    if (!req.params.id) {
        console.error('Missing import id param')
        res.status(400).send('Missing import id param')
        return
    }

    // Delete the import summary doc from the db
    Expense.findOneAndRemove({
        _id: req.params.id
    }).then(doc => {
        res.json(doc)
    }).catch(err => {
        console.error(`Error deleting import summary: ${err}`)
        res.status(500).json(err)
    })
})

module.exports = router

