const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
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
    const carName = data[0].inv_make
    res.render("./inventory/itemView", {
      title: carName + " vehicle",
      nav,
      itemView,
    })
}

/* ***************************
 *  Build Management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
  })
}

/* ***************************
 *  Build Add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
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

  if (regResult) {
    let nav = await utilities.getNav()
    req.flash("notice_good", `Congratulations the classification ${classification_name} was added successfully`)
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    req.flash("notice", `Sorry the registration failed.`)
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}


module.exports = invCont