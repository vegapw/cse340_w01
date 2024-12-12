const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/')
const accController = require('../controllers/accountController')
const regValidate = require("../utilities/account-validation")

// Route to build the login view
router.get("/login", utilities.handleErrors(accController.buildLogin))

// Route to build the registration view
router.get("/register", utilities.handleErrors(accController.buildRegister))

// Route to register an account
router.post("/register", 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount))

module.exports = router;
