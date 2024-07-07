const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

const Museum = require('./models/museum');
const { museumSchema } = require('./schemas');

/**
 * Database Connection Section
 */
mongoose.connect('mongodb://127.0.0.1:27017/discover_museum')
    .then(() =>{
        console.log("Connection Open")
    })
    .catch(err => {
        console.log("Error.......")
        console.log(err)
    })

/**
 * Middleware Section
 */   
app.engine('ejs', engine);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

const validateMuseum = (req,res, next) => {
    // console.log(req.body)
    const {error} = museumSchema.validate(req.body);
    console.log(error)
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

/**
 * CRUD Section
 */

// GET:: home page
app.get('/', (req, res) => {
    res.render('home')
})
// GET:: get new museum form
app.get('/museums/new', catchAsync(async(req,res) => {
    res.render('museums/new')
}))
// POST:: post the new museum form
app.post('/museums', validateMuseum, catchAsync(async(req, res) => {
    const newMuseum = new Museum(req.body.museum);
    await newMuseum.save();
    console.log('POST NEW Museum')
    console.log(req.body.museum)
    res.redirect(`/museums/${newMuseum._id}`)
}))
// GET:: museum list page
app.get('/museums', catchAsync(async (req, res) => {
    const museums = await Museum.find({});
    res.render('museums/index', {museums})
}))
// GET:: show museum detail
app.get('/museums/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const museum = await Museum.findById(id);
    res.render('museums/show', {museum})
}))
// GET:: get the edit museum form
app.get('/museums/:id/edit', catchAsync(async(req,res) =>{
    const {id} = req.params;
    const museum = await Museum.findById(id);
    res.render('museums/edit', {museum})
}))
// PUT:: update the edit form
app.put('/museums/:id', validateMuseum, catchAsync(async(req,res) =>{
    if(!req.body.museum) throw new ExpressError('Invalid Museum Data', 400)
    const {id} = req.params;
    const museum = await Museum.findByIdAndUpdate(id, req.body.museum, {runValidators: true});
    res.redirect(`/museums/${museum._id}`)
}))
// DELETE:: delete the musuem
app.delete('/museums/:id', catchAsync(async(req,res) =>{
    const {id} = req.params;
    const museum = await Museum.findByIdAndDelete(id);
    res.redirect('/museums')
}))

/**
 *  Handle Error
 */ 
app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found',404))
})
app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong'
    res.status(statusCode).render('error', {err});
})

/**
 * Run on port 3000
 */
app.listen(3000, () => {
    console.log('Serving on port 3000')
})