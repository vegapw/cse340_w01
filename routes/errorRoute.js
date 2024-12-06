// Needed Resources 
const express = require("express")
const router = new express.Router() 
const errController = require("../controllers/errController")

// Route for error 500
router.get("/", errController.buildError500);

module.exports = router