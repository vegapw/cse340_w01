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
router.get("/", 
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildManagement))

// Route to build the add-classification view
router.get("/add-classification",
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddClassification))

// Route to register a new classification 
router.post("/add-classification", 
    utilities.checkAccountType,
    invValidation.classificationRules(),
    invValidation.checkClassificationData,
    utilities.handleErrors(invController.registerClassification))

// Route to build the add-inventory view
router.get("/add-inventory", 
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddInventory))

// Route to register a new inventory 
router.post("/add-inventory",
    utilities.checkAccountType,
    invValidation.inventoryRules(),
    invValidation.checkInventoryData,
    utilities.handleErrors(invController.registerInventory))

// Route to get the inventory by id
router.get("/getInventory/:classification_id", 
    utilities.checkAccountType,
    utilities.handleErrors(invController.getInventoryJSON))

// Route to modify a vehicle by id
router.get("/edit/:inv_id", 
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildUpdateInventory))

// Route to update an inventory 
router.post("/update",
    utilities.checkAccountType,
    invValidation.updateInventoryRules(),
    invValidation.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

// Route to confirm the delete of a vehicle by id
router.get("/delete/:inv_id", 
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildDeleteInventory))

// Route to delete an inventory 
router.post("/delete", 
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventory))

module.exports = router;