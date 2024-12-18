const utilities = require("../utilities/")

const errCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
errCont.buildError500 = async function (req, res, next) {
    let nav = await utilities.getNav()
    const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
    const message = 'Oh no, There was a crash. Maybe try a different route?'
    res.render("./errors/error", {
    title: "Server Error",
    loginLinks,
    nav,
    message,
  })
}

module.exports = errCont
