const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MuseumSchema = new Schema({
    title: String,
    image: String,
    description: String,
    location: String,
    price: String
})

module.exports = mongoose.model('Museum', MuseumSchema);