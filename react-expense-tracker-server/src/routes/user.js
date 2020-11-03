let express = require('express')
let router = express.Router()
let User = require('../models/user.model')
let util = require('util')

/*
 * Get a user document by id
 */
router.get('/user/:id', (req, res) => {
    if (req.params.id === undefined || req.params.id === null) {
        console.error('Missing id parameter')
        res.status(400).send('Missing id parameter')
        return
    }

    User.findOne({ id: req.params.id }).then(doc => {
        res.json(doc)
    }).catch(err => {
        res.json(err)
    })
})

/*
 * Get a list of user
 */
router.get('/user', (req, res) => {
    User.find().sort({ id: 1 }).lean().then(users => {
        res.status(200).json(users)
    }).catch(err => {
        console.error(`Get users error: ${err}`)
        res.json(err)
    })
})

module.exports = router

