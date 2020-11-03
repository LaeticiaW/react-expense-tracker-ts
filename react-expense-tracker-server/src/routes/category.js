let express = require('express')
let router = express.Router()
let Category = require('../models/category.model')
let Expense = require('../models/expense.model')

/*
 * Retrieve a category document by id
 */
router.get('/category/:id', (req, res) => {
    if (!req.params.id) {
        console.error('Missing category id parameter')
        res.json('Missing category id parameter')
        return
    }

    Category.findOne({ _id: id }).then(doc => {
        res.json(doc)
    }).catch(err => {
        console.error(`Error retrieving category: ${err}`)
        res.json(err)
    })
})

/*
 * Retrieve the list of all category
 */
router.get('/category', (req, res) => {
    Category.find({}).then(doc => {
        res.status(200).json(doc)
        return
    }).catch(err => {
        console.error(`Find category error: ${err}`)
        res.json(err)
    })
})

/*
 * Create a new category
 */
router.post('/category', (req, res) => {
    if (!req.body && !req.body.name) {
        console.error('Missing category name param')
        res.status(400).send('Missing category name param')
        return
    }

    let model = new Category(req.body)
    model.save().then(doc => {
        res.status(200).json(doc)
    }).catch(err => {
        console.error(`Error creating category: ${err}`)
        res.status(500).json(err)
    })
})

/*
 * Update a category by id
 */
router.put('/category/:id', (req, res) => {
    if (!req.params.id) {
        console.error('Missing category id param')
        res.status(400).send('Missing category id param')
        return
    }

    if (!req.body.name) {
        console.error('Missing category name')
        res.status(400).send('Missing category name')
    }

    Category.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).then(doc => {
        res.json(doc)
    }).catch(err => {
        console.error(`Error updating category: ${err}`)
        res.status(500).json(err)
    }).catch(err => {
        console.error(`Find category error: ${err}`)
        res.json(err)
    })
})

/*
 * Delete a category by id
 */
router.delete('/category/:id', (req, res) => {
    if (!req.params.id) {
        console.error('Missing category id param')
        res.status(400).send('Missing category id param')
        return
    }

    // Do not allow deleting a category that is in use, e.g. associated to an expense
    Expense.findOne({ categoryId: req.params.id }).then(doc => {
        console.log('Expense Doc:', doc)
        if (doc === null) {
            Category.findOneAndRemove({
                _id: req.params.id
            }).then(doc => {
                res.json(doc)
            }).catch(err => {
                console.error(`Error deleting category: ${err}`)
                res.status(500).json(err)
            })
        } else {
            res.status(500).send('Category in use')
        }
    }).catch(err => {
        res.json(err)
    })
})

module.exports = router

