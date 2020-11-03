const mongoose = require('mongoose')

/*
 * Import Model
 */
var ImportSchema = new mongoose.Schema({
        importDate: {
            type: String,
            required: 'Import Date is required'
        },
        fileName: {
            type: String,
            required: 'File Name is required'
        },
        description: {
            type: String,
            required: 'Description is required'
        },
        recordCount: {
            type: Number,
            required: 'recordCount is required'
        }
    },
    {
        collection: 'imports'
    });

module.exports = mongoose.model('ImportModel', ImportSchema);
