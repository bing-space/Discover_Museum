const Review = require('../models/review');
const Museum = require('../models/museum');

module.exports.createReview = async (req, res) => {
    const museum = await Museum.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id;
    museum.reviews.push(review)
    await review.save();
    await museum.save();
    req.flash('success','Created new review')
    res.redirect(`/museums/${museum._id}`)
}

module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    await Museum.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId) // Will call middleware
    req.flash('success','Successfully deleted review')
    res.redirect(`/museums/${id}`)
}