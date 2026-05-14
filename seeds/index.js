const mongoose = require('mongoose');
const cities = require('./cities');
const { names, descriptions } = require('./seedHelpers');
const Museum = require('../models/museum');

mongoose.connect('mongodb://localhost:27017/discover-museum', {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
            // location: `${cities[random100].city}, ${cities[random100].country}`


const seedDB = async () => {
    await Museum.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random100 = Math.floor(Math.random() * 8);
        const themusem = new Museum({
            name: `${sample(names)}`,
            description: `${sample(descriptions)}`,
            website: `www.themuseum.com`,
            location: `${cities[random100].city}, ${cities[random100].country}`

        })
        await themusem.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})