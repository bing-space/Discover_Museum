const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateMuseum} = require('../middleware')
const museums = require('../controllers/museums')

// GET:: museums list
// POST:: create new museum - post the museum form
router.route('/')
    .get(catchAsync(museums.index))
    .post(validateMuseum, isLoggedIn, catchAsync(museums.createMuseum))

// GET:: create new museum - render the museum form
router.get('/new',isLoggedIn, museums.renderNewForm)

// GET:: show museum detail
// PUT:: update museum data
// DELETE:: deletes museum
router.route('/:id')
    .get(catchAsync(museums.showMuseum))
    .put(isLoggedIn, isAuthor, validateMuseum, catchAsync(museums.updateMuseum))
    .delete(isLoggedIn,isAuthor, catchAsync(museums.deleteMuseum))
    
// GET:: update the museum - render the museum form with data: GET
router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(museums.renderEditForm))

module.exports = router;