const { name } = require("ejs")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { loginRules } = require("../utilities/account-validation")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    loginLinks,
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by Inventory Id
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventoryItemById(inventory_id)
    const itemView = await utilities.buildItemView(data)
    let nav = await utilities.getNav()
    const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
    const carName = data[0].inv_make
    res.render("./inventory/itemView", {
      title: carName + " vehicle",
      loginLinks,
      nav,
      itemView,
    })
}

/* ***************************
 *  Build Management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
  const classificationList = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    loginLinks,
    nav,
    classificationList,
  })
}

/* ***************************
 *  Build Add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    loginLinks,
    nav,
    errors: null,
  })
}

/* ***************************
 *  Register new classification 
 * ************************** */
invCont.registerClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const regResult = await invModel.registerClassification(classification_name)
  const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)

  if (regResult) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    req.flash("notice_good", `Congratulations the classification ${classification_name} was added successfully`)
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      loginLinks,
      nav,
      classificationList,
    })
  } else {
    let nav = await utilities.getNav()
    req.flash("notice", `Sorry the registration failed.`)
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      loginLinks,
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Build Add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
  let classificationList = await utilities.buildClassificationList(null)
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    loginLinks,
    nav,
    errors: null,
    classificationList,
  })
}

/* ***************************
 *  Register new inventory 
 * ************************** */
invCont.registerInventory = async function (req, res, next) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  const regResult = await invModel.registerInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
  const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)

  if (regResult) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    req.flash("notice_good", `Congratulations the inventory ${inv_make} was added successfully`)
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      loginLinks,
      nav,
      classificationList,
    })
  } else {
    let nav = await utilities.getNav()
    req.flash("notice", `Sorry the registration failed.`)
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      loginLinks,
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build Edit inventory view
 * ************************** */
invCont.buildUpdateInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
  let vehicleData = await invModel.getInventoryItemById(inv_id)
  let name = vehicleData[0].inv_make + " " + vehicleData[0].inv_model
  let classificationList = await utilities.buildClassificationList(vehicleData[0].classification_id)
  res.render("./inventory/edit-inventory", {
    title: "Edit " + name,
    loginLinks,
    nav,
    errors: null,
    classificationList,
    inv_id : vehicleData[0].inv_id,
    inv_make : vehicleData[0].inv_make,
    inv_model : vehicleData[0].inv_model,
    inv_year : vehicleData[0].inv_year,
    inv_description : vehicleData[0].inv_description,
    inv_image : vehicleData[0].inv_image,
    inv_thumbnail : vehicleData[0].inv_thumbnail,
    inv_price : vehicleData[0].inv_price,
    inv_miles : vehicleData[0].inv_miles,
    inv_color : vehicleData[0].inv_color,
  })
}

/* ***************************
 *  Update inventory 
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body
  const regResult = await invModel.updateInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id)
  const name = inv_make + " " + inv_model

  if (regResult) {
    const classificationList = await utilities.buildClassificationList()
    req.flash("notice_good", `The ${inv_make} ${inv_model} was updated successfully`)
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      loginLinks,
      nav,
      classificationList,
    })
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    req.flash("notice", `Sorry the update failed.`)
    res.status(501).render("./inventory/edit-inventory", {
      title: "Edit " + name,
      loginLinks,
      nav,
      errors: null,
      classificationList,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
  }
}

/* ***************************
 *  Build Delete inventory view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
  let vehicleData = await invModel.getInventoryItemById(inv_id)
  let name = vehicleData[0].inv_make + " " + vehicleData[0].inv_model
  res.render("./inventory/delete-confirm", {
    title: "Delete " + name,
    loginLinks,
    nav,
    errors: null,
    inv_id : vehicleData[0].inv_id,
    inv_make : vehicleData[0].inv_make,
    inv_model : vehicleData[0].inv_model,
    inv_year : vehicleData[0].inv_year,
    inv_price : vehicleData[0].inv_price,
  })
}

invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const loginLinks = await utilities.buildLoginLinks(res.locals.loggedin, res.locals.accountData)
  const { inv_make, inv_model, inv_year, inv_price, inv_id } = req.body
  const regResult = await invModel.deleteInventory(inv_id)
  const name = inv_make + " " + inv_model
  if (regResult) {
    const classificationList = await utilities.buildClassificationList()
    req.flash("notice_good", `The ${inv_make} ${inv_model} was deleted successfully`)
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      loginLinks,
      nav,
      classificationList,
    })
  } else {
    req.flash("notice", `Sorry the delete failed.`)
    res.status(501).render("./inventory/delete-confirm", {
      title: "Delete " + name,
      loginLinks,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    })
  }
}

module.exports = invCont