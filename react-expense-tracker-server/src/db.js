let mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

module.exports = {
    initialize() {
        console.log('Connecting to database...')
        var mongoDb = mongoose.connect('mongodb://localhost/reactExpenseTracker', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        //Get the default connection
        var db = mongoose.connection

        // Handle error and connected events
        db.on('error', console.error.bind(console, 'MongoDB connection error:'))
        db.on('connected', console.error.bind(console, "MongoDB connected"))

        // Initialize mongoose models
        require('./models/category.model')
    }
}

