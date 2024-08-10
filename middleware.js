const {museumSchema, reviewSchema} = require('./schemas.js')
const ExpressError = require('./utils/ExpressError');
const Museum = require('./models/museum');
const Review = require('./models/review');

module.exports.isLoggedIn = (req,res,next) => {
    console.log("REQ.USER... ", req.user)
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','you must be signed in')
        return res.redirect('/login')
    }
    next();
}

module.exports.validateMuseum = (req,res, next) => {
    const {error} = museumSchema.validate(req.body);
    console.log(error)
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const museum = await Museum.findById(id);
    if(!museum.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/museums/${id}`)
    }
    next();
}

module.exports.validateReview = (req,res, next) => {
    const {error} = reviewSchema.validate(req.body);
    console.log(error)
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/museums/${id}`)
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}