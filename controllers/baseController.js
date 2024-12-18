const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
  res.render("index", {title: "Home", nav, loginLinks})
  //req.flash("notice", "This is a flash message.")
}

module.exports = baseController