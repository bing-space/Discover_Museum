const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const Museum = require('../models/museum');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')

// Post review
router.post('/', isLoggedIn,validateReview, catchAsync( async (req, res) => {
    const museum = await Museum.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id;
    museum.reviews.push(review)
    await review.save();
    await museum.save();
    res.redirect(`/museums/${museum._id}`)
}))
// Delete review
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Museum.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId) // Will call middleware
    res.redirect(`/museums/${id}`)
}))

module.exports = router;