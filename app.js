const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Museum = require('./models/museum');

mongoose.connect('mongodb://localhost:27017/discover-museum', {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});


app.set('view engine','ejs')
app.set('views', path.join(__dirname,'views'))
// Middleware that parses incoming HTTP requests with form data
app.use(express.urlencoded({extended:true}))
// Middleware that allows to use 'PUT'
app.use(methodOverride('_method'))

/*
* Routes
*/
app.get('/', (req, res) => {
    res.render('home')
})
// GET Route: all museums
app.get('/museums', async (req, res) => {
    const museums = await Museum.find({});
    res.render('museums/index',{museums})
})
// GET Route: new museum form
app.get('/museums/new', (req, res) => {
    res.render('museums/new')
})
// POST Route: post new museum info, then direct to that musem page
app.post('/museums', async (req, res) => {
    const museum = new Museum(req.body.museum);
    await museum.save();
    res.redirect(`/museums/${museum._id}`)
})
// GET Route: get museum detail by id
app.get('/museums/:id', async (req, res) => {
    const museum = await Museum.findById(req.params.id)
    res.render('museums/show',{museum})
})
// GET Route: edit museum info form
app.get('/museums/:id/edit', async (req, res) => {
    const museum = await Museum.findById(req.params.id)
    res.render('museums/edit',{museum})
})
// PUT Route: update the museum
app.put('/museums/:id', async (req, res) => {
    const { id } = req.params;
    const museum = await Museum.findByIdAndUpdate(id, {...req.body.museum})
    res.redirect(`/museums/${museum._id}`)
})


app.listen(3000, () => {
    console.log('Serviing on port 3000')
})