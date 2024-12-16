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
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accCon.buildRegister = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
}

/* ****************************************
*  Register an account
* *************************************** */
accCon.registerAccount = async function (req, res) {
    let nav = await utilities.getNav()
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
            nav,
            error: null,
        })
    }

    const regResult = await accModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword)

    if (regResult) {
        req.flash("notice_good", `Congratulations, you\'re registered ${account_firstname}. Please Log in.`)
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", `Sorry, the registration failed.`)
        res.status(501).render("account/register", {
            title: "Register",
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
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
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
    res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
    })
}

module.exports = accCon