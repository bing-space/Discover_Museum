const express = require('express')
const router = express.Router();
const cathchAsync = require('../utils/catchAsync')
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');

// GET:: render the register form
// POST:: post the the register form
router.route('/register')
    .get(users.renderRegister)
    .post(cathchAsync(users.register))

// GET:: render the login form
// POST:: post the login form
router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login )

// GET:: logout
router.get('/logout', users.logout)

module.exports = router;