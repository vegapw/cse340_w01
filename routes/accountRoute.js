const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/')
const accController = require('../controllers/accountController')

// Route to build the login view
router.get("/login", accController.buildLogin)

module.exports = router;
