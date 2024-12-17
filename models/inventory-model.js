const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

/* ***************************
 *  Get item inventory detail
 * ************************** */
async function getInventoryItemById(inventory_id){
    try {
        const data1 = await pool.query(
            `SELECT * FROM public.inventory AS i 
            WHERE i.inv_id = $1`,
            [inventory_id], 
        )
        return data1.rows
    } catch (error) {
        console.error("getinventorybyid error" + error)
    }
  }

/* ***************************
 *  Register a new classification
 * ************************** */
async function registerClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Check if a classification exists
 * ************************** */
async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Register a new inventory
 * ************************** */
async function registerInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Check if a inventory exists
 * ************************** */
async function checkExistingInventory(inv_make) {
  try {
    const sql = "SELECT * FROM inventory WHERE inv_make = $1"
    const classification = await pool.query(sql, [inv_make])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Update an inventory
 * ************************** */
async function updateInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id) {
  try {
    const sql = "UPDATE inventory SET inv_make=$1, inv_model=$2, inv_year=$3, inv_description=$4, inv_image=$5, inv_thumbnail=$6, inv_price=$7, inv_miles=$8, inv_color=$9, classification_id=$10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id])
    return data.rows[0]
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Delete an inventory
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1 RETURNING *"
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    return error.message
  }
}

module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getInventoryItemById, 
  registerClassification, 
  checkExistingClassification, 
  registerInventory, 
  checkExistingInventory,
  updateInventory,
  deleteInventory
}