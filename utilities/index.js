const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the Item inventory detailed view
* ************************************ */
Util.buildItemView = async function(data){
  let container
  if(data.length > 0){
    container = '<div id="det-item">'
    container += '<section class="card">'
    container += '<h1>' + data[0].inv_year + ' ' + data[0].inv_make + '</h1>'
    container += '<picture><img src="' + data[0].inv_image + '" alt="Image of ' 
    + data[0].inv_make + data[0].inv_model + '"></picture>'
    container += '</section><section class="card">'
    container += '<h3>' + data[0].inv_make + ' Details</h3>'
    container += '<p><span>Price:</span> $' 
    + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</p>'
    container += '<p><span>Description:</span> '+ data[0].inv_description + '</p>'
    container += '<p><span>Color:</span> '+ data[0].inv_color + '</p>'
    container += '<p><span>Miles:</span> ' 
    + new Intl.NumberFormat('en-US').format(data[0].inv_miles) + '</p>'
    container += '</section></div>'
  } else { 
    container += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return container
}

/* **************************************
* Build classification List
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */

Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please Log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    next()
  }
}

/* ****************************************
* Check Login
**************************************** */

Util.checkLogin = async (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
* Build Login Links
**************************************** */

Util.buildLoginLinks = async (loggedin, accountData) => {
  let loginLinks = `<a title="Click to log in" href="/account/login">My Account</a>`
  if (loggedin) {
    loginLinks = `<a title="Go to profile" href="/account/">Welcome ${accountData.account_firstname}</a>`
    loginLinks += `-<a title="Log out" href="/account/logout">Log out</a>`
    return loginLinks
  } 
  return loginLinks
}

/* ****************************************
* Check account_type
**************************************** */
Util.checkAccountType = async (req, res, next) => {
  const type = res.locals.accountData.account_type
  if (type == 'Employee' || type == 'Admin') {
    next()
  } else {
    req.flash("notice", "Please log in with the appropriate credentials to access this page.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
* Build Management Welcome
**************************************** */

Util.buildManagementWelcome = async (accountData) => {
  let welcome = `<h2>Welcome ${accountData.account_firstname}</h2>`
  const type = accountData.account_type
  welcome += `<p><a title="Update account information" href="/account/update/${accountData.account_id}">Edit account information</a></p>`
  if (type == 'Employee' || type == 'Admin') {
    welcome += `<h3>Inventory Management</h3><p><a title="Inventory Management" href="/inv/">Manage Inventory</a></p>`
  } 
  return welcome
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util