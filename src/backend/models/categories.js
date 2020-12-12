const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema ({
    catType: {
        type: String,
        required: true
    }
}, { timestamps: true })

const CategoryModel = mongoose.model('Categorie', categorySchema);
module.exports = CategoryModel;