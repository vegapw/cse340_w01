// Needed Resources 
const express = require("express")
const router = new express.Router() 
const errController = require("../controllers/errController")
const utilities = require("../utilities/")

// Route for error 500
router.get("/", utilities.handleErrors(errController.buildError500))

module.exports = router