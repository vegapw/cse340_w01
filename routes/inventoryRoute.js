// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidation = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build the item detailed view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))

// Route to build the management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build the add-classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Route to build the add-classification view
router.post("/add-classification", 
    invValidation.registrationRules(),
    invValidation.checkClassificationData,
    utilities.handleErrors(invController.registerClassification))

module.exports = router;