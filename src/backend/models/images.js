const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema ({
    base64img: {
        type: String,
        required: true
    }
})

const ImageModel = mongoose.model('Image', imageSchema);
module.exports = ImageModel;