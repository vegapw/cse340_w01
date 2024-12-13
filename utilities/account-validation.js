const utilities = require(".")
const { body, validationResult } = require('express-validator')
const accModel = require("../models/account-model")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
 validate.registrationRules = () => {
    return [
        //firstname is required and must be a string
        body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 1})
        .withMessage("Please provide a first name."), // on error this message is sent
        
        //lastname is required and must be a string
        body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 2})
        .withMessage("Please provide a last name."), // on error this message is sent

        //valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .escape()
        .isEmail()
        .normalizeEmail() 
        .withMessage("A valid email is required.") // on error this message is sent
        .custom(async (account_email) => {
            const emailExists = await accModel.checkExistingEmail(account_email)
            if (emailExists) {
                throw new Error("Email exists. Please log in or use a different email.")
            }
        }),

        //password is required and must be minimum of 12 characters and include 1 capital letter, 1 number and 1 special character.
        body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet the requirements."), // on error this message is sent
    ]
 }

 /*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
 validate.loginRules = () => {
    return [

        //valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() 
        .withMessage("A valid email is required."), // on error this message is sent

        //password is required and must be minimum of 12 characters and include 1 capital letter, 1 number and 1 special character.
        body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet the requirements."), // on error this message is sent
    ]
 }

 /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

 validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title : "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
 }

 /* ******************************
 * Check data and return errors or continue login
 * ***************************** */

 validate.checkLogData = async (req, res, next) => {
    const {account_email} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title : "Login",
            nav,
            account_email,
        })
        return
    }
    next()
 }

 module.exports = validate