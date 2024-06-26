const mongoose = require('mongoose');
const Museum = require('../models/museum');

const { titles, locations } = require('./seedHelpers')

mongoose.connect('mongodb://127.0.0.1:27017/discover_museum')
    .then(() => {
        console.log("Connection Open")
    })
    .catch(err => {
        console.log("Error.......")
        console.log(err)
    })

const seedDB = async () => {
    await Museum.deleteMany({}) // Delete Everything
    for(let i=0; i< 10; i++){
        const random1000 = Math.floor(Math.random() * 6);

        const museum = new Museum({
            location: `${locations[random1000]}`,
            title: `${titles[random1000]}`,
            description: 'The placeholder text, beginning with the line “Lorem ipsum dolor sit amet, consectetur adipiscing elit”, looks like Latin because in its youth, centuries ago, it was Latin.',
            price: 4.55

        })
        await museum.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})