const utilities = require("../utilities/")

const errCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
errCont.buildError500 = async function (req, res, next) {
    let nav = await utilities.getNav()
    const message = 'Oh no, There was a crash. Maybe try a different route?'
    res.render("./errors/error", {
    title: "Server Error",
    nav,
    message,
  })
}

module.exports = errCont
