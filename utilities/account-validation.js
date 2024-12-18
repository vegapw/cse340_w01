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
        .isEmail()
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
    const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title : "Registration",
            loginLinks,
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
    const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title : "Login",
            loginLinks,
            nav,
            account_email,
        })
        return
    }
    next()
 }

 /*  **********************************
  *  Update account Validation Rules Info
  * ********************************* */
 validate.updateAccountInfoRules = () => {
    return [

        //firstname is required and must be a string
        body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("First name cannot be empty.")
        .isLength({min: 1})
        .withMessage("Please provide a first name."), // on error this message is sent
        
        //lastname is required and must be a string
        body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Last name cannot be empty.")
        .isLength({min: 1})
        .withMessage("Please provide a last name."), // on error this message is sent

        //valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .isEmail()
        .withMessage("A valid email is required."), // on error this message is sent

    ]
 }

  /*  **********************************
  *  Update account Validation Rules Password
  * ********************************* */
  validate.updateAccountPasswordRules = () => {
    return [
        
        //password is required and must be minimum of 12 characters and include 1 capital letter, 1 number and 1 special character.
        body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Password cannot be empty.")
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
 * Check data and return errors or continue update info
 * ***************************** */

  validate.checkUpdateInfoData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id} = req.body
    const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
    const emailExists = await accModel.checkExistingEmailDifferentId(account_email, account_id)
    if (emailExists) {
        req.flash("notice", "This email already exists, please type other.")
    }
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty() || emailExists) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title : "Login",
            loginLinks,
            nav,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        })
        return
    }
    next()
 }
/* ******************************
 * Check data and return errors or continue update password
 * ***************************** */

validate.checkUpdatePassData = async (req, res, next) => {
    const { account_id } = req.body
    const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title : "Login",
            loginLinks,
            nav,
            account_firstname: res.locals.accountData.account_firstname,
            account_lastname: res.locals.accountData.account_lastname,
            account_email: res.locals.accountData.account_email,
            account_id,
        })
        return
    }
    next()
 }


 module.exports = validate