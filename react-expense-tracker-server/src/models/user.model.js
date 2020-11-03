const mongoose = require('mongoose')

/*
 * User Model
 */
var UserSchema = new mongoose.Schema({
        id: {
            type: String,
            required: 'User id is required'
        },
        firstName: {
            type: String,
            required: 'First name is required'
        },
        lastName: {
            type: String,
            required: 'Last name is required'
        }
    },
    {
        collection: 'users'
    });

module.exports = mongoose.model('UserModel', UserSchema);
