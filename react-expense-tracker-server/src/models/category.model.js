let mongoose = require('mongoose')
/*
 * Category Model
 */
var CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        default: '',
        unique: true,
        trim: true,
        required: 'Category name is required'
    },
    subcategories: {
        type: Array, "defaults": []
    }
}, {
    collection: 'categories'
});

module.exports = mongoose.model('CategoryModel', CategorySchema);
