const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const Museum = require('../models/museum');
const {reviewSchema} = require('../schemas.js')

const validateReview = (req,res, next) => {
    const {error} = reviewSchema.validate(req.body);
    console.log(error)
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

// Post review
router.post('/',validateReview, catchAsync( async (req, res) => {
    const museum = await Museum.findById(req.params.id)
    const review = new Review(req.body.review)
    museum.reviews.push(review)
    await review.save();
    await museum.save();
    res.redirect(`/museums/${museum._id}`)
}))
// Delete review
router.delete('/:reviewId', catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Museum.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId) // Will call middleware
    res.redirect(`/museums/${id}`)
}))

module.exports = router;