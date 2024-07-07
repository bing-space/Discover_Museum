const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('../models/review')

const MuseumSchema = new Schema({
    title: String,
    image: String,
    description: String,
    location: String,
    price: Number,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

// Query Middleware
MuseumSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Museum', MuseumSchema);