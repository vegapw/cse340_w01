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

// Route to login
router.post("/login", 
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accController.accountLogin)
)

// Route to build the management view for an account
router.get("/", 
    utilities.checkLogin,
    utilities.handleErrors(accController.buildManagement))

// Route to logout an account
router.get("/logout", utilities.handleErrors(accController.logOut))

// Route to logout an account
router.get("/update/:account_id", utilities.handleErrors(accController.buildUpdateAccount))

// Route to logout an account
router.post("/update/info", 
    regValidate.updateAccountInfoRules(),
    regValidate.checkUpdateInfoData,
    utilities.handleErrors(accController.updateAccountInfo))

// Route to logout an account
router.post("/update/password", 
    regValidate.updateAccountPasswordRules(),
    regValidate.checkUpdatePassData,
    utilities.handleErrors(accController.updateAccountPass))

module.exports = router;
