const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MuseumSchema = new Schema({
    name: String,
    image: String,
    description: String,
    website: String,
    location: String,
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

module.exports = mongoose.model('Museum', MuseumSchema)