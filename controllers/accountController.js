const utilities = require('../utilities/')

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

module.exports = accCon