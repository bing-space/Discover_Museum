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

app.get('/', (req, res) => {
    res.render('home')
})

// Testing
app.get('/makemuseum', async (req, res) => {
    const themuseum = new Museum({
        name: 'The MET', 
        description: 'The Metropolitan Museum of Art, colloquially referred to as the Met, is an encyclopedic art museum in New York City.',
        website: 'https://www.metmuseum.org/',
        location: 'NY, US'
    });
    await themuseum.save();
    res.send(themuseum)
})


app.listen(3000, () => {
    console.log('Serviing on port 3000')
})