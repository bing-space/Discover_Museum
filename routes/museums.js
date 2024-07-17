const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Museum = require('../models/museum');
const {museumSchema} = require('../schemas.js')
const {isLoggedIn} = require('../middleware')

const validateMuseum = (req,res, next) => {
    const {error} = museumSchema.validate(req.body);
    console.log(error)
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

// GET:: get new museum form
router.get('/new',isLoggedIn, (req, res) => {
    res.render('museums/new')
})

// POST:: post the new museum form
router.post('/',validateMuseum, isLoggedIn,catchAsync(async (req, res) => { 
    const newMuseum = new Museum(req.body.museum);
    await newMuseum.save();
    req.flash('success','Successfully made a new museum')
    // console.log(newCamp);
    // Redirect
    res.redirect(`/museums/${newMuseum._id}`)
}))

// GET:: museum list page
router.get('/',catchAsync( async (req, res) => {
    const museums = await Museum.find({});
    res.render('museums/index', {museums})
}))

// GET:: show museum detail
router.get('/:id', catchAsync( async (req, res) =>{
    const {id} = req.params;
    const museum = await Museum.findById(id).populate('reviews');
    if(!museum){
        req.flash('error','Cannot find that museum')
        return res.redirect(`/museums`)
    }
    res.render('museums/show', {museum})
}))

// GET:: get the edit museum form
router.get('/:id/edit', isLoggedIn,catchAsync( async (req,res) => {
    const {id} = req.params;
    const museum = await Museum.findById(id);
    if(!museum){
        req.flash('error','Cannot find that museum')
        return res.redirect(`/museums`)
    }
    res.render('museums/edit', {museum})
}))

// PUT:: update the edit form
router.put('/:id',validateMuseum, isLoggedIn,catchAsync( async (req, res) => {
    //if(!req.body.museum) throw new ExpressError('Invalid Museum Data', 400)
    const {id} = req.params;
    const museum = await Museum.findByIdAndUpdate(id, req.body.museum, {runValidators: true});
    req.flash('success','Successfully updated a new museum')
    res.redirect(`/museums/${museum._id}`)
}))
// Deletes campground
router.delete('/:id', isLoggedIn,catchAsync( async (req, res) => {
    const {id} = req.params;
    const museum = await Museum.findByIdAndDelete(id);
    req.flash('success','Successfully deleted museum')
    res.redirect('/museums')
}))

module.exports = router;