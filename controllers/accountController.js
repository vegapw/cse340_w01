const utilities = require('../utilities/')
const accModel = require('../models/account-model')

const accCon = {}

/* ***************************
 *  Deliver Login view
 * ************************** */
accCon.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
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
    
    const regResult = await accModel.registerAccount(account_firstname, account_lastname, account_email, account_password)

    if (regResult) {
        req.flash("notice", `Congratulations, you\'re registered ${account_firstname}. Please Log in.`)
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", `Sorry, the registration failed.`)
        res.status(501).render("account/register", {
            title: "Register",
            nav,
        })
    }
}

module.exports = accCon