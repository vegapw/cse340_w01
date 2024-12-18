const utilities = require('../utilities/')
const accModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config

const accCon = {}

/* ***************************
 *  Deliver Login view
 * ************************** */
accCon.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
    res.render("account/login", {
        title: "Login",
        loginLinks,
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accCon.buildRegister = async function (req, res, next) {
    let nav = await utilities.getNav()
    const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
    res.render("account/register", {
      title: "Register",
      loginLinks, 
      nav,
      errors: null,
    })
}

/* ****************************************
*  Register an account
* *************************************** */
accCon.registerAccount = async function (req, res) {
    let nav = await utilities.getNav()
    const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
    const {account_firstname, account_lastname, account_email, account_password} = req.body
    
    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", `Sorry there was an error processing the registration.`)
        res.status(500).render("account/register", {
            title: "Registration",
            loginLinks,
            nav,
            error: null,
        })
    }

    const regResult = await accModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword)

    if (regResult) {
        req.flash("notice_good", `Congratulations, you\'re registered ${account_firstname}. Please Log in.`)
        res.status(201).render("account/login", {
            title: "Login",
            loginLinks,
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", `Sorry, the registration failed.`)
        res.status(501).render("account/register", {
            title: "Register",
            loginLinks,
            nav,
            errors: null,
        })
    }
}

/* ****************************************
*  Process Login request
* *************************************** */
accCon.accountLogin = async (req, res) => {
    let nav = utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accModel.getAccountByEmail(account_email)
    const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            loginLinks,
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
            if (process.env.NODE_ENV == 'development') {
                res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
            } else {
                res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000})
            }
            return res.redirect("/account/")
        } else {
            req.flash("notice", "Please check your credentials ad try again.")
            res.status(400).render("account/login", {
                title: "Login",
                loginLinks,
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error("Access Forbidden");
    }
}

/* ****************************************
*  Build the account management view
* *************************************** */
accCon.buildManagement = async (req, res, next) => {
    let nav = await utilities.getNav()
    const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
    const accountLinks = await utilities.buildManagementWelcome(res.locals.accountData)
    res.render("account/management", {
        title: "Account Management",
        loginLinks,
        nav,
        errors: null,
        accountLinks,
    })
}

/* ****************************************
*  Logout account 
* *************************************** */
accCon.logOut = async (req, res, next) => {
    req.flash("notice_good", "Logout successful.")
    res.clearCookie("jwt")
    return res.redirect("/")
}

/* ****************************************
*  Build the account update view
* *************************************** */
accCon.buildUpdateAccount = async (req, res, next) => {
    const account_id = req.body
    let nav = await utilities.getNav()
    const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)

    res.render("account/update", {
        title: "Edit account",
        loginLinks,
        nav,
        errors: null,
        account_firstname: res.locals.accountData.account_firstname,
        account_lastname: res.locals.accountData.account_lastname,
        account_email: res.locals.accountData.account_email,
        account_id: res.locals.accountData.account_id,
    })
}

/* ****************************************
*  Update an account info
* *************************************** */
accCon.updateAccountInfo = async function (req, res) {
    let nav = await utilities.getNav()
    const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
    const {account_firstname, account_lastname, account_email, account_id} = req.body
    const accountLinks = await utilities.buildManagementWelcome(res.locals.accountData)

    const regResult = await accModel.updateAccountInfo(account_firstname, account_lastname, account_email, account_id)

    if (regResult) {
        const accountData = await accModel.getAccountById(account_id)
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
            if (process.env.NODE_ENV == 'development') {
                res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
            } else {
                res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000})
            }
        req.flash("notice_good", `Your account ${account_firstname} was updated successfully.`)
        res.status(201).render("account/management", {
            title: "Account Management",
            loginLinks,
            nav,
            errors: null,
            accountLinks,
        })
    } else {
        req.flash("notice", `Sorry, the update failed.`)
        res.status(501).render("account/update", {
            title: "Edit account",
            loginLinks,
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        })
    }
}

/* ****************************************
*  Update an account password
* *************************************** */
accCon.updateAccountPass = async function (req, res) {
    let nav = await utilities.getNav()
    const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
    const {account_id, account_password} = req.body
    const accountLinks = await utilities.buildManagementWelcome(res.locals.accountData)

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", `Sorry there was an error processing the registration.`)
        res.status(500).render("account/update", {
            title: "Edit account",
            loginLinks,
            nav,
            error: null,
        })
    }

    const regResult = await accModel.updateAccountPass(account_id, hashedPassword)

    if (regResult) {
        req.flash("notice_good", `Your password was updated successfully.`)
        res.status(201).render("account/management", {
            title: "Account Management",
            loginLinks,
            nav,
            errors: null,
            accountLinks,
        })
    } else {
        req.flash("notice", `Sorry, the update failed.`)
        res.status(501).render("account/update", {
            title: "Edit account",
            loginLinks,
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        })
    }
}

module.exports = accCon