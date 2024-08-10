const { model } = require('mongoose');
const Museum = require('../models/museum');

module.exports.index = async (req, res) => {
    const museums = await Museum.find({});
    res.render('museums/index', {museums})
}

module.exports.renderNewForm = (req, res) => {
    res.render('museums/new')
}

module.exports.createMuseum = async (req, res) => { 
    const newCamp = new Museum(req.body.museum);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success','Successfully made a new museum')
    console.log(newCamp);
    // Redirect
    res.redirect(`/museums/${newCamp._id}`)
}

module.exports.showMuseum = async (req, res) =>{
    const {id} = req.params;
    const museum = await Museum.findById(id).populate({path: 'reviews', populate: {path: 'author'}}).populate('author');
    if(!museum){
        req.flash('error','Cannot find that museum')
        return res.redirect(`/museums`)
    }
    res.render('museums/show', {museum})
}

module.exports.renderEditForm = async (req,res) => {
    const {id} = req.params;
    const museum = await Museum.findById(id);
    if(!museum){
        req.flash('error','Cannot find that museum')
        return res.redirect(`/museums`)
    }
    res.render('museums/edit', {museum})
}

module.exports.updateMuseum = async (req, res) => {
    const { id } = req.params;
    const museum = await Museum.findByIdAndUpdate(id, req.body.museum, {runValidators: true})
    req.flash('success','Successfully updated a new museum')
    res.redirect(`/museums/${museum._id}`);
}

module.exports.deleteMuseum = async (req, res) => {
    const { id } = req.params;
    await Museum.findByIdAndDelete(id);
    req.flash('success','Successfully deleted museum')
    res.redirect('/museums');
}