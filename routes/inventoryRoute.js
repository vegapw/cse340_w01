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

// Route to register a new classification 
router.post("/add-classification", 
    invValidation.classificationRules(),
    invValidation.checkClassificationData,
    utilities.handleErrors(invController.registerClassification))

// Route to build the add-inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Route to register a new inventory 
router.post("/add-inventory", 
    invValidation.inventoryRules(),
    invValidation.checkInventoryData,
    utilities.handleErrors(invController.registerInventory))

module.exports = router;