const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');

const Museum = require('./models/museum');

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

/**
 * CRUD Section
 */

// GET:: home page
app.get('/', (req, res) => {
    res.render('home')
})
// GET:: get new museum form
app.get('/museums/new', async(req,res) => {
    res.render('museums/new')
})
// POST:: post the new museum form
app.post('/museums', async(req, res) => {
    const newMuseum = new Museum(req.body);
    await newMuseum.save();
    console.log(req.body)
    res.redirect(`/museums/${newMuseum._id}`)
})
// GET:: museum list page
app.get('/museums', async (req, res) => {
    const museums = await Museum.find({});
    res.render('museums/index', {museums})
})
// GET:: show museum detail
app.get('/museums/:id', async (req, res) => {
    const {id} = req.params;
    const museum = await Museum.findById(id);
    res.render('museums/show', {museum})
})
// GET:: get the edit museum form
app.get('/museums/:id/edit', async(req,res) =>{
    const {id} = req.params;
    const museum = await Museum.findById(id);
    res.render('museums/edit', {museum})
})
// PUT:: update the edit form
app.put('/museums/:id', async(req,res) =>{
    const {id} = req.params;
    const museum = await Museum.findByIdAndUpdate(id, req.body, {runValidators: true});
    res.redirect(`/museums/${museum._id}`)
})
// DELETE:: delete the musuem
app.delete('/museums/:id', async(req,res) =>{
    const {id} = req.params;
    const museum = await Museum.findByIdAndDelete(id);
    res.redirect('/museums')
})


/**
 * Run on port 3000
 */
app.listen(3000, () => {
    console.log('Serving on port 3000')
})