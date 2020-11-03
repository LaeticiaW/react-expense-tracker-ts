let express = require('express')
let app = express()
let categoryRoute = require('./routes/category')
let expenseRoute = require('./routes/expense')
let importRoute = require('./routes/import')
let userRoute = require('./routes/user')
let bodyParser = require('body-parser')
let db = require('./db.js')
let cors = require('cors')

// Initialize the DB
db.initialize()

// Handle cors
app.use(cors())

// Parse body
app.use(bodyParser.json())

// Allow access
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()

})

// Log incoming requests
app.use((req, res, next) => {
    console.log(`${new Date().toString()}: ${req.method} ${req.originalUrl}`)
    next() // invokes next middleware in chain, either need this or res.send
})

// Set static path
app.use(express.static('public'))

// Add routes
app.use(categoryRoute)
app.use(expenseRoute)
app.use(importRoute)
app.use(userRoute)

// Start server on specified port
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.info(`Server started on port ${PORT}`))
