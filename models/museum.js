const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MuseumSchema = new Schema({
    name: String,
    description: String,
    website: String,
    location: String
})

module.exports = mongoose.model('Museum', MuseumSchema)