const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { museumSchema, reviewSchema } = require('./schemas');
const flash = require('connect-flash');
const session =  require('express-session')
const museums = require('./routes/museums')
const reviews = require('./routes/reviews')

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
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())
const sessionConfig = {
    secret: 'thisisnotagoodsecret', 
    resave: false, 
    saveUninitialized: true, 
    cookie: {
        httpOnly: true,
        expires: Date.now() + 100 * 60 * 60 * 24 * 7,
        maxAge: 100 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})


/**
 * Home page
 */ 
app.get('/', (req, res) => {
    res.render('home')
})
/**
 * CRUD Section: Museum
 */

app.use('/museums', museums)
/**
 * CRUD Section: Review
 */
app.use('/museums/:id/reviews', reviews)


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