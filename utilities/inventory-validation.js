const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
        //Classification_name must be Alphabetical characters only
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 1})
        .isAlpha()
        .withMessage("Please provide only Alphabetical characters.")
        .custom(async (classification_name) => {
            const classificationExists = await invModel.checkExistingClassification(classification_name)
            if (classificationExists) {
                throw new Error("This classification already exists, please type a new one.")
            }
        }),
    ]
}

/*  **********************************
  *  Check data and return errors or continue to add a new classification
  * ********************************* */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
    return [
        // inv_make must be Alphanumeric and 3 characters only
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Make must not be empty.")
        .isAlphanumeric()
        .withMessage("Make must be alphanumeric.")
        .isLength({min: 3})
        .withMessage("Make must be at least 3 character long.")
        .custom(async (inv_make) => {
            const inventoryExists = await invModel.checkExistingInventory(inv_make)
            if (inventoryExists) {
                throw new Error("This make already exists, please type a new one.")
            }
        }),

        // inv_model must be Alphanumeric and 3 characters only
        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Model must not be empty.")
        .isAlphanumeric()
        .withMessage("Model must be alphanumeric.")
        .isLength({min: 3})
        .withMessage("Model must be at least 3 character long."),

        // inv_year must be 4 digits only
        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Year must not be empty.")
        .isDate({format: 'YYYY'})
        .withMessage("Year must be 4 digits long."),

        // inv_description must not be empty
        body("inv_description")
        .trim()
        .notEmpty()
        .withMessage("Description must not be empty."),

        // inv_image must not be empty
        body("inv_image")
        .trim()
        .notEmpty()
        .withMessage("Image must not be empty."),

        // inv_thumbnail must not be empty
        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .withMessage("Thumbnail must not be empty."),

        // inv_price must be greater than zero
        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Price must not be empty.")
        .isDecimal({gt: 0})
        .withMessage("Price must be greater than zero."),

        // inv_miles must be digits only
        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Miles must not be empty.")
        .isInt()
        .withMessage("Miles must be digits only."),

        // inv_color must not be empty
        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Color must not be empty."),

        // classification_id must not be empty
        body("classification_id")
        .notEmpty()
        .withMessage("A Classification must be selected."),
    ]
}

/*  **********************************
  *  Check data and return errors or continue to add a new inventory
  * ********************************* */
validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            classificationList,
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color,
        })
        return
    }
    next()
}

module.exports = validate