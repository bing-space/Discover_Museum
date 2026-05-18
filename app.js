const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Museum = require('./models/museum')

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

app.listen(3000, () => {
    console.log('Serviing on port 3000')
})